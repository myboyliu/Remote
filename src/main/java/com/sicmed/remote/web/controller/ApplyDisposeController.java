package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.ApplyTimeService;
import com.sicmed.remote.web.service.CaseConsultantService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(value = "apply/dispose")
public class ApplyDisposeController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private ApplyTimeService applyTimeService;

    @Autowired
    private CaseConsultantService caseConsultantService;

    /**
     * 医政 工作台 重新分配医生
     */
    @PostMapping(value = "sirUpdateDoctor")
    public Map sirUpdate(ApplyForm applyForm) {

        String userId = getRequestToken();

        if (StringUtils.isBlank(applyForm.getId())) {
            return badRequestOfArguments("传入参数为空");
        }

        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("重新分配医生失败医生失败");
        }

        return succeedRequest(applyForm);
    }

    /**
     * 医政 工作台 修改日期
     */
    @PostMapping(value = "sirUpdateDate")
    public Map sirUpdateDate(String applyFormId, String eventStartTime, String eventEndTime) {
        if (StringUtils.isBlank(eventStartTime) || StringUtils.isBlank(eventEndTime) || StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("传入参数不全");
        }

        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 1) {
            return badRequestOfArguments("删除原applyTime失败");
        }

        String userId = getRequestToken();

        ApplyTime applyTime = new ApplyTime();
        applyTime.setApplyFormId(applyFormId);
        applyTime.setUpdateUser(userId);
        applyTime.setEventStartTime(YtDateUtils.stringToDate(eventStartTime));
        applyTime.setEventEndTime(YtDateUtils.stringToDate(eventEndTime));
        int k = applyTimeService.updateByForm(applyTime);
        if (k < 1) {
            return badRequestOfArguments("确认时间,time修改失败");
        }

        return succeedRequest(applyTime);
    }

    // 医政 工作台 修改价格 数据库暂无表格

    /**
     * 更新申请状态
     *
     * @param applyForm
     * @param applyStatus
     * @param msg1
     * @param msg2
     */
    public Map updateStatus(ApplyForm applyForm, ApplyTime applyTime, String applyStatus, String msg1, String msg2) {

        if (StringUtils.isBlank(applyForm.getId())) {
            return badRequestOfArguments("applyForm.id is null");
        }

        String userId = getRequestToken();

        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments(msg1);
        }

        applyTime.setApplyFormId(applyForm.getId());
        applyTime.setApplyStatus(applyStatus);
        applyTime.setUpdateUser(userId);
        int j = applyTimeService.updateStatus(applyTime);
        if (j < 1) {
            return badRequestOfArguments(msg2);
        }
        return succeedRequest(applyForm);
    }

    /**
     * 医政 受邀会诊 拒收原因
     */
    public int sirRepulseReport(String applyFormId, String report) {
        String userId = getRequestToken();
        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyFormId);
        caseConsultant.setConsultantReport(report);
        caseConsultant.setUpdateUser(userId);
        int i = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
        return i;
    }


    /**
     * 医政 受邀会诊 待收诊 接受
     */
    @PostMapping(value = "sirConsultationMasterAccede")
    public Map sirConsultationMasterAccede(ApplyForm applyForm, ApplyTime applyTime) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_ACCEDE);
        String msg1 = "受邀会诊收诊医政待收诊接受,form修改失败";
        String msg2 = "受邀会诊收诊医政待收诊接受,time修改失败";

        return updateStatus(applyForm, applyTime, applyStatus, msg1, msg2);
    }

    /**
     * 医政 受邀会诊 待收诊 拒收
     */
    @PostMapping(value = "sirConsultationMasterReject")
    public Map sirConsultationMasterReject(ApplyForm applyForm, ApplyTime applyTime, String report) {

        int i = sirRepulseReport(applyForm.getId(), report);
        if (i < 1) {
            return badRequestOfArguments("拒收原因填写失败");
        }

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        String msg1 = "受邀会诊收诊医政待收诊拒绝,form修改失败";
        String msg2 = "受邀会诊收诊医政待收诊拒绝,time修改失败";

        return updateStatus(applyForm, applyTime, applyStatus, msg1, msg2);
    }

    /**
     * 医政 受邀会诊  排期审核 接受
     */
    @PostMapping(value = "sirDateCheckAccede")
    public Map sirDateCheckAccede(ApplyForm applyForm, ApplyTime applyTime) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        String msg1 = "受邀会诊收诊医政排期审核接受,form修改失败";
        String msg2 = "受邀会诊收诊医政排期审核接受,time修改失败";

        return updateStatus(applyForm, applyTime, applyStatus, msg1, msg2);
    }

    /**
     * 医政 受邀会诊  排期审核 拒收
     */
    @PostMapping(value = "sirDateCheckReject")
    public Map sirDateCheckReject(ApplyForm applyForm, ApplyTime applyTime) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        String msg1 = "受邀会诊收诊医政排期审核拒绝,form修改失败";
        String msg2 = "受邀会诊收诊医政排期审核拒绝,time修改失败";

        return updateStatus(applyForm, applyTime, applyStatus, msg1, msg2);
    }
    
}
