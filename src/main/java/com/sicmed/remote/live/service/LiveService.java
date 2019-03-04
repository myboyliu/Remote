package com.sicmed.remote.live.service;

import com.sicmed.remote.live.bean.FuzzySearchLiveBean;
import com.sicmed.remote.live.bean.GetLiveParamBean;
import com.sicmed.remote.live.entity.Live;
import com.sicmed.remote.live.mapper.LiveMapper;
import com.sicmed.remote.web.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LiveService implements BaseService<Live> {

    @Autowired
    private LiveMapper liveMapper;

    @Override
    public int insertSelective(Live live) {
        return liveMapper.insertSelective(live);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(Live live) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(Live live) {
        return 0;
    }

    @Override
    public Live getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<Live> findByDynamicParam(Live live) {
        return null;
    }

    public int selectCountByParam(GetLiveParamBean getLiveParamBean) {
       return liveMapper.selectCountByParam(getLiveParamBean);
    }

    public List<Live> selectListByParam(GetLiveParamBean getLiveParamBean) {

        return liveMapper.selectListByParam(getLiveParamBean);
    }

    public int searchCountByParam(FuzzySearchLiveBean fuzzySearchLiveBean) {
        return liveMapper.searchCountByParam(fuzzySearchLiveBean);
    }

    public List<Live> searchListByParam(FuzzySearchLiveBean fuzzySearchLiveBean) {
        return liveMapper.searchListByParam(fuzzySearchLiveBean);
    }
}
