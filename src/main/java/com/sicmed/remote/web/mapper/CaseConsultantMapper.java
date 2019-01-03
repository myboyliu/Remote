package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.CaseConsultant;

public interface CaseConsultantMapper {
    int deleteByPrimaryKey(String id);

    int insert(CaseConsultant record);

    int insertSelective(CaseConsultant record);

    CaseConsultant selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CaseConsultant record);

    int updateByPrimaryKey(CaseConsultant record);

    int updateInviteDoctorByPrimaryKeySelective(CaseConsultant caseConsultant);
}