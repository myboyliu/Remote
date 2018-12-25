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

    public List<ApplyForm> selectSendConsultant(ApplyForm applyForm) {
        return applyFormMapper.selectSendConsultant(applyForm);
    }

    public int updateStatus(ApplyForm applyForm, String applyStatus, String userId) {
        applyForm.setApplyStatus(applyStatus);
        applyForm.setUpdateUser(userId);
        return applyFormMapper.updateByPrimaryKeySelective(applyForm);
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
        return null;
    }

    @Override
    public List<ApplyForm> findByDynamicParam(ApplyForm applyForm) {
        return applyFormMapper.findByDynamicParam(applyForm);
    }

    public List<ApplyForm> getByApplyFormBean(ApplyFormBean applyFormBean) {
        return applyFormMapper.getByApplyFormBean(applyFormBean);
    }
}
