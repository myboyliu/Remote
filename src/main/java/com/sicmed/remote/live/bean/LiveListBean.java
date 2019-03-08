package com.sicmed.remote.live.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
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

    private String liveBranchId;

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

    private String subscriptionNumber;

    private String curriculumScheduleId;

}
