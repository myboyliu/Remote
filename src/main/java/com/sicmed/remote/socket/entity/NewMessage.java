package com.sicmed.remote.socket.entity;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.sicmed.remote.web.entity.PageEntity;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class NewMessage extends PageEntity implements Serializable {
    /**  */
    private String id;

    /** 01视频会诊  02课程更新  03直播预报  04直播提醒 05系统消息 */
    private String msgType;

    /** 标题 */
    private String msgTitle;

    /** 详情 */
    private String msgDetails;

    /** 0未读 1已读 */
    private String readSign;

    /** 发送用户id */
    private String applyFormId;

    /** 消息id*/
    private String msgId;

    /** 接收用户Id */
    private String inviteUserId;

    /**  */
    private String createUser;

    /**  */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date createTime;

    /**  */
    private Date updateTime;

    /**  */
    private String updateUser;

    /**  */
    private Date deleteTime;

    /**  */
    private String deleteUser;

    /** 删除标记 */
    private String delFlag;

    public void setJSONObject(JSONObject jsonObject){
        this.id = jsonObject.getString("id");
    }

}