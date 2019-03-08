package com.sicmed.remote.live.entity;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.sicmed.remote.meeting.bean.MeetingBean;
import lombok.Data;

import java.util.Date;

@Data
public class Live {
    private String id;

    private String liveId;

    private String liveName;

    private String liveNumber;

    private String liveCoverUrl;

    private String liveDescription;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Date liveStartTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Date liveEndTime;

    private String liveBranch;

    private String liveHospital;

    private String livePassword;

    private String liveType;

    private String livePeriod;

    private String liveUrl;

    private String liveScope;

    private String liveUser;

    private Boolean liveMute;

    private Boolean liveRecord;

    private Boolean liveStart;

    private String liveJson;

    private String createUser;

    private Date createTime;

    private String updateUser;

    private Date updateTime;

    private String deleteUser;

    private Date deleteTime;

    private String delFlag;

    public void setMeetingBean(MeetingBean meetingBean){
        this.liveUrl = meetingBean.getLiveUrl();
        this.livePassword = meetingBean.getLivePwd();
        this.liveNumber = meetingBean.getAppointmentNumber();
        this.liveUser = meetingBean.getAccount();
        this.liveId = meetingBean.getAppointmentId();
        this.liveJson = JSONObject.toJSONString(meetingBean);
    }

}