package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.FuzzySearchBean;
import com.sicmed.remote.web.entity.Consumables;
import com.sicmed.remote.web.mapper.ConsumablesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsumablesService implements BaseService<Consumables>{

    @Autowired
    private ConsumablesMapper consumablesMapper;

    @Override
    public int insertSelective(Consumables consumables) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(Consumables consumables) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(Consumables consumables) {
        return 0;
    }

    @Override
    public Consumables getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<Consumables> findByDynamicParam(Consumables consumables) {
        return null;
    }

    public List<Consumables> fuzzySearchConsumables(FuzzySearchBean fuzzySearchBean) {
        return consumablesMapper.fuzzySearchConsumables(fuzzySearchBean);
    }

    public int fuzzySearchConsumablesSize(String param) {
        return consumablesMapper.fuzzySearchConsumablesSize(param);
    }
}
