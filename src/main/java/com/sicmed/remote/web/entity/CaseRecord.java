package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CaseRecord extends BaseEntity {
    private String id;

    private String caseNumber;

    private String patientId;

    private String mainSuit;

    private String pastMedicalHistory;

    private String existingMedicalHistory;

    private String allergicHistory;

    @NotBlank(message = "caseDiagnosis is null")
    @Size(min = 2, max = 2550, message = "caseDiagnosis 长度不合规")
    private String caseDiagnosis;

    @Min(1)
    @Max(150)
    private Integer patientAge;

    @NotBlank
    private String patientSex;

    @Min(value = 10, message = "身高不能小于10cm")
    @Max(value = 300, message = "身高不能超过275cm 吉尼斯认证世界最高272cm")
    private Integer patientHeight;

    @Min(value = 500, message = "体重不能小于0.5kg 已知存活最轻婴儿为0.5kg")
    @Max(value = 300000, message = "体重不能超过300kg")
    private Integer patientWeight;

}