package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyNodeConstant;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.meeting.entity.Meeting;
import com.sicmed.remote.meeting.service.MeetingService;
import com.sicmed.remote.web.YoonaLtUtils.OrderNumUtils;
import com.sicmed.remote.web.bean.ApplyFormInfoBean;
import com.sicmed.remote.web.bean.ApplyTimeBean;
import com.sicmed.remote.web.bean.ConsultationTimeBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.ApplyNodeService;
import com.sicmed.remote.web.service.ApplyTimeService;
import com.sicmed.remote.web.service.CaseConsultantService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;

/**
 * 视频会诊 流程接口
 */
@Slf4j
@RestController
@RequestMapping(value = "apply/video")
public class ApplyVideoController extends ApplyController {
    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private ApplyTimeService applyTimeService;

    @Autowired
    private CaseConsultantService caseConsultantService;

    @Autowired
    private ApplyNodeService applyNodeService;
    @Autowired
    private MeetingService meetingService;

    /**
     * 发起视频会诊申请接口 需要医政审核流程
     *
     * @param applyForm
     * @param applyFormBr
     * @param startEndTime
     * @param consultantUserList
     * @param consultantPrice
     * @param hospitalPrice
     * @param consultantReport
     * @param draftId
     * @return
     */
    @Transactional
    @PostMapping(value = "create/audit")
    public Map videoConsultation(@Validated ApplyForm applyForm, BindingResult applyFormBr, String startEndTime, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport
            , String draftId) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }

        if (StringUtils.isNotBlank(draftId)) {
            applyFormService.deleteApplyFormDraft(draftId);
        }

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();

        // 添加 视频会诊 申请表
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyUserId(userId);
        applyForm.setApplyType(String.valueOf(ApplyType.APPLY_CONSULTATION_VIDEO));
        applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_APPLY_CREATE_SUCCESS));
        applyForm.setApplySummary(getApplySummary());
        applyForm.setCreateUser(userId);
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("视频会诊记录保存失败");
        }

        if (startEndTime == null) {
            return badRequestOfArguments("startEndTime is null");
        }

        Map<String, String> resultMap = applyTimeJson(startEndTime);

        // 添加申请时间
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyForm.getId());
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        applyTimeBean.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_APPLY_CREATE_SUCCESS));
        int j = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (j < 1) {
            return badRequestOfArguments("添加申请时间失败");
        }

        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyForm.getId());
        caseConsultant.setCreateUser(userId);
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setHospitalPrice(hospitalPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setApplyUserId(userId);
        caseConsultant.setConsultantReport(consultantReport);

        int k = caseConsultantService.insertSelective(caseConsultant);
        if (k < 1) {
            return badRequestOfArguments("添加失败");
        }
        applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.发起会诊.toString());
        return succeedRequest(applyForm);
    }

    /**
     * 发起视频会诊申请接口 不需要需要医政审核流程
     *
     * @param applyForm
     * @param applyFormBr
     * @param startEndTime
     * @param consultantUserList
     * @param consultantPrice
     * @param hospitalPrice
     * @param consultantReport
     * @param draftId
     * @return
     */
    @Transactional
    @PostMapping(value = "create")
    public Map videoConsultation2(@Validated ApplyForm applyForm, BindingResult applyFormBr, String startEndTime, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport
            , String draftId) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }

        if (StringUtils.isNotBlank(draftId)) {
            applyFormService.deleteApplyFormDraft(draftId);
        }
        if (startEndTime == null) {
            return badRequestOfArguments("startEndTime is null");
        }
        CurrentUserBean currentUserBean = getCurrentUser();

        // 添加 视频会诊 申请表
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyUserId(UserTokenManager.getCurrentUserId());
        applyForm.setApplyType(String.valueOf(ApplyType.APPLY_CONSULTATION_VIDEO));
        applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE));
        applyForm.setApplySummary(getApplySummary());
        applyForm.setCreateUser(UserTokenManager.getCurrentUserId());
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("视频会诊记录保存失败");
        }


        Map<String, String> resultMap = applyTimeJson(startEndTime);

        // 添加申请时间
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setCreateUser(UserTokenManager.getCurrentUserId());
        applyTimeBean.setApplyFormId(applyForm.getId());
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE));
        applyTimeService.insertStartEndTimes(applyTimeBean);


        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyForm.getId());
        caseConsultant.setCreateUser(UserTokenManager.getCurrentUserId());
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setHospitalPrice(hospitalPrice);
        caseConsultant.setInviteUserId(applyForm.getInviteUserId());
        caseConsultant.setApplyUserId(UserTokenManager.getCurrentUserId());
        caseConsultant.setConsultantReport(consultantReport);

        caseConsultantService.insertSelective(caseConsultant);

        applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.发起会诊.toString());
        return succeedRequest(applyForm);
    }


    /**
     * 发起方医院 医政 同意视频会诊申请 审核接口
     *
     * @param applyFormId
     * @return
     */
    @Transactional
    @PostMapping(value = "accept")
    public Object sirSendCheckAccede(String applyFormId) {
        log.info(applyFormId + ":会诊申请审核开始!>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        //1.会诊申请ID校验
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
//        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        if (applyFormInfoBean == null) {
            log.info(applyFormId + ":审核失败-会诊申请不存在或会诊申请ID错误!");
            return badRequestOfUpdate("审核失败:会诊申请不存在或会诊申请ID错误!");
        }
        //2.修改会诊申请状态
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE));
        applyForm.setConsultantApplyTime(new Date());
        applyForm.setApplyNumber(OrderNumUtils.getOrderNo(redisTemplate));
        applyForm.setUpdateUser(UserTokenManager.getCurrentUserId());

        int updateResult = applyFormService.updateByPrimaryKeySelective(applyForm);
        //3.修改操作是否成功判断
        if (updateResult != 1) {
            log.info(applyFormId + ":审核失败-数据库操作错误!");
            return badRequestOfUpdate("审核失败:数据库操作错误!");
        }
        //4.修改成功 调用短信服务发送短信提醒给 主会诊医生
        ArrayList<String> smsContext = new ArrayList<>();
        smsContext.add(applyFormInfoBean.getApplyHospitalName());
        smsContext.add(applyFormInfoBean.getApplyBranchName());
        smsContext.add(applyFormInfoBean.getApplyUserName());
        boolean sendResult = smsService.singleSendByTemplate("86", applyFormInfoBean.getInviteUserPhone(), 326099, smsContext);

        if (sendResult) {
            log.info(applyFormId + ":发送短信给主会诊医生成功!");
        } else {
            log.info(applyFormId + ":发送短信给主会诊医生失败!");
        }
        log.info(applyFormId + ":会诊申请审核成功!");
        log.info(applyFormId + ":会诊申请审核结束!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        //5.接口调用成功返回
        return succeedRequestOfUpdate("审核成功!");
    }


    /**
     * 受邀医生 接收视频会诊 接口
     *
     * @param applyFormId
     * @param inviteSummary
     * @param startEndTime
     * @param consultantUserList
     * @param consultantPrice
     * @param consultantReport
     * @param meeting
     * @return
     */
    @Transactional
    @PostMapping(value = "doctor/accept/audit")
    public Map allocationDoctorTime(String applyFormId, String inviteSummary, String startEndTime, String consultantUserList, BigDecimal consultantPrice, String consultantReport, Meeting meeting) {
        log.info("主会诊医生接收视频会诊开始=====================================================");
        //1.参数校验
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("参数错误");
        }
        //2.修改 视频会诊 状态
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyForm.setApplyStatus(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE.toString());


        //3.修改 视频会诊时间
        log.info(applyFormId + ":修改会诊申请时间");
        applyTimeService.delByApplyForm(applyFormId);
        Map<String, String> resultMap = applyTimeJson(startEndTime);
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(UserTokenManager.getCurrentUserId());
        applyTimeBean.setApplyStatus(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE.toString());
        applyTimeService.insertStartEndTimes(applyTimeBean);

        //4.修改会诊记录信息
        if (StringUtils.isNotBlank(inviteSummary) && StringUtils.isNotBlank(consultantUserList) && StringUtils.isNotBlank(consultantReport) && consultantPrice != null) {
            applyForm.setInviteSummary(inviteSummary);
            caseConsultantService.updateDoctorAndTime(applyFormId,consultantUserList,consultantReport,consultantPrice);
        }
        applyFormService.inviteeConsent(applyForm);

        //5.保存视频会议属性
        log.info(applyFormId + ":保存视频会诊会议属性");
        meeting.setId(applyFormId);
        meetingService.createMeeting(meeting);

        //6.添加视频会诊流程节点
        log.info(applyFormId + ":添加操作流程节点");
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());

        //7.发送短信提醒医政审核视频会诊订单
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
        ArrayList<String> smsContext = new ArrayList<>();
        smsContext.add(applyFormInfoBean.getInviteBranchName());
        smsContext.add(applyFormInfoBean.getInviteUserName());
        smsService.singleSendByTemplate("86", applyFormInfoBean.getInviteAdminPhone(), 326102, smsContext);
        log.info("主会诊医生接收视频会诊结束=====================================================");
        return succeedRequest("操作成功");
    }

    /**
     * 受邀医生 接收视频会诊 接口
     *
     * @param applyFormId
     * @param inviteSummary
     * @param startEndTime
     * @param consultantUserList
     * @param consultantPrice
     * @param consultantReport
     * @param meeting
     * @return
     */
    @Transactional
    @PostMapping(value = "doctor/accept")
    public Map allocationDoctorTime2(String applyFormId, String inviteSummary, String startEndTime, String consultantUserList, BigDecimal consultantPrice, String consultantReport, Meeting meeting) {
        log.info("不需要审核流程 主会诊医生接收视频会诊开始=====================================================");
        //1.参数校验
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("参数错误");
        }

        //2.修改 视频会诊 状态
        ApplyForm applyForm = new ApplyForm();
        applyForm.setApplyStatus(ConsultationStatus.CONSULTATION_DATETIME_LOCKED.toString());
        applyForm.setId(applyFormId);
        applyForm.setUpdateUser(UserTokenManager.getCurrentUserId());


        //3.修改 视频会诊时间
        log.info(applyFormId + ":修改会诊申请时间");
        ConsultationTimeBean consultationTimeBean = applyTimeJsonToConsultationTimeBean(startEndTime);
        applyTimeService.delByApplyForm(applyFormId);
        Map<String, String> resultMap = applyTimeJson(startEndTime);
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setCreateUser(UserTokenManager.getCurrentUserId());
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setApplyStatus(ConsultationStatus.CONSULTATION_DATETIME_LOCKED.toString());
        applyTimeService.insertStartEndTimes(applyTimeBean);
        //4.修改会诊记录信息
        if (StringUtils.isNotBlank(inviteSummary) && StringUtils.isNotBlank(consultantUserList) && StringUtils.isNotBlank(consultantReport) && consultantPrice != null) {
            caseConsultantService.updateDoctorAndTime(applyFormId,consultantUserList,consultantReport,consultantPrice);
            applyForm.setInviteSummary(inviteSummary);
        }
        applyFormService.inviteeConsent(applyForm);

        //5.保存视频会议属性
        meeting.setId(applyFormId);
        meetingService.createMeeting(meeting);
        log.info(applyFormId + ":保存视频会诊会议属性");


        //6.添加视频会诊流程节点
        log.info(applyFormId + ":添加操作流程节点");
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
        //7.发送短信提醒医政审核视频会诊订单
        ArrayList<String> smsContext = new ArrayList<>();
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
        smsContext.add(applyFormInfoBean.getCaseSummary());
        smsContext.add(consultationTimeBean.getStartTime());
        smsService.singleSendByTemplate("86", applyFormInfoBean.getApplyUserPhone(), 326105, smsContext);
        smsService.singleSendByTemplate("86", applyFormInfoBean.getInviteUserPhone(), 326106, smsContext);

        meetingService.createMeeting(applyFormId);
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已排期.toString());
        log.info("不需要审核流程 主会诊医生接收视频会诊结束=====================================================");
        return succeedRequest("操作成功");
    }

    /**
     * 受邀医政 接收视频会诊申请
     *
     * @param applyFormId
     * @return
     */
