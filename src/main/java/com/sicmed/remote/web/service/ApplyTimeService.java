package com.sicmed.remote.web.service;

import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.bean.ApplyTimeBean;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.mapper.ApplyTimeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

    // 由已排期的applyFormId获取对应的applyTime
    public ApplyTime getByApplyFormId(String applyFormId) {
        return applyTimeMapper.getByApplyFormId(applyFormId);
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

    public int updateReferralTime(String applyFormId, String inquiryDatetime, String applyStatus) {
        applyTimeMapper.delByApplyForm(applyFormId);
        //4.添加新的转诊时间
        Date date = YtDateUtils.stringToDate(inquiryDatetime);
        LinkedHashMap<String, String> resultMap = new LinkedHashMap<>();
        resultMap.put(YtDateUtils.dateToString(YtDateUtils.parmDateBegin(date)), YtDateUtils.dateToString(YtDateUtils.intradayEnd(date)));
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setCreateUser(UserTokenManager.getCurrentUserId());
        applyTimeBean.setStartEndTime(resultMap);
        applyTimeBean.setApplyStatus(applyStatus);
        return applyTimeMapper.insertStartEndTimes(applyTimeBean);
    }

    public int updateMeetingTime(String applyFormId, Map<String, String> meetingTimeMap,String applyStatus) {
        applyTimeMapper.delByApplyForm(applyFormId);
        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyFormId);
        applyTimeBean.setStartEndTime(meetingTimeMap);
        applyTimeBean.setCreateUser(UserTokenManager.getCurrentUserId());
        applyTimeBean.setApplyStatus(applyStatus);
        return applyTimeMapper.insertStartEndTimes(applyTimeBean);
    }
}
