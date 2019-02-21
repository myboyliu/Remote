package com.sicmed.remote.web.bean;

import lombok.Data;

import java.io.Serializable;

@Data
public class ConsultationPriceStatisticsParamBean implements Serializable {

    private String startTime;

    private String endTime;

    private String hospitalId;

    private String sumByUserPrice;

    private String sumByTotalPrice;

    private String groupByApplyHospital;

    private String groupByApplyBranch;

    private String groupByInviteBranch;

    private String groupByApplyUser;

    private String groupByInviteUser;

    private String groupByInviteHospital;

    private String isApply;

    private String isInvite;
}
