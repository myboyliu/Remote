package com.sicmed.remote.web.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class ApplyForm extends BaseEntity implements Serializable {

    private String id;

    private String applyNumber;

    private String caseRecordId;

    private String caseSummary;

    private String applyUserSummary;

    private String inviteUserSummary;

    private String applyUserId;

    private String applyManagerId;

    private String inviteUserId;

    private String inviteManagerId;

    private String applyBranchId;

    private Date consultantApplyTime;

    private String applyStatus;

    private String applyType;

    private String applyRemark;

}