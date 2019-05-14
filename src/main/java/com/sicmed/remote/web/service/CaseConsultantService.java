package com.sicmed.remote.web.service;

import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.ConsultationStatusBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.mapper.CaseConsultantMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CaseConsultantService implements BaseService<CaseConsultant> {

    @Autowired
    private CaseConsultantMapper caseConsultantMapper;

    // 辅助会诊医生查询
    public List<ApplyForm> selectAssist(ApplyFormBean applyFormBean) {
        return caseConsultantMapper.selectAssist(applyFormBean);
    }

    // 受邀会诊 医生 所有数目查询
    public ConsultationStatusBean receiveSelectAllCount(String userId, String branchId, String hospitalId, List<String> consultantTypeList) {

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setInviteUserId(userId);
        applyFormBean.setInviteBranchId(branchId);
        applyFormBean.setInviteHospitalId(hospitalId);
        applyFormBean.setConsultationTypeList(consultantTypeList);

        return caseConsultantMapper.receiveSelectAllCount(applyFormBean);
    }

    // 受邀会诊 医政 所有数目查询
    public ConsultationStatusBean receiveSelectAllCountSir(String hospitalId, List<String> consultantTypeList) {

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setInviteHospitalId(hospitalId);
        applyFormBean.setConsultationTypeList(consultantTypeList);

        return caseConsultantMapper.receiveSelectAllCountSir(applyFormBean);
    }

    // 受邀会诊 医生 已拒收,排期审核数目查询
    public ConsultationStatusBean receiveSelectHalfCount(String userId, List<String> consultantTypeList) {
        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setInviteUserId(userId);
        applyFormBean.setConsultationTypeList(consultantTypeList);
        return caseConsultantMapper.receiveSelectHalfCount(applyFormBean);
    }

    // 查询会诊报告
    public String selectReport(String applyFormId) {
        return caseConsultantMapper.selectReport(applyFormId);
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

    public int updateDoctorAndTime(String applyFormId, String consultantUserList, String consultantReport, BigDecimal consultantPrice) {
        CaseConsultant caseConsultant = new CaseConsultant();
        caseConsultant.setId(applyFormId);
        caseConsultant.setConsultantUserList(consultantUserList);
        caseConsultant.setConsultantReport(consultantReport);
        caseConsultant.setConsultantPrice(consultantPrice);
        caseConsultant.setUpdateUser(UserTokenManager.getCurrentUserId());
        return caseConsultantMapper.updateByPrimaryKeySelective(caseConsultant);
    }
}
