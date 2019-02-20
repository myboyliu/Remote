package com.sicmed.remote.web.entity;

import java.util.Date;

public class ConsultationPriceRecord {
    private String id;

    private String consultationId;

    private String applyHospitalId;

    private String applyBranchId;

    private String applyUserId;

    private String inviteHospitalId;

    private String inviteBranchId;

    private String inviteUserId;

    private String inviteUserPrice;

    private String inviteHospitalPrice;

    private String totalPrice;

    private String consultationType;

    private Date createTime;

    private String delFlag;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(String consultationId) {
        this.consultationId = consultationId == null ? null : consultationId.trim();
    }

    public String getApplyHospitalId() {
        return applyHospitalId;
    }

    public void setApplyHospitalId(String applyHospitalId) {
        this.applyHospitalId = applyHospitalId == null ? null : applyHospitalId.trim();
    }

    public String getApplyBranchId() {
        return applyBranchId;
    }

    public void setApplyBranchId(String applyBranchId) {
        this.applyBranchId = applyBranchId == null ? null : applyBranchId.trim();
    }

    public String getApplyUserId() {
        return applyUserId;
    }

    public void setApplyUserId(String applyUserId) {
        this.applyUserId = applyUserId == null ? null : applyUserId.trim();
    }

    public String getInviteHospitalId() {
        return inviteHospitalId;
    }

    public void setInviteHospitalId(String inviteHospitalId) {
        this.inviteHospitalId = inviteHospitalId == null ? null : inviteHospitalId.trim();
    }

    public String getInviteBranchId() {
        return inviteBranchId;
    }

    public void setInviteBranchId(String inviteBranchId) {
        this.inviteBranchId = inviteBranchId == null ? null : inviteBranchId.trim();
    }

    public String getInviteUserId() {
        return inviteUserId;
    }

    public void setInviteUserId(String inviteUserId) {
        this.inviteUserId = inviteUserId == null ? null : inviteUserId.trim();
    }

    public String getInviteUserPrice() {
        return inviteUserPrice;
    }

    public void setInviteUserPrice(String inviteUserPrice) {
        this.inviteUserPrice = inviteUserPrice == null ? null : inviteUserPrice.trim();
    }

    public String getInviteHospitalPrice() {
        return inviteHospitalPrice;
    }

    public void setInviteHospitalPrice(String inviteHospitalPrice) {
        this.inviteHospitalPrice = inviteHospitalPrice == null ? null : inviteHospitalPrice.trim();
    }

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
        this.totalPrice = totalPrice == null ? null : totalPrice.trim();
    }

    public String getConsultationType() {
        return consultationType;
    }

    public void setConsultationType(String consultationType) {
        this.consultationType = consultationType == null ? null : consultationType.trim();
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(String delFlag) {
        this.delFlag = delFlag == null ? null : delFlag.trim();
    }
}