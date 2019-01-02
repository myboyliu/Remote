package com.sicmed.remote.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class ApplyNode implements Serializable {
    private String id;

    private String nodeName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date nodeTime;

    private String nodeOperator;

    private String applyId;


}