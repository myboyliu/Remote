package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @program: tele-medicine
 * @description: 直播返回内容
 * @author: Xue0601
 * @create: 2018-10-30 10:41
 **/
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class YqyLiveBean implements Serializable {

    /**
     * 直播id
     */
    private String id;

    /**
     * 直播标题
     */
    private String liveName;

    /**
     * 直播医院
     */
    private String hospitalName;

    /**
     * 直播科室
     */
    private String deptName;

    /**
     * 直播室id
     */
    private String liveRoomId;

    /**
     * 直播密码
     */
    private String livePwd;

    /**
     * 直播地址
     */
    private String liveUrl;

    /**
     * 直播描述
     */
    private String liveDescribe;

    /**
     * 直播开始时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Date liveStartTime;

    /**
     * 直播结束时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date liveEndTime;

    /**
     * 直播类别id
     */
    private String liveClass;

    /**
     * 直播封面url
     */
    private String liveCoverUrl;

    /**
     * 关注量
     */
    private Integer followNum;

    /**
     * 是否关注
     */
    private boolean isFollow;

}