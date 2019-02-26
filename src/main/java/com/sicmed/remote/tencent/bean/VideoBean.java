package com.sicmed.remote.tencent.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @program: tele-medicine
 * @description:
 * @author: Xue0601
 * @create: 2018-10-31 11:40
 **/
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VideoBean implements Serializable{

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

    /** 科室 */
    private String deptName;

    /** 转码后地址 */
    private String videoUrlTure;

    /** 医院 */
    private String hospitalName;

    /** 视频id */
    private String videoFileId;

    /** 时长 */
    private String timeLong;

}
