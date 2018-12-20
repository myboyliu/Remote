package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class YqyLive extends BaseEntity {
    /** 直播id */
    private String id;

    /** 直播标题 */
    private String liveName;

    /** 管理直播地址 */
    private String adminUrl;

    /** 直播管理密码 */
    private String adminPwd;

    /** 直播室id */
    private String liveRoomId;

    /** 直播科室 */
    private CustomBranch customBranch;

    /** 直播观看地址 */
    private String liveUrl;

    /** 直播描述 */
    private String liveDescribe;

    /** 直播开始时间 */
    private Date liveStartTime;

    /** 直播结束时间 */
    private Date liveEndTime;

    /** 直播类别 */
    private String liveClass;

    /** 直播封面url */
    private String liveCoverUrl;

    /** 直播创建人 */
    private String liveUserId;

    /** 关注量 */
    private Integer followNum;

  }