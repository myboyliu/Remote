package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplyForm extends BaseEntity {

    private String id;

    private String applyNumber;

    @NotBlank(message = "caseRecordId is null")
    @Size(min = 32, max = 32, message = "caseRecordId 长度不合规")
    private String caseRecordId;

    private String caseSummary;

    private String applyUserSummary;

    private String inviteUserSummary;


    private String applyUserId;

    @NotBlank(message = "applyHospitalId is null")
    @Size(min = 32, max = 32, message = "applyHospitalId 长度不合规")
    private String applyHospitalId;

    @Size(min = 32, max = 32, message = "inviteUserId 长度不合规")
    private String inviteUserId;

    @NotBlank(message = "inviteHospitalId is null")
    @Size(min = 32, max = 32, message = "inviteHospitalId 长度不合规")
    private String inviteHospitalId;

    @NotBlank(message = "applyBranchId is null")
    @Size(min = 32, max = 32, message = "applyBranchId 长度不合规")
    private String applyBranchId;

    private Date consultantApplyTime;

    private String applyStatus;

    private String applyType;

    private String applyRemark;

}