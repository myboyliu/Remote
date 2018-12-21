package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.YoonaLtUtils.IdentityCardUtil;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.bean.ApplyTimeBean;
import com.sicmed.remote.web.bean.CaseContentBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
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
        String applySummary = "<"+currentUserBean.getUserName()+"/"+currentUserBean.getTitleName()+"/"+currentUserBean.getBranchName()+"/"+currentUserBean.getHospitalName()+">";
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
    public Map videoConsultation(@Validated ApplyForm applyForm, BindingResult applyFormBr, String startEndTime) {

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
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("视频会诊记录保存失败");
        }

        if (startEndTime == null) {
            return badRequestOfArguments("startEndTime is null");
        }

        LinkedHashMap<String, String> resultMap;
        try {
            resultMap = JSON.parseObject(startEndTime, new TypeReference<LinkedHashMap<String, String>>() {
            }, Feature.OrderedField);
        } catch (Exception e) {
            return badRequestOfArguments("startEndTime 格式有误");
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

        return succeedRequest(applyForm);
    }

    /**
     * 图文会诊
     *
     * @param applyForm
     * @param applyFormBr
     */
    @PostMapping(value = "picture")
    public Map pictureConsultation(@Validated ApplyForm applyForm, BindingResult applyFormBr) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);

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

        // 添加申请时间
        ApplyTime applyTime = new ApplyTime();
        applyTime.setApplyFormId(applyForm.getId());
        applyTime.setCreateUser(userId);
        applyTime.setApplyStatus(applyForm.getApplyStatus());
        int j = applyTimeService.insertSelective(applyTime);
        if (j < 1) {
            return badRequestOfArguments("添加申请时间失败");
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
     * 确认转诊,图文视频会诊时间
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

    // 按照登录id显示不同查询结果
    @GetMapping(value = "respectivelyCheck")
    public Map respectivelyCheck() {

        // 医政
        String userId = getRequestToken();
        return null;
    }

}
