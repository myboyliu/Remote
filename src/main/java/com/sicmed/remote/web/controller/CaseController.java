package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.web.YoonaLtUtils.IdentityCardUtil;
import com.sicmed.remote.web.bean.CaseContentBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseContent;
import com.sicmed.remote.web.entity.CasePatient;
import com.sicmed.remote.web.entity.CaseRecord;
import com.sicmed.remote.web.service.CaseContentService;
import com.sicmed.remote.web.service.CasePatientService;
import com.sicmed.remote.web.service.CaseRecordService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import sun.nio.cs.ext.MacArabic;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description 创建病例以及修改病例相关
 * @data 2018/12/19
 */
@Slf4j
@RestController
@Validated
@RequestMapping(value = "case")
public class CaseController extends BaseController {

    @Autowired
    private CasePatientService casePatientService;

    @Autowired
    private CaseRecordService caseRecordService;

    @Autowired
    private CaseContentService caseContentService;

    /**
     * 创建病例
     *
     * @param casePatient
     * @param casePatientBr
     * @param caseRecord
     * @param caseRecordBr
     * @param weightPathTypeId
     */
    @PostMapping(value = "insertNewCase")
    public Map insertNewCase(@Validated CasePatient casePatient, BindingResult casePatientBr,
                             @Validated CaseRecord caseRecord, BindingResult caseRecordBr,
                             String weightPathTypeId) {

        if (casePatientBr.hasErrors()) {
            return fieldErrorsBuilder(casePatientBr);
        }
        if (caseRecordBr.hasErrors()) {
            return fieldErrorsBuilder(caseRecordBr);
        }
        if (StringUtils.isBlank(weightPathTypeId)) {
            return badRequestOfArguments("weightPathTypeId is null");
        }
        if (!IdentityCardUtil.validateCard(casePatient.getPatientCard())) {
            return badRequestOfArguments("身份证输入有误");
        }

        String userId = getRequestToken();

/*
        // 添加病例患者基本信息
        casePatient.setCreateUser(userId);

        // 查询患者是否已经存在
        CasePatient rel = casePatientService.selectByCard(casePatient.getPatientCard());
        if (rel == null) {
            int i = casePatientService.insertSelective(casePatient);
            if (i < 1) {
                return badRequestOfInsert("添加casePatient失败");
            }
        }

        if (rel != null) {
            casePatient.setId(rel.getId());
            int k = casePatientService.updateByCard(casePatient);
            if (k < 1) {
                return badRequestOfInsert("添加casePatient失败");
            }
        }*/

        // 添加病例初步诊断结果
/*        caseRecord.setCreateUser(userId);
        caseRecord.setPatientId(casePatient.getId());
        int j = caseRecordService.insertSelective(caseRecord);
        if (j < 1) {
            return badRequestOfInsert("添加caseRecord的caseDiagnosis失败");
        }*/

        // 文件路径 与 病例文件id map解析,添加病例附件

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
        int l = caseContentService.insertByMap(caseContentBean);
        if (l < 0) {
            return badRequestOfInsert("添加病例失败");
        }

        return succeedRequest(caseRecord);
    }

    /**
     * 修改CaseRecord
     *
     * @param caseRecord
     */
    @PostMapping(value = "updateCaseRecord")
    public Map updateCaseRecord(CaseRecord caseRecord) {

        if (caseRecord == null) {
            return badRequestOfArguments("caseRecord 为空");
        }

        String userId = getRequestToken();
        caseRecord.setUpdateUser(userId);
        int i = caseRecordService.updateByPrimaryKeySelective(caseRecord);
        if (i < 1) {
            return badRequestOfArguments("修改caseRecord失败");
        }

        return succeedRequest("修改caseRecord成功");
    }

    /**
     * 修改CasePatient
     *
     * @param casePatient
     */
    @PostMapping(value = "updateCasePatient")
    public Map updateCaseRecord(CasePatient casePatient) {

        if (casePatient == null) {
            return badRequestOfArguments("casePatient 为空");
        }

        String userId = getRequestToken();
        casePatient.setUpdateUser(userId);
        int i = casePatientService.updateByPrimaryKeySelective(casePatient);
        if (i < 1) {
            return badRequestOfArguments("修改casePatient失败");
        }

        return succeedRequest("修改casePatient成功");
    }

    /**
     * 修改CaseContent
     */
    @Transactional
    @PostMapping(value = "updateCaseContent")
    public Map updateCaseContent(String weightPathTypeId, String recordId) {

        if (StringUtils.isBlank(recordId) || StringUtils.isBlank(weightPathTypeId)) {
            return badRequestOfArguments("weightPathTypeId 或 caseRecordId 为空");
        }

        int j = caseContentService.selectRecordId(recordId);
        if (j > 0) {
            int i = caseContentService.deleteByCaseRecordId(recordId);
            if (i < 1) {
                return badRequestOfArguments("recordId有误");
            }
        }

        // 文件路径 与 病例文件id map解析
        List<CaseContent> resultList;
        try {
            resultList = JSON.parseObject(weightPathTypeId, new TypeReference<LinkedList>() {
            }, Feature.OrderedField);
        } catch (Exception e) {
            return badRequestOfArguments("pathWeightTypeId 填写错误");
        }

        String userId = getRequestToken();
        CaseContentBean caseContentBean = new CaseContentBean();
        caseContentBean.setRecordId(recordId);
        caseContentBean.setUpdateUser(userId);
        caseContentBean.setWeightPathTypeId(resultList);
        int l = caseContentService.insertByMap(caseContentBean);
        if (l < 0) {
            return badRequestOfInsert("更新CaseContent失败");
        }
        return succeedRequest(caseContentBean);
    }

    // 删除病例中的图片
    @GetMapping(value = "softDelPicture")
    public Map softDelPicture(String id) {

        if (StringUtils.isBlank(id)) {
            return badRequestOfArguments("传入id为空");
        }

        int i = caseContentService.softDeleteById(id);
        if (i < 0) {
            return badRequestOfArguments("删除失败");
        }
        return succeedRequest("删除成功");
    }
}
