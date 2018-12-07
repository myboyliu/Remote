package com.sicmed.remote.web.entity;

import lombok.Data;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class UserDetail extends BaseEntity {
    private String id;

    private String userName;

    private String userAge;

    private String userSex;

    private String userAddress;

    private String userCardNumber;

    private String telephone;

    private String hospitalId;

    private String branchId;

    private String titleId;

    private String specialistTypeId;

    private String headImg;

    private String userResume;

    private String userStrong;

    private String needCaseType;

    private String consultationPicturePrice;

    private String consultationVideoPrice;

}