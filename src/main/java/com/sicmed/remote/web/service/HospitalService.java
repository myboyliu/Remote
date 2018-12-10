package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.Hospital;
import com.sicmed.remote.web.mapper.HospitalMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService implements BaseService<Hospital> {

    @Autowired
    private HospitalMapper hospitalMapper;

    @Override
    public int insertSelective(Hospital hospital) {
        return hospitalMapper.insertSelective(hospital);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return hospitalMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(Hospital hospital) {
        return hospitalMapper.updateByPrimaryKeySelective(hospital);
    }

    @Override
    public int updateByPrimaryKey(Hospital hospital) {
        return 0;
    }

    @Override
    public Hospital getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<Hospital> findByDynamicParam(Hospital hospital) {
        return hospitalMapper.findByDynamicParam(hospital);
    }
}
