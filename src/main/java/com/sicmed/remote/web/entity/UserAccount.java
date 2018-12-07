package com.sicmed.remote.web.entity;

import lombok.Data;

import java.util.Date;
/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class UserAccount extends BaseEntity {
    private String id;

    private String userPhone;

    private String userPassword;

    private String salt;

    private String createIp;

    private Date lastLoginTime;

    private String lastLoginIp;

}