package com.sicmed.remote.tencent.bean;

import com.sicmed.remote.web.entity.PageEntity;
import lombok.Data;

@Data
public class SelectVideoListParamBean extends PageEntity {

    private String videoType;

    private String groupByTime;

    private String groupByHot;

}
