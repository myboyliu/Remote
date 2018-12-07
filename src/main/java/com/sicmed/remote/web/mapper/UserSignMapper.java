package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.UserSign;

public interface UserSignMapper {
    int deleteByPrimaryKey(String id);

    int insert(UserSign record);

    int insertSelective(UserSign record);

    UserSign selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(UserSign record);

    int updateByPrimaryKey(UserSign record);
}