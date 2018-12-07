package com.sicmed.remote.web.entity;

import lombok.Data;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class Branch extends BaseEntity {
    private String id;

    private String parentId;

    private String branchName;

    private String branchNumber;

    private String branchGrade;

    private String branchInform;

    private Integer branchWeight;

    private String orderWeight;


}