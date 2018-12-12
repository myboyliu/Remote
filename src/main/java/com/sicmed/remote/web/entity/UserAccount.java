package com.sicmed.remote.web.entity;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.rmi.MarshalException;
import java.util.Date;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class UserAccount extends BaseEntity {
    private String id;

    @NotBlank(message = "手机号不能为空")
    @Size(max = 11, min = 11, message = "手机号长度错误")
    private String userPhone;

    @NotBlank(message = "密码不能为空")
    @Size(min = 8,max = 16,message = "密码长度应在8-16位之间,必须包含英文,数字,下划线中的两种")
    private String userPassword;

    private String salt;

    private String createIp;

    private Date lastLoginTime;

    private String lastLoginIp;

}