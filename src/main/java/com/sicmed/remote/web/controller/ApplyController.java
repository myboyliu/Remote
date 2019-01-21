package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyNodeConstant;
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
import org.springframework.transaction.annotation.Transactional;
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
 * @description 转诊, 图文会诊, 视频会诊, 草稿, 搜索
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

    @Autowired
    private ApplyNodeService applyNodeService;

    /**
     * 添加草稿,草稿至少含有患者姓名,身份证,病例文件三种数据,否则无法创建,
     *
     * @param casePatient
     * @param caseRecord
     * @param weightPathTypeId
     * @param applyForm
     */
    @Transactional
    @PostMapping(value = "draft")
    public Map draft(CasePatient casePatient, CaseRecord caseRecord, String weightPathTypeId, ApplyForm applyForm,
                     String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport) {

        if (StringUtils.isBlank(casePatient.getPatientName()) || StringUtils.isBlank(casePatient.getPatientCard())
                || StringUtils.isBlank(weightPathTypeId)) {
            return badRequestOfArguments("数据不全,无法创建草稿");
        }

        if (!IdentityCardUtil.validateCard(casePatient.getPatientCard())) {
            return badRequestOfArguments("身份证输入有误");
        }

        String userId = getRequestToken();
        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("未能获取登录用户Id");
        }


        // 添加病例所需文件 文件路径 与 病例文件id map解析
        List<CaseContent> resultList;
        try {
            resultList = JSON.parseObject(weightPathTypeId, new TypeReference<LinkedList>() {
            }, Feature.OrderedField);
        } catch (Exception e) {
            return badRequestOfArguments("pathWeightTypeId 填写错误");
        }

        CaseContentBean caseContentBean = new CaseContentBean();
        caseContentBean.setCasePatient(casePatient);
        caseContentBean.setCaseRecord(caseRecord);
        caseContentBean.setCreateUser(userId);
        caseContentBean.setWeightPathTypeId(resultList);
        int k = caseContentService.insertByMap(caseContentBean);
        if (k < 0) {
            return badRequestOfInsert("添加CaseContent失败");
        }

        // 添加applyForm,applyStatus申请状态为草稿
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        if (currentUserBean == null) {
            return badRequestOfArguments("获取医生详细信息失败");
        }

        applyForm.setCaseRecordId(caseRecord.getId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyUserId(userId);
        String applyType = String.valueOf(ApplyType.APPLY_DRAFT);
        applyForm.setApplyType(applyType);
        applyForm.setCreateUser(userId);
        int l = applyFormService.insertSelective(applyForm);
        if (l < 1) {
            return badRequestOfArguments("添加草稿失败");
        }

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyForm.getId());
        caseConsultant.setCreateUser(userId);
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setHospitalPrice(hospitalPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setApplyUserId(userId);
        caseConsultant.setConsultantReport(consultantReport);

        int a = caseConsultantService.insertSelective(caseConsultant);
        if (a < 1) {
            return badRequestOfArguments("添加失败");
        }
        return succeedRequest(casePatient);
    }

    /**
     * 获取申请发起人摘要信息
     *
     * @return
     */
    private String getApplySummary(String userId) {
//        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        return "<" + currentUserBean.getUserName() + "/" + currentUserBean.getTitleName() + "/" + currentUserBean.getBranchName() + "/" + currentUserBean.getHospitalName() + ">";
    }

    /**
     * 转诊
     *
     * @param applyForm
     */
    @Transactional
    @PostMapping(value = "transfer")
    public Map transferTreatment(@Validated ApplyForm applyForm, BindingResult applyFormBr, String startEndTime) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        String applySummary = getApplySummary(userId);
        // 添加 转诊 申请表
        String applyType = String.valueOf(ApplyType.APPLY_REFERRAL);
        String applyStatues = String.valueOf(InquiryStatus.INQUIRY_APPLY_CREATE_SUCCESS);
        applyForm.setCreateUser(userId);
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyType(applyType);
        applyForm.setApplyUserId(userId);
        applyForm.setApplyStatus(applyStatues);
        applyForm.setApplySummary(applySummary);
        applyForm.setCreateUser(userId);
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
    @Transactional
    @PostMapping(value = "video")
    public Map videoConsultation(@Validated ApplyForm applyForm, BindingResult applyFormBr, String startEndTime, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport) {

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
        applyForm.setApplySummary(getApplySummary(userId));
        applyForm.setCreateUser(userId);
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
                resultMap.put(consultationTimeBean.getStartTime(), consultationTimeBean.getEndTime());
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
        caseConsultant.setId(applyForm.getId());
        caseConsultant.setCreateUser(userId);
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setHospitalPrice(hospitalPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setApplyUserId(userId);
        caseConsultant.setConsultantReport(consultantReport);

        int k = caseConsultantService.insertSelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("添加失败");
        }
        applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.发起会诊.toString());
        return succeedRequest(applyForm);
    }

    /**
     * 图文会诊
     *
     * @param applyForm
     * @param applyFormBr
     */
    @Transactional
    @PostMapping(value = "picture")
    public Map pictureConsultation(@Validated ApplyForm applyForm, BindingResult applyFormBr, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }


        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        applyForm.setApplySummary(getApplySummary(userId));
        // 添加 图文会诊 申请表
        applyForm.setApplyUserId(userId);
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        String applyType = String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT);
        applyForm.setApplyType(applyType);
        String applyStatues = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_CREATE_SUCCESS);
        applyForm.setApplyStatus(applyStatues);
        applyForm.setCreateUser(userId);

        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("图文会诊记录保存失败");
        }

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyForm.getId());
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setHospitalPrice(hospitalPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setApplyUserId(userId);
        caseConsultant.setConsultantReport(consultantReport);
        caseConsultant.setCreateUser(userId);

        int j = caseConsultantService.insertSelective(caseConsultant);
        if (j < 1) {
            return badRequestOfArguments("添加失败");
        }
        applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.发起会诊.toString());
        return succeedRequest(applyForm);
    }

    /**
     * 医生工作台详细信息展示(无草稿页面展示)
     */
    @GetMapping(value = "detailById")
    public Map detailById(String applyFormId) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数为空");
        }

        ApplyFormBean applyFormBean = applyFormService.detailById(applyFormId);
        if (applyFormBean == null) {
            return badRequestOfArguments("查询失败");
        }
        return succeedRequest(applyFormBean);
    }

    /**
     * 医生查询草稿数量
     */
    @GetMapping(value = "draftCount")
    public Map draftSelect() {

        String userId = getRequestToken();
        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("获取登录用户id失败");
        }
        int i = applyFormService.countDraft(userId);
        return succeedRequest(i);
    }

}
