package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.CasePatient;
import com.sicmed.remote.web.mapper.CasePatientMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CasePatientService implements BaseService<CasePatient> {

    @Autowired
    private CasePatientMapper casePatientMapper;

    @Override
    public int insertSelective(CasePatient casePatient) {
        return casePatientMapper.insertSelective(casePatient);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(CasePatient casePatient) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(CasePatient casePatient) {
        return 0;
    }

    @Override
    public CasePatient getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<CasePatient> findByDynamicParam(CasePatient casePatient) {
        return null;
    }
}
