package com.sicmed.remote.web.entity;

import lombok.Data;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class CaseContentType extends BaseEntity {
    private String id;

    private String parentId;

    private String caseTypeName;

    private String caseNumber;

    private Integer caseTypeWeight;


}