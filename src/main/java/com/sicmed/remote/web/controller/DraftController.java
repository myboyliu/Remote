package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseRecord;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.CaseContentService;
import com.sicmed.remote.web.service.CasePatientService;
import com.sicmed.remote.web.service.CaseRecordService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    private CasePatientService casePatientService;

    @Autowired
    private CaseRecordService caseRecordService;

    @Autowired
    private CaseContentService caseContentService;


    /**
     * 医生 草稿箱 删除
     * 此处为物理删除
     */
    @Transactional
    @GetMapping(value = "draftDel")
    public Map draftDel(String applyFormId) {
        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数有误");
        }

        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        String caseRecordId = applyForm.getCaseRecordId();
        // 删除caseRecordId相关的病例信息
        if (StringUtils.isNotBlank(caseRecordId)) {
            CaseRecord caseRecord = caseRecordService.getByPrimaryKey(caseRecordId);
            String casePatientId = caseRecord.getPatientId();
            casePatientService.deleteByPrimaryKey(casePatientId);
            caseContentService.deleteByCaseRecordId(caseRecordId);
            caseRecordService.deleteByPrimaryKey(caseRecordId);
        }
        int i = applyFormService.softDel(applyFormId);
        if (i < 1) {
            return badRequestOfArguments("删除草稿失败或无此id对应applyForm");
        }

        return succeedRequest("删除成功");
    }

    /**
     * 草稿箱 转诊
     */
    /**
     * 草稿箱 图文会诊
     */
    /**
     * 草稿箱 视频会诊
     */
}
