package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.Branch;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * @author MaxCoder
 * @version 1.0
 * @Description TODO
 **/
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BranchBean extends Branch implements Serializable {

    private List<Branch> childList;
}
