package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplyTime extends BaseEntity {
    private String id;

    private String applyFormId;

    private Date eventStartTime;

    private Date eventEndTime;

    private String applyStatus;

}