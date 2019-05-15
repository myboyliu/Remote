package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.Role;

import java.util.List;

public interface RoleMapper {

    int deleteByPrimaryKey(String id);

    int insert(Role record);

    int insertSelective(Role record);

    Role selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Role record);

    int updateByPrimaryKey(Role record);

    List<Role> getRoleList();
}