package com.sicmed.remote.socket.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class NewMessageBean {

    /**  id */
    private String id;

    /** 01视频会诊  02课程更新  03直播预报  04直播提醒 05系统消息 */
    private String msgType;

    /** 标题 */
    private String msgTitle;

    /** 详情 */
    private String msgDetails;

    /** 0未读 1已读 */
    private String readSign;

    private String aboutId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm",timezone = "GMT+8")
    private Date createTime;  // 创建时间

}
