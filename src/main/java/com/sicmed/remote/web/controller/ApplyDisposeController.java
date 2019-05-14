package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyNodeConstant;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.meeting.entity.Meeting;
import com.sicmed.remote.meeting.service.MeetingService;
import com.sicmed.remote.web.YoonaLtUtils.OrderNumUtils;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.bean.*;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.service.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
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
public class ApplyDisposeController extends ApplyController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private ApplyTimeService applyTimeService;

    @Autowired
    private CaseConsultantService caseConsultantService;

    @Autowired
    private ApplyNodeService applyNodeService;
    @Autowired
    private ConsultationPriceRecordService consultationPriceRecordService;


    /**
     * 医政 工作台 重新分配医生
     */
    @Transactional
    @PostMapping(value = "sirUpdateDoctor")
    public Map sirUpdateDoctor(ApplyForm applyForm, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport) {

        String userId = getRequestToken();

        // 修改apply_form相关
        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("修改applyForm失败");
        }

        // 医生重新分配,修改case_consultant相关
        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyForm.getId());
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setHospitalPrice(hospitalPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setConsultantReport(consultantReport);
        caseConsultant.setUpdateUser(userId);
        int k = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
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
    public Map sirUpdateDate(ApplyTime applyTime, Meeting meeting) {
        if (applyTime == null) {
            return badRequestOfArguments("传入参数有误");
        }

        String userId = getRequestToken();

        // 由applyFormId删除原apply_time中选定的时间段,并添加修改的时间
        int j = applyTimeService.delByApplyForm(applyTime.getApplyFormId());
        if (j < 0) {
            return badRequestOfArguments("删除原applyTime失败");
        }
        applyTime.setCreateUser(userId);
        int k = applyTimeService.insertSelective(applyTime);
        if (k < 1) {
            return badRequestOfArguments("确认时间,time修改失败");
        }

        // case_consultant的时间段修改为对应的时间
        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setConsultantStartTime(applyTime.getEventStartTime());
        caseConsultant.setConsultantEndTime(applyTime.getEventEndTime());
        caseConsultant.setId(applyTime.getApplyFormId());
        caseConsultantService.updateByPrimaryKeySelective(caseConsultant);

        meeting.setId(applyTime.getApplyFormId());
        meetingService.updateMeeting(meeting);

        return succeedRequest(applyTime);
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
    @Transactional
    @PostMapping(value = "sirTransferAmendTime")
    public Map sirTransferAmendTime(String applyFormId, String startEndTime) {
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("参数有误");
        }

        String userId = getRequestToken();

        // 删除原设定的转诊时间
        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 1) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return badRequestOfArguments("删除原时间失败");
        }

        // 解析传入的startEndTime为{开始时间:结束时间}格式
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
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return badRequestOfArguments("添加申请时间失败");
        }
        return succeedRequest(resultMap);

    }

    /**
     * 医生 发出会诊 带反馈 编辑临床反馈 暂存 /医生 受邀会诊 会诊中 编辑会诊报告 暂存
     */
    @Transactional
    @PostMapping(value = "doctorSendFeedbackReportMoment")
    public Map doctorSendFeedbackReportMoment(String applyFormId, String consultantFeedback, ConsultantReportBean consultantReportBean) {

        String userId = getRequestToken();

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyFormId);
        if (StringUtils.isNotBlank(consultantFeedback)) {
            // 添加会诊反馈
            caseConsultant.setConsultantFeedback(consultantFeedback);
        }

        if (consultantReportBean == null || StringUtils.isNotBlank(consultantReportBean.getReport())) {
            // 添加会诊报告
            String oldReport = caseConsultantService.selectReport(applyFormId);
            List<ConsultantReportBean> newConsultantReportBeanList = new ArrayList<>();
            List<ConsultantReportBean> consultantReportBeanList = JSON.parseObject(oldReport, new TypeReference<List<ConsultantReportBean>>() {
            }, Feature.OrderedField);
            for (ConsultantReportBean reportBean : consultantReportBeanList) {
                if (reportBean.getDoctorId().equals(consultantReportBean.getDoctorId())) {
                    newConsultantReportBeanList.add(consultantReportBean);
                } else {
                    newConsultantReportBeanList.add(reportBean);
                }
            }
            String newReport = JSON.toJSONString(newConsultantReportBeanList);
            caseConsultant.setConsultantReport(newReport);
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
    public Map doctorSendFeedbackReport(String applyFormId, String consultantFeedback, ConsultantReportBean consultantReportBean) {

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
        if (consultantReportBean == null || StringUtils.isNotBlank(consultantReportBean.getReport())) {
            String oldReport = caseConsultantService.selectReport(applyFormId);
            List<ConsultantReportBean> newConsultantReportBeanList = new ArrayList<>();
            List<ConsultantReportBean> consultantReportBeanList = JSON.parseObject(oldReport, new TypeReference<List<ConsultantReportBean>>() {
            }, Feature.OrderedField);
            for (ConsultantReportBean reportBean : consultantReportBeanList) {
                if (reportBean.getDoctorId().equals(consultantReportBean.getDoctorId())) {
                    newConsultantReportBeanList.add(consultantReportBean);
                } else {
                    newConsultantReportBeanList.add(reportBean);
                }
            }
            String newReport = JSON.toJSONString(newConsultantReportBeanList);
            applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
            caseConsultant.setConsultantReport(newReport);

        }
        caseConsultant.setUpdateUser(userId);
        int k = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("CaseConsultant修改失败");
        }

        ApplyForm applyForm = new ApplyForm();
        if (StringUtils.isNotBlank(consultantReportBean.getMdtFlag())) {
            // 修改多学科会诊标识 0为多学科 1为默认单学科
            applyForm.setMdtFlag("0");
        }
        applyForm.setId(applyFormId);
        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments("form修改失败");
        }

        // 非图文会诊需要修改状态
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

        // 添加操作时间节点
        if (applyStatus == ConsultationStatus.CONSULTATION_REPORT_SUBMITTED.toString()) {
            applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已提交会诊报告.toString());
        } else if (applyStatus == ConsultationStatus.CONSULTATION_END.toString()) {
            applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已反馈.toString());

            consultationPriceRecordService.insertList(caseConsultantService.getByPrimaryKey(applyFormId), applyForm);
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
     * 同科室医生接收会诊申请
     *
     * @param applyFormId
     * @param startEndTime
     * @param meeting
     * @return
     */
    @Transactional
    @PostMapping(value = "doctorAcceptOther")
    public Map doctorAcceptOther(String applyFormId, String startEndTime, Meeting meeting) {
        //1.参数校验
        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        if (null == applyForm) {
            return badRequestOfArguments("传入applyFormId为空");
        }
        //2.修改会诊申请    判断会诊类型修改会诊申请状态
        String applyType = applyForm.getApplyType();
        if (String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT).equals(applyType)) {
            // 图文会诊接收后状态立即变为会诊中
            applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_BEGIN));
        } else {
            //视频会诊
            applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE));
        }
        CurrentUserBean currentUserBean = UserTokenManager.getCurrentUser();
        StringBuffer inviteSummary = new StringBuffer();
        inviteSummary.append("<").append(currentUserBean.getUserName()).append("/").append(currentUserBean.getTitleName()).append("/").append(currentUserBean.getBranchName()).append("/").append(currentUserBean.getHospitalName()).append(">");
        applyForm.setId(applyFormId);
        applyForm.setInviteUserId(UserTokenManager.getCurrentUserId());
        applyForm.setInviteSummary(inviteSummary.toString());
        applyForm.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyFormService.inviteeConsent(applyForm);
