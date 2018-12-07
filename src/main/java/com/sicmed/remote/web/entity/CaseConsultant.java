package com.sicmed.remote.web.entity;

import java.math.BigDecimal;
import java.util.Date;

public class CaseConsultant extends BaseEntity {
    private String id;

    private String applyUserId;

    private String inviteUserId;

    private String consultantUserList;

    private Date consultantStartTime;

    private Date consultantEndTime;

    private String consultantReport;

    private String consultantFeedback;

    private BigDecimal consultantPrice;

    private BigDecimal hospitalPrice;

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

    public String getApplyUserId() {
        return applyUserId;
    }

    public void setApplyUserId(String applyUserId) {
        this.applyUserId = applyUserId == null ? null : applyUserId.trim();
    }

    public String getInviteUserId() {
        return inviteUserId;
    }

    public void setInviteUserId(String inviteUserId) {
        this.inviteUserId = inviteUserId == null ? null : inviteUserId.trim();
    }

    public String getConsultantUserList() {
        return consultantUserList;
    }

    public void setConsultantUserList(String consultantUserList) {
        this.consultantUserList = consultantUserList == null ? null : consultantUserList.trim();
    }

    public Date getConsultantStartTime() {
        return consultantStartTime;
    }

    public void setConsultantStartTime(Date consultantStartTime) {
        this.consultantStartTime = consultantStartTime;
    }

    public Date getConsultantEndTime() {
        return consultantEndTime;
    }

    public void setConsultantEndTime(Date consultantEndTime) {
        this.consultantEndTime = consultantEndTime;
    }

    public String getConsultantReport() {
        return consultantReport;
    }

    public void setConsultantReport(String consultantReport) {
        this.consultantReport = consultantReport == null ? null : consultantReport.trim();
    }

    public String getConsultantFeedback() {
        return consultantFeedback;
    }

    public void setConsultantFeedback(String consultantFeedback) {
        this.consultantFeedback = consultantFeedback == null ? null : consultantFeedback.trim();
    }

    public BigDecimal getConsultantPrice() {
        return consultantPrice;
    }

    public void setConsultantPrice(BigDecimal consultantPrice) {
        this.consultantPrice = consultantPrice;
    }

    public BigDecimal getHospitalPrice() {
        return hospitalPrice;
    }

    public void setHospitalPrice(BigDecimal hospitalPrice) {
        this.hospitalPrice = hospitalPrice;
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