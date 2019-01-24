package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.ConsumablesSpecifications;
import com.sicmed.remote.web.mapper.ConsumablesSpecificationsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsumablesSpecificationsService implements BaseService<ConsumablesSpecifications>{

    @Autowired
    private ConsumablesSpecificationsMapper consumablesSpecificationsMapper;

    @Override
    public int insertSelective(ConsumablesSpecifications consumablesSpecifications) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(ConsumablesSpecifications consumablesSpecifications) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(ConsumablesSpecifications consumablesSpecifications) {
        return 0;
    }

    @Override
    public ConsumablesSpecifications getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<ConsumablesSpecifications> findByDynamicParam(ConsumablesSpecifications consumablesSpecifications) {
        return null;
    }

    public List<ConsumablesSpecifications> findSpecificationsById(String id) {
        return consumablesSpecificationsMapper.findSpecificationsById(id);
    }
}
