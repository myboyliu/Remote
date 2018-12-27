package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.mapper.ApplyFormMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return 0;
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
}
