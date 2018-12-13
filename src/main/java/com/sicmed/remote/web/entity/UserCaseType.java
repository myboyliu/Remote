package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserCaseType extends BaseEntity{
    private String id;

    private String userId;

    private String caseTypeId;

}