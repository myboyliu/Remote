package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.ApplyNode;

public interface ApplyNodeMapper {
    int deleteByPrimaryKey(String id);

    int insert(ApplyNode record);

    int insertSelective(ApplyNode record);

    ApplyNode selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(ApplyNode record);

    int updateByPrimaryKey(ApplyNode record);
}