package com.sicmed.remote.live.mapper;

import com.sicmed.remote.live.bean.GetLiveParamBean;
import com.sicmed.remote.live.entity.Live;

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
}