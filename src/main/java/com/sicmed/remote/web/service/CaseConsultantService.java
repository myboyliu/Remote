package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.mapper.CaseConsultantMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseConsultantService implements BaseService<CaseConsultant> {

    @Autowired
    private CaseConsultantMapper caseConsultantMapper;

    // 辅助会诊医生查询
    public List<ApplyForm> selectAssist(ApplyFormBean applyFormBean) {
        return caseConsultantMapper.selectAssist(applyFormBean);
    }

    @Override
    public int insertSelective(CaseConsultant caseConsultant) {
        return caseConsultantMapper.insertSelective(caseConsultant);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return caseConsultantMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(CaseConsultant caseConsultant) {
        return caseConsultantMapper.updateByPrimaryKeySelective(caseConsultant);
    }

    @Override
    public int updateByPrimaryKey(CaseConsultant caseConsultant) {
        return 0;
    }

    @Override
    public CaseConsultant getByPrimaryKey(String id) {
        return caseConsultantMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<CaseConsultant> findByDynamicParam(CaseConsultant caseConsultant) {
        return null;
    }

    public int updateInviteDoctorByPrimaryKeySelective(CaseConsultant caseConsultant) {
        return caseConsultantMapper.updateInviteDoctorByPrimaryKeySelective(caseConsultant);
    }
}
