package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.mapper.ApplyFormMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
public class ApplyFormService implements BaseService<ApplyForm> {

    @Autowired
    private ApplyFormMapper applyFormMapper;

    // 更新applyForm表单apply_status状态
    public int updateStatus(ApplyForm applyForm, String applyStatus, String userId) {
        applyForm.setApplyStatus(applyStatus);
        applyForm.setUpdateUser(userId);
        return applyFormMapper.updateByPrimaryKeySelective(applyForm);
    }

    // 转诊查询
    public List<ApplyForm> selectApplyInquiry(ApplyFormBean applyFormBean) {
        return applyFormMapper.selectApplyInquiry(applyFormBean);
    }

    // 会诊查询
    public List<ApplyForm> selectApplyInquiryDate(ApplyFormBean applyFormBean) {
        return applyFormMapper.selectApplyInquiryDate(applyFormBean);
    }

    // 工作台详情页由applyFormId查询
    public ApplyFormBean detailById(String id) {
        return applyFormMapper.detailById(id);
    }

    // 草稿删除
    public int softDel(String id) {
        return applyFormMapper.softDel(id);
    }

    // 发出会诊 数目查询
    public Integer sendSelectCount(String userId, String hospitalId, List<String> consultantTypeList, List<String> statusList) {

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setConsultationTypeList(consultantTypeList);

        return applyFormMapper.sendSelectCount(applyFormBean);
    }

    // 转诊 双方角色 数目查询
    public Integer inquiryCountSelect(String userId, String hospitalId, List<String> consultantTypeList, List<String> statusList) {

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setInviteHospitalId(hospitalId);
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setInviteUserId(userId);

        return applyFormMapper.inquiryCountSelect(applyFormBean);
    }

    // 转诊 排期审核 数目查询
    public Integer inquirySlaveMasterAccedeCount(String userId, String hospitalId, List<String> consultantTypeList, List<String> statusList) {

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setInviteUserId(userId);
        applyFormBean.setInviteHospitalId(hospitalId);

        return applyFormMapper.inquirySlaveMasterAccedeCount(applyFormBean);
    }

    // 转诊 待审核 查询
    public Integer inquiryCreateSuccessCount(String userId, String hospitalId, List<String> consultantTypeList, List<String> statusList) {

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setConsultationStatusList(statusList);
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setApplyHospitalId(hospitalId);

        return applyFormMapper.inquiryCreateSuccessCount(applyFormBean);
    }

    @Override
    public int insertSelective(ApplyForm applyForm) {
        return applyFormMapper.insertSelective(applyForm);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(ApplyForm applyForm) {
        return applyFormMapper.updateByPrimaryKeySelective(applyForm);
    }

    @Override
    public int updateByPrimaryKey(ApplyForm applyForm) {
        return 0;
    }

    @Override
    public ApplyForm getByPrimaryKey(String id) {
        return applyFormMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<ApplyForm> findByDynamicParam(ApplyForm applyForm) {
        return applyFormMapper.findByDynamicParam(applyForm);
    }

    // 医生会诊查询
    public List<ApplyForm> getByApplyFormBean(ApplyFormBean applyFormBean) {
        return applyFormMapper.getByApplyFormBean(applyFormBean);
    }

    //  医政会诊查询
    public List<ApplyForm> sirGetByApplyFormBean(ApplyFormBean applyFormBean) {
        return applyFormMapper.sirGetByApplyFormBean(applyFormBean);
    }

    // 医政 转诊 查询
    public List<ApplyForm> sirSelectInquiry(ApplyFormBean applyFormBean) {
        return applyFormMapper.sirSelectInquiry(applyFormBean);
    }

    public int updateInviteDoctorByPrimaryKeySelective(ApplyForm applyForm) {
        return applyFormMapper.updateInviteDoctorByPrimaryKeySelective(applyForm);
    }
}
