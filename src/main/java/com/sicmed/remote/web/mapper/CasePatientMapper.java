package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.CasePatient;

import java.util.List;

public interface CasePatientMapper {
    int deleteByPrimaryKey(String id);

    int insert(CasePatient record);

    int insertSelective(CasePatient record);

    CasePatient selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CasePatient record);

    int updateByPrimaryKey(CasePatient record);

    CasePatient selectByCard(String patientCard);

    int updateByCard(CasePatient casePatient);

    List<CasePatient> findByDynamicParam(CasePatient casePatient);

}