package com.sicmed.remote.web.entity;

import java.util.Date;

public class Hospital extends BaseEntity {
    private String id;

    private String hospitalName;

    private String hospitalAlias;

    private String hospitalInform;

    private String hospitalGrade;

    private Integer hospitalWeight;

    private String typeId;

    private String cityId;

    private String activationFlag;

    private String orderWeight;

    private String createUser;

    private Date createTime;

    private String updateUser;

    private Date updateTime;

    private String deleteUser;

    private Date deleteTime;

    private String delFlag;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName == null ? null : hospitalName.trim();
    }

    public String getHospitalAlias() {
        return hospitalAlias;
    }

    public void setHospitalAlias(String hospitalAlias) {
        this.hospitalAlias = hospitalAlias == null ? null : hospitalAlias.trim();
    }

    public String getHospitalInform() {
        return hospitalInform;
    }

    public void setHospitalInform(String hospitalInform) {
        this.hospitalInform = hospitalInform == null ? null : hospitalInform.trim();
    }

    public String getHospitalGrade() {
        return hospitalGrade;
    }

    public void setHospitalGrade(String hospitalGrade) {
        this.hospitalGrade = hospitalGrade == null ? null : hospitalGrade.trim();
    }

    public Integer getHospitalWeight() {
        return hospitalWeight;
    }

    public void setHospitalWeight(Integer hospitalWeight) {
        this.hospitalWeight = hospitalWeight;
    }

    public String getTypeId() {
        return typeId;
    }

    public void setTypeId(String typeId) {
        this.typeId = typeId == null ? null : typeId.trim();
    }

    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId == null ? null : cityId.trim();
    }

    public String getActivationFlag() {
        return activationFlag;
    }

    public void setActivationFlag(String activationFlag) {
        this.activationFlag = activationFlag == null ? null : activationFlag.trim();
    }

    public String getOrderWeight() {
        return orderWeight;
    }

    public void setOrderWeight(String orderWeight) {
        this.orderWeight = orderWeight == null ? null : orderWeight.trim();
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser == null ? null : createUser.trim();
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser == null ? null : updateUser.trim();
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getDeleteUser() {
        return deleteUser;
    }

    public void setDeleteUser(String deleteUser) {
        this.deleteUser = deleteUser == null ? null : deleteUser.trim();
    }

    public Date getDeleteTime() {
        return deleteTime;
    }

    public void setDeleteTime(Date deleteTime) {
        this.deleteTime = deleteTime;
    }

    public String getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(String delFlag) {
        this.delFlag = delFlag == null ? null : delFlag.trim();
    }
}