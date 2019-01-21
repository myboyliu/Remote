package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.*;
import lombok.Data;

import java.util.List;

/**
 * @author YoonaLt
 * 草稿Bean类
 * @version 1.0 This Version Running JDK 1.8
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DraftBean {

    private ApplyForm applyForm;

    private CaseRecord caseRecord;

    private CasePatient casePatient;

    private List<CaseContent> caseContentList;

    private CaseConsultant caseConsultant;
}
