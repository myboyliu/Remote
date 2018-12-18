package com.sicmed.remote.web.bean;

import lombok.Data;

/**
 * @author MaxCoder
 * @version 1.0
 * @Description TODO
 **/
@Data
public class UpdateCustomBranchBean {

    private String hospitalId;
    private String customBranchId;
    private String customBranchName;
    private String baseBranchId;
    private String type;
}
