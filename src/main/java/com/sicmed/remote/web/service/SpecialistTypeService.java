package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.SpecialistType;
import com.sicmed.remote.web.mapper.SpecialistTypeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author MaxCoder
 * @version 1.0
 * @Description TODO
 **/

@Service
public class SpecialistTypeService implements BaseService<SpecialistType> {

    @Autowired
    private SpecialistTypeMapper specialistTypeMapper;

    @Override
    public int insertSelective(SpecialistType specialistType) {
        return specialistTypeMapper.insertSelective(specialistType);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return specialistTypeMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(SpecialistType specialistType) {
        return specialistTypeMapper.updateByPrimaryKeySelective(specialistType);
    }

    @Override
    public int updateByPrimaryKey(SpecialistType specialistType) {
        return specialistTypeMapper.updateByPrimaryKey(specialistType);
    }

    @Override
    public SpecialistType getByPrimaryKey(String id) {
        return specialistTypeMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<SpecialistType> findByDynamicParam(SpecialistType specialistType) {
        return specialistTypeMapper.findByDynamicParam(specialistType);
    }
}
