package com.sicmed.remote.web.entity;

import lombok.Data;

import java.util.Date;

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

    private String caseDiagnosis;

}