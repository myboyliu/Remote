package com.sicmed.remote.web.entity;

import java.util.Date;

public class Branch {
    private String id;

    private String parentId;

    private String branchName;

    private String branchNumber;

    private String branchGrade;

    private String branchInform;

    private Integer branchWeight;

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

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId == null ? null : parentId.trim();
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName == null ? null : branchName.trim();
    }

    public String getBranchNumber() {
        return branchNumber;
    }

    public void setBranchNumber(String branchNumber) {
        this.branchNumber = branchNumber == null ? null : branchNumber.trim();
    }

    public String getBranchGrade() {
        return branchGrade;
    }

    public void setBranchGrade(String branchGrade) {
        this.branchGrade = branchGrade == null ? null : branchGrade.trim();
    }

    public String getBranchInform() {
        return branchInform;
    }

    public void setBranchInform(String branchInform) {
        this.branchInform = branchInform == null ? null : branchInform.trim();
    }

    public Integer getBranchWeight() {
        return branchWeight;
    }

    public void setBranchWeight(Integer branchWeight) {
        this.branchWeight = branchWeight;
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