//    @Transactional
//    @PostMapping(value = "sirReceiveMasterAccede")
//    public Map sirConsultationMasterAccede(String applyFormId) {
//        if (StringUtils.isBlank(applyFormId)) {
//            return badRequestOfArguments("参数错误");
//        }
////        String applyType = applyFormService.getByPrimaryKey(applyFormId).getApplyType();
//
//        // 视频会诊状态变为会诊时间已选定
////        if (ApplyType.APPLY_CONSULTATION_VIDEO.toString().equals(applyType)) {
////            applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已排期.toString());
////            applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
////        }
//        // 图文会诊接收后立刻变为会诊中
////        if (ApplyType.APPLY_CONSULTATION_IMAGE_TEXT.toString().equals(applyType)) {
////            applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
////            applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已接诊.toString());
////        }
//
//        int i = applyFormService.updateStatus(applyFormId,String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED));
//        if (i < 1) {
//            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
//            return badRequestOfArguments("已被接收");
//        }
//
//        ApplyTime applyTime = new ApplyTime();
//        applyTime.setApplyFormId(applyFormId);
//        applyTime.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED));
//        applyTime.setUpdateUser(UserTokenManager.getCurrentUserId());
//        applyTimeService.updateStatus(applyTime);
//
//        meetingService.createMeeting(applyFormId);
//
//        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已排期.toString());
//
//        return succeedRequest("接收成功");
//    }

    /**
     * 医政 受邀会诊  排期审核 接收
     */
    @Transactional
    @PostMapping(value = "sir/accept")
    public Map sirDateCheckAccede(String applyFormId) {
        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数错误");
        }
        applyFormService.updateStatus(applyFormId, String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED));
        // 非图文会诊需要更新与之相关的apply_time中的 apply_status属性
        ApplyTime applyTime = new ApplyTime();
        applyTime.setApplyFormId(applyFormId);
        applyTime.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED));
        applyTime.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyTimeService.updateStatus(applyTime);

        meetingService.createMeeting(applyFormId);

        ArrayList<String> smsContext = new ArrayList<>();
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
        smsContext.add(applyFormInfoBean.getCaseSummary());
        smsContext.add(applyFormInfoBean.getMeetingStartTime().toString());
        smsService.singleSendByTemplate("86", applyFormInfoBean.getApplyUserPhone(), 326105, smsContext);
        smsService.singleSendByTemplate("86", applyFormInfoBean.getInviteUserPhone(), 326106, smsContext);
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已排期.toString());
        //7.发送短信提醒医政审核视频会诊订单

        return succeedRequest("接收成功");
    }


    /**
     * 医政 受邀会诊 MDT协调 确认协调
     */

    /**
     * 发起医政 发出会诊 待审核 退回
     */
    @Transactional
    @PostMapping(value = "reject")
    public Map sirSendCheckReject(String applyFormId) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("applyFormId is null");
        }

        // 删除applyFormId对应的applyTime表中字段
        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 0) {
            return badRequestOfArguments("删除applyTime失败");
        }

        // 设置applyForm类型为草稿
        ApplyForm applyForm = new ApplyForm();
        String userId = getRequestToken();
        String applyType2 = String.valueOf(ApplyType.APPLY_DRAFT);
        applyForm.setId(applyFormId);
        applyForm.setApplyType(applyType2);
        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("医政发出会诊待审核退回修改applyForm失败");
        }
        return succeedRequest(applyForm);
    }

    /**
     * 医生 受邀会诊 代收诊 拒收
     */
    /**
     * 受邀医生 拒收视频会诊申请
     *
     * @param applyFormId
     * @param report
     * @return
     */
    @Transactional
    @PostMapping(value = "doctor/reject")
    public Map doctorReceiveReject(String applyFormId, String report) {
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(report)) {
            return badRequestOfArguments("参数错误");
        }

        ApplyForm applyForm = new ApplyForm();
        applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT));
        applyForm.setId(applyFormId);
        applyForm.setRefuseRemark(report);

        ApplyTime applyTime = new ApplyTime();
        applyTime.setApplyFormId(applyForm.getId());
        applyTime.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT));
        applyTime.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyTimeService.updateStatus(applyTime);


        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已拒收.toString());

        return succeedRequest(applyForm);
    }

    /**
     * 医政 受邀会诊 拒收
     */
    /**
     * 受邀医政 拒绝视频会诊申请
     *
     * @param applyFormId
     * @param report
     * @return
     */
    @Transactional
    @PostMapping(value = "sir/reject")
    public Map sirConsultationMasterReject(String applyFormId, String report) {
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(report)) {
            return badRequestOfArguments("参数错误");
        }

        ApplyForm applyForm = new ApplyForm();
        applyForm.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT));
        applyForm.setId(applyFormId);
        applyForm.setRefuseRemark(report);
        applyFormService.updateByPrimaryKeySelective(applyForm);
        // 判断applyForm属性applyStatus,做不同操作
//        if (InquiryStatus.INQUIRY_APPLY_REJECT.toString().equals(applyStatus)) {
//            // 转诊申请审核已拒绝,病例状态变为草稿,并删除与之对应apply_time相关
//            applyForm.setApplyType(ApplyType.APPLY_DRAFT.toString());
//            int j = applyTimeService.delByApplyForm(applyFormId);
//            if (j < 1) {
//                return badRequestOfArguments(msg2);
//            }
//        }

        // 非图文会诊需要更新与之相关的apply_time中的 apply_status属性
        ApplyTime applyTime = new ApplyTime();
        applyTime.setApplyFormId(applyForm.getId());
        applyTime.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT));
        applyTime.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyTimeService.updateStatus(applyTime);

        // 由apply_status添加对应的时间节点
        applyNodeService.insertByStatus(applyForm.getId(), ApplyNodeConstant.已拒收.toString());

        return succeedRequest("操作成功!");
    }


}
