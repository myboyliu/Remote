package com.sicmed.remote.web.mapper;

import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.ConsultationStatusBean;
import com.sicmed.remote.web.bean.InquiryStatusBean;
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

    List<ApplyForm> selectInquiryDai(ApplyFormBean applyFormBean);

    List<ApplyForm> selectApplyInquiryDate(ApplyFormBean applyFormBean);

    List<ApplyForm> sirSelectInquiry(ApplyFormBean applyFormBean);

    List<ApplyForm> sirSelectInquiryDai(ApplyFormBean applyFormBean);

    List<ApplyForm> sirSelectInquiryJuShou(ApplyFormBean applyFormBean);

    List<ApplyForm> dorSelectInquiryJuShou(ApplyFormBean applyFormBean);

    ApplyFormBean detailById(String id);

    int softDel(String id);

    int updateInviteDoctorByPrimaryKeySelective(ApplyForm applyForm);

    ConsultationStatusBean sendSelectAllCount(ApplyFormBean applyFormBean);

    InquiryStatusBean inquiryCreateSuccessAllCountDr(ApplyFormBean applyFormBean);

    InquiryStatusBean inquiryCreateSuccessAllCountSir(ApplyFormBean applyFormBean);

    int countDraft(ApplyForm applyForm);

    List<ApplyFormBean> searchByRemark(ApplyFormBean applyFormBean);

    List<ApplyFormBean> sirSearchByRemark(ApplyFormBean applyFormBean);
}