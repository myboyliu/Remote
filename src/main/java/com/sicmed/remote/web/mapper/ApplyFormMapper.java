package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.ApplyForm;

public interface ApplyFormMapper {
    int deleteByPrimaryKey(String id);

    int insert(ApplyForm record);

    int insertSelective(ApplyForm record);

    ApplyForm selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(ApplyForm record);

    int updateByPrimaryKey(ApplyForm record);
}