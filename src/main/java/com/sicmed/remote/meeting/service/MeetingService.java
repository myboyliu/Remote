package com.sicmed.remote.meeting.service;

import com.sicmed.remote.OtherConfiguration.StorageRedisKey;
import com.sicmed.remote.meeting.bean.MeetingBean;
import com.sicmed.remote.meeting.entity.Meeting;
import com.sicmed.remote.meeting.entity.RequestMeeting;
import com.sicmed.remote.meeting.mapper.MeetingMapper;
import com.sicmed.remote.meeting.util.YqyMeetingUtils;
import com.sicmed.remote.task.RedisTimerService;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.mapper.ApplyFormMapper;
import com.sicmed.remote.web.mapper.ApplyTimeMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class MeetingService {

    @Autowired
    private MeetingMapper meetingMapper;

    @Autowired
    private ApplyTimeMapper applyTimeMapper;

    @Autowired
    private RedisTimerService redisTimerService;

    /**
     * 根据 视频会诊ID 创建 会议
     */
    public void createMeeting(String applyFormId){
        //1.查询视频会诊信息
        ApplyTime applyTime = applyTimeMapper.getFinalTime(applyFormId);
        try {
            this.createMeeting(applyTime);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 根据 视频会诊记录 创建 会议
     */
    public void createMeeting(ApplyTime applyTime) throws Exception {
        log.debug("----------------------创建视频会议开始------------------------");
        //1.创建视频会议
        Meeting meeting = new Meeting();
        meeting.setApplyTime(applyTime);
        log.debug("----------------------调用云启云业务开始------------------------");
        //2.调用云启云视频会议 接口 创建视频会议
        RequestMeeting requestMeeting = new RequestMeeting();
        requestMeeting.setMeetingInfo(meeting);

        MeetingBean meetingBean = YqyMeetingUtils.createMeeting(requestMeeting);
        log.debug("----------------------调用云启云业务结束------------------------");
        //3.云启云视频会议 接口 调用 结果处理
        meeting.setMeetingBean(meetingBean);
        //4.视频会议信息插入数据库
        meetingMapper.insertSelective(meeting);
        log.debug("----------------------创建定时任务开始------------------------");
        //5.调用 定时 提醒服务
        redisTimerService.createVideoRemind(applyTime.getApplyFormId(),applyTime.getEventStartTime());
        log.debug("----------------------创建定时任务结束------------------------");
        log.debug("----------------------创建视频会议结束------------------------");
    }

    /**
     * 根据 视频会诊ID 修改 会议
     */
    public void updateMeeting(String applyFormId){
        //1.查询视频会诊信息
        ApplyTime applyTime = applyTimeMapper.getFinalTime(applyFormId);
        try {
            this.updateMeeting(applyTime);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据 视频会诊记录 修改 会议
     */
    public void updateMeeting(ApplyTime applyTime) throws Exception {
        //1.创建视频会议
        Meeting meeting = new Meeting();
        meeting.setApplyTime(applyTime);

        //2.调用云启云视频会议 接口 创建视频会议
        RequestMeeting requestMeeting = new RequestMeeting();
        requestMeeting.setMeetingInfo(meeting);

        MeetingBean meetingBean = YqyMeetingUtils.updateMeeting(requestMeeting);

        //3.云启云视频会议 接口 调用 结果处理
        meeting.setMeetingBean(meetingBean);

        //4.视频会议信息插入数据库
        meetingMapper.updateByPrimaryKeySelective(meeting);

        //5.调用 定时 提醒服务
        redisTimerService.createVideoRemind(applyTime.getApplyFormId(),applyTime.getEventStartTime());

    }
}
