package com.sicmed.remote.web.entity;

import lombok.Data;

import java.io.Serializable;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class UserSign extends BaseEntity implements Serializable {
    private String id;

    private String signature;

    private String idCardFront;

    private String idCardContrary;

    private String doctorCardFront;

    private String doctorCardContrary;

    private String workCard;

    private String approveStatus;

}