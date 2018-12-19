package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sicmed.remote.web.entity.Branch;
import com.sicmed.remote.web.entity.Hospital;
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
public class HospitalBean extends Hospital implements Serializable {

    private List<BranchBean> branchBeanList;

}
