package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.service.ApplyFormService;
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
 * @description 转诊相关查询
 * @date 2018/12/26
 */
@RestController
@RequestMapping(value = "apply/transfer")
public class ApplyTransferController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;
    // 转诊类型查询
    private final static List<String> consultationTypeListInquiry = new ArrayList<>();

    static {
        String type = String.valueOf(ApplyType.APPLY_REFERRAL);
        consultationTypeListInquiry.add(type);
    }

    /**
     * 医生 转诊 查询
     */
    public Map inquirySelect(List<String> consultationStatusList, String msg) {

        String userId = getRequestToken();

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultationTypeListInquiry);
        applyFormBean.setConsultationStatusList(consultationStatusList);
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setInviteUserId(userId);
        List<ApplyForm> applyFormList = applyFormService.selectApplyInquiry(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return succeedRequest(applyFormList);
        }

        return succeedRequest(applyFormList);
    }

    /**
     * 医生 转诊 待收诊
     */
    @GetMapping(value = "inquiryApplyAccede")
    public Map inquiryApplyAccede() {

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_ACCEDE);
        consultationStatusList.add(inquiryStatus);

        String msg = "无待收诊";

        return inquirySelect(consultationStatusList, msg);
    }

    /**
     * 医生 转诊 已拒收
     */
    @GetMapping(value = "inquirySlaveMasterReject")
    public Map inquirySlaveMasterReject() {

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus1 = String.valueOf(InquiryStatus.INQUIRY_SLAVE_REJECT);
        String inquiryStatus2 = String.valueOf(InquiryStatus.INQUIRY_MASTER_REJECT);
        consultationStatusList.add(inquiryStatus1);
        consultationStatusList.add(inquiryStatus2);

        String msg = "无已拒收";

        return inquirySelect(consultationStatusList, msg);
    }

    /**
     * 医生 转诊 已排期
     */
    @GetMapping(value = "inquiryDate")
    public Map inquiryDate() {

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus1 = String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED);
        String inquiryStatus2 = String.valueOf(InquiryStatus.INQUIRY_SENDER_CONFIRM);
        consultationStatusList.add(inquiryStatus1);
        consultationStatusList.add(inquiryStatus2);

        String msg = "无已排期";

        return inquirySelect(consultationStatusList, msg);
    }

    /**
     * 医生 转诊 已结束
     */
    @GetMapping(value = "inquiryEnd")
    public Map inquiryEnd() {

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus1 = String.valueOf(InquiryStatus.INQUIRY_END);
        String inquiryStatus2 = String.valueOf(InquiryStatus.INQUIRY_SENDER_CANCEL);
        consultationStatusList.add(inquiryStatus1);
        consultationStatusList.add(inquiryStatus2);

        String msg = "无已结束";

        return inquirySelect(consultationStatusList, msg);
    }

    /**
     * 医生 转诊 排期审核
     */
    @GetMapping(value = "inquirySlaveMasterAccede")
    public Map inquirySlaveMasterAccede() {

        String userId = getRequestToken();

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus1 = String.valueOf(InquiryStatus.INQUIRY_SLAVE_ACCEDE);
        String inquiryStatus2 = String.valueOf(InquiryStatus.INQUIRY_MASTER_ACCEDE);
        consultationStatusList.add(inquiryStatus1);
        consultationStatusList.add(inquiryStatus2);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultationTypeListInquiry);
        applyFormBean.setConsultationStatusList(consultationStatusList);
        applyFormBean.setInviteUserId(userId);

        List<ApplyForm> applyFormList = applyFormService.selectApplyInquiryDate(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return succeedRequest(applyFormList);
        }
        return succeedRequest(applyFormList);
    }

    /**
     * 医生 转诊 待审核
     */
    @GetMapping(value = "inquiryCreateSuccess")
    public Map inquiryCreateSuccess() {

        String userId = getRequestToken();

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_CREATE_SUCCESS);
        consultationStatusList.add(inquiryStatus);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setConsultationTypeList(consultationTypeListInquiry);
        applyFormBean.setConsultationStatusList(consultationStatusList);

        List<ApplyForm> applyFormList = applyFormService.getByApplyFormBean(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return succeedRequest(applyFormList);
        }
        return succeedRequest(applyFormList);
    }

    /**
     * 医政 转诊 查询
     */
    public Map sirInquirySelect(ApplyFormBean applyFormBean, List<String> consultationStatusList, String msg) {

        applyFormBean.setConsultationStatusList(consultationStatusList);
        applyFormBean.setConsultationTypeList(consultationTypeListInquiry);

        List<ApplyForm> applyFormList = applyFormService.sirSelectInquiry(applyFormBean);
        if (applyFormList != null && applyFormList.size() == 0) {
            return badRequestOfArguments(applyFormList);
        }

        return succeedRequest(applyFormList);
    }

    /**
     * 医政 转诊 待审核
     */
    @GetMapping(value = "sirInquiryCheck")
    public Map sirInquiryCheck() {

        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);
        String hospitalId = userDetail.getHospitalId();

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_CREATE_SUCCESS);
        consultationStatusList.add(inquiryStatus);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyHospitalId(hospitalId);

        String msg = "无待审核";

        return sirInquirySelect(applyFormBean, consultationStatusList, msg);
    }

    /**
     * 医政 转诊 待接收
     */
    @GetMapping(value = "sirInquiryAccept")
    public Map sirInquiryAccept() {

        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);
        String hospitalId = userDetail.getHospitalId();

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus = String.valueOf(InquiryStatus.INQUIRY_APPLY_ACCEDE);
        consultationStatusList.add(inquiryStatus);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setInviteHospitalId(hospitalId);

        String msg = "无待接收";

        return sirInquirySelect(applyFormBean, consultationStatusList, msg);
    }

    /**
     * 医政 转诊 排期审核
     */
    @GetMapping(value = "sirInquiryCheckDate")
    public Map sirInquiryCheckDate() {

        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);
        String hospitalId = userDetail.getHospitalId();

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus1 = String.valueOf(InquiryStatus.INQUIRY_SLAVE_ACCEDE);
        String inquiryStatus2 = String.valueOf(InquiryStatus.INQUIRY_MASTER_ACCEDE);
        consultationStatusList.add(inquiryStatus1);
        consultationStatusList.add(inquiryStatus2);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setInviteHospitalId(hospitalId);

        String msg = "无排期审核";

        return sirInquirySelect(applyFormBean, consultationStatusList, msg);
    }

    /**
     * 医政 转诊 已排期
     */
    @GetMapping(value = "sirInquiryDate")
    public Map sirInquiryDate() {
        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);
        String hospitalId = userDetail.getHospitalId();

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus1 = String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED);
        String inquiryStatus2 = String.valueOf(InquiryStatus.INQUIRY_SENDER_CONFIRM);
        consultationStatusList.add(inquiryStatus1);
        consultationStatusList.add(inquiryStatus2);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setInviteHospitalId(hospitalId);

        String msg = "无已排期";

        return sirInquirySelect(applyFormBean, consultationStatusList, msg);
    }

    /**
     * 医政 转诊 已拒收
     */
    @GetMapping(value = "sirInquiryReject")
    public Map sirInquiryReject() {
        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);
        String hospitalId = userDetail.getHospitalId();

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus1 = String.valueOf(InquiryStatus.INQUIRY_SLAVE_REJECT);
        String inquiryStatus2 = String.valueOf(InquiryStatus.INQUIRY_MASTER_REJECT);
        consultationStatusList.add(inquiryStatus1);
        consultationStatusList.add(inquiryStatus2);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setInviteHospitalId(hospitalId);

        String msg = "无已拒收";

        return sirInquirySelect(applyFormBean, consultationStatusList, msg);
    }

    /**
     * 医政 转诊 已结束
     */
    @GetMapping(value = "sirInquiryEnd")
    public Map sirInquiryEnd() {

        String userId = getRequestToken();
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);
        String hospitalId = userDetail.getHospitalId();

        List<String> consultationStatusList = new ArrayList<>();
        String inquiryStatus1 = String.valueOf(InquiryStatus.INQUIRY_SENDER_CANCEL);
        String inquiryStatus2 = String.valueOf(InquiryStatus.INQUIRY_END);
        consultationStatusList.add(inquiryStatus1);
        consultationStatusList.add(inquiryStatus2);

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setInviteHospitalId(hospitalId);

        String msg = "无已结束";

        return sirInquirySelect(applyFormBean, consultationStatusList, msg);
    }

    // 转诊 角色双方 数目查询
    @GetMapping(value = "inquiryCount")
    public Map inquiryCount(String list, String hospitalId) {

        String userId = getRequestToken();

        List<String> statusList;
        statusList = JSON.parseObject(list, new TypeReference<LinkedList>() {
        }, Feature.OrderedField);

        int i = applyFormService.inquiryCountSelect(userId, hospitalId, consultationTypeListInquiry, statusList);

        return succeedRequest(i);
    }

    // 转诊 排期审核 数目查询
    @GetMapping(value = "inquirySlaveMasterAccedeCount")
    public Map inquirySlaveMasterAccedeCount(String list) {

        List<String> statusList;
        statusList = JSON.parseObject(list, new TypeReference<LinkedList>() {
        }, Feature.OrderedField);

        String userId = getRequestToken();

        int i = applyFormService.inquirySlaveMasterAccedeCount(userId, consultationTypeListInquiry, statusList);

        return succeedRequest(i);
    }

    // 转诊 待审核  查询
    @GetMapping(value = "inquiryCreateSuccessCount")
    public Map inquiryCreateSuccessCount(String list) {

        List<String> statusList;
        statusList = JSON.parseObject(list, new TypeReference<LinkedList>() {
        }, Feature.OrderedField);

        String userId = getRequestToken();

        int i = applyFormService.inquiryCreateSuccessCount(userId, consultationTypeListInquiry, statusList);

        return succeedRequest(i);
    }

}