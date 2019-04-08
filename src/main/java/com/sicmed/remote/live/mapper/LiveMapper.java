package com.sicmed.remote.live.mapper;

import com.sicmed.remote.live.bean.FuzzySearchLiveBean;
import com.sicmed.remote.live.bean.GetLiveParamBean;
import com.sicmed.remote.live.entity.Live;
import com.sicmed.remote.web.bean.ScheduledParam;

import java.util.List;

public interface LiveMapper {
    int deleteByPrimaryKey(String id);

    int insert(Live record);

    int insertSelective(Live record);

    Live selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Live record);

    int updateByPrimaryKey(Live record);

    List<Live> selectByParam(GetLiveParamBean getLiveParamBean);

    int selectCountByParam(GetLiveParamBean getLiveParamBean);

    List<Live> selectListByParam(GetLiveParamBean getLiveParamBean);

    int searchCountByParam(FuzzySearchLiveBean fuzzySearchLiveBean);

    List<Live> searchListByParam(FuzzySearchLiveBean fuzzySearchLiveBean);

    int getCountByUser(String requestToken);

    List<Live> getListByUser(GetLiveParamBean getLiveParamBean);

    int addSubscriptionNumber(String curriculumId);

    int lessSubscriptionNumber(String curriculumId);

    List<String> selectTimeByParam(ScheduledParam scheduledParam);

    List<String> selectScheduledByParam(ScheduledParam scheduledParam);
}