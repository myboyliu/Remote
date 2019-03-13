package com.sicmed.remote.rbac.service;

import com.alibaba.fastjson.JSONArray;
import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.rbac.entity.UserRole;
import com.sicmed.remote.rbac.mapper.UserRoleMapper;
import com.sicmed.remote.web.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserRoleService implements BaseService<UserRole> {

    @Autowired
    private UserRoleMapper userRoleMapper;

    @Override
    public int insertSelective(UserRole userRole) {
        return userRoleMapper.insertSelective(userRole);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(UserRole userRole) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(UserRole userRole) {
        return 0;
    }

    @Override
    public UserRole getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<UserRole> findByDynamicParam(UserRole userRole) {
        return null;
    }
}
