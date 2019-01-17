package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyNodeConstant;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.YoonaLtUtils.OrderNumUtils;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.bean.ApplyTimeBean;
import com.sicmed.remote.web.bean.ConsultantReportBean;
import com.sicmed.remote.web.bean.ConsultationTimeBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.service.*;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.omg.PortableInterceptor.INACTIVE;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;

/**
 * @author YoonaLt
 * 页面点击功能实现
 * @version 1.0 This Version Running JDK 1.8
 */
@Slf4j
@RestController
@RequestMapping(value = "apply/dispose")
public class ApplyDisposeController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private ApplyTimeService applyTimeService;

    @Autowired
    private CaseConsultantService caseConsultantService;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private ApplyNodeService applyNodeService;

    @Autowired
    private UserDetailService userDetailService;

    /**
     * 医政 工作台 重新分配医生
     */
    @Transactional
    @PostMapping(value = "sirUpdateDoctor")
    public Map sirUpdateDoctor(ApplyForm applyForm, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport) {

        String userId = getRequestToken();

        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateInviteDoctorByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("修改applyForm失败");
        }

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyForm.getId());
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setHospitalPrice(hospitalPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setConsultantReport(consultantReport);
        caseConsultant.setUpdateUser(userId);

        int k = caseConsultantService.updateInviteDoctorByPrimaryKeySelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("添加失败");
        }
        return succeedRequest(applyForm);
    }

    /**
     * 医政 工作台 受邀会诊 修改日期 选择一条时间
     */
    @Transactional
    @PostMapping(value = "sirUpdateDate")
    public Map sirUpdateDate(ApplyTime applyTime) {
        if (applyTime == null) {
            return badRequestOfArguments("传入参数有误");
        }

        int j = applyTimeService.delByApplyForm(applyTime.getApplyFormId());
        if (j < 0) {
            return badRequestOfArguments("删除原applyTime失败");
        }

        String userId = getRequestToken();

        applyTime.setCreateUser(userId);
        int k = applyTimeService.insertSelective(applyTime);
        if (k < 1) {
            return badRequestOfArguments("确认时间,time修改失败");
        }

        return succeedRequest(applyTime);
    }

    /**
     * applyTime修改多条时间,解析Json数据
     */
    public Map applyTimeJson(String startEndTime) {

        if (StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("startEndTime is null");
        }

        Map<String, String> resultMap = new LinkedHashMap<>();
        List<ConsultationTimeBean> consultationTimeBeanList;
        try {
            consultationTimeBeanList = JSON.parseObject(startEndTime, new TypeReference<List<ConsultationTimeBean>>() {
            }, Feature.OrderedField);
        } catch (Exception e) {
            return badRequestOfArguments("startEndTime 格式有误");
        }
        if (consultationTimeBeanList != null) {
            for (ConsultationTimeBean consultationTimeBean : consultationTimeBeanList) {
                resultMap.put(consultationTimeBean.getStartTime(), consultationTimeBean.getEndTime());
            }
        }

        return resultMap;
    }

    /**
     * 医政 工作台 发出会诊 修改日期 选择多个时间
     */
    @Transactional
    @PostMapping(value = "sirSendUpdateDate")
    public Map sirSendUpdateDate(String applyFormId, String startEndTime) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("applyFormId  is null");
        }

        // 删除原时间
        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 0) {
            return badRequestOfArguments("删除原applyTime失败");
        }

        //解析传入json
        Map<String, String> resultMap = applyTimeJson(startEndTime);

        // 添加申请时间
        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_CREATE_SUCCESS);
        String userId = getRequestToken();
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        applyTimeBean.setApplyStatus(applyStatus);

        int i = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (i < 1) {
            return badRequestOfArguments("添加申请时间失败");
        }

        return succeedRequest(applyTimeBean);
    }

    // 医政 工作台 修改价格 数据库暂无表格

    /**
     * 医政 会诊 转诊 更新申请状态
     *
     * @param applyFormId
     * @param applyStatus
     * @param msg1
     * @param msg2
     */
    public Map updateStatus(String applyFormId, String orderNumber, String applyStatus, String msg1,
                            String msg2, String refuseRemark) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("applyFormId is null");
        }

        String userId = getRequestToken();

        ApplyForm applyForm = new ApplyForm();
        if (InquiryStatus.INQUIRY_APPLY_REJECT.toString().equals(applyStatus)) {
            applyForm.setApplyType(ApplyType.APPLY_DRAFT.toString());
        }
        applyForm.setId(applyFormId);
        if (StringUtils.isNotBlank(refuseRemark)) {
            applyForm.setRefuseRemark(refuseRemark);
        }
        if (StringUtils.isNotBlank(orderNumber)) {
            applyForm.setApplyNumber(orderNumber);
        }
        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments(msg1);
        }

        if (ApplyType.APPLY_REFERRAL.toString().equals(applyForm.getApplyType())
                && InquiryStatus.INQUIRY_APPLY_REJECT.toString().equals(applyStatus)) {
            int j = applyTimeService.delByApplyForm(applyFormId);
            if (j < 1) {
                return badRequestOfArguments(msg2);
            }
        }
        applyForm = applyFormService.getByPrimaryKey(applyFormId);
        if (!ApplyType.APPLY_CONSULTATION_IMAGE_TEXT.toString().equals(applyForm.getApplyType())) {
            ApplyTime applyTime = new ApplyTime();
            applyTime.setApplyFormId(applyForm.getId());
            applyTime.setApplyStatus(applyStatus);
            applyTime.setUpdateUser(userId);
            int j = applyTimeService.updateStatus(applyTime);
            if (j < 1) {
                return badRequestOfArguments(msg2);
            }
        }

        if (applyStatus == ConsultationStatus.CONSULTATION_SLAVE_ACCEDE.toString()) {
            applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.已接诊.toString());
        } else if (applyStatus == "CONSULTATION_DATETIME_LOCKED") {
            applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.已排期.toString());
        } else if (applyStatus == ConsultationStatus.CONSULTATION_MASTER_REJECT.toString()) {
            applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.已拒收.toString());
        }
        return succeedRequest(applyForm);
    }


    /**
     * 医政 受邀会诊 拒收
     */
    @Transactional
    @PostMapping(value = "sirReceiveMasterReject")
    public Map sirConsultationMasterReject(String applyFormId, String report) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);

        String msg1 = "受邀会诊收诊医政拒收,form修改失败";
        String msg2 = "受邀会诊收诊医政拒收,time修改失败";

        return updateStatus(applyFormId, null, applyStatus, msg1, msg2, report);
    }

    /**
     * 医政 受邀会诊 待收诊 接收
     */
    @Transactional
    @PostMapping(value = "sirReceiveMasterAccede")
    public Map sirConsultationMasterAccede(String applyFormId) {

        String applyType = applyFormService.getByPrimaryKey(applyFormId).getApplyType();
        // 视频会诊状态变为会诊时间已选定
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        // 图文会诊接收后立刻变为会诊中
        if (ApplyType.APPLY_CONSULTATION_IMAGE_TEXT.toString().equals(applyType)) {
            applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
            applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
        }

        String msg1 = "受邀会诊收诊医政待收诊接受,form修改失败";
        String msg2 = "受邀会诊收诊医政待收诊接受,time修改失败";

        return updateStatus(applyFormId, null, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 受邀会诊  排期审核 接收
     */
    @Transactional
    @PostMapping(value = "sirReceiveDateCheckAccede")
    public Map sirDateCheckAccede(String applyFormId) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        String msg1 = "受邀会诊收诊医政排期审核接受,form修改失败";
        String msg2 = "受邀会诊收诊医政排期审核接受,time修改失败";

        return updateStatus(applyFormId, null, applyStatus, msg1, msg2, null);
    }


    /**
     * 医政 受邀会诊 砖家协调 确认协调
     */
    @Transactional
    @PostMapping(value = "sirReceiveHarmonizeAccede")
    public Map sirReceiveHarmonizeAccede(String applyFormId) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);

        String applyType = applyFormService.getByPrimaryKey(applyFormId).getApplyType();
        // 图文会诊砖家协调后立刻变为会诊中
        if (ApplyType.APPLY_CONSULTATION_IMAGE_TEXT.toString().equals(applyType)) {
            applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        }

        String msg1 = "受邀会诊收诊医政确认砖家协调,form修改失败";
        String msg2 = "受邀会诊收诊医政确认砖家协调,time修改失败";

        return updateStatus(applyFormId, null, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 发出会诊 待审核 通过
     */
    @Transactional
    @PostMapping(value = "sirSendCheckAccede")
    public Map sirSendCheckAccede(String applyFormId) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        String msg1 = "发出会诊医政待审核通过,form修改失败";
        String msg2 = "发出会诊医政待审核通过,time修改失败";
        String orderNumber = OrderNumUtils.getOrderNo(redisTemplate);

        return updateStatus(applyFormId, orderNumber, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 发出会诊 待审核 退回
     */
    @Transactional
    @PostMapping(value = "sirSendCheckReject")
    public Map sirSendCheckReject(String applyFormId) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("applyFormId is null");
        }

        // 删除applyFormId对应的applyTime表中字段
        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 0) {
            return badRequestOfArguments("删除applyTime失败");
        }

        // 删除CaseConsultant表对应字段
        caseConsultantService.deleteByPrimaryKey(applyFormId);

        // 设置applyForm类型为草稿
        ApplyForm applyForm = new ApplyForm();
        String userId = getRequestToken();
        String applyType2 = String.valueOf(ApplyType.APPLY_DRAFT);
        applyForm.setId(applyFormId);
        applyForm.setApplyType(applyType2);
        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("医政发出会诊待审核退回修改applyForm失败");
        }
        return succeedRequest(applyForm);
    }

    /**
     * 转诊 修改接收人
     */
    @PostMapping(value = "sirTransferAmendDor")
    public Map sirTransferAmendDor(String applyFormId, String inviteSummary, String inviteBranchId, String inviteUserId, String inviteHospitalId) {
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(inviteBranchId)) {
            return badRequestOfArguments("参数有误");
        }

        String userId = getRequestToken();
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setInviteUserId(inviteUserId);
        applyForm.setInviteSummary(inviteSummary);
        applyForm.setInviteBranchId(inviteBranchId);
        applyForm.setInviteHospitalId(inviteHospitalId);
        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("修改医生失败");
        }
        return succeedRequest("修改成功");
    }

    /**
     * 转诊 修改时间
     */
    @PostMapping(value = "sirTransferAmendTime")
    public Map sirTransferAmendTime(String applyFormId, String startEndTime) {
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("参数有误");
        }

        String userId = getRequestToken();
        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 1) {
            return badRequestOfArguments("删除原时间失败");
        }

        List<String> lists;
        LinkedHashMap<String, String> resultMap = new LinkedHashMap<>();
        try {
            lists = JSON.parseObject(startEndTime, new TypeReference<List<String>>() {
            }, Feature.OrderedField);
        } catch (Exception e) {
            e.printStackTrace();
            return badRequestOfArguments("startEndTime 格式有误");
        }
        if (lists == null) {
            return badRequestOfArguments("未输入日期");
        }
        for (String time : lists) {
            Date date = YtDateUtils.stringToDate(time);
            String start = YtDateUtils.dateToString(YtDateUtils.parmDateBegin(date));
            String end = YtDateUtils.dateToString(YtDateUtils.intradayEnd(date));
            resultMap.put(start, end);
        }

        // 添加 转诊申请 时间
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        int k = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (k < 1) {
            return badRequestOfArguments("添加申请时间失败");
        }
        return succeedRequest(resultMap);

    }

    /**
     * 医政 转诊 待审核 审核通过
     */
    @Transactional
    @PostMapping(value = "sirTransferCheckAccede")
    public Map sirTransferCheckAccede(String applyFormId) {
        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数错误");
        }

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_ACCEDE);
        String userId = getRequestToken();
        String orderNumber = OrderNumUtils.getOrderNo(redisTemplate);

        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setApplyStatus(applyStatus);
        applyForm.setUpdateUser(userId);
        applyForm.setApplyNumber(orderNumber);

        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("修改applyForm失败");
        }

        applyNodeService.insertByNodeOperator(applyFormId, ApplyNodeConstant.发起转诊.toString(), applyForm.getApplySummary());
        return succeedRequest(applyForm);
    }

    /**
     * 医政 转诊 待审核 拒绝
     */
    @Transactional
    @PostMapping(value = "sirTransferCheckReject")
    public Map sirTransferCheckReject(String applyFormId, String refuseRemark) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_REJECT);
        String msg1 = "转诊医政待审核拒绝,form修改失败";
        String msg2 = "转诊医政待审核拒绝,time修改失败";

        return updateStatus(applyFormId, null, applyStatus, msg1, msg2, refuseRemark);
    }

    /**
     * 转诊选定时间 添加
     */
    public Map transferDateSure(String applyFormId, String applyStatus, String inquiryDatetime) {

        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(inquiryDatetime)) {
            return badRequestOfArguments("参数错误");
        }

        String userId = getRequestToken();

        LinkedHashMap<String, String> resultMap = new LinkedHashMap<>();
        Date date = YtDateUtils.stringToDate(inquiryDatetime);
        String start = YtDateUtils.dateToString(YtDateUtils.parmDateBegin(date));
        String end = YtDateUtils.dateToString(YtDateUtils.intradayEnd(date));
        resultMap.put(start, end);

        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments("form修改失败");
        }

        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 1) {
            return badRequestOfArguments("time修改失败");
        }

        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        applyTimeBean.setApplyStatus(applyForm.getApplyStatus());
        int k = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (k < 1) {
            return badRequestOfArguments("重新添加申请时间失败");
        }

        return succeedRequest(applyForm);
    }

    /**
     * 医政 转诊 代收诊 同意
     */
    @Transactional
    @PostMapping(value = "sirTransferMasterAccede")
    public Map sirTransferMasterAccede(String applyFormId, String inquiryDatetime) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED);

        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已排期.toString());
        return transferDateSure(applyFormId, applyStatus, inquiryDatetime);
    }

    /**
     * 医政 转诊 代收诊 拒绝
     */
    @Transactional
    @PostMapping(value = "sirTransferMasterReject")
    public Map sirTransferMasterReject(String applyFormId, String refuseRemark) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_MASTER_REJECT);
        String msg1 = "转诊医政待收诊拒绝,form修改失败";
        String msg2 = "转诊医政待收诊拒绝,time修改失败";
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已拒收.toString());
        return updateStatus(applyFormId, null, applyStatus, msg1, msg2, refuseRemark);
    }

    /**
     * 医政 转诊 排期审核 同意
     */
    @Transactional
    @PostMapping(value = "sirTransferDateCheckAccede")
    public Map sirTransferDateCheckAccede(String applyFormId, String inquiryDatetime) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数错误");
        }

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED);
        String userId = getRequestToken();

        // 若修改时间
        if (StringUtils.isNotBlank(inquiryDatetime)) {

            LinkedHashMap<String, String> resultMap = new LinkedHashMap<>();
            Date date = YtDateUtils.stringToDate(inquiryDatetime);
            String start = YtDateUtils.dateToString(YtDateUtils.parmDateBegin(date));
            String end = YtDateUtils.dateToString(YtDateUtils.intradayEnd(date));
            resultMap.put(start, end);

            int j = applyTimeService.delByApplyForm(applyFormId);
            if (j < 1) {
                return badRequestOfArguments("转诊医政待收诊同意,time修改失败");
            }

            ApplyTimeBean applyTimeBean = new ApplyTimeBean();
            applyTimeBean.setApplyFormId(applyFormId);
            applyTimeBean.setStartEndTime(resultMap);
            applyTimeBean.setCreateUser(userId);
            applyTimeBean.setApplyStatus(applyStatus);
            int k = applyTimeService.insertStartEndTimes(applyTimeBean);
            if (k < 1) {
                return badRequestOfArguments("添加申请时间失败");
            }
        }

        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments("转诊医政待收诊同意,form修改失败");
        }

        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已排期.toString());
        return succeedRequest(applyForm);
    }

    /**
     * 医政 转诊 排期审核 拒绝
     */
    @Transactional
    @PostMapping(value = "sirTransferDateCheckReject")
    public Map sirTransferDateCheckReject(String applyFormId, String report) {

        // 选定转诊时间
        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_MASTER_REJECT);
        String msg1 = "转诊医政排期审核拒绝,form修改失败";
        String msg2 = "转诊医政排期审核拒绝,time修改失败";
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已拒收.toString());
        return updateStatus(applyFormId, null, applyStatus, msg1, msg2, report);
    }

    /**
     * 医生 受邀会诊 代收诊 拒收
     */
    @Transactional
    @PostMapping(value = "doctor")
    public Map doctorReceiveReject(String applyFormId, String report) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT);
        String msg1 = "受邀胡子很医生拒收,form修改失败";
        String msg2 = "受邀胡子很医生拒收,time修改失败";
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已拒收.toString());
        return updateStatus(applyFormId, null, applyStatus, msg1, msg2, report);
    }

    /**
     * 医生 发出会诊 带反馈 编辑临床反馈 暂存 /医生 受邀会诊 会诊中 编辑会诊报告 暂存
     */
    @Transactional
    @PostMapping(value = "doctorSendFeedbackReportMoment")
    public Map doctorSendFeedbackReportMoment(String applyFormId, String consultantFeedback, String report) {

        String userId = getRequestToken();

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyFormId);
        if (StringUtils.isNotBlank(consultantFeedback)) {
            caseConsultant.setConsultantFeedback(consultantFeedback);
        }
        if (StringUtils.isNotBlank(report)) {
            caseConsultant.setConsultantReport(report);
        }
        caseConsultant.setUpdateUser(userId);
        int k = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("CaseConsultant修改失败");
        }

        return succeedRequest(caseConsultant);
    }

    /**
     * 医生 发出会诊 待反馈 编辑临床反馈 提交 /医生 受邀会诊 会诊中 编辑会诊报告 提交
     */
    @Transactional
    @PostMapping(value = "doctorSendFeedbackReport")
    public Map doctorSendFeedbackReport(String applyFormId, String consultantFeedback, String report) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("applyFormId is null");
        }

        String userId = getRequestToken();
        String applyStatus = null;

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyFormId);
        if (StringUtils.isNotBlank(consultantFeedback)) {
            applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_END);
            caseConsultant.setConsultantFeedback(consultantFeedback);
        }
        if (StringUtils.isNotBlank(report)) {
            applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
            caseConsultant.setConsultantReport(report);
        }
        caseConsultant.setUpdateUser(userId);
        int k = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("CaseConsultant修改失败");
        }

        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments("form修改失败");
        }

        applyForm = applyFormService.getByPrimaryKey(applyFormId);
        if (!ApplyType.APPLY_CONSULTATION_IMAGE_TEXT.toString().equals(applyForm.getApplyType())) {
            ApplyTime applyTime = new ApplyTime();
            applyTime.setApplyFormId(applyForm.getId());
            applyTime.setApplyStatus(applyStatus);
            applyTime.setUpdateUser(userId);
            int j = applyTimeService.updateStatus(applyTime);
            if (j < 1) {
                return badRequestOfArguments("time修改失败");
            }
        }

        if (applyStatus == ConsultationStatus.CONSULTATION_REPORT_SUBMITTED.toString()) {
            applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已提交会诊报告.toString());
        } else if (applyStatus == ConsultationStatus.CONSULTATION_END.toString()) {
            applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已反馈.toString());

            new Thread(() -> {
                try {
                    Thread.sleep(1000);
                    applyNodeService.insertByNodeOperator(applyFormId, ApplyNodeConstant.已结束.toString(), "");
                } catch (Exception e) {
                    Thread.currentThread().interrupt();
                }
                Thread.currentThread().interrupt();
            }).start();
        }

        return succeedRequest(applyForm);
    }

    /**
     * 医生 转诊 待收诊 拒绝
     */
    @Transactional
    @PostMapping(value = "doctorTransferReject")
    public Map doctorTransferReject(String applyFormId, String refuseRemark) {
        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SLAVE_REJECT);
        String msg1 = "受邀医生待收诊拒收,form修改失败";
        String msg2 = "受邀医生待收诊拒收,time修改失败";
        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        applyNodeService.insertByNodeOperator(applyFormId, ApplyNodeConstant.已拒收.toString(), applyForm.getApplySummary());
        return updateStatus(applyFormId, null, applyStatus, msg1, msg2, refuseRemark);
    }

    /**
     * 医生 转诊 待收诊 接收 排期审核
     */
    @Transactional
    @PostMapping(value = "doctorTransDateCheck")
    public Map doctorTransDateCheck(String applyFormId, String inquiryDatetime) {
        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SLAVE_ACCEDE);
        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        applyNodeService.insertByNodeOperator(applyFormId, ApplyNodeConstant.已接诊.toString(), applyForm.getApplySummary());
        return transferDateSure(applyFormId, applyStatus, inquiryDatetime);
    }

    /**
     * 医生 转诊 待收诊 接收 已排期
     */
    @Transactional
    @PostMapping(value = "doctorTransDateSure")
    public Map doctorTransDateSure(String applyFormId, String inquiryDatetime) {
        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED);
        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        applyNodeService.insertByNodeOperator(applyFormId, ApplyNodeConstant.已排期.toString(), applyForm.getApplySummary());
        return transferDateSure(applyFormId, applyStatus, inquiryDatetime);
    }

    /**
     * 医生 草稿箱 删除
     */
    @Transactional
    @GetMapping(value = "DraftDel")
    public Map draftDel(String applyFormId) {

        int i = applyFormService.softDel(applyFormId);
        if (i < 1) {
            return badRequestOfArguments("删除草稿失败");
        }

        return succeedRequest("删除成功");
    }

    /**
     * 医生 受邀会诊 待收诊 接收 原接收人非本人
     */
    @Transactional
    @PostMapping(value = "doctorAcceptOther")
    public Map doctorAcceptOther(String applyFormId, String startEndTime) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("传入applyFormId为空");
        }

        String type = applyFormService.getByPrimaryKey(applyFormId).getApplyType();
        // 更新applyForm相关
        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        String inviteSummary = "<" + currentUserBean.getUserName() + "/" + currentUserBean.getTitleName() + "/" + currentUserBean.getBranchName() + "/" + currentUserBean.getHospitalName() + ">";
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setInviteUserId(userId);
        applyForm.setInviteSummary(inviteSummary);
        applyForm.setApplyStatus(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE.toString());
        if (ApplyType.APPLY_CONSULTATION_IMAGE_TEXT.toString().equals(type)) {
            applyForm.setApplyStatus(ConsultationStatus.CONSULTATION_BEGIN.toString());
            applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
        }
        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("更新form失败");
        }

        // 视频会诊,更新applyTime相关
        if (ApplyType.APPLY_CONSULTATION_VIDEO.toString().equals(type)) {
            // 删除原时间
            int j = applyTimeService.delByApplyForm(applyFormId);
            if (j < 0) {
                return badRequestOfArguments("删除原applyTime失败");
            }

            //解析传入json
            Map<String, String> resultMap = applyTimeJson(startEndTime);

            // 添加新的时间
            ApplyTimeBean applyTimeBean = new ApplyTimeBean();
            applyTimeBean.setApplyFormId(applyFormId);
            applyTimeBean.setStartEndTime(resultMap);
            applyTimeBean.setCreateUser(userId);
            applyTimeBean.setApplyStatus(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE.toString());
            int m = applyTimeService.insertStartEndTimes(applyTimeBean);
            if (m < 1) {
                return badRequestOfArguments("添加申请时间失败");
            }

        }

        // 更新caseConsultant相关
        ConsultantReportBean consultantReportBean = new ConsultantReportBean();
        consultantReportBean.setDoctorName(currentUserBean.getUserName());
        consultantReportBean.setDoctorId(userId);
        consultantReportBean.setReport("");
        consultantReportBean.setReportStatus("1");
        List<ConsultantReportBean> consultantReportBeanList = new LinkedList<>();
        consultantReportBeanList.add(consultantReportBean);
        String jsonReport = JSON.toJSONString(consultantReportBeanList);

        Map<String, String> userMap = new LinkedHashMap<>();
        String doctorPrice = null;
        userMap.put("doctorName", inviteSummary);
        userMap.put("doctorId", userId);
        if (ApplyType.APPLY_CONSULTATION_IMAGE_TEXT.toString().equals(type)) {
            doctorPrice = currentUserBean.getConsultationPicturePrice();
            userMap.put("price", currentUserBean.getConsultationPicturePrice());
        }
        if (ApplyType.APPLY_CONSULTATION_VIDEO.toString().equals(type)) {
            doctorPrice = currentUserBean.getConsultationVideoPrice();
            userMap.put("price", currentUserBean.getConsultationVideoPrice());
        }
        List<Map> userList = new LinkedList<>();
        userList.add(userMap);
        String jsonUser = JSON.toJSONString(userList);

        CaseConsultant caseConsultant = caseConsultantService.getByPrimaryKey(applyFormId);
        BigDecimal hospitalPrice = caseConsultant.getHospitalPrice();
        BigDecimal resultDoctorPrice = new BigDecimal(doctorPrice);
        BigDecimal consultantPrice = hospitalPrice.add(resultDoctorPrice);

        caseConsultant.setId(applyFormId);
        caseConsultant.setInviteUserId(userId);
        caseConsultant.setConsultantUserList(jsonUser);
        caseConsultant.setConsultantReport(jsonReport);
        caseConsultant.setUpdateUser(userId);
        caseConsultant.setConsultantPrice(consultantPrice);
        int k = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("更新CaseConsultant失败");
        }
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
        return succeedRequest("已接收");
    }

    /**
     * 医生 受邀会诊 待接收(视频会诊) 主会诊医生接收
     */
    @Transactional
    @PostMapping(value = "mainDoctorAccede")
    public Map mainDoctorAccede(String applyFormId, String startEndTime) {
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("applyFormId or startEndTime is null");
        }

        // 删除原时间
        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 0) {
            return badRequestOfArguments("删除原applyTime失败");
        }

        //解析传入json
        Map<String, String> resultMap = applyTimeJson(startEndTime);

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE);
        String userId = getRequestToken();

        // 修改applyForm状态
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setApplyStatus(applyStatus);
        applyForm.setUpdateUser(userId);
        int k = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (k < 1) {
            return badRequestOfArguments("修改applyForm失败");
        }

        // 添加新的时间
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        applyTimeBean.setApplyStatus(applyStatus);

        int i = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (i < 1) {
            return badRequestOfArguments("添加申请时间失败");
        }
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
        return succeedRequest(applyTimeBean);
    }

    /**
     * 医生 受邀会诊 待接收(图文会诊) 主会诊医生接收
     */
    @Transactional
    @PostMapping(value = "mainDoctorAccedePicture")
    public Map mainDoctorAccedePicture(String applyFormId, String startEndTime) {
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("applyFormId or startEndTime is null");
        }


        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        String userId = getRequestToken();

        // 修改applyForm状态
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setApplyStatus(applyStatus);
        applyForm.setUpdateUser(userId);
        int k = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (k < 1) {
            return badRequestOfArguments("修改applyForm失败");
        }

        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
        return succeedRequest("成功");
    }

    /**
     * 主会诊医生MDT协调 视频会诊
     */
    @Transactional
    @PostMapping(value = "allocationDoctorTime")
    public Map allocationDoctorTime(String applyFormId, String inviteSummary, String startEndTime, String consultantUserList, BigDecimal consultantPrice,
                                    String consultantReport) {

        String userId = getRequestToken();

        // 更新applyForm状态
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setUpdateUser(userId);
        applyForm.setApplyStatus(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE.toString());
        applyForm.setInviteSummary(inviteSummary);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("修改applyForm失败");
        }

        // 确认时间
        Map<String, String> resultMap = applyTimeJson(startEndTime);

        ApplyTime applyTime = new ApplyTime();
        applyTime.setApplyFormId(applyFormId);
        applyTime.setCreateUser(userId);
        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 0) {
            badRequestOfArguments("删除原applyTime失败");
        }

        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        applyTimeBean.setApplyStatus(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE.toString());
        int k = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (k < 1) {
            return badRequestOfArguments("添加新的applyTime失败");
        }

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyForm.getId());
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setConsultantReport(consultantReport);
        caseConsultant.setUpdateUser(userId);

        int l = caseConsultantService.updateInviteDoctorByPrimaryKeySelective(caseConsultant);
        if (l < 1) {
            return badRequestOfArguments("添加失败");
        }

        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
        return succeedRequest("操作成功");
    }

    /**
     * 主会诊医生MDT协调 图文会诊
     */
    @Transactional
    @PostMapping(value = "allocationDoctorTimePicture")
    public Map allocationDoctorTimePicture(String applyFormId, String inviteSummary, String consultantUserList, BigDecimal consultantPrice,
                                           String consultantReport) {

        String userId = getRequestToken();

        // 更新applyForm状态
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setUpdateUser(userId);
        applyForm.setApplyStatus(ConsultationStatus.CONSULTATION_BEGIN.toString());
        applyForm.setInviteSummary(inviteSummary);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("修改applyForm失败");
        }

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyForm.getId());
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setConsultantReport(consultantReport);
        caseConsultant.setUpdateUser(userId);

        int l = caseConsultantService.updateInviteDoctorByPrimaryKeySelective(caseConsultant);
        if (l < 1) {
            return badRequestOfArguments("添加失败");
        }
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
        return succeedRequest("操作成功");
    }
}
