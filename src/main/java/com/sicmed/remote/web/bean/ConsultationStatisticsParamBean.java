package com.sicmed.remote.web.bean;

import lombok.Data;

@Data
public class ConsultationStatisticsParamBean {

    private String startTime;

    private String endTime;

    private String hospitalId;

    private String applyStatus;

    private String groupByApplyHospital;

    private String groupByApplyBranch;

    private String groupByInviteBranch;

    private String groupByApplyUserSpecialistType;

    private String groupByInviteUserSpecialistType;

    private String groupByInviteHospital;

    private String groupByDay;

    private String isApply;

    private String isInvite;

}
