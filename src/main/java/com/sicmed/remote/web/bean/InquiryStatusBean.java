package com.sicmed.remote.web.bean;

import lombok.Data;

@Data
public class InquiryStatusBean {

    private String inquiryApplyCreateSuccess;

    private String inquiryApplyAccede;

    private String inquiryApplyReject;

    private String inquirySlaveAccede;

    private String inquirySlaveReject;

    private String inquiryMasterAccede;

    private String inquiryMasterReject;

    private String inquiryDatetimeLockeD;

    private String inquirySenderConfirm;

    private String inquirySenderCancel;

    private String inquiryEnd;
}
