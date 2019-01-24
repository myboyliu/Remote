package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.ConsultationStatusBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseConsultant;

import java.util.List;

public interface CaseConsultantMapper {
    int deleteByPrimaryKey(String id);

    int insert(CaseConsultant record);

    int insertSelective(CaseConsultant record);

    CaseConsultant selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CaseConsultant record);

    int updateByPrimaryKey(CaseConsultant record);

    int updateInviteDoctorByPrimaryKeySelective(CaseConsultant caseConsultant);

    List<ApplyForm> selectAssist(ApplyFormBean applyFormBean);

    ConsultationStatusBean receiveSelectAllCount(ApplyFormBean applyFormBean);

    ConsultationStatusBean receiveSelectAllCountSir(ApplyFormBean applyFormBean);

    ConsultationStatusBean receiveSelectHalfCount(ApplyFormBean applyFormBean);

    String selectReport(String applyFormId);

}