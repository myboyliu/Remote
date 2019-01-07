package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CaseConsultant extends BaseEntity {
    private String id;

    private String applyUserId;

    private String inviteUserId;

    private String consultantUserList;

    private Date consultantStartTime;

    private Date consultantEndTime;

    private String consultantReport;

    private String consultantFeedback;

    private BigDecimal consultantPrice;

    private BigDecimal hospitalPrice;

}