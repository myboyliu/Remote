package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.UserCaseType;

public interface UserCaseTypeMapper {
    int deleteByPrimaryKey(String id);

    int insert(UserCaseType record);

    int insertSelective(UserCaseType record);

    UserCaseType selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(UserCaseType record);

    int updateByPrimaryKey(UserCaseType record);
}