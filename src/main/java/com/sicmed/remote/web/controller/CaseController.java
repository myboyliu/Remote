package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.web.YoonaLtUtils.IdentityCardUtil;
import com.sicmed.remote.web.bean.CaseContentBean;
import com.sicmed.remote.web.entity.CaseContent;
import com.sicmed.remote.web.entity.CasePatient;
import com.sicmed.remote.web.entity.CaseRecord;
import com.sicmed.remote.web.service.CaseContentService;
import com.sicmed.remote.web.service.CasePatientService;
import com.sicmed.remote.web.service.CaseRecordService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping(value = "case")
public class CaseController extends BaseController {

    @Autowired
    private CasePatientService casePatientService;

    @Autowired
    private CaseRecordService caseRecordService;

    @Autowired
    private CaseContentService caseContentService;

    /**
     * 创建病例->患者信息
     *
     * @param casePatient
     * @param casePatientBr
     * @param caseRecord
     * @param caseRecordBr
     * @param pathAndTypeId
     */
    @PostMapping(value = "insertNewCase")
    public Map insertNewCase(@Validated CasePatient casePatient, BindingResult casePatientBr,
                             @Validated CaseRecord caseRecord, BindingResult caseRecordBr,
                             String pathAndTypeId) {

        if (casePatientBr.hasErrors()) {
            return fieldErrorsBuilder(casePatientBr);
        }
        if (caseRecordBr.hasErrors()) {
            return fieldErrorsBuilder(caseRecordBr);
        }

        String userId = getRequestToken();

        // 添加病例患者基本信息
        if (!IdentityCardUtil.validateCard(casePatient.getPatientCard())) {
            return badRequestOfArguments("身份证输入有误");
        }
        casePatient.setPatientSex(IdentityCardUtil.getGenderByIdCard(casePatient.getPatientCard()));
        casePatient.setCreateUser(userId);
        int i = casePatientService.insertSelective(casePatient);
        if (i < 1) {
            return badRequestOfInsert("添加casePatient失败");
        }

        // 添加病例初步诊断结果
        caseRecord.setCreateUser(userId);
        caseRecord.setId(casePatient.getId());
        int j = caseRecordService.insertSelective(caseRecord);
        if (j < 1) {
            return badRequestOfInsert("添加caseRecord的caseDiagnosis失败");
        }

        // 添加病例所需文件
        if (StringUtils.isNotBlank(pathAndTypeId)) {

            // 文件路径 与 病例文件id map解析
            LinkedHashMap<String, String> resultMap;
            try {
                resultMap = JSON.parseObject(pathAndTypeId, new TypeReference<LinkedHashMap<String, String>>() {
                }, Feature.OrderedField);
            } catch (Exception e) {
                return badRequestOfArguments("typeIdAndPath 填写错误");
            }

            CaseContentBean caseContentBean = new CaseContentBean();
            caseContentBean.setCreateUser(userId);
            caseContentBean.setRecordId(casePatient.getId());
            caseContentBean.setCreateUser(userId);
            caseContentBean.setPathAndTypeIdMap(resultMap);
            int l = caseContentService.insertByMap(caseContentBean);
            if (l < 0) {
                return badRequestOfInsert("添加CaseContent失败");
            }
        }

        return succeedRequest("创建患者成功");
    }

}
