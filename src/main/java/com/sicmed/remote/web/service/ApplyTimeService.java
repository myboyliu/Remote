package com.sicmed.remote.web.service;

import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.bean.ApplyTimeBean;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.mapper.ApplyTimeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplyTimeService implements BaseService<ApplyTime> {

    @Autowired
    private ApplyTimeMapper applyTimeMapper;

    public int updateStatus(ApplyTime applyTime) {
        return applyTimeMapper.updateApplyFormId(applyTime);
    }

    public int updateByForm(ApplyTime applyTime) {
        return applyTimeMapper.updateApplyFormId(applyTime);
    }

    public int delByApplyForm(String applyFormId) {
        return applyTimeMapper.delByApplyForm(applyFormId);
    }

    public int insertStartEndTimes(ApplyTimeBean applyTimeBean) {
        return applyTimeMapper.insertStartEndTimes(applyTimeBean);
    }

    @Override
    public int insertSelective(ApplyTime applyTime) {
        return applyTimeMapper.insertSelective(applyTime);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(ApplyTime applyTime) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(ApplyTime applyTime) {
        return 0;
    }

    @Override
    public ApplyTime getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<ApplyTime> findByDynamicParam(ApplyTime applyTime) {
        return null;
    }
}
