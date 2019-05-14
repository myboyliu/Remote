package com.sicmed.remote.web.service;

import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.web.bean.*;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseRecord;
import com.sicmed.remote.web.mapper.ApplyFormMapper;
import com.sicmed.remote.web.mapper.CaseConsultantMapper;
import com.sicmed.remote.web.mapper.CaseContentMapper;
import com.sicmed.remote.web.mapper.CaseRecordMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class ApplyFormService implements BaseService<ApplyForm> {


    @Autowired
    private ApplyFormMapper applyFormMapper;

    @Autowired
    private CaseRecordMapper caseRecordMapper;

    @Autowired
    private CaseContentMapper caseContentMapper;

    @Autowired
    private CaseConsultantMapper caseConsultantMapper;


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

    // 转诊 医生 已拒收 查询
    public List<ApplyForm> dorSelectInquiryJuShou(ApplyFormBean applyFormBean) {
        return applyFormMapper.dorSelectInquiryJuShou(applyFormBean);
    }

    // 转诊待收诊
    public List<ApplyForm> selectInquiryDai(ApplyFormBean applyFormBean) {
        return applyFormMapper.selectInquiryDai(applyFormBean);
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
        applyFormBean.setInviteHospitalId(hospitalId);

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

    // 医生搜索 总数目
    public int searchCount(String userId, String condition) {
        List<String> statusList = new ArrayList<>();
        statusList.add(String.valueOf(ConsultationStatus.CONSULTATION_END));
        statusList.add(String.valueOf(InquiryStatus.INQUIRY_END));

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyUserId(userId);
        applyFormBean.setApplyRemark(condition);
        applyFormBean.setConsultationStatusList(statusList);

        return applyFormMapper.searchCount(applyFormBean);
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

    // 医政 搜索总数目
    public int sirSearchCount(String hospitalId, String condition) {

        List<String> statusList = new ArrayList<>();
        statusList.add(String.valueOf(ConsultationStatus.CONSULTATION_END));
        statusList.add(String.valueOf(InquiryStatus.INQUIRY_END));

        ApplyFormBean applyFormBean = new ApplyFormBean();
        applyFormBean.setApplyHospitalId(hospitalId);
        applyFormBean.setApplyRemark(condition);
        applyFormBean.setConsultationStatusList(statusList);
        return applyFormMapper.sirSearchCount(applyFormBean);
    }

    // 医政 搜索
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

        ApplyForm applyForm = applyFormMapper.selectByPrimaryKey(applyFormId);
        // 获取caseRecordId
        String caseRecordId = applyForm.getCaseRecordId();
        // 删除caseRecordId相关的病例信息
        if (StringUtils.isNotBlank(caseRecordId)) {
            caseContentMapper.deleteByCaseRecordId(caseRecordId);
            caseRecordMapper.deleteByPrimaryKey(caseRecordId);
        }
        caseConsultantMapper.deleteByPrimaryKey(applyFormId);
        return applyFormMapper.deleteByPrimaryKey(applyForm.getId());
    }

    // 草稿创建会转诊删除原表单
    public int deleteApplyFormDraft(String draftId) {
        caseConsultantMapper.deleteByPrimaryKey(draftId);
        return applyFormMapper.deleteByPrimaryKey(draftId);
    }

    // 医生 受邀会诊 待收诊  同意
    public int inviteeConsent(ApplyForm applyForm) {
        return applyFormMapper.inviteeConsent(applyForm);
    }

    // 转诊 待收诊  同意
    public int inviteeTransfer(ApplyForm applyForm) {
        return applyFormMapper.inviteeTransfer(applyForm);
    }

    // 会/转 诊病例次数统计,发出列表
    public List<StatisticsSearchBean> applyConsultationStatistics(String hospitalId, String
            status, StatisticsSearchBean statisticsSearchBean
    ) {
        statisticsSearchBean.setHospitalId(hospitalId);
        statisticsSearchBean.setStatus(status);

        return applyFormMapper.applyConsultationStatistics(statisticsSearchBean);
    }

    // 会诊高级统计
    public List<StatisticsSearchBean> advancedConsultationStatistics(String hospitalId, StatisticsSearchBean
            statisticsSearchBean) {

        statisticsSearchBean.setStatus(String.valueOf(ConsultationStatus.CONSULTATION_END));
        statisticsSearchBean.setHospitalId(hospitalId);

        return applyFormMapper.advancedConsultationStatistics(statisticsSearchBean);
    }

    @Override
    public int insertSelective(ApplyForm applyForm) {
        return applyFormMapper.insertSelective(applyForm);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return applyFormMapper.deleteByPrimaryKey(id);
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

    // 医生 转诊  待审核
    public List<ApplyForm> inquiryDaiShou(ApplyFormBean applyFormBean) {
        return applyFormMapper.inquiryDaiShou(applyFormBean);
    }

    //  医政会诊查询
    public List<ApplyForm> sirGetByApplyFormBean(ApplyFormBean applyFormBean) {
        return applyFormMapper.sirGetByApplyFormBean(applyFormBean);
    }

    // 医政 转诊 查询
    public List<ApplyForm> sirSelectInquiry(ApplyFormBean applyFormBean) {
        return applyFormMapper.sirSelectInquiry(applyFormBean);
    }

    // 医政 转诊 待收诊 查询
    public List<ApplyForm> sirSelectInquiryDai(ApplyFormBean applyFormBean) {
        return applyFormMapper.sirSelectInquiryDai(applyFormBean);
    }

    // 医政 转诊 已拒收 查询
    public List<ApplyForm> sirSelectInquiryJuShou(ApplyFormBean applyFormBean) {
        return applyFormMapper.sirSelectInquiryJuShou(applyFormBean);
    }

    public int updateInviteDoctorByPrimaryKeySelective(ApplyForm applyForm) {
        return applyFormMapper.updateInviteDoctorByPrimaryKeySelective(applyForm);
    }

    public List<String> selectTimeByParam(ScheduledParam scheduledParam) {
        return applyFormMapper.selectTimeByParam(scheduledParam);
    }

    public List<ApplyFormBean> selectScheduledByParam(ScheduledParam scheduledParam) {
        return applyFormMapper.selectScheduledByParam(scheduledParam);
    }

    /**
     * 查询会诊相关医院科室人员信息
     */
    public ApplyFormInfoBean getApplyFormInfo(String applyFormId){

        return applyFormMapper.getApplyFormInfo(applyFormId);
    }

    /**
     * 根据ID修改状态
     *
     * @param applyFormId
     * @param applyStatus
     */
    public int updateStatus(String applyFormId, String applyStatus) {
        ApplyForm applyForm = new ApplyForm();
        applyForm.setId(applyFormId);
        applyForm.setUpdateUser(UserTokenManager.getCurrentUserId());
        applyForm.setApplyStatus(applyStatus);
       return applyFormMapper.updateByPrimaryKeySelective(applyForm);
    }
}
