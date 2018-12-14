package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.UserDetail;
import lombok.Data;

import java.util.List;

/**
 * @author MaxCoder
 * @version 1.0
 * @Description TODO
 **/
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserBean extends UserDetail {

    private String approveStatus;

    List<UserDetail> userDetails;

}
