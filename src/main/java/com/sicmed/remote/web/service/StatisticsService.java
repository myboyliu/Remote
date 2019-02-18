package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.ConsultationStatisticsBean;
import com.sicmed.remote.web.bean.ConsultationStatisticsParamBean;
import com.sicmed.remote.web.mapper.StatisticsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatisticsService {

    @Autowired
    private StatisticsMapper statisticsMapper;

    public List<ConsultationStatisticsBean> getConsultationStatisticsListByParam(ConsultationStatisticsParamBean consultationStatisticsParamBean){

        return statisticsMapper.getConsultationStatisticsListByParam(consultationStatisticsParamBean);
    }
}
