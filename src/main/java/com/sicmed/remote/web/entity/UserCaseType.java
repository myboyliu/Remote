package com.sicmed.remote.web.entity;

import lombok.Data;

import java.io.Serializable;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class UserCaseType extends BaseEntity implements Serializable {
    private String id;

    private String userId;

    private String caseTypeId;

}