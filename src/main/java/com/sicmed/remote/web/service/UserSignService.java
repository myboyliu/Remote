package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.UserSign;
import com.sicmed.remote.web.mapper.UserSignMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserSignService implements BaseService<UserSign> {

    @Autowired
    private UserSignMapper userSignMapper;

    @Override
    public int insertSelective(UserSign userSign) {
        return userSignMapper.insertSelective(userSign);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(UserSign userSign) {
        return userSignMapper.updateByPrimaryKeySelective(userSign);
    }

    @Override
    public int updateByPrimaryKey(UserSign userSign) {
        return 0;
    }

    @Override
    public UserSign getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<UserSign> findByDynamicParam(UserSign userSign) {
        return null;
    }
}
