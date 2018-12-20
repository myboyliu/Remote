package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TencentVideo extends BaseEntity {
    /** 点播表id */
    private String id;

    /** 课程标题 */
    private String videoName;

    /** 课程分类 */
    private String videoClass;

    /** 课程描述 */
    private String videoDescribe;

    /** 原视频地址 */
    private String videoUrl;

    /** 视频封面 */
    private String videoCoverUrl;

    /** 上传时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date uploadTime;

    /** 上传人 */
    private String uploadUser;

    /** 播放量 */
    private Integer playback;

    /** 医院科室 */
    private CustomBranch customBranch;

    /** 转码后地址 */
    private String videoUrlTrue;

    /** 转码标记(0:转码中,1:已转码) */
    private String transCode;

    /** 视频id */
    private String videoFileId;

    /** 时长 */
    private String timeLong;

  }

