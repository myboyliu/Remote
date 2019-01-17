package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.service.ApplyFormService;
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
@RequestMapping(value = "statisticsSearch")
public class StatisticsSearchController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    private final String consultatioSelStatus = String.valueOf(ConsultationStatus.CONSULTATION_END);

    private final String inquirySelStatus = String.valueOf(InquiryStatus.INQUIRY_END);

    /**
     * 医生 主页面搜索
     */
    @GetMapping(value = "doctorSearch")
    public Map doctorSearch(String condition) {

        if (StringUtils.isBlank(condition)) {
            return badRequestOfArguments("输入的搜索条件为空");
        }

        String userId = getRequestToken();
        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("五大获取登录用户Id");
        }

        List<ApplyFormBean> applyFormBeanList = applyFormService.searchByRemark(userId, condition);

        return succeedRequest(applyFormBeanList);
    }


    /**
     * 医政 主页面搜索
     *
     */
    @GetMapping(value = "sirSearch")
    public Map sirSearch(String condition) {

        if (StringUtils.isBlank(condition)) {
            return badRequestOfArguments("输入的搜索条件为空");
        }

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        String hospitalId = currentUserBean.getHospitalId();
        if (StringUtils.isBlank(hospitalId)) {
            return badRequestOfArguments("无法获取医院Id");
        }

        List<ApplyFormBean> applyFormBeanList = applyFormService.sirSearchByRemark(hospitalId, condition);

        return succeedRequest(applyFormBeanList);
    }
}