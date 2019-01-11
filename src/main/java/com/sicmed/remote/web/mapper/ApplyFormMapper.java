package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.ConsultationStatusBean;
import com.sicmed.remote.web.entity.ApplyForm;

import java.util.List;

public interface ApplyFormMapper {
    int deleteByPrimaryKey(String id);

    int insert(ApplyForm record);

    int insertSelective(ApplyForm record);

    ApplyForm selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(ApplyForm record);

    int updateByPrimaryKey(ApplyForm record);

    List<ApplyForm> findByDynamicParam(ApplyForm applyForm);

    List<ApplyForm> getByApplyFormBean(ApplyFormBean applyFormBean);

    List<ApplyForm> sirGetByApplyFormBean(ApplyFormBean applyFormBean);

    List<ApplyForm> selectApplyInquiry(ApplyFormBean applyFormBean);

    List<ApplyForm> selectApplyInquiryDate(ApplyFormBean applyFormBean);

    List<ApplyForm> sirSelectInquiry(ApplyFormBean applyFormBean);

    ApplyFormBean detailById(String id);

    int softDel(String id);

    int updateInviteDoctorByPrimaryKeySelective(ApplyForm applyForm);

    Integer sendSelectCount(ApplyFormBean applyFormBean);

    Integer inquiryCountSelect(ApplyFormBean applyFormBean);

    Integer inquirySlaveMasterAccedeCount(ApplyFormBean applyFormBean);

    Integer inquiryCreateSuccessCount(ApplyFormBean applyFormBean);

    ConsultationStatusBean sendSelectAllCount(ApplyFormBean applyFormBean);

    ConsultationStatusBean inquiryAllCount(ApplyFormBean applyFormBean);

    ConsultationStatusBean inquiryAllCountDoctor(ApplyFormBean applyFormBean);

    ConsultationStatusBean inquiryAllCountSir(ApplyFormBean applyFormBean);

    ConsultationStatusBean inquiryCreateSuccessAllCount(ApplyFormBean applyFormBean);

    ConsultationStatusBean inquirySMAdAllCount(ApplyFormBean applyFormBean);

    int countDraft(ApplyForm applyForm);

}