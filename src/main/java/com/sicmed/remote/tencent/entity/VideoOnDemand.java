package com.sicmed.remote.tencent.entity;

import com.sicmed.remote.web.entity.PageEntity;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class VideoOnDemand extends PageEntity implements Serializable {

    private String id;

    private String videoName;

    private String videoType;

    private String videoDescribe;

    private String videoUrl;

    private String videoCoverUrl;

    private Date uploadTime;

    private String uploadUser;

    private Integer playback;

    private String hospitalId;

    private String branchId;

    private String transCode;

    private String videoFileId;

    private String timeLong;

    private String createUser;

    private Date createTime;

    private String updateUser;

    private Date updateTime;

    private String deleteUser;

    private Date deleteTime;

    private String delFlag;

}