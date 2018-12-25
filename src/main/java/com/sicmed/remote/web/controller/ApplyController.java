package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.YoonaLtUtils.IdentityCardUtil;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.bean.*;
import com.sicmed.remote.web.entity.*;
import com.sicmed.remote.web.service.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description 转诊, 图文会诊, 视频会诊, 草稿
 * @data 2018/12/19
 */
@Slf4j
@RestController
@RequestMapping(value = "apply")
public class ApplyController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private CasePatientService casePatientService;

    @Autowired
    private CaseRecordService caseRecordService;

    @Autowired
    private CaseContentService caseContentService;

    @Autowired
    private ApplyTimeService applyTimeService;
    @Autowired
    private CaseConsultantService caseConsultantService;

    /**
     * 添加草稿
     *
     * @param casePatient
     * @param caseRecord
     * @param weightPathTypeId
     */
    @PostMapping(value = "draft")
    public Map draft(CasePatient casePatient, CaseRecord caseRecord, String weightPathTypeId, ApplyForm applyForm) {

        if (casePatient != null) {
            if (StringUtils.isNotBlank(casePatient.getPatientCard())) {

                if (!IdentityCardUtil.validateCard(casePatient.getPatientCard())) {
                    return badRequestOfArguments("身份证输入有误");
                }
            }
        }

        String userId = getRequestToken();

        // 添加病例患者基本信喜

        casePatient.setCreateUser(userId);
        int i = casePatientService.insertSelective(casePatient);
        if (i < 1) {
            return badRequestOfInsert("添加casePatient失败");
        }
        caseRecord.setPatientId(casePatient.getId());


        // 添加病例初步诊断结果
        caseRecord.setCreateUser(userId);
        int j = caseRecordService.insertSelective(caseRecord);
        if (j < 1) {
            return badRequestOfInsert("添加caseRecord的caseDiagnosis失败");
        }

        CaseContentBean caseContentBean = new CaseContentBean();
        caseContentBean.setRecordId(caseRecord.getId());
        applyForm.setCaseRecordId(caseRecord.getId());

        // 添加病例所需文件
        if (StringUtils.isNotBlank(weightPathTypeId)) {

            // 文件路径 与 病例文件id map解析
            List<CaseContent> resultList;
            try {
                resultList = JSON.parseObject(weightPathTypeId, new TypeReference<LinkedList>() {
                }, Feature.OrderedField);
            } catch (Exception e) {
                return badRequestOfArguments("pathWeightTypeId 填写错误");
            }
            caseContentBean.setRecordId(caseRecord.getId());
            caseContentBean.setCreateUser(userId);
            caseContentBean.setWeightPathTypeId(resultList);
            int k = caseContentService.insertByMap(caseContentBean);
            if (k < 0) {
                return badRequestOfInsert("添加CaseContent失败");
            }
        }

        // 添加applyForm,applyStatus申请状态为草稿
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        if (currentUserBean == null) {
            return badRequestOfArguments("获取医生详细信息失败");
        }

        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyUserId(userId);
        String applyType = String.valueOf(ApplyType.APPLY_DRAFT);
        applyForm.setApplyType(applyType);
        int l = applyFormService.insertSelective(applyForm);
        if (l < 1) {
            return badRequestOfArguments("添加草稿失败");
        }

        return succeedRequest(casePatient);
    }

    /**
     * 获取申请发起人摘要信息
     *
     * @return
     */
    private String getApplySummary() {
        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        return "<" + currentUserBean.getUserName() + "/" + currentUserBean.getTitleName() + "/" + currentUserBean.getBranchName() + "/" + currentUserBean.getHospitalName() + ">";
    }

    /**
     * 转诊
     *
     * @param applyForm
     */
    @PostMapping(value = "transfer")
    public Map transferTreatment(@Validated ApplyForm applyForm, BindingResult applyFormBr, String startEndTime) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        String applySummary = getApplySummary();
        // 添加 转诊 申请表
        String applyType = String.valueOf(ApplyType.APPLY_REFERRAL);
        String applyStatues = String.valueOf(InquiryStatus.INQUIRY_APPLY_CREATE_SUCCESS);
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyType(applyType);
        applyForm.setApplyUserId(userId);
        applyForm.setApplyStatus(applyStatues);
        applyForm.setApplySummary(applySummary);
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("转诊记录保存失败");
        }

        if (startEndTime == null) {
            return badRequestOfArguments("startEndTime is null");
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
            return badRequestOfArguments("日期输入有误");
        }
        for (String time : lists) {
            Date date = YtDateUtils.stringToDate(time);
            String start = YtDateUtils.dateToString(YtDateUtils.parmDateBegin(date));
            String end = YtDateUtils.dateToString(YtDateUtils.intradayEnd(date));
            resultMap.put(start, end);
        }

        // 添加 转诊申请 时间
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyForm.getId());
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        applyTimeBean.setApplyStatus(applyForm.getApplyStatus());
        int j = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (j < 1) {
            return badRequestOfArguments("添加申请时间失败");
        }

        return succeedRequest(applyForm);
    }

    /**
     * 视频会诊
     *
     * @param applyForm
     * @param applyFormBr
     */
    @PostMapping(value = "video")
    public Map videoConsultation(@Validated ApplyForm applyForm, BindingResult applyFormBr, String startEndTime, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);

        // 添加 视频会诊 申请表
        String applyType = String.valueOf(ApplyType.APPLY_CONSULTATION_VIDEO);
        String applyStatues = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_CREATE_SUCCESS);
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyUserId(userId);
        applyForm.setApplyType(applyType);
        applyForm.setApplyStatus(applyStatues);
        applyForm.setApplySummary(getApplySummary());
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("视频会诊记录保存失败");
        }

        if (startEndTime == null) {
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
                resultMap.put(consultationTimeBean.getStartTime(), consultationTimeBean.getEntTime());
            }
        }
        // 添加申请时间
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyForm.getId());
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        applyTimeBean.setApplyStatus(applyForm.getApplyStatus());
        int j = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (j < 1) {
            return badRequestOfArguments("添加申请时间失败");
        }

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setHospitalPrice(hospitalPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setApplyUserId(userId);

        int k = caseConsultantService.insertSelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("添加失败");
        }

        return succeedRequest(applyForm);
    }

    /**
     * 图文会诊
     *
     * @param applyForm
     * @param applyFormBr
     */
    @PostMapping(value = "picture")
    public Map pictureConsultation(@Validated ApplyForm applyForm, BindingResult applyFormBr, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }


        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        applyForm.setApplySummary(getApplySummary());
        // 添加 图文会诊 申请表
        applyForm.setApplyUserId(userId);
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        String applyType = String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT);
        applyForm.setApplyType(applyType);
        String applyStatues = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_CREATE_SUCCESS);
        applyForm.setApplyStatus(applyStatues);

        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("图文会诊记录保存失败");
        }

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setHospitalPrice(hospitalPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setApplyUserId(userId);

        int j = caseConsultantService.insertSelective(caseConsultant);
        if (j < 1) {
            return badRequestOfArguments("添加失败");
        }

        return succeedRequest(applyForm);
    }

    /**
     * 更新申请状态
     *
     * @param applyForm
     * @param applyStatus
     * @param msg1
     * @param msg2
     */
    public Map updateStatus(ApplyForm applyForm, String applyStatus, String msg1, String msg2) {

        if (StringUtils.isBlank(applyForm.getId())) {
            return badRequestOfArguments("applyForm.id is null");
        }

        String userId = getRequestToken();

        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments(msg1);
        }

        int j = applyTimeService.updateStatus(applyForm.getId(), applyStatus, userId);
        if (j < 1) {
            return badRequestOfArguments(msg2);
        }
        return succeedRequest(applyForm);
    }

    /**
     * 转诊医政同意转诊
     */
    @PostMapping(value = "applyAccede")
    public Map applyAccede(ApplyForm applyForm) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_ACCEDE);
        String msg1 = "转诊医政同意转诊,form修改失败";
        String msg2 = "转诊医政同意转诊,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 转诊医政拒绝转诊
     */
    @PostMapping(value = "applyReject")
    public Map applyReject(ApplyForm applyForm) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_REJECT);
        String msg1 = "转诊审核医政拒绝,form修改失败";
        String msg2 = "转诊审核医政拒绝,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 受诊医政接受转诊
     */
    @PostMapping(value = "masterAccede")
    public Map masterAccede(ApplyForm applyForm) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_MASTER_ACCEDE);
        String msg1 = "受诊医政接受转诊,form修改失败";
        String msg2 = "受诊医政接受转诊,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 受诊医政拒绝转诊
     */
    @PostMapping(value = "masterReject")
    public Map masterReject(ApplyForm applyForm) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_MASTER_REJECT);
        String msg1 = "受诊医政拒绝转诊,form修改失败";
        String msg2 = "受诊医政拒绝转诊,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 受诊医生接受转诊
     */
    @PostMapping(value = "slaveAccede")
    public Map slaveAccede(ApplyForm applyForm) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SLAVE_ACCEDE);
        String msg1 = "受诊医生接受转诊,form修改失败";
        String msg2 = "受诊医生接受转诊,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 受诊医生拒绝转诊
     */
    @PostMapping(value = "slaveReject")
    public Map slaveReject(ApplyForm applyForm) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SLAVE_REJECT);
        String msg1 = "受诊医生拒绝转诊,form修改失败";
        String msg2 = "受诊医生拒绝转诊,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 确认转诊,视频会诊时间
     */
    @PostMapping(value = "dateTime")
    public Map dateTime(ApplyForm applyForm, String startEndTime) {

        // 删除原时间
        if (applyForm == null || StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("applyForm or startEndTime is null");
        }

        int i = applyTimeService.delByApplyForm(applyForm.getId());
        if (i < 1) {
            return badRequestOfArguments("删除原applyTime失败");
        }

        String userId = getRequestToken();
        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED);

        int j = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (j < 1) {
            return badRequestOfArguments("确认时间,form修改失败");
        }

        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyForm.getId());
        applyTimeBean.setApplyStatus(applyStatus);
        applyTimeBean.setUpdateUser(userId);
        int k = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (k < 1) {
            return badRequestOfArguments("确认时间,time修改失败");
        }
        return succeedRequest(applyForm);
    }

    /**
     * 转诊医生确认转诊
     */
    @PostMapping(value = "senderConfirm")
    public Map senderConfirm(ApplyForm applyForm) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SENDER_CONFIRM);
        String msg1 = "转诊医生确认转诊,form修改失败";
        String msg2 = "转诊医生确认转诊,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 转诊医生取消转诊
     */
    @PostMapping(value = "senderCancel")
    public Map senderCancel(ApplyForm applyForm) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SENDER_CANCEL);
        String msg1 = "转诊医生取消转诊,form修改失败";
        String msg2 = "转诊医生取消转诊,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 会诊首诊医政审核通过
     */
    @PostMapping(value = "consultationApplyAccede")
    public Map consultationApplyAccede(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        String msg1 = "会诊审核通过,form修改失败";
        String msg2 = "会诊审核通过,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 会诊首诊医政审核拒绝
     */
    @PostMapping(value = "consultationApplyReject")
    public Map consultationApplyReject(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_REJECT);
        String msg1 = "会诊首诊医政审核拒绝,form修改失败";
        String msg2 = "会诊首诊医政审核拒绝,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 会诊收诊医生同意
     */
    @PostMapping(value = "consultationSlaveAccede")
    public Map consultationSlaveAccede(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE);
        String msg1 = "会诊收诊医生同意,form修改失败";
        String msg2 = "会诊收诊医生同意,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 会诊收诊医生拒绝
     */
    @PostMapping(value = "consultationSlaveReject")
    public Map consultationSlaveReject(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT);
        String msg1 = "会诊收诊医生拒绝,form修改失败";
        String msg2 = "会诊收诊医生拒绝,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 会诊收诊医政接收
     */
    @PostMapping(value = "consultationMasterAccede")
    public Map consultationMasterAccede(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_ACCEDE);
        String msg1 = "会诊收诊医政接收,form修改失败";
        String msg2 = "会诊收诊医政接收,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 会诊收诊医政拒绝
     */
    @PostMapping(value = "consultationMasterReject")
    public Map consultationMasterReject(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        String msg1 = "会诊收诊医政拒绝,form修改失败";
        String msg2 = "会诊收诊医政拒绝,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 会诊收诊医政选择砖家
     */
    @PostMapping(value = "consultationDoctorLocked")
    public Map consultationDoctorLocked(ApplyForm applyForm) {

        if (StringUtils.isBlank(applyForm.getInviteUserId())) {
            return badRequestOfArguments("请选择砖家");
        }

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DOCTOR_LOCKED);
        if (StringUtils.isBlank(applyForm.getInviteUserId())) {
            return badRequestOfArguments("未选定砖家");
        }
        String msg1 = "会诊收诊医政选择砖家,form修改失败";
        String msg2 = "会诊收诊医政选择砖家,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 会诊开始
     */
    @PostMapping(value = "consultationBegin")
    public Map consultationBegin(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        String msg1 = "会诊开始,form修改失败";
        String msg2 = "会诊开始,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 提交报告
     */
    @PostMapping(value = "consultationReport")
    public Map consultationReport(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
        String msg1 = "提交报告,form修改失败";
        String msg2 = "提交报告,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 反馈
     */
    @PostMapping(value = "consultationFeedback")
    public Map consultationFeedback(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_FEEDBACK_SUBMITTED);
        String msg1 = "反馈,form修改失败";
        String msg2 = "反馈,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    /**
     * 会诊结束
     */
    @PostMapping(value = "consultationEnd")
    public Map consultationEnd(ApplyForm applyForm) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_END);
        String msg1 = "会诊结束,form修改失败";
        String msg2 = "会诊结束,time修改失败";

        return updateStatus(applyForm, applyStatus, msg1, msg2);
    }

    // 查询相关代码
    private final static List<String> consultantTypeList = new ArrayList<>();

    static {
        consultantTypeList.add(String.valueOf(ApplyType.APPLY_CONSULTATION_VIDEO));
        consultantTypeList.add(String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT));
    }

    /**
     * 发出会诊查询
     *
     * @param statusList
     * @param msg
     */
    public Map sendSelect(List<String> statusList, String msg) {

        String userId = getRequestToken();

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setConsultationTypeList(consultantTypeList);

        List<ApplyForm> applyFormList = applyFormService.getByApplyFormBean(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return badRequestOfArguments(msg);
        }

        return succeedRequest(applyFormList);

    }

    /**
     * 发出会诊待审核
     */
    @GetMapping(value = "sendApplyCreateSuccess")
    public Map sendApplyCreateSuccess() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_CREATE_SUCCESS);
        statusList.add(applyStatus);
        String msg = "无待审核";

        return sendSelect(statusList, msg);
    }

    /**
     * 发出会诊待收诊
     */
    @GetMapping(value = "sendApplySlaveDoctor")
    public Map sendApplySlaveDoctor() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT);
        String applyStatus3 = String.valueOf(ConsultationStatus.CONSULTATION_DOCTOR_LOCKED);
        String applyStatus4 = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_ACCEDE);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        statusList.add(applyStatus3);
        statusList.add(applyStatus4);
        String msg = "无待收诊";

        return sendSelect(statusList, msg);
    }

    /**
     * 发出会诊已拒收
     */
    @GetMapping(value = "sendMasterReject")
    public Map sendMasterReject() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        statusList.add(applyStatus);
        String msg = "无已拒收";

        return sendSelect(statusList, msg);
    }

    /**
     * 发出会诊已排期
     */
    @GetMapping(value = "sendDateTimeLocked")
    public Map sendDateTimeLocked() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        statusList.add(applyStatus);
        String msg = "无已排期";

        return sendSelect(statusList, msg);
    }

    /**
     * 发出会诊会诊中
     */
    @GetMapping(value = "sendBegin")
    public Map sendBegin() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        statusList.add(applyStatus);
        String msg = "无会诊中";

        return sendSelect(statusList, msg);
    }

    /**
     * 发出会诊待反馈
     */
    @GetMapping(value = "sendReportSubmitted")
    public Map sendReportSubmitted() {

        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
        statusList.add(applyStatus);
        String msg = "无待反馈";

        return sendSelect(statusList, msg);
    }

    /**
     * 发出会诊已结束
     */
    @GetMapping(value = "sendEnd")
    public Map sendEnd() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_END);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_FEEDBACK_SUBMITTED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无已结束";

        return sendSelect(statusList, msg);
    }

    /**
     * 受邀会诊查询
     */
    public Map receiveSelect(List<String> statusList, String msg) {

        String userId = getRequestToken();

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setInviteUserId(userId);

        List<ApplyForm> applyFormList = applyFormService.getByApplyFormBean(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return badRequestOfArguments(msg);
        }

        return succeedRequest(applyFormList);

    }

    /**
     * 受邀会诊待收诊
     */
    @GetMapping(value = "receiveApplyAccede")
    public Map receiveApplyAccede() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        statusList.add(applyStatus);
        String msg = "无待收诊";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊已拒收
     */
    @GetMapping(value = "receiveSlaveMasterReject")
    public Map receiveSlaveMasterReject() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无已拒收";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊排期审核
     */
    @GetMapping(value = "receiveSlaveDoctor")
    public Map receiveSlaveDoctor() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_DOCTOR_LOCKED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无排期审核";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊已排期
     */
    @GetMapping(value = "receiveDateTimeLocked")
    public Map receiveDateTimeLocked() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        statusList.add(applyStatus);
        String msg = "无已排期";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊会诊中
     */
    @GetMapping(value = "receiveBegin")
    public Map receiveBegin() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        statusList.add(applyStatus);
        String msg = "无会诊中";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊待反馈
     */
    @GetMapping(value = "receiveReportSubmitted")
    public Map receiveReportSubmitted() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
        statusList.add(applyStatus);
        String msg = "无待反馈";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊已结束
     */
    @GetMapping(value = "receiveEnd")
    public Map receiveEnd() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_END);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_FEEDBACK_SUBMITTED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无已结束";

        return receiveSelect(statusList, msg);
    }
    
}
