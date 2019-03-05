package com.sicmed.remote.meeting.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MeetingBean implements Serializable {

    private String account;             //组会人账号

    private String accountPwd;          //组会人密码（第一次创建会议是才会返回）

    private String appointmentId;       //会议日程id

    private String appointmentName;     //会诊室名称

    private String appointmentNumber;   //会诊室号码

    private double appointmentPeriod;   //会议时长

    private String livePwd;             //直播密码

    private String hostPwd;             //会议密码

    private String liveUrl;             //直播链接

    private Long startTime;           //会诊开始时间

    private String webrtcUrl;           //会议链接

    private String cid;                 //会议id

}
