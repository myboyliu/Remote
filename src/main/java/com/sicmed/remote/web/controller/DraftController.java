package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.web.bean.DraftBean;
import com.sicmed.remote.web.entity.*;
import com.sicmed.remote.web.service.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("获取登录用户id失败");
        }
        int i = applyFormService.countDraft(userId);
        return succeedRequest(i);
    }

    /**
     * 用户查询草稿
     */
    @GetMapping(value = "selectByUser")
    public Map selectByUser() {
        String userId = getRequestToken();
        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("无法获取登录用户Id");
        }

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

}
