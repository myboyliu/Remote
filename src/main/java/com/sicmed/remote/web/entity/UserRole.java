package com.sicmed.remote.web.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class UserRole implements Serializable {
    private String id;

    private String userId;

    private String roleId;

    private String createUser;

    private Date createTime;

    private String updateUser;

    private Date updateTime;

    private String deleteUser;

    private Date deleteTime;

    private String delFlag;


}