//        if (i < 1) {
//            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
//            return badRequestOfArguments("已被接收");
//        }

        //3.修改视频会诊时间 视频会诊,修改applyTime
        if (String.valueOf(ApplyType.APPLY_CONSULTATION_VIDEO).equals(applyType)) {
            Map<String, String> resultMap = applyTimeJson(startEndTime);
            ApplyTimeBean applyTimeBean = new ApplyTimeBean();
            applyTimeBean.setApplyFormId(applyFormId);
            applyTimeBean.setStartEndTime(resultMap);
            applyTimeBean.setCreateUser(getRequestToken());
            applyTimeBean.setApplyStatus(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE.toString());
            applyTimeService.delByApplyForm(applyFormId);
            applyTimeService.insertStartEndTimes(applyTimeBean);
            meeting.setId(applyFormId);
            meetingService.createMeeting(meeting);
        }
        //4.修改 会诊记录信息 更新caseConsultant相关,接收人改变,与之相关需要更新
        ConsultantReportBean consultantReportBean = new ConsultantReportBean();
        consultantReportBean.setDoctorName(currentUserBean.getUserName());
        consultantReportBean.setDoctorId(getRequestToken());
        consultantReportBean.setReport("");
        consultantReportBean.setReportStatus("1");
        List<ConsultantReportBean> consultantReportBeanList = new LinkedList<>();
        consultantReportBeanList.add(consultantReportBean);
        String jsonReport = JSON.toJSONString(consultantReportBeanList);
        Map<String, String> userMap = new LinkedHashMap<>();
        String doctorPrice = null;
        userMap.put("doctorName", inviteSummary.toString());
        userMap.put("doctorId", getRequestToken());
        if (String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT).equals(applyType)) {
            doctorPrice = currentUserBean.getConsultationPicturePrice();
            userMap.put("price", currentUserBean.getConsultationPicturePrice());
        }
        if (String.valueOf(ApplyType.APPLY_CONSULTATION_VIDEO).equals(applyType)) {
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
        caseConsultant.setInviteUserId(getRequestToken());
        caseConsultant.setConsultantUserList(jsonUser);
        caseConsultant.setConsultantReport(jsonReport);
        caseConsultant.setUpdateUser(getRequestToken());
        caseConsultant.setConsultantPrice(consultantPrice);
        int k = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
        if (k < 1) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return badRequestOfArguments("更新CaseConsultant失败");
        }
        //5.添加视频会诊流程节点
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
        //6.发送短信提醒医政审核视频会诊订单
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
        ArrayList<String> smsContext = new ArrayList<>();
        smsContext.add(applyFormInfoBean.getInviteBranchName());
        smsContext.add(applyFormInfoBean.getInviteUserName());
        smsService.singleSendByTemplate("86",applyFormInfoBean.getInviteAdminPhone(),326102,smsContext);
        return succeedRequest("已接收");
    }

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
        Date date = new Date();

        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);

        // 判断applyForm属性applyStatus,做不同操作
        if (InquiryStatus.INQUIRY_APPLY_REJECT.toString().equals(applyStatus)) {
            // 转诊申请审核已拒绝,病例状态变为草稿,并删除与之对应apply_time相关
            applyForm.setApplyType(ApplyType.APPLY_DRAFT.toString());
            int j = applyTimeService.delByApplyForm(applyFormId);
            if (j < 1) {
                return badRequestOfArguments(msg2);
            }
        }
        if (ConsultationStatus.CONSULTATION_APPLY_ACCEDE.toString().equals(applyStatus)) {
            // 会诊申请审核通过,添加申请时间
            applyForm.setConsultantApplyTime(date);
        }
        if (StringUtils.isNotBlank(refuseRemark)) {
            // 备注不为空,添加备注
            applyForm.setRefuseRemark(refuseRemark);
        }
        if (StringUtils.isNotBlank(orderNumber)) {
            applyForm.setApplyNumber(orderNumber);
        }
        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments(msg1);
        }

        // 非图文会诊需要更新与之相关的apply_time中的 apply_status属性
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

        // 由apply_status添加对应的时间节点
        if (applyStatus == ConsultationStatus.CONSULTATION_SLAVE_ACCEDE.toString()) {
            applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.已接诊.toString());
        } else if (applyStatus == "CONSULTATION_DATETIME_LOCKED") {
            meetingService.createMeeting(applyFormId);
            applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.已排期.toString());
        } else if (applyStatus == ConsultationStatus.CONSULTATION_MASTER_REJECT.toString()) {
            applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.已拒收.toString());
        }

        return succeedRequest(applyForm);
    }


}
