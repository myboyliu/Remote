package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.UserCaseType;
import com.sicmed.remote.web.entity.UserDetail;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 属性应与UserBean合并,不应命名为UserControllerBean
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserControllerBean extends UserDetail implements Serializable {

    private String userPhone;

    private String signature;

    private String doctorCardFront;

    private String approveStatus;

    private List<UserCaseType> caseTypeIds;
}
