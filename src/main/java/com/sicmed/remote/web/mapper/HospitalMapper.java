package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.Hospital;

import java.util.List;

public interface HospitalMapper {
    int deleteByPrimaryKey(String id);

    int insert(Hospital record);

    int insertSelective(Hospital record);

    Hospital selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Hospital record);

    int updateByPrimaryKey(Hospital record);

    List<Hospital> findByDynamicParam(Hospital hospital);
}