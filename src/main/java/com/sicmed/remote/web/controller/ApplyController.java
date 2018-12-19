package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.web.YoonaLtUtils.IdentityCardUtil;
import com.sicmed.remote.web.bean.CaseContentBean;
import com.sicmed.remote.web.entity.*;
import com.sicmed.remote.web.service.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "apply")
public class ApplyController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private UserDetailService userDetailService;

    @Autowired
    private CasePatientService casePatientService;

    @Autowired
    private CaseRecordService caseRecordService;

    @Autowired
    private CaseContentService caseContentService;

    /**
     * 添加草稿
     *
     * @param casePatient
     * @param caseRecord
     * @param weightPathTypeId
     */
    @PostMapping(value = "draft")
    public Map draft(CasePatient casePatient, CaseRecord caseRecord, String weightPathTypeId) {

        String userId = getRequestToken();

        ApplyForm applyForm = new ApplyForm();
        applyForm.setApplyUserId(userId);

        CaseContentBean caseContentBean = new CaseContentBean();

        // 添加病例患者基本信息
        if (casePatient != null) {

            String str = casePatient.getPatientCard();
            if (StringUtils.isNotBlank(str)) {

                if (!IdentityCardUtil.validateCard(casePatient.getPatientCard())) {
                    return badRequestOfArguments("身份证输入有误");
                }
                casePatient.setPatientSex(IdentityCardUtil.getGenderByIdCard(casePatient.getPatientCard()));
            }

            casePatient.setCreateUser(userId);
            int i = casePatientService.insertSelective(casePatient);
            if (i < 1) {
                return badRequestOfInsert("添加casePatient失败");
            }
            caseRecord.setPatientId(casePatient.getId());
        }

        // 添加病例初步诊断结果
        if (caseRecord != null) {

            caseRecord.setCreateUser(userId);
            int j = caseRecordService.insertSelective(caseRecord);
            if (j < 1) {
                return badRequestOfInsert("添加caseRecord的caseDiagnosis失败");
            }

            caseContentBean.setRecordId(caseRecord.getId());
            applyForm.setCaseRecordId(caseRecord.getId());
        }


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
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);
        if (userDetail == null) {
            return badRequestOfArguments("获取医生详细信息失败");
        }

        applyForm.setApplyBranchId(userDetail.getBranchId());
        String applyStatus = String.valueOf(ApplyType.APPLY_DRAFT);
        applyForm.setApplyStatus(applyStatus);
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("添加草稿失败");
        }

        return succeedRequest(casePatient);
    }

    /**
     * 转诊
     * @param applyForm
     */
    @PostMapping(value = "transfer")
    public Map transferTreatment(ApplyForm applyForm) {

        String userId = getRequestToken();

        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);
        applyForm.setApplyBranchId(userDetail.getBranchId());
        String applyStatus = String.valueOf(ApplyType.APPLY_REFERRAL);
        applyForm.setApplyStatus(applyStatus);
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("转诊申请失败");
        }
        return succeedRequest(applyForm);
    }

    // 图文会诊

    // 视频会诊
}
