package com.sicmed.remote.web.bean;

import com.sicmed.remote.web.entity.ApplyForm;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ApplyFormBean extends ApplyForm implements Serializable {

    List<String> consultationStatusList;
    List<String> consultationTypeList;
}
