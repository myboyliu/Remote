package com.sicmed.remote.meeting.entity;

import lombok.Data;

import java.io.Serializable;

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

    private String startTime;           //会诊开始时间

    private String endTime;             //会诊结束时间(通过它计算时长)

    private int concurrentNum;          //所需并发数

}
