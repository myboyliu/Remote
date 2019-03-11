package com.sicmed.remote.meeting.entity;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.meeting.bean.MeetingBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class Meeting implements Serializable {
    private String id;

    private String meetId;

    private String meetName;

    private String meetNumber;

    private String meetCoverUrl;

    private String meetDescription;

    private Date meetStartTime;

    private Date meetEndTime;

    private String meetUser;

    private String meetBranch;

    private String meetHospital;

    private String meetUrl;

    private String meetPassword;

    private String meetType;

    private String meetPeriod;

    private String meetScope;

    private Boolean meetMute;

    private Boolean meetRecord;

    private Boolean meetStart;

    private String meetJson;

    private Integer subscriptionNumber;

    private String createUser;

    private Date createTime;

    private String updateUser;

    private Date updateTime;

    private String deleteUser;

    private Date deleteTime;

    private String delFlag;


    public void setApplyTime(ApplyTime applyTime) {
        this.meetName = applyTime.getApplyFormId();
        this.meetStartTime = applyTime.getEventStartTime();
        this.meetEndTime = applyTime.getEventEndTime();
        this.meetMute = false;
        this.meetRecord = false;
        this.meetStart = false;

    }

    public void setMeetingBean(MeetingBean meetingBean) {
        this.meetUrl = meetingBean.getWebrtcUrl();
        this.meetPassword = meetingBean.getHostPwd();
        this.meetNumber = meetingBean.getAppointmentNumber();
        this.meetUser = meetingBean.getAccount();
        this.meetId = meetingBean.getAppointmentId();
        this.meetJson = JSONObject.toJSONString(meetingBean);
    }
}