package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.entity.*;
import com.sicmed.remote.web.service.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
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
     * 用户查询草稿
     */
    @GetMapping(value = "selectByUser")
    public Map selectByUser() {
        String userId = getRequestToken();
        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("无法获取登录用户Id");
        }

        ApplyForm applyForm = new ApplyForm();
        applyForm.setCreateUser(userId);
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

        CaseConsultant caseConsultant = caseConsultantService.getByPrimaryKey(applyFormId);
        BigDecimal hospitalPrice = caseConsultant.getHospitalPrice();
        // 需要获取userIdList,并解析合并医生价格
        String doctorListStr = caseConsultant.getConsultantUserList();
        if (StringUtils.isNotBlank(doctorListStr)) {

        }

        String caseRecordId = applyForm.getCaseRecordId();
        CaseRecord caseRecord = caseRecordService.getByPrimaryKey(caseRecordId);

        String casePatientId = caseRecord.getPatientId();
        CasePatient casePatient = casePatientService.getByPrimaryKey(casePatientId);

        List<CaseContent> caseContentList = caseContentService.findByCaseRecordId(caseRecordId);

        return null;
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
     * 草稿箱 转诊
     */
    /**
     * 草稿箱 图文会诊
     */
    /**
     * 草稿箱 视频会诊
     */
}
