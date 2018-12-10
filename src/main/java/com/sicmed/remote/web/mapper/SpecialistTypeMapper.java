package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.SpecialistType;

import java.util.List;

public interface SpecialistTypeMapper {
    int deleteByPrimaryKey(String id);

    int insert(SpecialistType record);

    int insertSelective(SpecialistType record);

    SpecialistType selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(SpecialistType record);

    int updateByPrimaryKey(SpecialistType record);

    List<SpecialistType> findByDynamicParam(SpecialistType specialistType);
}