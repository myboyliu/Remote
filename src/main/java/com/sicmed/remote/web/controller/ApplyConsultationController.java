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

@RestController
@RequestMapping(value = "apply/consultation")
public class ApplyConsultationController extends BaseController {


    @Autowired
    private ApplyFormService applyFormService;

    /**
     * 根据受邀医生查询已拒收会诊申请
     */

    @GetMapping(value = "getApplyByIUser")
    public Object getApplyByIUser() {

        List<String> consultationStatusList = new ArrayList<>();
        consultationStatusList.add(ConsultationStatus.CONSULTATION_SLAVE_REJECT.toString());
        consultationStatusList.add(ConsultationStatus.CONSULTATION_MASTER_REJECT.toString());

        List<String> consultationTypeList = new ArrayList<>();
        consultationTypeList.add(ApplyType.APPLY_CONSULTATION_IMAGE_TEXT.toString());
        consultationTypeList.add(ApplyType.APPLY_CONSULTATION_VIDEO.toString());

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setInviteUserId(getRequestToken());
        applyFormBean.setConsultationStatusList(consultationStatusList);
        applyFormBean.setConsultationTypeList(consultationTypeList);

        List<ApplyForm> applyFormList = applyFormService.getByApplyFormBean(applyFormBean);

        return succeedRequestOfSelect(applyFormList);
    }
}
