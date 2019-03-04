package com.sicmed.remote.live.service;

import com.sicmed.remote.live.entity.Live;
import com.sicmed.remote.web.service.BaseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LiveService implements BaseService<Live> {

    @Override
    public int insertSelective(Live live) {
        return 0;
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
}
