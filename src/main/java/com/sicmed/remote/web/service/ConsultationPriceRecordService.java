package com.sicmed.remote.web.service;

import com.sicmed.remote.common.util.ConsultationUserBean;
import com.sicmed.remote.common.util.ConsultationUserListUtils;
import com.sicmed.remote.web.bean.StatisticsSearchBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.entity.ConsultationPriceRecord;
import com.sicmed.remote.web.mapper.ConsultationPriceRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ConsultationPriceRecordService implements BaseService<ConsultationPriceRecord> {

    @Autowired
    private ConsultationPriceRecordMapper consultationPriceRecordMapper;

    public int insertList(CaseConsultant caseConsultant, ApplyForm applyForm) {
        List<ConsultationUserBean> consultationUserBeanList = ConsultationUserListUtils.consultationUserListJsonToObj(caseConsultant.getConsultantUserList());
        List<ConsultationPriceRecord> consultationPriceRecordList = new ArrayList<>();
        for (ConsultationUserBean consultationUserBean : consultationUserBeanList) {
            ConsultationPriceRecord consultationPriceRecord = new ConsultationPriceRecord();

            consultationPriceRecord.setConsultationId(applyForm.getId());
            consultationPriceRecord.setApplyHospitalId(applyForm.getApplyHospitalId());
            consultationPriceRecord.setApplyBranchId(applyForm.getApplyBranchId());
            consultationPriceRecord.setApplyUserId(applyForm.getApplyUserId());
            consultationPriceRecord.setConsultationType(applyForm.getApplyType());
            consultationPriceRecord.setInviteHospitalId(applyForm.getInviteHospitalId());
            consultationPriceRecord.setInviteBranchId(consultationUserBean.getBranchId());
            consultationPriceRecord.setInviteUserId(consultationUserBean.getDoctorId());
            consultationPriceRecord.setInviteHospitalPrice(caseConsultant.getHospitalPrice());
            consultationPriceRecord.setInviteUserPrice(consultationUserBean.getPrice());
            consultationPriceRecord.setTotalPrice(caseConsultant.getConsultantPrice());

            consultationPriceRecordList.add(consultationPriceRecord);
        }
        return consultationPriceRecordMapper.insertList(consultationPriceRecordList);
    }

    @Override
    public int insertSelective(ConsultationPriceRecord consultationPriceRecord) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(ConsultationPriceRecord consultationPriceRecord) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(ConsultationPriceRecord consultationPriceRecord) {
        return 0;
    }

    @Override
    public ConsultationPriceRecord getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<ConsultationPriceRecord> findByDynamicParam(ConsultationPriceRecord consultationPriceRecord) {
        return null;
    }

    // 会诊费用统计,发出列表
    public List<StatisticsSearchBean> consultationPriceApplyStatistics(String hospitalId, String status,
                                                                       StatisticsSearchBean statisticsSearchBean) {
        statisticsSearchBean.setStatus(status);
        statisticsSearchBean.setHospitalId(hospitalId);
        return consultationPriceRecordMapper.consultationPriceApplyStatistics(statisticsSearchBean);
    }

    // 会诊费用统计,受邀列表
    public List<StatisticsSearchBean> consultationPriceInviteStatistics(String hospitalId, String status,
                                                                        StatisticsSearchBean statisticsSearchBean) {
        statisticsSearchBean.setStatus(status);
        statisticsSearchBean.setHospitalId(hospitalId);
        return consultationPriceRecordMapper.consultationPriceInviteStatistics(statisticsSearchBean);
    }
}
