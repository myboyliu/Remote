package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ApplyNodeConstant;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.web.bean.ApplyFormInfoBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.ApplyNodeService;
import com.sicmed.remote.web.service.CaseConsultantService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Map;

/**
 * 图文会诊 流程接口
 */
@Slf4j
@RestController
@RequestMapping(value = "apply/picture")
public class ApplyPictureController extends ApplyController {
    @Autowired
    private ApplyFormService applyFormService;


    @Autowired
    private CaseConsultantService caseConsultantService;

    @Autowired
    private ApplyNodeService applyNodeService;

    /**
     * 发起图文会诊接口 需要医政审核流程
     *
     * @param applyForm
     * @param applyFormBr
     * @param consultantUserList
     * @param consultantPrice
     * @param hospitalPrice
     * @param consultantReport
     * @param draftId
     * @return
     */
    @Transactional
    @PostMapping(value = "create/audit")
    public Map pictureConsultation(@Validated ApplyForm applyForm, BindingResult applyFormBr, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport,
                                   String draftId) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }

        if (StringUtils.isNotBlank(draftId)) {
            applyFormService.deleteApplyFormDraft(draftId);
        }

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();
        applyForm.setApplySummary(getApplySummary());
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
     * 发起图文会诊接口 不需要医政审核流程
     *
     * @param applyForm
     * @param applyFormBr
     * @param consultantUserList
     * @param consultantPrice
     * @param hospitalPrice
     * @param consultantReport
     * @param draftId
     * @return
     */
    @Transactional
    @PostMapping(value = "create")
    public Map pictureConsultation2(@Validated ApplyForm applyForm, BindingResult applyFormBr, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport,
                                    String draftId) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }

        if (StringUtils.isNotBlank(draftId)) {
            applyFormService.deleteApplyFormDraft(draftId);
        }

        CurrentUserBean currentUserBean = UserTokenManager.getCurrentUser();
        applyForm.setApplySummary(getApplySummary());
        // 添加 图文会诊 申请表
        applyForm.setApplyUserId(UserTokenManager.getCurrentUserId());
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyType(String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT));
        applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE));
        applyForm.setCreateUser(UserTokenManager.getCurrentUserId());

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
        caseConsultant.setApplyUserId(UserTokenManager.getCurrentUserId());
        caseConsultant.setConsultantReport(consultantReport);
        caseConsultant.setCreateUser(UserTokenManager.getCurrentUserId());

        int j = caseConsultantService.insertSelective(caseConsultant);
        if (j < 1) {
            return badRequestOfArguments("添加失败");
        }
        applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.发起会诊.toString());
        return succeedRequest(applyForm);
    }


    /**
     * 受邀医生 接受图文会诊申请
     *
     * @param applyFormId
     * @param inviteSummary
     * @param consultantUserList
     * @param consultantPrice
     * @param consultantReport
     * @return
     */
    @Transactional
    @PostMapping(value = "doctor/accept")
    public Map allocationDoctorTimePicture(String applyFormId, String inviteSummary, String consultantUserList, BigDecimal consultantPrice, String consultantReport) {
        //1.参数校验
        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数错误");
        }
        //2.更新applyForm状态
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_BEGIN));

        //3.
        if (StringUtils.isNotBlank(inviteSummary) && StringUtils.isNotBlank(consultantUserList) && StringUtils.isNotBlank(consultantReport) && consultantPrice != null) {
            applyForm.setInviteSummary(inviteSummary);
            CaseConsultant caseConsultant = new CaseConsultant();
            caseConsultant.setId(applyForm.getId());
            caseConsultant.setConsultantUserList(consultantUserList);
            caseConsultant.setConsultantPrice(consultantPrice);
            caseConsultant.setConsultantReport(consultantReport);
            caseConsultant.setUpdateUser(UserTokenManager.getCurrentUserId());
            caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
        }
        int i = applyFormService.inviteeConsent(applyForm);
        if (i < 1) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return badRequestOfArguments("已被接收");
        }
        //4.
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());

        ArrayList<String> smsContext = new ArrayList<>();
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
        smsContext.add(applyFormInfoBean.getCaseSummary());
        smsContext.add(applyFormInfoBean.getMeetingStartTime().toString());
        smsService.singleSendByTemplate("86", applyFormInfoBean.getApplyUserPhone(), 326112, smsContext);
        return succeedRequest("操作成功");
    }


    /**
     *
     * 受邀医政 接受图文会诊申请
     *
     * @param applyFormId
     * @return
     */
    @Transactional
    @PostMapping(value = "sir/accept")
    public Map sirReceiveHarmonizeAccede(String applyFormId) {

        ApplyForm applyForm = new ApplyForm();
        applyForm.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyForm.setId(applyFormId);
        applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_BEGIN));
        applyFormService.updateByPrimaryKeySelective(applyForm);

        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());

        ArrayList<String> smsContext = new ArrayList<>();
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
        smsContext.add(applyFormInfoBean.getCaseSummary());
        smsContext.add(applyFormInfoBean.getMeetingStartTime().toString());
        smsService.singleSendByTemplate("86", applyFormInfoBean.getApplyUserPhone(), 326112, smsContext);
        return succeedRequest("受邀医政接收图文会诊申请成功");
    }
}
