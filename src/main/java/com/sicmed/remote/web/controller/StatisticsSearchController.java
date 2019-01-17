package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.CaseConsultantService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * @author YoonaLt
 * @version 1.0 This Version Running JDK 1.8
 * 统计和搜索
 */
@RestController
@RequestMapping(value = "statistics")
public class StatisticsSearchController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private CaseConsultantService caseConsultantService;

    private final String consultatioSelStatus = String.valueOf(ConsultationStatus.CONSULTATION_END);

    private final String inquirySelStatus = String.valueOf(InquiryStatus.INQUIRY_END);

    /**
     * 医生 搜索
     * applyForm applyRemark 字段模糊 applyStatus 已结束
     * userId在case_consultant 表 consultant_user_list字段中
     * applyForm全表搜索
     * 病例主题 收件人 发件人 applyNumber  结束时间(排序,最新排在上面)
     */
    @GetMapping(value = "doctorSearch")
    public Map doctorSearch(String condition) {

        if (StringUtils.isBlank(condition)) {
            return badRequestOfArguments("输入的搜索条件为空");
        }

        String userId = getRequestToken();

        List<ApplyFormBean> applyFormBeanList = caseConsultantService.searchByRemark(userId, null, condition);
        return succeedRequest(applyFormBeanList);
    }


    /**
     * 医政 搜索
     *
     * @param condition
     */
    @GetMapping(value = "sirSearch")
    public Map sirSearch(String condition) {

        if (StringUtils.isBlank(condition)) {
            return badRequestOfArguments("输入的搜索条件为空");
        }

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);

        List<ApplyFormBean> applyFormBeanList = caseConsultantService.searchByRemark(null, currentUserBean.getHospitalId(), condition);
        return succeedRequest(applyFormBeanList);
    }
}
