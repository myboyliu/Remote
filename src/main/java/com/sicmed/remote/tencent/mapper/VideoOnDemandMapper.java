package com.sicmed.remote.tencent.mapper;

import com.sicmed.remote.tencent.bean.FuzzySearchVideoBean;
import com.sicmed.remote.tencent.bean.SelectVideoListParamBean;
import com.sicmed.remote.tencent.bean.VideoListBean;
import com.sicmed.remote.tencent.entity.TencentVideo;
import com.sicmed.remote.tencent.entity.VideoOnDemand;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface VideoOnDemandMapper {
    int deleteByPrimaryKey(String id);

    int insert(VideoOnDemand record);

    int insertSelective(VideoOnDemand record);

    VideoOnDemand selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(VideoOnDemand record);

    int updateByPrimaryKey(VideoOnDemand record);

    int fuzzyVideoListCountByParam(FuzzySearchVideoBean fuzzySearchVideoBean);

    List<VideoListBean> fuzzyVideoListByParam(FuzzySearchVideoBean fuzzySearchVideoBean);

    int updateByFileIdSelective(VideoOnDemand videoOnDemand);

    int getVideoListCountByParam(SelectVideoListParamBean selectVideoListParamBean);

    List<VideoListBean> getVideoListByParam(SelectVideoListParamBean selectVideoListParamBean);

    int addClickCount(String videoId);

    int getVideoListCountByUser(@Param(value = "createUser") String requestToken);

    List<VideoListBean> getVideoListByUser(VideoOnDemand videoOnDemand);

    int deleteVideoByParam(VideoOnDemand videoOnDemand);
}