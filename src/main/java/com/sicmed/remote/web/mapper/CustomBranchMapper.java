package com.sicmed.remote.web.mapper;


import com.sicmed.remote.web.entity.CustomBranch;

import java.util.List;

public interface CustomBranchMapper {

    int deleteByPrimaryKey(String id);

    int insert(CustomBranch record);

    int insertSelective(CustomBranch record);

    CustomBranch selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CustomBranch record);

    int updateByPrimaryKey(CustomBranch record);

    List<CustomBranch> findByDynamicParam(CustomBranch branch);

}