package com.sicmed.remote.tencent.service;

import com.sicmed.remote.tencent.bean.FuzzySearchVideoBean;
import com.sicmed.remote.tencent.entity.TencentVideo;
import com.sicmed.remote.tencent.entity.VideoOnDemand;
import com.sicmed.remote.tencent.mapper.VideoOnDemandMapper;
import com.sicmed.remote.web.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoOnDemandService implements BaseService {


    @Autowired
    private VideoOnDemandMapper videoOnDemandMapper;

    public int fuzzyVideoListCountByParam(FuzzySearchVideoBean fuzzySearchVideoBean) {
        return videoOnDemandMapper.fuzzyVideoListCountByParam(fuzzySearchVideoBean);
    }

    public List<VideoOnDemand> fuzzyVideoListByParam(FuzzySearchVideoBean fuzzySearchVideoBean) {

        return videoOnDemandMapper.fuzzyVideoListByParam(fuzzySearchVideoBean);
    }

    @Override
    public int insertSelective(Object o) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(Object o) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(Object o) {
        return 0;
    }

    @Override
    public Object getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List findByDynamicParam(Object o) {
        return null;
    }
}
