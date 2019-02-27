package com.sicmed.remote.tencent.bean;

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
}
