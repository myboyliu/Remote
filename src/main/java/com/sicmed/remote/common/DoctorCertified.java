package com.sicmed.remote.common;

/**
 * 医生认证信息审核状态
 */
public enum DoctorCertified {
    /**
     * 认证失败
     */
    AUTHENTICATION_FAILED,
    /**
     * 认证通过
     */
    AUTHENTICATION_ACCEDE,
    /**
     * 认证信息提交
     */
    AUTHENTICATION_CREATE_SUCCESS
}
