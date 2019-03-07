package com.sicmed.remote.live.bean;

import com.sicmed.remote.web.entity.PageEntity;
import lombok.Data;

@Data
public class GetLiveParamBean extends PageEntity {

    private String liveType;

    private String groupByTime;

    private String groupByHot;

    private String createUser;

    private String branchId;

    private String hospitalId;

    private String sameBranchId;

}
