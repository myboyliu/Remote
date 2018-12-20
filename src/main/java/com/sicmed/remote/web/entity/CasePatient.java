package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import javax.validation.constraints.*;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CasePatient extends BaseEntity {
    private String id;

    private String patientNumber;

    @NotBlank(message = "patientName is null")
    @Size(min = 2, max = 32, message = "patientName 长度不合规")
    private String patientName;

    @NotBlank(message = "patientCard is null")
    @Size(min = 15, max = 18, message = "身份证不合规,长度有误")
    private String patientCard;

    @NotBlank(message = "patientPhone is null")
    @Size(min = 11, max = 11, message = "patientPhone 长度不合规")
    private String patientPhone;

    private String patientBirthday;

    private String cityId;

    @NotBlank(message = "常住城市为空")
    @Size(min = 2, max = 50, message = "常住城市长度不合规")
    private String detailAddress;

    private String educationId;

    private String professionId;

    private String nationId;

    private String bloodGroupId;

}