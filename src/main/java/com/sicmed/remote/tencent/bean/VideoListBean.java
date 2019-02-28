package com.sicmed.remote.tencent.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class VideoListBean {
    private String id;
    private String videoName;
    private String videoDescribe;
    private String videoCoverUrl;
    private String videoFileId;
    private String hospitalName;
    private String branchName;
    private String playback;
    private String transCode;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private String uploadTime;
}
