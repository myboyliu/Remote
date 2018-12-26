package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.service.ApplyFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description 会诊相关查询
 * @date 2018/12/26
 */
@RestController
@RequestMapping(value = "apply/consultation")
public class ApplyConsultationController extends BaseController {


    @Autowired
    private ApplyFormService applyFormService;

    // 会诊查询相关代码
    private final static List<String> consultantTypeList = new ArrayList<>();

    static {
        consultantTypeList.add(String.valueOf(ApplyType.APPLY_CONSULTATION_VIDEO));
        consultantTypeList.add(String.valueOf(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT));
    }

    /**
     * 发出会诊查询
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

        List<ApplyForm> applyFormList = applyFormService.getByApplyFormBean(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return badRequestOfArguments(msg);
        }

        return succeedRequest(applyFormList);

    }

    /**
     * 发出会诊待审核
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
     * 发出会诊待收诊
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
     * 发出会诊已拒收
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
     * 发出会诊已排期
     */
    @GetMapping(value = "sendDateTimeLocked")
    public Map sendDateTimeLocked() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        statusList.add(applyStatus);
        String msg = "无已排期";

        return sendSelect(statusList, msg);
    }

    /**
     * 发出会诊会诊中
     */
    @GetMapping(value = "sendBegin")
    public Map sendBegin() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        statusList.add(applyStatus);
        String msg = "无会诊中";

        return sendSelect(statusList, msg);
    }

    /**
     * 发出会诊待反馈
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
     * 发出会诊已结束
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
     * 受邀会诊查询
     */
    public Map receiveSelect(List<String> statusList, String msg) {

        String userId = getRequestToken();

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setInviteUserId(userId);

        List<ApplyForm> applyFormList = applyFormService.getByApplyFormBean(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return badRequestOfArguments(msg);
        }

        return succeedRequest(applyFormList);

    }

    /**
     * 受邀会诊待收诊
     */
    @GetMapping(value = "receiveApplyAccede")
    public Map receiveApplyAccede() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_APPLY_ACCEDE);
        statusList.add(applyStatus);
        String msg = "无待收诊";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊已拒收
     */
    @GetMapping(value = "receiveSlaveMasterReject")
    public Map receiveSlaveMasterReject() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_REJECT);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_MASTER_REJECT);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无已拒收";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊排期审核
     */
    @GetMapping(value = "receiveSlaveDoctor")
    public Map receiveSlaveDoctor() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_SLAVE_ACCEDE);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_DOCTOR_LOCKED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无排期审核";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊已排期
     */
    @GetMapping(value = "receiveDateTimeLocked")
    public Map receiveDateTimeLocked() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_DATETIME_LOCKED);
        statusList.add(applyStatus);
        String msg = "无已排期";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊会诊中
     */
    @GetMapping(value = "receiveBegin")
    public Map receiveBegin() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_BEGIN);
        statusList.add(applyStatus);
        String msg = "无会诊中";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊待反馈
     */
    @GetMapping(value = "receiveReportSubmitted")
    public Map receiveReportSubmitted() {
        List<String> statusList = new ArrayList<>();
        String applyStatus = String.valueOf(ConsultationStatus.CONSULTATION_REPORT_SUBMITTED);
        statusList.add(applyStatus);
        String msg = "无待反馈";

        return receiveSelect(statusList, msg);
    }

    /**
     * 受邀会诊已结束
     */
    @GetMapping(value = "receiveEnd")
    public Map receiveEnd() {
        List<String> statusList = new ArrayList<>();
        String applyStatus1 = String.valueOf(ConsultationStatus.CONSULTATION_END);
        String applyStatus2 = String.valueOf(ConsultationStatus.CONSULTATION_FEEDBACK_SUBMITTED);
        statusList.add(applyStatus1);
        statusList.add(applyStatus2);
        String msg = "无已结束";

        return receiveSelect(statusList, msg);
    }
}
