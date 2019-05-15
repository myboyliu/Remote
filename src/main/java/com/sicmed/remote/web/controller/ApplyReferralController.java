package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyNodeConstant;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.web.YoonaLtUtils.OrderNumUtils;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.bean.ApplyFormInfoBean;
import com.sicmed.remote.web.bean.ApplyTimeBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.ApplyNodeService;
import com.sicmed.remote.web.service.ApplyTimeService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * 转诊流程接口
 * <p>
 * 转诊流程
 * 1.首诊医生创建转诊申请
 * 2.首诊医政审核发布转诊申请
 * 3.会诊医生接收转诊申请/会诊医政接收转诊申请
 */
@Slf4j
@RestController
@RequestMapping(value = "apply/referral")
public class ApplyReferralController extends ApplyController {
    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private ApplyTimeService applyTimeService;

    @Autowired
    private ApplyNodeService applyNodeService;

    /**
     * 创建转诊申请 医政审核流程
     *
     * @param applyForm
     * @param applyFormBr
     * @param startEndTime
     * @param draftId
     * @return
     */
    @Transactional
    @PostMapping(value = "create/audit")
    public Map transferTreatment(@Validated ApplyForm applyForm, BindingResult applyFormBr, String startEndTime, String draftId) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }

        if (StringUtils.isNotBlank(draftId)) {
            applyFormService.deleteApplyFormDraft(draftId);
        }
        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();
        String applySummary = getApplySummary();
        // 添加 转诊 申请表
        String applyType = String.valueOf(ApplyType.APPLY_REFERRAL);
        String applyStatues = String.valueOf(InquiryStatus.INQUIRY_APPLY_CREATE_SUCCESS);
        applyForm.setCreateUser(userId);
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyType(applyType);
        applyForm.setApplyUserId(userId);
        applyForm.setApplyStatus(applyStatues);
        applyForm.setApplySummary(applySummary);
        applyForm.setCreateUser(userId);
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("转诊记录保存失败");
        }

        if (startEndTime == null) {
            return badRequestOfArguments("startEndTime is null");
        }

        List<String> lists;
        LinkedHashMap<String, String> resultMap = new LinkedHashMap<>();
        try {
            lists = JSON.parseObject(startEndTime, new TypeReference<List<String>>() {
            }, Feature.OrderedField);
        } catch (Exception e) {
            e.printStackTrace();
            return badRequestOfArguments("startEndTime 格式有误");
        }
        if (lists == null) {
            return badRequestOfArguments("日期输入有误");
        }
        for (String time : lists) {
            Date date = YtDateUtils.stringToDate(time);
            String start = YtDateUtils.dateToString(YtDateUtils.parmDateBegin(date));
            String end = YtDateUtils.dateToString(YtDateUtils.intradayEnd(date));
            resultMap.put(start, end);
        }

        // 添加 转诊申请 时间
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyForm.getId());
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(userId);
        applyTimeBean.setApplyStatus(applyForm.getApplyStatus());
        int j = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (j < 1) {
            return badRequestOfArguments("添加申请时间失败");
        }

        return succeedRequest(applyForm);
    }

    /**
     * 创建转诊申请 不需要审核流程
     *
     * @param applyForm
     * @param applyFormBr
     * @param startEndTime
     * @param draftId
     * @return
     */
    @Transactional
    @PostMapping(value = "create")
    public Map transferTreatment2(@Validated ApplyForm applyForm, BindingResult applyFormBr, String startEndTime, String draftId) {

        if (applyFormBr.hasErrors()) {
            return fieldErrorsBuilder(applyFormBr);
        }
        if (startEndTime == null) {
            return badRequestOfArguments("startEndTime is null");
        }
        if (StringUtils.isNotBlank(draftId)) {
            applyFormService.deleteApplyFormDraft(draftId);
        }

        CurrentUserBean currentUserBean = UserTokenManager.getCurrentUser();
        String applySummary = getApplySummary();
        // 添加 转诊 申请表
        applyForm.setCreateUser(UserTokenManager.getCurrentUserId());
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyType(String.valueOf(ApplyType.APPLY_REFERRAL));
        applyForm.setApplyUserId(UserTokenManager.getCurrentUserId());
        applyForm.setApplyStatus(String.valueOf(InquiryStatus.INQUIRY_APPLY_ACCEDE));
        applyForm.setApplySummary(applySummary);
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("转诊记录保存失败");
        }
        LinkedHashMap<String, String> resultMap = new LinkedHashMap<>();
        List<String> lists = JSON.parseObject(startEndTime, new TypeReference<List<String>>() {
        }, Feature.OrderedField);
        for (String time : lists) {
            Date date = YtDateUtils.stringToDate(time);
            String start = YtDateUtils.dateToString(YtDateUtils.parmDateBegin(date));
            String end = YtDateUtils.dateToString(YtDateUtils.intradayEnd(date));
            resultMap.put(start, end);
        }

        // 添加 转诊申请 时间
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyForm.getId());
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setCreateUser(UserTokenManager.getCurrentUserId());
        applyTimeBean.setApplyStatus(String.valueOf(InquiryStatus.INQUIRY_APPLY_ACCEDE));
        int j = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (j < 1) {
            return badRequestOfArguments("添加申请时间失败");
        }

        ArrayList<String> smsContext = new ArrayList<>();
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyForm.getId());
        smsContext.add(applyFormInfoBean.getApplyHospitalName());
        smsContext.add(applyFormInfoBean.getApplyBranchName());
        smsContext.add(applyFormInfoBean.getApplyUserName());
        smsService.singleSendByTemplate("86", applyFormInfoBean.getInviteUserPhone(), 326111, smsContext);
        return succeedRequest(applyForm);
    }

    /**
     * 发起方医院 医政 同意转诊申请 审核接口
     *
     * @param applyFormId
     * @return
     */
    @Transactional
    @PostMapping(value = "accept")
    public Map sirTransferCheckAccede(String applyFormId) {
        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数错误");
        }

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_ACCEDE);
        String userId = getRequestToken();
        String orderNumber = OrderNumUtils.getOrderNo(redisTemplate);

        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setApplyStatus(applyStatus);
        applyForm.setUpdateUser(userId);
        applyForm.setApplyNumber(orderNumber);
        applyForm.setConsultantApplyTime(new Date());

        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("修改applyForm失败");
        }

        applyForm = applyFormService.getByPrimaryKey(applyFormId);
        applyNodeService.insertByNodeOperator(applyFormId, ApplyNodeConstant.发起转诊.toString(), applyForm.getApplySummary());

        ArrayList<String> smsContext = new ArrayList<>();
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
        smsContext.add(applyFormInfoBean.getApplyHospitalName());
        smsContext.add(applyFormInfoBean.getApplyBranchName());
        smsContext.add(applyFormInfoBean.getApplyUserName());
        smsService.singleSendByTemplate("86", applyFormInfoBean.getInviteUserPhone(), 326111, smsContext);
        return succeedRequest(applyForm);
    }


    /**
     *
     * 受邀医生 接受转诊申请 需要医政审核接口
     *
     * @param applyFormId
     * @param inquiryDatetime
     * @return
     */
    @Transactional
    @PostMapping(value = "receive/audit")
    public Map doctorTransDateCheck(String applyFormId, String inquiryDatetime) {
        //1.接口参数校验
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(inquiryDatetime)) {
            return badRequestOfArguments("参数错误");
        }

        //2.修改转诊申请状态
        applyFormService.updateStatus(applyFormId, String.valueOf(InquiryStatus.INQUIRY_SLAVE_ACCEDE));

        //3.修改转诊时间
        applyTimeService.updateReferralTime(applyFormId, inquiryDatetime, String.valueOf(InquiryStatus.INQUIRY_SLAVE_ACCEDE));

        //5.添加转诊流程操作节点
        applyNodeService.insertByNodeOperator(applyFormId, ApplyNodeConstant.已接诊.toString(), getApplySummary());

        return succeedRequest("接收成功!");

    }

    /**
     * 受邀医生 接受转诊申请 不需要医政审核接口
     */
    @Transactional
    @PostMapping(value = "receive")
    public Map doctorTransDateSure(String applyFormId, String inquiryDatetime) {
        //1.接口参数校验
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(inquiryDatetime)) {
            return badRequestOfArguments("参数错误");
        }
        //2.修改转诊申请状态
        applyFormService.updateStatus(applyFormId, String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED));

        //3.修改转诊时间
        applyTimeService.updateReferralTime(applyFormId, inquiryDatetime, String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED));

        //4.添加转诊提醒
        redisTimerService.createReferralEndListener(applyFormId, YtDateUtils.dateToString(YtDateUtils.intradayEnd(YtDateUtils.stringToDate(inquiryDatetime))), UserTokenManager.getCurrentUserId());

        //5.添加转诊流程操作节点
        applyNodeService.insertByNodeOperator(applyFormId, ApplyNodeConstant.已排期.toString(), getApplySummary());
        ArrayList<String> smsContext = new ArrayList<>();
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
        log.debug(applyFormInfoBean.toString());
        smsContext.add(applyFormInfoBean.getCaseSummary());
        smsContext.add(applyFormInfoBean.getMeetingStartTime().toString());
        smsService.singleSendByTemplate("86", applyFormInfoBean.getApplyUserPhone(), 326112, smsContext);
        return succeedRequest("接收成功");
    }


    /**
     * 受邀医生 拒收转诊申请接口
     *
     * @param applyFormId
     * @param refuseRemark
     * @return
     */
    @Transactional
    @PostMapping(value = "doctor/reject")
    public Map doctorTransferReject(String applyFormId, String refuseRemark) {
        //1.接口参数校验
        if (StringUtils.isBlank(applyFormId) || StringUtils.isNotBlank(refuseRemark)) {
            return badRequestOfArguments("接口参数错误");
        }
        //2.修改转诊 申请状态
        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        applyForm.setId(applyFormId);
        applyForm.setRefuseRemark(refuseRemark);
        applyForm.setApplyStatus(String.valueOf(InquiryStatus.INQUIRY_SLAVE_REJECT));
        applyForm.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyFormService.updateByPrimaryKeySelective(applyForm);

        //3.修改转诊时间中的申请状态
        ApplyTime applyTime = new ApplyTime();
        applyTime.setApplyFormId(applyForm.getId());
        applyTime.setApplyStatus(String.valueOf(InquiryStatus.INQUIRY_SLAVE_REJECT));
        applyTime.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyTimeService.updateStatus(applyTime);

        //4.添加转诊流程节点
        applyNodeService.insertByNodeOperator(applyFormId, ApplyNodeConstant.已拒收.toString(), applyForm.getInviteSummary());

        return succeedRequest(applyForm);
    }

    /**
     *
     * 受邀医政 接收转诊申请
     *
     * @param applyFormId
     * @param inquiryDatetime
     * @return
     */
    @Transactional
    @PostMapping(value = "sir/accept")
    public Map sirTransferMasterAccede(String applyFormId, String inquiryDatetime) {
        //1.接口参数校验
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(inquiryDatetime)) {
            return badRequestOfArguments("参数错误");
        }

        //2.修改转诊申请状态
        applyFormService.updateStatus(applyFormId, String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED));

        //3.修改转诊时间
        if (StringUtils.isNotBlank(inquiryDatetime)) {
            applyTimeService.updateReferralTime(applyFormId, inquiryDatetime, String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED));
            redisTimerService.createReferralEndListener(applyFormId, YtDateUtils.dateToString(YtDateUtils.intradayEnd(YtDateUtils.stringToDate(inquiryDatetime))), UserTokenManager.getCurrentUserId());
        } else {
            ApplyTime applyTime = applyTimeService.getByApplyFormId(applyFormId);
            String endTime = YtDateUtils.dateToString(applyTime.getEventEndTime());
            redisTimerService.createReferralEndListener(applyFormId, endTime, UserTokenManager.getCurrentUserId());
        }

        //6.添加转诊流程操作节点
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已排期.toString());

        ArrayList<String> smsContext = new ArrayList<>();
        ApplyFormInfoBean applyFormInfoBean = applyFormService.getApplyFormInfo(applyFormId);
        smsContext.add(applyFormInfoBean.getCaseSummary());
        smsContext.add(applyFormInfoBean.getMeetingStartTime().toString());
        smsService.singleSendByTemplate("86", applyFormInfoBean.getApplyUserPhone(), 326112, smsContext);
        return succeedRequest("接收成功");
    }


    /**
     *
     * 受邀医政拒绝 转诊申请 接口
     *
     * @param applyFormId
     * @param refuseRemark
     * @return
     */
    @Transactional
    @PostMapping(value = "sir/reject")
    public Map sirTransferMasterReject(String applyFormId, String refuseRemark) {
        //1.参数校验
        if (StringUtils.isBlank(applyFormId) || StringUtils.isNotBlank(refuseRemark)) {
            return badRequestOfArguments("参数错误");
        }
        //2.修改转诊申请状态
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setRefuseRemark(refuseRemark);
        applyForm.setApplyStatus(String.valueOf(InquiryStatus.INQUIRY_MASTER_REJECT));
        applyFormService.updateByPrimaryKeySelective(applyForm);
        //3.添加转诊申请操作节点
        applyNodeService.insertByStatus(applyFormId, ApplyNodeConstant.已拒收.toString());

        return succeedRequest("拒收成功!");

    }

    /**
     * 发起方医院 医政 拒绝转诊申请 审核接口
     *
     * @param applyFormId
     * @param refuseRemark
     * @return
     */
    @Transactional
    @PostMapping(value = "reject")
    public Map sirTransferCheckReject(String applyFormId, String refuseRemark) {
        //1.参数校验
        if (StringUtils.isBlank(applyFormId) || StringUtils.isBlank(refuseRemark)) {
            return badRequestOfArguments("接口参数错误");
        }
        //2.构建修改模型
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setApplyType(ApplyType.APPLY_DRAFT.toString());
        applyForm.setUpdateUser(UserTokenManager.getCurrentUserId());

        //3.转诊申请审核已拒绝,病例状态变为草稿,并删除与之对应apply_time相关
        applyTimeService.delByApplyForm(applyFormId);
        //4.修改转诊申请记录
        applyFormService.updateByPrimaryKeySelective(applyForm);

        return succeedRequest("转诊申请退回成功!");
    }


}
