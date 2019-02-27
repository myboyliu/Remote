package com.sicmed.remote.yunqiyun.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

/**
 * @program: tele-medicine
 * @description: 直播信息
 * @author: Xue0601
 * @create: 2018-11-23 18:11
 **/
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LiveInfoBean implements Serializable{

    private String id;

    private String username;

    private String adminUrl;

    private String adminPwd;

    private String liveUrl;

}
