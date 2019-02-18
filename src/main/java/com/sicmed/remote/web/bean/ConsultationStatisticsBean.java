package com.sicmed.remote.web.bean;

import lombok.Data;

import java.io.Serializable;

@Data
public class ConsultationStatisticsBean implements Serializable {

    private String applyHospitalName;
    private String inviteHospitalName;
    private String applyCustomBranchName;
    private String inviteCustomBranchName;
    private String applyUserSpecialistTypeName;
    private String inviteUserSpecialistTypeName;
    private String groupCount;

}
