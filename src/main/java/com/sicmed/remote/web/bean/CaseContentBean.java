package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.CaseContent;
import com.sicmed.remote.web.entity.CasePatient;
import com.sicmed.remote.web.entity.CaseRecord;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CaseContentBean extends CaseContent {

    private List weightPathTypeId;

    private CasePatient casePatient;

    private CaseRecord caseRecord;
}
