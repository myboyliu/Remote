package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.BranchBean;
import com.sicmed.remote.web.entity.Branch;

import java.util.List;

public interface BranchMapper {

    int deleteByPrimaryKey(String id);

    int insert(Branch record);

    int insertSelective(Branch record);

    Branch selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Branch record);

    int updateByPrimaryKey(Branch record);

    List<Branch> findByDynamicParam(Branch branch);

    List<BranchBean> findMultilevelListByDynamicParam(Branch branch);

    List<Branch> getSecondList();

    List<Branch> getFirstList();
}