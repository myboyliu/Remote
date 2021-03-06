package com.sicmed.remote.web.mapper;

import com.alibaba.fastjson.JSONArray;
import com.sicmed.remote.web.entity.UserRole;

public interface UserRoleMapper {
    int deleteByPrimaryKey(String id);

    int insert(UserRole record);

    int insertSelective(UserRole record);

    UserRole selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(UserRole record);

    int updateByPrimaryKey(UserRole record);

    JSONArray getUserByRoleId(String roleId);

    JSONArray getUserByParam(UserRole userRole);

    int deleteByUser(String userId);
}