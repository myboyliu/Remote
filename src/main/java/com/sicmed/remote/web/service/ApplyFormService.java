package com.sicmed.remote.web.service;

import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.ConsultationStatusBean;
import com.sicmed.remote.web.bean.InquiryStatusBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseRecord;
import com.sicmed.remote.web.mapper.ApplyFormMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ApplyFormService implements BaseService<ApplyForm> {

    @Autowired
    private ApplyFormMapper applyFormMapper;

    @Autowired
    private CasePatientService casePatientService;

    @Autowired
    private CaseRecordService caseRecordService;

    @Autowired
    private CaseContentService caseContentService;

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private CaseConsultantService caseConsultantService;

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

    // 转诊 医生 各个状态数目查询
    public InquiryStatusBean inquiryCreateSuccessAllCountDr(String userId, List<String> consultantTypeList) {

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setApplyUserId(userId);

        return applyFormMapper.inquiryCreateSuccessAllCountDr(applyFormBean);
    }

    // 转诊 医政 各个状态总数目查询
    public InquiryStatusBean inquiryCreateSuccessAllCountSir(String hospitalId, List<String> consultantTypeList) {

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setConsultationTypeList(consultantTypeList);
        applyFormBean.setApplyHospitalId(hospitalId);

        return applyFormMapper.inquiryCreateSuccessAllCountSir(applyFormBean);
    }

    // 发出会诊 总数目查询,hospitalId为空时,查询对象医生;不为空时,医政
    public ConsultationStatusBean sendSelectAllCount(String userId, String hospitalId, List<String> consultantTypeList) {

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setConsultationTypeList(consultantTypeList);

        return applyFormMapper.sendSelectAllCount(applyFormBean);
    }

    // 草稿 数目查询
    public int countDraft(String string) {
        ApplyForm applyForm = new ApplyForm();
        applyForm.setApplyUserId(string);
        applyForm.setApplyType(ApplyType.APPLY_DRAFT.toString());
        return applyFormMapper.countDraft(applyForm);
    }

    // 医生 搜索
    public List<ApplyFormBean> searchByRemark(String userId, String condition) {

        List<String> statusList = new ArrayList<>();
        statusList.add(String.valueOf(ConsultationStatus.CONSULTATION_END));
        statusList.add(String.valueOf(InquiryStatus.INQUIRY_END));

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setApplyRemark(condition);
        applyFormBean.setConsultationStatusList(statusList);
        return applyFormMapper.searchByRemark(applyFormBean);
    }

    // 医证 搜索
    public List<ApplyFormBean> sirSearchByRemark(String hospitalId, String condition) {

        List<String> statusList = new ArrayList<>();
        statusList.add(String.valueOf(ConsultationStatus.CONSULTATION_END));
        statusList.add(String.valueOf(InquiryStatus.INQUIRY_END));

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setApplyRemark(condition);
        applyFormBean.setConsultationStatusList(statusList);
        return applyFormMapper.sirSearchByRemark(applyFormBean);
    }

    // 删除草稿
    @Transactional
    public int draftDel(String applyFormId) {

        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        // 获取caseRecordId
        String caseRecordId = applyForm.getCaseRecordId();
        // 删除caseRecordId相关的病例信息
        if (StringUtils.isNotBlank(caseRecordId)) {
            caseContentService.deleteByCaseRecordId(caseRecordId);
            caseRecordService.deleteByPrimaryKey(caseRecordId);
        }
        caseConsultantService.deleteByPrimaryKey(applyFormId);
        return applyFormMapper.deleteByPrimaryKey(applyForm.getId());
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
