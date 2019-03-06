package com.sicmed.remote.live.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class LiveListBean {
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

    private String liveBranchName;

    private String liveHospitalName;

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

}
