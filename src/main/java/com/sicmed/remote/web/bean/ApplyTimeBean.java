package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.ApplyTime;
import lombok.Data;

import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplyTimeBean extends ApplyTime {

    private Map<String, String> startEndTime;
}
