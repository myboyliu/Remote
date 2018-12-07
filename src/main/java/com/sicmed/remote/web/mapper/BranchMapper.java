package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.Branch;

public interface BranchMapper {
    int deleteByPrimaryKey(String id);

    int insert(Branch record);

    int insertSelective(Branch record);

    Branch selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Branch record);

    int updateByPrimaryKey(Branch record);
}