package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.ConsultationTimeBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.CaseConsultantService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description 转诊, 图文会诊, 视频会诊, 草稿, 工作台病例详细展示
 * @data 2018/12/19
 */
@Slf4j
@RestController
@RequestMapping(value = "apply")
public class ApplyController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private CaseConsultantService caseConsultantService;

    /**
     * 添加草稿
     *
     * @param applyForm
     */
    @Transactional
    @PostMapping(value = "draft")
    public Map draft(ApplyForm applyForm, String consultantUserList, BigDecimal consultantPrice, BigDecimal hospitalPrice, String consultantReport,
                     String draftId) {

        if (StringUtils.isNotBlank(draftId)) {
            applyFormService.deleteApplyFormDraft(draftId);
        }

        String userId = getRequestToken();
        // 添加applyForm,applyStatus申请状态为草稿
        CurrentUserBean currentUserBean = getCurrentUser();
        if (currentUserBean == null) {
            return badRequestOfArguments("获取医生详细信息失败");
        }

        applyForm.setCaseRecordId(applyForm.getCaseRecordId());
        applyForm.setApplyHospitalId(currentUserBean.getHospitalId());
        applyForm.setApplyBranchId(currentUserBean.getBranchId());
        applyForm.setApplyUserId(userId);
        String applyType = String.valueOf(ApplyType.APPLY_DRAFT);
        applyForm.setApplyType(applyType);
        applyForm.setCreateUser(userId);
        int l = applyFormService.insertSelective(applyForm);
        if (l < 1) {
            return badRequestOfArguments("添加草稿失败");
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

        int a = caseConsultantService.insertSelective(caseConsultant);
        if (a < 1) {
            return badRequestOfArguments("添加失败");
        }
        return succeedRequest(applyForm);
    }

    /**
     * 医生工作台详细信息展示(无草稿页面展示)
     */
    @GetMapping(value = "detailById")
    public Map detailById(String applyFormId) {

        if (StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("参数为空");
        }

        ApplyFormBean applyFormBean = applyFormService.detailById(applyFormId);
        if (applyFormBean == null) {
            return badRequestOfArguments("查询失败");
        }
        return succeedRequest(applyFormBean);
    }

    /**
     * applyTime修改多条时间,解析Json数据
     */
    public Map applyTimeJson(String startEndTime) {

        // 传入时间格式为 {开始时间:结束时间},解析(解析为consultationTimeBeanList?)
        Map<String, String> resultMap = new LinkedHashMap<>();
        List<ConsultationTimeBean> consultationTimeBeanList;
        consultationTimeBeanList = JSON.parseObject(startEndTime, new TypeReference<List<ConsultationTimeBean>>() {
        }, Feature.OrderedField);

        for (ConsultationTimeBean consultationTimeBean : consultationTimeBeanList) {
            resultMap.put(consultationTimeBean.getStartTime(), consultationTimeBean.getEndTime());
        }

        return resultMap;
    }

    public ConsultationTimeBean applyTimeJsonToConsultationTimeBean(String startEndTime) {
        List<ConsultationTimeBean> consultationTimeBeanList = JSON.parseObject(startEndTime, new TypeReference<List<ConsultationTimeBean>>() {
        }, Feature.OrderedField);
        return consultationTimeBeanList.get(0);

    }

    public String getApplySummary() {
        CurrentUserBean currentUserBean = UserTokenManager.getCurrentUser();
        return "<" + currentUserBean.getUserName() + "/" + currentUserBean.getTitleName() + "/" + currentUserBean.getBranchName() + "/" + currentUserBean.getHospitalName() + ">";
    }

}
