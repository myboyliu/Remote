package com.sicmed.remote.tencent.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.tencent.bean.FuzzySearchVideoBean;
import com.sicmed.remote.tencent.bean.SelectVideoListParamBean;
import com.sicmed.remote.tencent.bean.VideoListBean;
import com.sicmed.remote.tencent.entity.VideoOnDemand;
import com.sicmed.remote.tencent.mapper.VideoOnDemandMapper;
import com.sicmed.remote.web.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class VideoOnDemandService implements BaseService<VideoOnDemand> {


    @Autowired
    private VideoOnDemandMapper videoOnDemandMapper;

    public int fuzzyVideoListCountByParam(FuzzySearchVideoBean fuzzySearchVideoBean) {
        return videoOnDemandMapper.fuzzyVideoListCountByParam(fuzzySearchVideoBean);
    }

    public List<VideoListBean> fuzzyVideoListByParam(FuzzySearchVideoBean fuzzySearchVideoBean) {

        return videoOnDemandMapper.fuzzyVideoListByParam(fuzzySearchVideoBean);
    }

    public int updataByEventResult(Map<String, Object> eventResultMap) {
        VideoOnDemand videoOnDemand = new VideoOnDemand();
        videoOnDemand.setVideoFileId(eventResultMap.get("fileId").toString());
        videoOnDemand.setVideoCoverUrl(eventResultMap.get("coverUrl").toString());
        JSONArray jsonArray = JSONArray.parseArray(eventResultMap.get("playSet").toString());
        JSONObject video1 = jsonArray.getJSONObject(1);
        videoOnDemand.setVideoUrl(video1.get("url").toString());
        videoOnDemand.setTransCode("1");
        return videoOnDemandMapper.updateByFileIdSelective(videoOnDemand);
    }


    @Override
    public int insertSelective(VideoOnDemand videoOnDemand) {
        return videoOnDemandMapper.insertSelective(videoOnDemand);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(VideoOnDemand videoOnDemand) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(VideoOnDemand videoOnDemand) {
        return 0;
    }

    @Override
    public VideoOnDemand getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<VideoOnDemand> findByDynamicParam(VideoOnDemand videoOnDemand) {
        return null;
    }

    public int getVideoListCountByParam(SelectVideoListParamBean selectVideoListParamBean) {
        return videoOnDemandMapper.getVideoListCountByParam(selectVideoListParamBean);
    }

    public List<VideoListBean> getVideoListByParam(SelectVideoListParamBean selectVideoListParamBean) {
        return videoOnDemandMapper.getVideoListByParam(selectVideoListParamBean);
    }

    public int addClickCount(String videoId) {
        return videoOnDemandMapper.addClickCount(videoId);
    }

    public int getVideoListCountByUser(String requestToken) {
        return videoOnDemandMapper.getVideoListCountByUser(requestToken);
    }

    public List<VideoListBean> getVideoListByUser(VideoOnDemand videoOnDemand) {
        return videoOnDemandMapper.getVideoListByUser(videoOnDemand);
    }

    public int deleteVideoByParam(VideoOnDemand videoOnDemand) {
        return videoOnDemandMapper.deleteVideoByParam(videoOnDemand);
    }
}
