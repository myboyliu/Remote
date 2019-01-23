package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.web.YoonaLtUtils.IdentityCardUtil;
import com.sicmed.remote.web.bean.DraftBean;
import com.sicmed.remote.web.entity.*;
import com.sicmed.remote.web.service.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * @author YoonaLt
 * 草稿相关
 * @version 1.0 This Version Running JDK 1.8
 */
@RestController
@RequestMapping(value = "draft")
public class DraftController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private CaseConsultantService caseConsultantService;

    @Autowired
    private CaseRecordService caseRecordService;

    @Autowired
    private CasePatientService casePatientService;

    @Autowired
    private CaseContentService caseContentService;

    /**
     * 医生查询草稿数量
     */
    @GetMapping(value = "draftCount")
    public Map draftCount() {

        String userId = getRequestToken();
        int i = applyFormService.countDraft(userId);
        return succeedRequest(i);
    }

    /**
     * 用户查询草稿
     */
    @GetMapping(value = "selectByUser")
    public Map selectByUser() {
        String userId = getRequestToken();

        ApplyForm applyForm = new ApplyForm();
        applyForm.setApplyUserId(userId);
        applyForm.setApplyType(ApplyType.APPLY_DRAFT.toString());
        List<ApplyForm> applyFormList = applyFormService.findByDynamicParam(applyForm);
        if (applyFormList == null) {
            return badRequestOfArguments("查询出错");
        }
        return succeedRequest(applyFormList);
    }

    /**
     * 草稿箱详细信息返回
     */
    @GetMapping(value = "msgShow")
    public Map msgShow(String applyFormId) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数错误");
        }

        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        if (applyForm == null) {
            return badRequestOfArguments("获取applyForm失败");
        }

        CaseConsultant caseConsultant = caseConsultantService.getByPrimaryKey(applyFormId);

        String caseRecordId = applyForm.getCaseRecordId();
        if (StringUtils.isBlank(caseRecordId)) {
            return badRequestOfArguments("获取caseRecordId失败");
        }
        CaseRecord caseRecord = caseRecordService.getByPrimaryKey(caseRecordId);

        List<CaseContent> caseContentList = caseContentService.findByCaseRecordId(caseRecordId);

        String casePatientId = caseRecord.getPatientId();
        if (StringUtils.isBlank(casePatientId)) {
            return badRequestOfArguments("获取casePatientId失败");
        }
        CasePatient casePatient = casePatientService.getByPrimaryKey(casePatientId);

        DraftBean draftBean = new DraftBean();
        draftBean.setApplyForm(applyForm);
        draftBean.setCaseConsultant(caseConsultant);
        draftBean.setCaseContentList(caseContentList);
        draftBean.setCaseRecord(caseRecord);
        draftBean.setCasePatient(casePatient);
        return succeedRequest(draftBean);
    }

    /**
     * 医生 草稿箱 删除
     * 此处为物理删除
     */
    @GetMapping(value = "draftDel")
    public Map draftDel(String applyFormId) {
        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数有误");
        }

        int i = applyFormService.draftDel(applyFormId);
        if (i < 1) {
            return badRequestOfArguments("删除草稿失败或无此id对应applyForm");
        }

        return succeedRequest("删除成功");
    }

    /**
     * 草稿,创建完整病例
     */
    @PostMapping(value = "draftFullCase")
    public Map draftFullCase(@Validated CasePatient casePatient, BindingResult casePatientBr, String casePatientId,
                             @Validated CaseRecord caseRecord, BindingResult caseRecordBr, String caseRecordId,
                             String weightPathTypeId) {

        if (casePatientBr.hasErrors()) {
            return fieldErrorsBuilder(casePatientBr);
        }
        if (caseRecordBr.hasErrors()) {
            return fieldErrorsBuilder(caseRecordBr);
        }
        if (StringUtils.isBlank(weightPathTypeId) || StringUtils.isBlank(casePatientId) || StringUtils.isBlank(caseRecordId)) {
            return badRequestOfArguments("weightPathTypeId or casePatientId or caseRecordId is null");
        }
        if (!IdentityCardUtil.validateCard(casePatient.getPatientCard())) {
            return badRequestOfArguments("身份证输入有误");
        }

        // 文件路径 与 病例文件id map解析,添加病例附件
        List<CaseContent> resultList;
        try {
            resultList = JSON.parseObject(weightPathTypeId, new TypeReference<LinkedList>() {
            }, Feature.OrderedField);
        } catch (Exception e) {
            return badRequestOfArguments("pathWeightTypeId 填写错误");
        }
        if (resultList.size() == 0) {
            return badRequestOfArguments("无病例需求文件");
        }

        String userId = getRequestToken();
        int i = caseContentService.draftInsertCase(casePatient, casePatientId, caseRecord, caseRecordId, resultList, userId);
        if (i < 1) {
            return badRequestOfArguments("创建病例失败");
        }
        return succeedRequest(caseRecord);
    }

    /**
     * 草稿,保存草稿
     */
    @PostMapping(value = "saveDraft")
    public Map saveDraft(CasePatient casePatient, String casePatientId, CaseRecord caseRecord, String caseRecordId,
                         String weightPathTypeId) {

        if (StringUtils.isBlank(casePatient.getPatientName()) || StringUtils.isBlank(casePatient.getPatientCard())
                || StringUtils.isBlank(weightPathTypeId)) {
            return badRequestOfArguments("数据不全,无法创建草稿");
        }

        if (!IdentityCardUtil.validateCard(casePatient.getPatientCard())) {
            return badRequestOfArguments("身份证输入有误");
        }

        // 文件路径 与 病例文件id map解析,添加病例附件
        List<CaseContent> resultList;
        try {
            resultList = JSON.parseObject(weightPathTypeId, new TypeReference<LinkedList>() {
            }, Feature.OrderedField);
        } catch (Exception e) {
            return badRequestOfArguments("pathWeightTypeId 填写错误");
        }

        if (resultList.size() == 0) {
            return badRequestOfArguments("无病例需求文件");
        }

        String userId = getRequestToken();
        int i = caseContentService.draftInsertCase(casePatient, casePatientId, caseRecord, caseRecordId, resultList, userId);
        if (i < 1) {
            return badRequestOfArguments("创建病例失败");
        }
        return succeedRequest(caseRecord);

    }
}
