package com.sicmed.remote.web.entity;

import java.util.Date;

public class ApplyForm extends BaseEntity {
    private String id;

    private String applyNumber;

    private String caseRecordId;

    private String caseSummary;

    private String applyUserSummary;

    private String inviteUserSummary;

    private String applyUserId;

    private String applyManagerId;

    private String inviteUserId;

    private String inviteManagerId;

    private String applyBranchId;

    private Date consultantApplyTime;

    private String applyStatus;

    private String applyType;

    private String applyRemark;

    private Date createTime;

    private String createUser;

    private Date updateTime;

    private String updateUser;

    private Date deleteTime;

    private String deleteUser;

    private String delFlag;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getApplyNumber() {
        return applyNumber;
    }

    public void setApplyNumber(String applyNumber) {
        this.applyNumber = applyNumber == null ? null : applyNumber.trim();
    }

    public String getCaseRecordId() {
        return caseRecordId;
    }

    public void setCaseRecordId(String caseRecordId) {
        this.caseRecordId = caseRecordId == null ? null : caseRecordId.trim();
    }

    public String getCaseSummary() {
        return caseSummary;
    }

    public void setCaseSummary(String caseSummary) {
        this.caseSummary = caseSummary == null ? null : caseSummary.trim();
    }

    public String getApplyUserSummary() {
        return applyUserSummary;
    }

    public void setApplyUserSummary(String applyUserSummary) {
        this.applyUserSummary = applyUserSummary == null ? null : applyUserSummary.trim();
    }

    public String getInviteUserSummary() {
        return inviteUserSummary;
    }

    public void setInviteUserSummary(String inviteUserSummary) {
        this.inviteUserSummary = inviteUserSummary == null ? null : inviteUserSummary.trim();
    }

    public String getApplyUserId() {
        return applyUserId;
    }

    public void setApplyUserId(String applyUserId) {
        this.applyUserId = applyUserId == null ? null : applyUserId.trim();
    }

    public String getApplyManagerId() {
        return applyManagerId;
    }

    public void setApplyManagerId(String applyManagerId) {
        this.applyManagerId = applyManagerId == null ? null : applyManagerId.trim();
    }

    public String getInviteUserId() {
        return inviteUserId;
    }

    public void setInviteUserId(String inviteUserId) {
        this.inviteUserId = inviteUserId == null ? null : inviteUserId.trim();
    }

    public String getInviteManagerId() {
        return inviteManagerId;
    }

    public void setInviteManagerId(String inviteManagerId) {
        this.inviteManagerId = inviteManagerId == null ? null : inviteManagerId.trim();
    }

    public String getApplyBranchId() {
        return applyBranchId;
    }

    public void setApplyBranchId(String applyBranchId) {
        this.applyBranchId = applyBranchId == null ? null : applyBranchId.trim();
    }

    public Date getConsultantApplyTime() {
        return consultantApplyTime;
    }

    public void setConsultantApplyTime(Date consultantApplyTime) {
        this.consultantApplyTime = consultantApplyTime;
    }

    public String getApplyStatus() {
        return applyStatus;
    }

    public void setApplyStatus(String applyStatus) {
        this.applyStatus = applyStatus == null ? null : applyStatus.trim();
    }

    public String getApplyType() {
        return applyType;
    }

    public void setApplyType(String applyType) {
        this.applyType = applyType == null ? null : applyType.trim();
    }

    public String getApplyRemark() {
        return applyRemark;
    }

    public void setApplyRemark(String applyRemark) {
        this.applyRemark = applyRemark == null ? null : applyRemark.trim();
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser == null ? null : createUser.trim();
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser == null ? null : updateUser.trim();
    }

    public Date getDeleteTime() {
        return deleteTime;
    }

    public void setDeleteTime(Date deleteTime) {
        this.deleteTime = deleteTime;
    }

    public String getDeleteUser() {
        return deleteUser;
    }

    public void setDeleteUser(String deleteUser) {
        this.deleteUser = deleteUser == null ? null : deleteUser.trim();
    }

    public String getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(String delFlag) {
        this.delFlag = delFlag == null ? null : delFlag.trim();
    }
}