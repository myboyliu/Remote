package com.sicmed.remote.web.bean;

import lombok.Data;

import java.io.Serializable;

@Data
public class ConsultationPriceStatisticsBean implements Serializable {
    private String applyHospitalName;
    private String applyCustomBranchName;
    private String applyUserName;
    private String inviteHospitalName;
    private String inviteCustomBranchName;
    private String inviteUserName;
    private String sumPrice;

}
