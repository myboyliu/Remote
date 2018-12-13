package com.sicmed.remote.web.entity;

import lombok.Data;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class UserSign extends BaseEntity {
    private String id;

    private String signature;

    private String idCardFront;

    private String idCardContrary;

    private String doctorCardFront;

    private String doctorCardContrary;

    private String workCard;

    private String approveStatus;

}