package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.StatisticsSearchBean;
import com.sicmed.remote.web.entity.ConsultationPriceRecord;

import java.util.List;

public interface ConsultationPriceRecordMapper {
    int deleteByPrimaryKey(String id);

    int insert(ConsultationPriceRecord record);

    int insertSelective(ConsultationPriceRecord record);

    ConsultationPriceRecord selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(ConsultationPriceRecord record);

    int updateByPrimaryKey(ConsultationPriceRecord record);

    int insertList(List<ConsultationPriceRecord> consultationPriceRecordList);

    List<StatisticsSearchBean> consultationPriceApplyStatistics(StatisticsSearchBean statisticsSearchBean);

    List<StatisticsSearchBean> consultationPriceInviteStatistics(StatisticsSearchBean statisticsSearchBean);
}