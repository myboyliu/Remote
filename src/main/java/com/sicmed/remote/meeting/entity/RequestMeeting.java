package com.sicmed.remote.meeting.entity;

import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.live.entity.Live;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.Date;

@Slf4j
@Data
public class RequestMeeting implements Serializable {

    private String mobile;              //手机号

    private String realName;            //真实名

    private String appointmentName;     //会诊室名称

    private String appointmentId;       //会议id

    private String appointmentPeriod;   //会议时长，单位：小时 ，ps: 1.2

    private String appointmentNumber;   //会议室号码

    private String appointmentType;     //会议类型  1：预约会议

    private String hostPwd;             //会议密码

    private boolean isLive;             //是否开启直播

    private boolean isMute;             //参会者进入时是否静音

    private boolean isRecord;           //是否开启录制

    private String livePwd;             //直播密码

    private Date startTime;           //会诊开始时间

    private Date endTime;             //会诊结束时间(通过它计算时长)

    private int concurrentNum;          //所需并发数

    public RequestMeeting() {
        this.mobile = UserTokenManager.getCurrentUser().getUserPhone();
        this.realName = UserTokenManager.getCurrentUser().getUserName();
    }

    public void setLive(Live live) {
        log.debug(live.toString());
        this.appointmentId = live.getLiveId() != null ? live.getLiveId() : null;
        this.appointmentName = live.getLiveName();
        this.startTime = live.getLiveStartTime();
        this.endTime = live.getLiveEndTime();
        this.isLive = live.getLiveStart();
        this.isMute = live.getLiveMute();
        this.isRecord = live.getLiveRecord();
        this.concurrentNum = 1;
    }

    public void setMeetingInfo(Meeting meeting) {

        this.appointmentId = meeting.getMeetId() != null ? meeting.getMeetId() : null;
        this.appointmentName = meeting.getMeetName();
        this.startTime = meeting.getMeetStartTime();
        this.endTime = meeting.getMeetEndTime();
        this.isLive = meeting.getMeetStart();
        this.isMute = meeting.getMeetMute();
        this.isRecord = meeting.getMeetRecord();
        this.concurrentNum = 1;
    }
}
