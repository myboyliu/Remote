package com.sicmed.remote.web.bean;

import lombok.Data;

import java.io.Serializable;

@Data
public class ConsultantReportBean implements Serializable {

    private String doctorName;

    private String doctorId;

    private String report;

    private String reportStatus;

    private String doctorEnjoin;

    // 多学科会诊标识
    private String mdtFlag;
}
