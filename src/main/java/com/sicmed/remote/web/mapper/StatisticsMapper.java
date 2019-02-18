package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.ConsultationStatisticsBean;
import com.sicmed.remote.web.bean.ConsultationStatisticsParamBean;

import java.util.List;

public interface StatisticsMapper {
    List<ConsultationStatisticsBean> getConsultationStatisticsListByParam(ConsultationStatisticsParamBean consultationStatisticsParamBean);
}
