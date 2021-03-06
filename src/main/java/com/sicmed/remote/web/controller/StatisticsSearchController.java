package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.bean.StatisticsSearchBean;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.ConsultationPriceRecordService;
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

    @Autowired
    private ConsultationPriceRecordService consultationPriceRecordService;

    // 会诊结束状态
    private final String consultationEndStatus = String.valueOf(ConsultationStatus.CONSULTATION_END);

    // 转诊结束状态
    private final String inquiryEndStatus = String.valueOf(InquiryStatus.INQUIRY_END);

    /**
     * 医生主页面 搜索 总数
     */
    @GetMapping(value = "doctorSearchCount")
    public Map doctorSearchCount(String condition) {

        String userId = getRequestToken();

        int i = applyFormService.searchCount(userId, condition);

        return succeedRequest(i);
    }

    /**
     * 医生 主页面搜索
     */
    @GetMapping(value = "doctorSearch")
    public Map doctorSearch(String condition) {

        String userId = getRequestToken();

        List<ApplyFormBean> applyFormBeanList = applyFormService.searchByRemark(userId, condition);

        return succeedRequest(applyFormBeanList);
    }

    /**
     * 医政主页面 搜索总数
     */
    @GetMapping(value = "sirSearchCount")
    public Map sirSearchCount(String condition) {

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();
        String hospitalId = currentUserBean.getHospitalId();

        int i = applyFormService.sirSearchCount(hospitalId, condition);

        return succeedRequest(i);
    }

    /**
     * 医政 主页面搜索
     */
    @GetMapping(value = "sirSearch")
    public Map sirSearch(String condition) {

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();
        String hospitalId = currentUserBean.getHospitalId();

        List<ApplyFormBean> applyFormBeanList = applyFormService.sirSearchByRemark(hospitalId, condition);

        return succeedRequest(applyFormBeanList);
    }

    /**
     * 会诊病例次数统计
     */
    @GetMapping(value = "consultationStatistics")
    public Map consultationStatistics(StatisticsSearchBean statisticsSearchBean) {

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();

        List<StatisticsSearchBean> statisticsSearchBeans = applyFormService.applyConsultationStatistics(
                currentUserBean.getHospitalId(), consultationEndStatus, statisticsSearchBean);

        return succeedRequest(statisticsSearchBeans);
    }

    /**
     * 转诊病例次数统计
     */
    @GetMapping(value = "inviteStatistics")
    public Map inviteStatistics(StatisticsSearchBean statisticsSearchBean) {

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();

        List<StatisticsSearchBean> statisticsSearchBeans = applyFormService.applyConsultationStatistics(
                currentUserBean.getHospitalId(), inquiryEndStatus, statisticsSearchBean);

        return succeedRequest(statisticsSearchBeans);
    }

    /**
     * 会诊高级统计
     *
     * @param statisticsSearchBean
     */
    @GetMapping(value = "advancedConsultationStatistics")
    public Map advancedConsultationStatistics(StatisticsSearchBean statisticsSearchBean) {

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();

        List<StatisticsSearchBean> statisticsSearchBeans = applyFormService.advancedConsultationStatistics(currentUserBean.getHospitalId(), statisticsSearchBean);

        return succeedRequest(statisticsSearchBeans);
    }

    /**
     * 会诊费用统计,发出列表
     */
    @GetMapping(value = "consultationPriceApplyStatistics")
    public Map consultationPriceApplyStatistics(StatisticsSearchBean statisticsSearchBean) {

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();

        List<StatisticsSearchBean> statisticsSearchBeans = consultationPriceRecordService.consultationPriceApplyStatistics(
                currentUserBean.getHospitalId(), consultationEndStatus, statisticsSearchBean
        );
        return succeedRequest(statisticsSearchBeans);
    }

    /**
     * 会诊费用统计,受邀列表
     */
    @GetMapping(value = "consultationPriceInviteStatistics")
    public Map consultationPriceInviteStatistics(StatisticsSearchBean statisticsSearchBean) {

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();

        List<StatisticsSearchBean> statisticsSearchBeans = consultationPriceRecordService.consultationPriceInviteStatistics(
                currentUserBean.getHospitalId(), consultationEndStatus, statisticsSearchBean
        );
        return succeedRequest(statisticsSearchBeans);
    }

}