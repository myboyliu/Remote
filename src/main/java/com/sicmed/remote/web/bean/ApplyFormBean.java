package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyNode;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.entity.CaseContent;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplyFormBean extends ApplyForm implements Serializable {

    List<String> consultationStatusList;
    List<String> consultationTypeList;


    List<ApplyTime> applyTimeList;
    List<CaseContent> caseContentList;
    List<ApplyNode> applyNodeList;


    private String patientName;
    private String patientCard;
    private String patientPhone;

    private String patientId;
    private String patientSex;
    private String patientAge;
    private Integer patientHeight;
    private Integer patientWeight;
    private String caseDiagnosis;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date consultantEndTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date consultantStartTime;
    private String consultantReport;
    private String consultantFeedback;
    private BigDecimal consultantPrice;
    private BigDecimal hospitalPrice;
    private String consultantUserList;


    private String detailAddress;

    private boolean meetMute;
    private boolean meetRecord;
    private boolean meetStart;
    private String meetJson;

}
