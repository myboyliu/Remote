package com.sicmed.remote.web.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class CaseRecord extends BaseEntity implements Serializable {
    private String id;

    private String caseNumber;

    private String patientId;

    private String mainSuit;

    private String pastMedicalHistory;

    private String existingMedicalHistory;

    private String allergicHistory;

    private String caseDiagnosis;

}