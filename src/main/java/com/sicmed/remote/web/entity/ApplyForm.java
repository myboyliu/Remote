package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    private String applySummary;

    private String inviteSummary;


    private String applyUserId;

    //    @NotBlank(message = "applyHospitalId is null")
//    @Size(min = 32, max = 32, message = "applyHospitalId 长度不合规")
    private String applyHospitalId;

    @Size(min = 32, max = 32, message = "inviteUserId 长度不合规")
    private String inviteUserId;

    @NotBlank(message = "inviteHospitalId is null")
    @Size(min = 32, max = 32, message = "inviteHospitalId 长度不合规")
    private String inviteHospitalId;

    @NotBlank(message = "inviteBranchId is null")
    @Size(max = 32, min = 32, message = "inviteBranchId 长度不合规")
    private String inviteBranchId;

    //    @NotBlank(message = "applyBranchId is null")
//    @Size(min = 32, max = 32, message = "applyBranchId 长度不合规")
    private String applyBranchId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date consultantApplyTime;

    private String applyStatus;

    private String applyType;

    private String applyRemark;

    //拒绝原因
    private String refuseRemark;

    private String applyUrgent;

    private String mdtFlag;
}