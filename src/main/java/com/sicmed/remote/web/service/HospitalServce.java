package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.Hospital;
import com.sicmed.remote.web.mapper.HospitalMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalServce implements BaseService<Hospital> {

    @Autowired
    private HospitalMapper hm;

    @Override
    public int insertSelective(Hospital hospital) {
        return hm.insertSelective(hospital);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return hm.deleteByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(Hospital hospital) {
        return hm.updateByPrimaryKeySelective(hospital);
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
        return null;
    }
}
