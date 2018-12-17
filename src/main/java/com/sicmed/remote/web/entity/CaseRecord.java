package com.sicmed.remote.web.entity;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class CaseRecord extends BaseEntity {
    private String id;

    private String caseNumber;

    private String patientId;

    private String mainSuit;

    private String pastMedicalHistory;

    private String existingMedicalHistory;

    private String allergicHistory;

    @NotBlank(message = "caseDiagnosis is null")
    @Size(min = 2, max = 255, message = "caseDiagnosis 长度不合规")
    private String caseDiagnosis;

}