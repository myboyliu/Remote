package com.sicmed.remote.web.entity;

import java.util.Date;

public class UserDetail extends BaseEntity {
    private String id;

    private String userName;

    private String userAge;

    private String userSex;

    private String userAddress;

    private String userCardNumber;

    private String telephone;

    private String hospitalId;

    private String branchId;

    private String titleId;

    private String specialistTypeId;

    private String headImg;

    private String userResume;

    private String userStrong;

    private String needCaseType;

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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName == null ? null : userName.trim();
    }

    public String getUserAge() {
        return userAge;
    }

    public void setUserAge(String userAge) {
        this.userAge = userAge == null ? null : userAge.trim();
    }

    public String getUserSex() {
        return userSex;
    }

    public void setUserSex(String userSex) {
        this.userSex = userSex == null ? null : userSex.trim();
    }

    public String getUserAddress() {
        return userAddress;
    }

    public void setUserAddress(String userAddress) {
        this.userAddress = userAddress == null ? null : userAddress.trim();
    }

    public String getUserCardNumber() {
        return userCardNumber;
    }

    public void setUserCardNumber(String userCardNumber) {
        this.userCardNumber = userCardNumber == null ? null : userCardNumber.trim();
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone == null ? null : telephone.trim();
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId == null ? null : hospitalId.trim();
    }

    public String getBranchId() {
        return branchId;
    }

    public void setBranchId(String branchId) {
        this.branchId = branchId == null ? null : branchId.trim();
    }

    public String getTitleId() {
        return titleId;
    }

    public void setTitleId(String titleId) {
        this.titleId = titleId == null ? null : titleId.trim();
    }

    public String getSpecialistTypeId() {
        return specialistTypeId;
    }

    public void setSpecialistTypeId(String specialistTypeId) {
        this.specialistTypeId = specialistTypeId == null ? null : specialistTypeId.trim();
    }

    public String getHeadImg() {
        return headImg;
    }

    public void setHeadImg(String headImg) {
        this.headImg = headImg == null ? null : headImg.trim();
    }

    public String getUserResume() {
        return userResume;
    }

    public void setUserResume(String userResume) {
        this.userResume = userResume == null ? null : userResume.trim();
    }

    public String getUserStrong() {
        return userStrong;
    }

    public void setUserStrong(String userStrong) {
        this.userStrong = userStrong == null ? null : userStrong.trim();
    }

    public String getNeedCaseType() {
        return needCaseType;
    }

    public void setNeedCaseType(String needCaseType) {
        this.needCaseType = needCaseType == null ? null : needCaseType.trim();
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