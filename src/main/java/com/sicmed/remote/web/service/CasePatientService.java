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

    public CasePatient selectByCard(String patientCard) {
        return casePatientMapper.selectByCard(patientCard);
    }

    public int updateByCard(CasePatient casePatient) {
        return casePatientMapper.updateByCard(casePatient);
    }

    @Override
    public int insertSelective(CasePatient casePatient) {
        return casePatientMapper.insertSelective(casePatient);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return casePatientMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(CasePatient casePatient) {
        return casePatientMapper.updateByPrimaryKeySelective(casePatient);
    }

    @Override
    public int updateByPrimaryKey(CasePatient casePatient) {
        return 0;
    }

    @Override
    public CasePatient getByPrimaryKey(String id) {
        return casePatientMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<CasePatient> findByDynamicParam(CasePatient casePatient) {
        return casePatientMapper.findByDynamicParam(casePatient);
    }
}
