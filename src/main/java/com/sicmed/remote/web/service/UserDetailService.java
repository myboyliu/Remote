package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.UserControllerBean;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.mapper.UserDetailMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailService implements BaseService<UserDetail> {

    @Autowired
    private UserDetailMapper userDetailMapper;

    public UserControllerBean selectPersonalCenter(String userId) {
        return userDetailMapper.selectPersonalCenter(userId);
    }

    @Override
    public int insertSelective(UserDetail userDetail) {
        return userDetailMapper.insertSelective(userDetail);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(UserDetail userDetail) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(UserDetail userDetail) {
        return 0;
    }

    @Override
    public UserDetail getByPrimaryKey(String id) {
        return userDetailMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<UserDetail> findByDynamicParam(UserDetail userDetail) {
        return null;
    }
}
