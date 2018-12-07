package com.sicmed.remote.web.entity;

import java.util.Date;

public class SpecialistType extends BaseEntity {
    private String id;

    private String specialistName;

    private String hospitalId;

    private String consultationPicturePrice;

    private String consultationVideoPrice;

    private Date createTime;

    private String createUser;

    private Date updateTime;

    private Date deleteTime;

    private String updateUser;

    private String deleteUser;

    private String delFlag;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getSpecialistName() {
        return specialistName;
    }

    public void setSpecialistName(String specialistName) {
        this.specialistName = specialistName == null ? null : specialistName.trim();
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId == null ? null : hospitalId.trim();
    }

    public String getConsultationPicturePrice() {
        return consultationPicturePrice;
    }

    public void setConsultationPicturePrice(String consultationPicturePrice) {
        this.consultationPicturePrice = consultationPicturePrice == null ? null : consultationPicturePrice.trim();
    }

    public String getConsultationVideoPrice() {
        return consultationVideoPrice;
    }

    public void setConsultationVideoPrice(String consultationVideoPrice) {
        this.consultationVideoPrice = consultationVideoPrice == null ? null : consultationVideoPrice.trim();
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

    public Date getDeleteTime() {
        return deleteTime;
    }

    public void setDeleteTime(Date deleteTime) {
        this.deleteTime = deleteTime;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser == null ? null : updateUser.trim();
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