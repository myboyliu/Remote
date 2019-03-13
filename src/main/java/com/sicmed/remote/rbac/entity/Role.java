package com.sicmed.remote.rbac.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class Role implements Serializable {
    private String id;

    private String parentId;

    private String roleName;

    private String description;

    private String crrateUser;

    private Date createTime;

    private String updateUser;

    private Date updateTime;

    private String deleteUser;

    private Date deleteTime;

    private String delFlag;


}