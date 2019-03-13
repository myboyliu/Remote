package com.sicmed.remote.rbac.service;

import com.sicmed.remote.rbac.entity.Role;
import com.sicmed.remote.rbac.mapper.RoleMapper;
import com.sicmed.remote.web.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService implements BaseService<Role> {

    @Autowired
    private RoleMapper roleMapper;

    @Override
    public int insertSelective(Role role) {
        return roleMapper.insertSelective(role);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(Role role) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(Role role) {
        return 0;
    }

    @Override
    public Role getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<Role> findByDynamicParam(Role role) {
        return null;
    }
}
