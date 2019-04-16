package com.sicmed.remote.meeting.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.meeting.bean.MasterDoctorBean;
import com.sicmed.remote.meeting.bean.MeetingBean;
import com.sicmed.remote.meeting.entity.Meeting;
import com.sicmed.remote.meeting.entity.RequestMeeting;
import com.sicmed.remote.meeting.mapper.MeetingMapper;
import com.sicmed.remote.meeting.util.YqyMeetingUtils;
import com.sicmed.remote.task.RedisTimerService;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.mapper.ApplyFormMapper;
import com.sicmed.remote.web.mapper.ApplyTimeMapper;
import com.sicmed.remote.web.service.CaseConsultantService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class MeetingService {

    @Autowired
    private MeetingMapper meetingMapper;

    @Autowired
    private ApplyTimeMapper applyTimeMapper;

    @Autowired
    private ApplyFormMapper applyFormMapper;

    @Autowired
    private RedisTimerService redisTimerService;

    @Autowired
    private CaseConsultantService caseConsultantService;


    /**
     * 根据 视频会诊ID 创建 会议
     */
    public void createMeeting(String applyFormId) {
        //1.查询视频会诊信息
        ApplyTime applyTime = applyTimeMapper.getFinalTime(applyFormId);
        try {
            this.createMeeting(applyTime);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据 视频会诊ID 创建 会议
     */
    public void createMeeting(Meeting meeting) {

        meetingMapper.insertSelective(meeting);

    }

    /**
     * 根据 视频会诊记录 创建 会议
     */
    public void createMeeting(ApplyTime applyTime){
        log.debug("----------------------创建视频会议开始------------------------");

        //查询 主会诊医生信息
        MasterDoctorBean masterDoctorBean = applyFormMapper.getMasterDoctorById(applyTime.getApplyFormId());

        //1.创建视频会议
        Meeting meeting = meetingMapper.selectByPrimaryKey(applyTime.getApplyFormId());
        if (meeting == null) {
            meeting = new Meeting();
            meeting.setId(applyTime.getApplyFormId());
            meeting.setMeetMute(false);
            meeting.setMeetStart(false);
            meeting.setMeetRecord(false);
        }
        meeting.setApplyTime(applyTime);
        log.debug("----------------------调用云启云业务开始------------------------");
        //2.调用云启云视频会议 接口 创建视频会议
        RequestMeeting requestMeeting = new RequestMeeting();
        requestMeeting.setMeetingInfo(meeting);
        log.debug(masterDoctorBean.toString());
        requestMeeting.setMobile(masterDoctorBean.getDoctorPhone());
        requestMeeting.setRealName(masterDoctorBean.getDoctorName());
        MeetingBean meetingBean = YqyMeetingUtils.createMeeting(requestMeeting);
        log.debug("----------------------调用云启云业务结束------------------------");
        //3.云启云视频会议 接口 调用 结果处理
        meeting.setMeetingBean(meetingBean);
        //4.视频会议信息插入数据库
        meetingMapper.updateByPrimaryKeySelective(meeting);
        log.debug("----------------------创建定时任务开始------------------------");
        //5.调用 定时 提醒服务
        CaseConsultant caseConsultant = caseConsultantService.getByPrimaryKey(applyTime.getApplyFormId());
        String userListString = caseConsultant.getConsultantUserList();
        List<Map<String, String>> mapList = JSON.parseObject(userListString, new TypeReference<List<Map<String, String>>>() {
        }, Feature.OrderedField);
        JSONArray jsonArray = new JSONArray();
        jsonArray.add(caseConsultant.getApplyUserId());
        for (Map map : mapList) {
            jsonArray.add(map.get("doctorId"));
        }

        redisTimerService.createMeetingRemind(applyTime.getApplyFormId(), applyTime.getEventStartTime(), jsonArray);
        log.debug("----------------------创建定时任务结束------------------------");
        log.debug("----------------------创建视频会议结束------------------------");
    }

    /**
     * 根据 视频会诊ID 修改 会议
     */
    public void updateMeeting(String applyFormId) {

        //1.查询视频会诊信息
        ApplyTime applyTime = applyTimeMapper.getFinalTime(applyFormId);
        try {
            this.updateMeeting(applyTime);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据 视频会诊ID 修改 会议
     */
    public void updateMeeting(Meeting meeting) {
        Meeting m = meetingMapper.selectByPrimaryKey(meeting.getId());
        if (null == m) {
            meetingMapper.insertSelective(meeting);
        } else {
            meetingMapper.updateByPrimaryKeySelective(meeting);
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
        JSONArray jsonArray = new JSONArray();
        JSONObject jsonObject = new JSONObject();
        jsonArray.add(jsonObject);

        redisTimerService.createMeetingRemind(applyTime.getApplyFormId(), applyTime.getEventStartTime(), jsonArray);

    }
}
