package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.UserRole;
import com.sicmed.remote.web.mapper.UserRoleMapper;
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

    public int updateUserRoleByUser(UserRole userRole) {
        userRoleMapper.deleteByUser(userRole.getUserId());
       return userRoleMapper.insertSelective(userRole);
    }
}
