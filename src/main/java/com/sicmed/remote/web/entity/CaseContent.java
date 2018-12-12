package com.sicmed.remote.web.entity;

import lombok.Data;

import java.io.Serializable;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class CaseContent extends BaseEntity implements Serializable {
    private String id;

    private String recordId;

    private String contentTypeId;

    private String contentPath;

    private Integer orderWeight;

}