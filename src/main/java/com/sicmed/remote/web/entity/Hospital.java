package com.sicmed.remote.web.entity;

import lombok.Data;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class Hospital extends BaseEntity {
    private String id;

    private String hospitalName;

    private String hospitalAlias;

    private String hospitalInform;

    private String hospitalGrade;

    private Integer hospitalWeight;

    private String typeId;

    private String cityId;

    private String activationFlag;

    private String orderWeight;

}