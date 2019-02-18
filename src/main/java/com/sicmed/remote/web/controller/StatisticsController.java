package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.web.bean.ConsultationStatisticsBean;
import com.sicmed.remote.web.bean.ConsultationStatisticsParamBean;
import com.sicmed.remote.web.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "statistics")
public class StatisticsController extends BaseController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping(value = "getConsultationCount")
    public Map getConsultationStatisticsList(ConsultationStatisticsParamBean consultationStatisticsParamBean){

        consultationStatisticsParamBean.setHospitalId(getCurrentUser().getHospitalId());
        consultationStatisticsParamBean.setApplyStatus(String.valueOf(ConsultationStatus.CONSULTATION_END));
        List<ConsultationStatisticsBean> consultationStatisticsBeanList = statisticsService.getConsultationStatisticsListByParam(consultationStatisticsParamBean);

        return succeedRequest(consultationStatisticsBeanList);
    }

}
