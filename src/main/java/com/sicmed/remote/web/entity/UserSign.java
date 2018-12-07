package com.sicmed.remote.web.entity;

import java.util.Date;

public class UserSign {
    private String id;

    private String signature;

    private String idCardFront;

    private String idCardContrary;

    private String doctorCardFront;

    private String doctorCardContrary;

    private String workCard;

    private String approveStatus;

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

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature == null ? null : signature.trim();
    }

    public String getIdCardFront() {
        return idCardFront;
    }

    public void setIdCardFront(String idCardFront) {
        this.idCardFront = idCardFront == null ? null : idCardFront.trim();
    }

    public String getIdCardContrary() {
        return idCardContrary;
    }

    public void setIdCardContrary(String idCardContrary) {
        this.idCardContrary = idCardContrary == null ? null : idCardContrary.trim();
    }

    public String getDoctorCardFront() {
        return doctorCardFront;
    }

    public void setDoctorCardFront(String doctorCardFront) {
        this.doctorCardFront = doctorCardFront == null ? null : doctorCardFront.trim();
    }

    public String getDoctorCardContrary() {
        return doctorCardContrary;
    }

    public void setDoctorCardContrary(String doctorCardContrary) {
        this.doctorCardContrary = doctorCardContrary == null ? null : doctorCardContrary.trim();
    }

    public String getWorkCard() {
        return workCard;
    }

    public void setWorkCard(String workCard) {
        this.workCard = workCard == null ? null : workCard.trim();
    }

    public String getApproveStatus() {
        return approveStatus;
    }

    public void setApproveStatus(String approveStatus) {
        this.approveStatus = approveStatus == null ? null : approveStatus.trim();
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