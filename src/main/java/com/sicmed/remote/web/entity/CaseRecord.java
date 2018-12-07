package com.sicmed.remote.web.entity;

import java.util.Date;

public class CaseRecord extends BaseEntity {
    private String id;

    private String caseNumber;

    private String patientId;

    private String mainSuit;

    private String pastMedicalHistory;

    private String existingMedicalHistory;

    private String allergicHistory;

    private String caseDiagnosis;

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

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber == null ? null : caseNumber.trim();
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId == null ? null : patientId.trim();
    }

    public String getMainSuit() {
        return mainSuit;
    }

    public void setMainSuit(String mainSuit) {
        this.mainSuit = mainSuit == null ? null : mainSuit.trim();
    }

    public String getPastMedicalHistory() {
        return pastMedicalHistory;
    }

    public void setPastMedicalHistory(String pastMedicalHistory) {
        this.pastMedicalHistory = pastMedicalHistory == null ? null : pastMedicalHistory.trim();
    }

    public String getExistingMedicalHistory() {
        return existingMedicalHistory;
    }

    public void setExistingMedicalHistory(String existingMedicalHistory) {
        this.existingMedicalHistory = existingMedicalHistory == null ? null : existingMedicalHistory.trim();
    }

    public String getAllergicHistory() {
        return allergicHistory;
    }

    public void setAllergicHistory(String allergicHistory) {
        this.allergicHistory = allergicHistory == null ? null : allergicHistory.trim();
    }

    public String getCaseDiagnosis() {
        return caseDiagnosis;
    }

    public void setCaseDiagnosis(String caseDiagnosis) {
        this.caseDiagnosis = caseDiagnosis == null ? null : caseDiagnosis.trim();
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