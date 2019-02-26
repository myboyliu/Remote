package com.sicmed.remote.tencent.mapper;

import com.sicmed.remote.tencent.bean.FuzzySearchVideoBean;
import com.sicmed.remote.tencent.entity.TencentVideo;
import com.sicmed.remote.tencent.entity.VideoOnDemand;

import java.util.List;

public interface VideoOnDemandMapper {
    int deleteByPrimaryKey(String id);

    int insert(VideoOnDemand record);

    int insertSelective(VideoOnDemand record);

    VideoOnDemand selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(VideoOnDemand record);

    int updateByPrimaryKey(VideoOnDemand record);

    int fuzzyVideoListCountByParam(FuzzySearchVideoBean fuzzySearchVideoBean);

    List<VideoOnDemand> fuzzyVideoListByParam(FuzzySearchVideoBean fuzzySearchVideoBean);
}