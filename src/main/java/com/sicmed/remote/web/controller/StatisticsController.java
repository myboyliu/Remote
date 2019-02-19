package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.bean.ConsultationStatisticsBean;
import com.sicmed.remote.web.bean.ConsultationStatisticsParamBean;
import com.sicmed.remote.web.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 统计数据查询接口
 */
@RestController
@RequestMapping(value = "statistics")
public class StatisticsController extends BaseController {

    @Autowired
    private StatisticsService statisticsService;

    /**
     * 会诊统计查询接口
     *
     * @param consultationStatisticsParamBean
     * @return
     */
    @GetMapping(value = "getConsultationCount")
    public Map getConsultationCount(ConsultationStatisticsParamBean consultationStatisticsParamBean) {

        consultationStatisticsParamBean.setHospitalId(getCurrentUser().getHospitalId());
        consultationStatisticsParamBean.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_END));
        List<ConsultationStatisticsBean> consultationStatisticsBeanList = statisticsService.getConsultationStatisticsListByParam(consultationStatisticsParamBean);

        return succeedRequest(consultationStatisticsBeanList);
    }

    /**
     * 转诊统计查询接口
     *
     * @param consultationStatisticsParamBean
     * @return
     */
    @GetMapping(value = "getReferralCount")
    public Map getReferralCount(ConsultationStatisticsParamBean consultationStatisticsParamBean) {

        consultationStatisticsParamBean.setHospitalId(getCurrentUser().getHospitalId());
        consultationStatisticsParamBean.setApplyStatus(String.valueOf(InquiryStatus.INQUIRY_END));
        List<ConsultationStatisticsBean> consultationStatisticsBeanList = statisticsService.getConsultationStatisticsListByParam(consultationStatisticsParamBean);

        return succeedRequest(consultationStatisticsBeanList);
    }
}
