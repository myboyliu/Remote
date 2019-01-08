package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConsultationStatusBean {
    private String consultationApplyCreateSuccess;

    private String consultationApplyAccede;

    private String consultationApplyReject;

    private String consultationSlaveAccede;

    private String consultationSlaveReject;

    private String consultationMasterAccede;

    private String consultationMasterReject;

    private String consultationDoctorLocked;

    private String consultationDatetimeLocked;

    private String consultationBegin;

    private String consultationReportSubmitted;

    private String consultationFeedbackSubmitted;

    private String consultationEn;
}
