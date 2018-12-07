package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.CasePatient;

public interface CasePatientMapper {
    int deleteByPrimaryKey(String id);

    int insert(CasePatient record);

    int insertSelective(CasePatient record);

    CasePatient selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CasePatient record);

    int updateByPrimaryKey(CasePatient record);
}