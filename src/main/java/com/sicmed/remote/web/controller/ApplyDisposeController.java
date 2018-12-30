package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.bean.ApplyTimeBean;
import com.sicmed.remote.web.bean.ConsultationTimeBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.ApplyTimeService;
import com.sicmed.remote.web.service.CaseConsultantService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
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
     * 医政 工作台 受邀会诊 修改日期 选择一条时间
     */
    @PostMapping(value = "sirUpdateDate")
    public Map sirUpdateDate(ApplyTime applyTime) {
        if (applyTime == null) {
            return badRequestOfArguments("传入参数有误");
        }

        int j = applyTimeService.delByApplyForm(applyTime.getApplyFormId());
        if (j < 1) {
            return badRequestOfArguments("删除原applyTime失败");
        }

        String userId = getRequestToken();

        applyTime.setUpdateUser(userId);
        int k = applyTimeService.updateByForm(applyTime);
        if (k < 1) {
            return badRequestOfArguments("确认时间,time修改失败");
        }

        return succeedRequest(applyTime);
    }

    /**
     * 医政 工作台 发出会诊 修改日期 选择多个时间
     */
    @PostMapping(value = "sirSendUpdateDate")
    public Map sirSendUpdateDate(String applyFormId, String startEndTime) {

        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("applyFormId or startEndTime is null");
        }

        // 删除原时间
        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 1) {
            return badRequestOfArguments("删除原applyTime失败");
        }

        //解析传入json
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
                resultMap.put(consultationTimeBean.getStartTime(), consultationTimeBean.getEntTime());
            }
        }

        // 添加申请时间
        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_CREATE_SUCCESS);
        String userId = getRequestToken();
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        applyTimeBean.setApplyStatus(applyStatus);

        int i = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (i < 1) {
            return badRequestOfArguments("添加申请时间失败");
        }

        return succeedRequest(applyTimeBean);
    }

    // 医政 工作台 修改价格 数据库暂无表格

    /**
     * 医政 会诊 转诊 更新申请状态
     *
     * @param id
     * @param applyStatus
     * @param msg1
     * @param msg2
     * @param report
     */
    public Map updateStatus(String id, String applyStatus, String msg1,
                            String msg2, String report) {

        if (StringUtils.isBlank(id)) {
            return badRequestOfArguments("applyForm.id is null");
        }

        String userId = getRequestToken();

        // 填写会诊报告(拒绝原因)
        if (StringUtils.isNotBlank(report)) {

            CaseConsultant caseConsultant = new CaseConsultant();
            caseConsultant.setId(id);
            caseConsultant.setConsultantReport(report);
            caseConsultant.setUpdateUser(userId);
            int i = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
            if (i < 1) {
                return badRequestOfArguments("拒收原因填写失败");
            }
        }

        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(id);
        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments(msg1);
        }
        applyForm = applyFormService.getByPrimaryKey(id);
        if (ApplyType.APPLY_CONSULTATION_VIDEO.toString().equals(applyForm.getApplyType()) ||
                ApplyType.APPLY_REFERRAL.toString().equals(applyForm.getApplyType())) {
            ApplyTime applyTime = new ApplyTime();
            applyTime.setApplyFormId(applyForm.getId());
            applyTime.setApplyStatus(applyStatus);
            applyTime.setUpdateUser(userId);
            int j = applyTimeService.updateStatus(applyTime);
            if (j < 1) {
                return badRequestOfArguments(msg2);
            }
        }
        return succeedRequest(applyForm);
    }


    /**
     * 医政 受邀会诊 拒收
     */
    @PostMapping(value = "sirReceiveMasterReject")
    public Map sirConsultationMasterReject(String id, String report) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);

        String msg1 = "受邀会诊收诊医政拒收,form修改失败";
        String msg2 = "受邀会诊收诊医政拒收,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, report);
    }

    /**
     * 医政 受邀会诊 待收诊 接收
     */
    @PostMapping(value = "sirReceiveMasterAccede")
    public Map sirConsultationMasterAccede(String id, String applyType) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_ACCEDE);

        // 图文会诊接收后立刻变为会诊中
        String resultType = String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT);
        if (resultType.equals(applyType)) {
            applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        }

        String msg1 = "受邀会诊收诊医政待收诊接受,form修改失败";
        String msg2 = "受邀会诊收诊医政待收诊接受,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 受邀会诊  排期审核 接收
     */
    @PostMapping(value = "sirReceiveDateCheckAccede")
    public Map sirDateCheckAccede(String id) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        String msg1 = "受邀会诊收诊医政排期审核接受,form修改失败";
        String msg2 = "受邀会诊收诊医政排期审核接受,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, null);
    }


    /**
     * 医政 受邀会诊 砖家协调 确认协调
     */
    @PostMapping(value = "sirReceiveHarmonizeAccede")
    public Map sirReceiveHarmonizeAccede(String id, String applyType) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);

        // 图文会诊砖家协调后立刻变为会诊中
        String resultType = String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT);
        if (resultType.equals(applyType)) {
            applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        }

        String msg1 = "受邀会诊收诊医政确认砖家协调,form修改失败";
        String msg2 = "受邀会诊收诊医政确认砖家协调,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 发出会诊 待审核 通过
     */
    @PostMapping(value = "sirSendCheckAccede")
    public Map sirSendCheckAccede(String id) {

        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        String msg1 = "发出会诊医政待审核通过,form修改失败";
        String msg2 = "发出会诊医政待审核通过,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 发出会诊 待审核 退回
     */
    @PostMapping(value = "sirSendCheckReject")
    public Map sirSendCheckReject(String id) {

        if (StringUtils.isBlank(id)) {
            return badRequestOfArguments("applyFormId is null");
        }

        // 删除applyFormId对应的applyTime表中字段
        int j = applyTimeService.delByApplyForm(id);
        if (j < 1) {
            return badRequestOfArguments("删除applyTime失败");
        }

        // 删除CaseConsultant表对应字段
        caseConsultantService.deleteByPrimaryKey(id);

        // 设置applyForm类型为草稿
        ApplyForm applyForm = new ApplyForm();
        String userId = getRequestToken();
        String applyType2 = String.valueOf(ApplyType.APPLY_DRAFT);
        applyForm.setId(id);
        applyForm.setApplyType(applyType2);
        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("医政发出会诊待审核退回修改applyForm失败");
        }
        return succeedRequest(applyForm);
    }

    /**
     * 医政 转诊 待审核 审核通过
     */
    @PostMapping(value = "sirTransferCheckAccede")
    public Map sirTransferCheckAccede(String id) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_ACCEDE);
        String msg1 = "转诊医政待审核通过,form修改失败";
        String msg2 = "转诊医政待审核通过,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 转诊 待审核 拒绝
     */
    @PostMapping(value = "sirTransferCheckReject")
    public Map sirTransferCheckReject(String id, String report) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_REJECT);
        String msg1 = "转诊医政待审核拒绝,form修改失败";
        String msg2 = "转诊医政待审核拒绝,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, report);
    }

    /**
     * 医政 转诊 代收诊 同意
     */
    @PostMapping(value = "sirTransferMasterAccede")
    public Map sirTransferMasterAccede(String id) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_MASTER_ACCEDE);
        String msg1 = "转诊医政待收诊同意,form修改失败";
        String msg2 = "转诊医政待收诊同意,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 转诊 代收诊 拒绝
     */
    @PostMapping(value = "sirTransferMasterReject")
    public Map sirTransferMasterReject(String id, String report) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_MASTER_REJECT);
        String msg1 = "转诊医政待收诊拒绝,form修改失败";
        String msg2 = "转诊医政待收诊拒绝,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, report);
    }

    /**
     * 医政 转诊 排期审核 同意
     */
    @PostMapping(value = "sirTransferDateCheckAccede")
    public Map sirTransferDateCheckAccede(String id) {

        // 选定转诊时间
        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED);
        String msg1 = "转诊医政排期审核同意,form修改失败";
        String msg2 = "转诊医政排期审核同意,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 转诊 排期审核 拒绝
     */
    @PostMapping(value = "sirTransferDateCheckReject")
    public Map sirTransferDateCheckReject(String id, String report) {

        // 选定转诊时间
        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_MASTER_REJECT);
        String msg1 = "转诊医政排期审核拒绝,form修改失败";
        String msg2 = "转诊医政排期审核拒绝,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, report);
    }

    /**
     * 医政 转诊 已排期 同意
     */
    @PostMapping(value = "sirTransferDateAccede")
    public Map sirTransferDateAccede(String id) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SENDER_CONFIRM);
        String msg1 = "转诊医政排期审核拒绝,form修改失败";
        String msg2 = "转诊医政排期审核拒绝,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, null);
    }

    /**
     * 医政 转诊 已排期 取消
     */
    @PostMapping(value = "sirTransferDateReject")
    public Map sirTransferDateReject(String id, String report) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SENDER_CANCEL);
        String msg1 = "转诊医政排期审核拒绝,form修改失败";
        String msg2 = "转诊医政排期审核拒绝,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, report);
    }

    /**
     * 医生 发出会诊 带反馈 编辑会诊报告 暂存
     */
    @PostMapping(value = "doctorSendFeedbackMoment")
    public Map doctorSendFeedbackMoment(String id, String consultantFeedback) {

        String userId = getRequestToken();

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(id);
        caseConsultant.setConsultantFeedback(consultantFeedback);
        caseConsultant.setUpdateUser(userId);
        int k = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("发出会诊医生待反馈暂存会诊报告,CaseConsultant修改失败");
        }
        return succeedRequest("发出会诊医生待反馈暂存会诊报告暂存成功");
    }

    /**
     * 医生 发出会诊 带反馈 编辑会诊报告 提交
     */
    @PostMapping(value = "doctorSendFeedback")
    public Map doctorSendFeedback(String id, String consultantFeedback) {

        if (StringUtils.isBlank(id)) {
            return badRequestOfArguments("applyForm.id is null");
        }

        String userId = getRequestToken();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_FEEDBACK_SUBMITTED);

        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(id);
        int i = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (i < 1) {
            return badRequestOfArguments("发出会诊医生待反馈提交会诊报告,form修改失败");
        }

        applyForm = applyFormService.getByPrimaryKey(id);
        if (!ApplyType.APPLY_CONSULTATION_IMAGE_TEXT.toString().equals(applyForm.getApplyType())) {
            ApplyTime applyTime = new ApplyTime();
            applyTime.setApplyFormId(applyForm.getId());
            applyTime.setApplyStatus(applyStatus);
            applyTime.setUpdateUser(userId);
            int j = applyTimeService.updateStatus(applyTime);
            if (j < 1) {
                return badRequestOfArguments("发出会诊医生待反馈提交会诊报告,time修改失败");
            }
        }

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(id);
        caseConsultant.setConsultantFeedback(consultantFeedback);
        caseConsultant.setUpdateUser(userId);
        int k = caseConsultantService.updateByPrimaryKeySelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("发出会诊医生待反馈提交会诊报告,CaseConsultant修改失败");
        }

        return succeedRequest(applyForm);
    }

    /**
     * 医生 转诊 已排期 同意
     */
    @PostMapping(value = "doctorTransferDateAccede")
    public Map doctorTransferDateAccede(String id) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SENDER_CONFIRM);
        String msg1 = "转诊医生已排期同意转诊,form修改失败";
        String msg2 = "转诊医生已排期同意转诊,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, null);
    }

    /**
     * 医生 转诊 已排期 取消
     */
    @PostMapping(value = "doctorTransferDateReject")
    public Map doctorTransferDateReject(String id, String report) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_SENDER_CANCEL);
        String msg1 = "转诊医生已排期拒绝转诊,form修改失败";
        String msg2 = "转诊医生已排期拒绝转诊,time修改失败";

        return updateStatus(id, applyStatus, msg1, msg2, report);
    }

    /**
     * 医生 草稿箱 删除
     */
    @GetMapping(value = "DraftDel")
    public Map draftDel(String id) {

        int i = applyFormService.softDel(id);
        if (i < 1) {
            return badRequestOfArguments("删除草稿失败");
        }

        return succeedRequest("删除成功");
    }

}
