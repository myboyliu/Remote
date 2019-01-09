package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.ConsultationStatusBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.CaseConsultantService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description 会诊相关查询
 * @date 2018/12/26
 */
@Slf4j
@RestController
@RequestMapping(value = "" +
        "" +
        "apply/consultation")
public class ApplyConsultationController extends BaseController {


    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private CaseConsultantService caseConsultantService;

    // 会诊查询相关代码
    private final static List<String> consultantTypeList = new ArrayList<>();

    static {
        consultantTypeList.add(String.valueOf(ApplyType.APPLY_CONSULTATION_VIDEO));
        consultantTypeList.add(String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT));
    }

    /**
     * 医生 发出会诊 查询
     *
     * @param statusList
     * @param msg
     */
    public Map sendSelect(List<String> statusList, String msg) {

        String userId = getRequestToken();

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setBeginNo(getPageEntity().getBeginNo());
        applyFormBean.setPageSize(getPageEntity().getPageSize());
        List<ApplyForm> applyFormList = applyFormService.getByApplyFormBean(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return badRequestOfArguments(msg);
        }

        return succeedRequest(applyFormList);

    }

    /**
     * 医生 发出会诊 待审核
     */
    @GetMapping(value = "sendApplyCreateSuccess")
    public Map sendApplyCreateSuccess() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_CREATE_SUCCESS);
        statusList.add(applyStatus);
        String msg = "无待审核";

        return sendSelect(statusList, msg);
    }

    /**
     * 医生 发出会诊 待收诊
     */
    @GetMapping(value = "sendApplySlaveDoctor")
    public Map sendApplySlaveDoctor() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT);
        String applyStatus3 = String.valueOf(ConsultationStatus.CONSULTATION_DOCTOR_LOCKED);
        String applyStatus4 = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_ACCEDE);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        statusList.add(applyStatus3);
        statusList.add(applyStatus4);
        String msg = "无待收诊";

        return sendSelect(statusList, msg);
    }

    /**
     * 医生 发出会诊 已拒收
     */
    @GetMapping(value = "sendMasterReject")
    public Map sendMasterReject() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        statusList.add(applyStatus);
        String msg = "无已拒收";

        return sendSelect(statusList, msg);
    }

    /**
     * 医生 发出会诊 已排期
     */
    @GetMapping(value = "sendDateTimeLocked")
    public Map sendDateTimeLocked() {
        procedureService.applyChecked();
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        statusList.add(applyStatus);
        String msg = "无已排期";

        return sendSelect(statusList, msg);
    }

    /**
     * 医生 发出会诊 会诊中
     */
    @GetMapping(value = "sendBegin")
    public Map sendBegin() {
        procedureService.applyChecked();
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        statusList.add(applyStatus);
        String msg = "无会诊中";

        return sendSelect(statusList, msg);
    }

    /**
     * 医生 发出会诊 待反馈
     */
    @GetMapping(value = "sendReportSubmitted")
    public Map sendReportSubmitted() {

        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
        statusList.add(applyStatus);
        String msg = "无待反馈";

        return sendSelect(statusList, msg);
    }

    /**
     * 医生 发出会诊 已结束
     */
    @GetMapping(value = "sendEnd")
    public Map sendEnd() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_END);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_FEEDBACK_SUBMITTED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无已结束";

        return sendSelect(statusList, msg);
    }

    /**
     * 医生 受邀会诊 主会诊医生查询
     */
    public Map receiveSelect(List<String> statusList) {

        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setInviteUserId(userId);
        applyFormBean.setBeginNo(getPageEntity().getBeginNo());
        applyFormBean.setPageSize(getPageEntity().getPageSize());
        if (statusList.size() == 1 && String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE).equals(statusList.get(0))) {
            applyFormBean.setInviteBranchId(userDetail.getBranchId());
            applyFormBean.setInviteUserId(null);
        }
        List<ApplyForm> applyFormList = applyFormService.getByApplyFormBean(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return badRequestOfArguments(applyFormList);
        }

        return succeedRequest(applyFormList);

    }

    /**
     * 医生 受邀会诊 待收诊
     */
    @GetMapping(value = "receiveApplyAccede")
    public Map receiveApplyAccede() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        statusList.add(applyStatus);

        return receiveSelect(statusList);
    }

    /**
     * 医生 受邀会诊 已拒收
     */
    @GetMapping(value = "receiveSlaveMasterReject")
    public Map receiveSlaveMasterReject() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);

        return receiveSelect(statusList);
    }

    /**
     * 医生 受邀会诊 排期审核
     */
    @GetMapping(value = "receiveSlaveDoctor")
    public Map receiveSlaveDoctor() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_DOCTOR_LOCKED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);

        return receiveSelect(statusList);
    }

    /**
     * 医生 受邀会诊  查询 包含辅助会诊医生
     */
    public Map receiveSelectAssist(List<String> statusList) {

        String userId = getRequestToken();

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setInviteUserId(userId);
        applyFormBean.setBeginNo(getPageEntity().getBeginNo());
        applyFormBean.setPageSize(getPageEntity().getPageSize());

        List<ApplyForm> applyFormList = caseConsultantService.selectAssist(applyFormBean);
        return succeedRequest(applyFormList);

    }

    /**
     * 医生 受邀会诊 已排期
     */
    @GetMapping(value = "receiveDateTimeLocked")
    public Map receiveDateTimeLocked() {
        procedureService.applyChecked();
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        statusList.add(applyStatus);

        return receiveSelectAssist(statusList);
    }

    /**
     * 医生 受邀会诊 会诊中
     */
    @GetMapping(value = "receiveBegin")
    public Map receiveBegin() {
        procedureService.applyChecked();
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        statusList.add(applyStatus);

        return receiveSelectAssist(statusList);
    }

    /**
     * 医生 受邀会诊 待反馈
     */
    @GetMapping(value = "receiveReportSubmitted")
    public Map receiveReportSubmitted() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
        statusList.add(applyStatus);

        return receiveSelectAssist(statusList);
    }

    /**
     * 医生 受邀会诊 已结束
     */
    @GetMapping(value = "receiveEnd")
    public Map receiveEnd() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_END);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_FEEDBACK_SUBMITTED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);

        return receiveSelectAssist(statusList);
    }

    /**
     * 医政 发出会诊 查询
     */
    public Map sirSendSelect(List<String> statusList, String msg) {

        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyHospitalId(userDetail.getHospitalId());
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setBeginNo(getPageEntity().getBeginNo());
        applyFormBean.setPageSize(getPageEntity().getPageSize());

        List<ApplyForm> applyFormList = applyFormService.sirGetByApplyFormBean(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return badRequestOfArguments(applyFormList);
        }

        return succeedRequest(applyFormList);
    }

    /**
     * 医政 发出会诊 待审核
     */
    @GetMapping(value = "sirSendApplyCreateSuccess")
    public Map sirSendApplyCreateSuccess() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_CREATE_SUCCESS);
        statusList.add(applyStatus);
        String msg = "无待审核";

        return sirSendSelect(statusList, msg);
    }

    /**
     * 医政 发出会诊 待收诊
     */
    @GetMapping(value = "sirSendApplySlaveDoctor")
    public Map sirSendApplySlaveDoctor() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT);
        String applyStatus3 = String.valueOf(ConsultationStatus.CONSULTATION_DOCTOR_LOCKED);
        String applyStatus4 = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_ACCEDE);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        statusList.add(applyStatus3);
        statusList.add(applyStatus4);
        String msg = "无待收诊";

        return sirSendSelect(statusList, msg);
    }

    /**
     * 医政 发出会诊 已拒收
     */
    @GetMapping(value = "sirSendMasterReject")
    public Map sirSendMasterReject() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        statusList.add(applyStatus);
        String msg = "无已拒收";

        return sirSendSelect(statusList, msg);
    }

    /**
     * 医政 发出会诊 已排期
     */
    @GetMapping(value = "sirSendDateTimeLocked")
    public Map sirSendDateTimeLocked() {
        procedureService.applyChecked();
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        statusList.add(applyStatus);
        String msg = "无已排期";

        return sirSendSelect(statusList, msg);
    }

    /**
     * 医政 发出会诊 会诊中
     */
    @GetMapping(value = "sirSendBegin")
    public Map sirSendBegin() {
        procedureService.applyChecked();
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        statusList.add(applyStatus);
        String msg = "无会诊中";

        return sirSendSelect(statusList, msg);
    }

    /**
     * 医政 发出会诊 待反馈
     */
    @GetMapping(value = "sirSendReportSubmitted")
    public Map sirSendReportSubmitted() {

        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
        statusList.add(applyStatus);
        String msg = "无待反馈";

        return sirSendSelect(statusList, msg);
    }

    /**
     * 医政 发出会诊 已结束
     */
    @GetMapping(value = "sirSendEnd")
    public Map sirSendEnd() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_END);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_FEEDBACK_SUBMITTED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无已结束";

        return sirSendSelect(statusList, msg);
    }

    /**
     * 医政 受邀会诊 查询
     */
    public Map sirReceiveSelect(List<String> statusList, String msg) {

        String userId = getRequestToken();

        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setInviteHospitalId(userDetail.getHospitalId());
        applyFormBean.setBeginNo(getPageEntity().getBeginNo());
        applyFormBean.setPageSize(getPageEntity().getPageSize());

        List<ApplyForm> applyFormList = applyFormService.sirGetByApplyFormBean(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return badRequestOfArguments(applyFormList);
        }

        return succeedRequest(applyFormList);
    }

    /**
     * 医政 受邀会诊 待收诊
     */
    @GetMapping(value = "sirReceiveApplyAccede")
    public Map sirReceiveApplyAccede() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        statusList.add(applyStatus);
        String msg = "无待收诊";

        return sirReceiveSelect(statusList, msg);
    }

    /**
     * 医政 受邀会诊 排期审核
     */
    @GetMapping(value = "sirReceiveSlaveDoctor")
    public Map sirReceiveSlaveDoctor() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_DOCTOR_LOCKED);
        String applyStatus3 = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_ACCEDE);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        statusList.add(applyStatus3);
        String msg = "无排期审核";

        return sirReceiveSelect(statusList, msg);
    }

    /**
     * 医政 受邀会诊 专家协调
     */
    @GetMapping(value = "sirReceiveSlaveReject")
    public Map sirReceiveSlaveReject() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT);
        statusList.add(applyStatus1);
        String msg = "无砖家协调";

        return sirReceiveSelect(statusList, msg);
    }

    /**
     * 医政 受邀会诊 已排期
     */
    @GetMapping(value = "sirReceiveDateTimeLocked")
    public Map sirReceiveDateTimeLocked() {
        procedureService.applyChecked();
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        statusList.add(applyStatus);
        String msg = "无已排期";

        return sirReceiveSelect(statusList, msg);
    }

    /**
     * 医政 受邀会诊 会诊中
     */
    @GetMapping(value = "sirReceiveBegin")
    public Map sirReceiveBegin() {
        procedureService.applyChecked();
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        statusList.add(applyStatus);
        String msg = "无会诊中";

        return sirReceiveSelect(statusList, msg);
    }

    /**
     * 医政 受邀会诊 待反馈
     */
    @GetMapping(value = "sirReceiveReportSubmitted")
    public Map sirReceiveReportSubmitted() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
        statusList.add(applyStatus);
        String msg = "无待反馈";

        return sirReceiveSelect(statusList, msg);
    }

    /**
     * 医政 受邀会诊  已拒收
     */
    @GetMapping(value = "sirReceiveSlaveMasterReject")
    public Map sirReceiveSlaveMasterReject() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        statusList.add(applyStatus1);
        String msg = "无已拒收";

        return sirReceiveSelect(statusList, msg);
    }

    /**
     * 医政 受邀会诊 已结束
     */
    @GetMapping(value = "sirReceiveEnd")
    public Map sirReceiveEnd() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_END);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_FEEDBACK_SUBMITTED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无已结束";

        return sirReceiveSelect(statusList, msg);
    }

    // 发出会诊 数目查询
    @GetMapping(value = "sendSelectCount")
    public Map sendSelectCount(String list, String hospitalId) {

        List<String> statusList;
        statusList = JSON.parseObject(list, new TypeReference<LinkedList>() {
        }, Feature.OrderedField);

        String userId = getRequestToken();

        int i = applyFormService.sendSelectCount(userId, hospitalId, consultantTypeList, statusList);

        return succeedRequest(i);
    }

    // 受邀会诊 数目查询
    @GetMapping(value = "receiveSelectCount")
    public Map receiveSelectCount(String list, String hospitalId) {


        List<String> statusList;
        statusList = JSON.parseObject(list, new TypeReference<LinkedList>() {
        }, Feature.OrderedField);

        String userId = getRequestToken();

        int i = caseConsultantService.selectCount(userId, hospitalId, consultantTypeList, statusList);

        return succeedRequest(i);

    }

    /**
     * 发出会诊 医生 总项数目全部查询
     */
    @GetMapping(value = "sendSelectAllCountDoctor")
    public Map sendSelectAllCountDoctor() {

        String userId = getRequestToken();

        ConsultationStatusBean consultationStatusBean = applyFormService.sendSelectAllCount(userId, null, consultantTypeList);

        return succeedRequest(consultationStatusBean);
    }

    /**
     * 发出会诊 医政 总项数目全部查询
     */
    @GetMapping(value = "sendSelectAllCountSir")
    public Map sendSelectAllCountSir() {

        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);

        ConsultationStatusBean consultationStatusBean = applyFormService.sendSelectAllCount(null, userDetail.getHospitalId(), consultantTypeList);

        return succeedRequest(consultationStatusBean);
    }

    /**
     * 受邀会诊 医生 所有数目查询
     */
    @GetMapping(value = "receiveSelectAllCountDoctor")
    public Map receiveSelectAllCountDoctor() {

        String userId = getRequestToken();

        ConsultationStatusBean consultationStatusBean = caseConsultantService.receiveSelectAllCount(userId, null, consultantTypeList);

        return succeedRequest(consultationStatusBean);
    }

    /**
     * 受邀会诊 医政 所有数目查询
     */
    @GetMapping(value = "receiveSelectAllCountSir")
    public Map receiveSelectAllCountSir() {

        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);

        ConsultationStatusBean consultationStatusBean = caseConsultantService.receiveSelectAllCountSir(userDetail.getHospitalId(), consultantTypeList);

        return succeedRequest(consultationStatusBean);
    }

}
