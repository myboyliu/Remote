package com.sicmed.remote.web.entity;

import lombok.Data;


/**
 * @author Administrator
 * @version 1.0
 */
@Data
public class CasePatient extends BaseEntity {
    private String id;

    private String patientNumber;

    private String patientName;

    private String patientCard;

    private String patientPhone;

    private String patientBirthday;

    private String patientAge;

    private String patientSex;

    private String patientHeight;

    private String patientWeight;

    private String cityId;

    private String detailAddress;

    private String educationId;

    private String professionId;

    private String nationId;

    private String bloodGroupId;

}