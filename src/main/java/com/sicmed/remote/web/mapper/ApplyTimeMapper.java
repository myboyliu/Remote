package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.ApplyTime;

public interface ApplyTimeMapper {
    int deleteByPrimaryKey(String id);

    int insert(ApplyTime record);

    int insertSelective(ApplyTime record);

    ApplyTime selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(ApplyTime record);

    int updateByPrimaryKey(ApplyTime record);
}