package com.sicmed.remote.web.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class ConsultationPriceRecord {
    private String id;

    private String consultationId;

    private String applyHospitalId;

    private String applyBranchId;

    private String applyUserId;

    private String inviteHospitalId;

    private String inviteBranchId;

    private String inviteUserId;

    private BigDecimal inviteUserPrice;

    private BigDecimal inviteHospitalPrice;

    private BigDecimal totalPrice;

    private String consultationType;

    private Date createTime;

    private String delFlag;


}