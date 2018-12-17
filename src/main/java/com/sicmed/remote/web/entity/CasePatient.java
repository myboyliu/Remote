package com.sicmed.remote.web.entity;

import lombok.Data;

import javax.validation.constraints.*;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
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

    @Min(value = 0, message = "年龄不能小于0岁")
    @Max(value = 127, message = "年龄不能超过127")
    private Integer patientAge;

    private String patientSex;

    @Min(value = 10, message = "身高不能小于10cm")
    @Max(value = 300, message = "身高不能超过275cm 吉尼斯认证世界最高272cm")
    private Integer patientHeight;

    @Min(value = 500, message = "体重不能小于0.5kg 已知存活最轻婴儿为0.5kg")
    @Max(value = 300000, message = "体重不能超过300kg")
    private Integer patientWeight;

    private String cityId;

    @NotBlank(message = "常住城市为空")
    @Size(min = 2, max = 50, message = "常住城市长度不合规")
    private String detailAddress;

    private String educationId;

    private String professionId;

    private String nationId;

    private String bloodGroupId;

}