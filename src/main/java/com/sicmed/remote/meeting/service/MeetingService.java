package com.sicmed.remote.meeting.service;

import com.sicmed.remote.OtherConfiguration.StorageRedisKey;
import com.sicmed.remote.meeting.bean.MeetingBean;
import com.sicmed.remote.meeting.entity.Meeting;
import com.sicmed.remote.meeting.entity.RequestMeeting;
import com.sicmed.remote.meeting.mapper.MeetingMapper;
import com.sicmed.remote.meeting.util.YqyMeetingUtils;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.mapper.ApplyFormMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MeetingService {

    @Autowired
    private MeetingMapper meetingMapper;
    @Autowired
    private ApplyFormMapper applyFormMapper;

    /**
     * 根据 视频会诊ID 创建 会议
     */
    public void createMeeting(String applyFormId) throws Exception {
        //1.查询视频会诊信息
        ApplyForm applyForm = applyFormMapper.selectByPrimaryKey(applyFormId);

        this.createMeeting(applyForm);
    }


    /**
     * 根据 视频会诊记录 创建 会议
     */
    @Transactional
    public void createMeeting(ApplyForm applyForm) throws Exception {

        //1.创建视频会议
        Meeting meeting = new Meeting();
        meeting.setApplyForm(applyForm);

        //2.调用云启云视频会议 接口 创建视频会议
        RequestMeeting requestMeeting = new RequestMeeting();
        requestMeeting.setMeetingInfo(meeting);

        MeetingBean meetingBean = YqyMeetingUtils.createMeeting(requestMeeting);

        //3.云启云视频会议 接口 调用 结果处理
        meeting.setMeetingBean(meetingBean);

        //4.视频会议信息插入数据库
        meetingMapper.insertSelective(meeting);

        //5.调用 定时 提醒服务
        StorageRedisKey storageRedisKey = new StorageRedisKey();
        storageRedisKey.timeBoundKey(applyForm.getId());

    }

    /**
     * 根据 视频会诊ID 修改 会议
     */
    public void updateMeeting(String applyFormId) throws Exception {
        //1.查询视频会诊信息
        ApplyForm applyForm = applyFormMapper.selectByPrimaryKey(applyFormId);

        this.updateMeeting(applyForm);
    }

    /**
     * 根据 视频会诊记录 修改 会议
     */
    public void updateMeeting(ApplyForm applyForm) throws Exception {
        //1.创建视频会议
        Meeting meeting = new Meeting();
        meeting.setApplyForm(applyForm);

        //2.调用云启云视频会议 接口 创建视频会议
        RequestMeeting requestMeeting = new RequestMeeting();
        requestMeeting.setMeetingInfo(meeting);

        MeetingBean meetingBean = YqyMeetingUtils.updateMeeting(requestMeeting);

        //3.云启云视频会议 接口 调用 结果处理
        meeting.setMeetingBean(meetingBean);

        //4.视频会议信息插入数据库
        meetingMapper.updateByPrimaryKeySelective(meeting);

        //5.调用 定时 提醒服务
        StorageRedisKey storageRedisKey = new StorageRedisKey();
        storageRedisKey.timeBoundKey(applyForm.getId());
    }
}
