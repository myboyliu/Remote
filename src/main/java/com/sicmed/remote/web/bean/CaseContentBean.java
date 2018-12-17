package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.CaseContent;
import lombok.Data;

import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CaseContentBean extends CaseContent {

    private Map<String, String> pathAndTypeIdMap;
}
