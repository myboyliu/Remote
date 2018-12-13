package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserCaseType extends BaseEntity implements Serializable {
    private String id;

    private String userId;

    private String caseTypeId;

}