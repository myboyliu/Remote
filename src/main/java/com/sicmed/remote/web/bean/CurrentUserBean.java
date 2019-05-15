package com.sicmed.remote.web.bean;

import com.sicmed.remote.web.entity.UserDetail;
import lombok.Data;

import java.io.Serializable;

@Data
public class CurrentUserBean extends UserDetail implements Serializable {


    private String branchName;

    private String hospitalName;

    private String specialistTypeName;

    private String userPhone;

    private String baseBranchId;

    private String roleDescription;

}
