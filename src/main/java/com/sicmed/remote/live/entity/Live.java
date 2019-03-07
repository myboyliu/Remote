package com.sicmed.remote.live.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
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


}