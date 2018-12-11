package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.UserCaseType;
import com.sicmed.remote.web.mapper.UserCaseTypeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserCaseTypeService implements BaseService<UserCaseType> {

    @Autowired
    private UserCaseTypeMapper userCaseTypeMapper;

    public int insertMulitple(Map<String, String> map) {
        return userCaseTypeMapper.insertMulitple(map);
    }

    @Override

    public int insertSelective(UserCaseType userCaseType) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(UserCaseType userCaseType) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(UserCaseType userCaseType) {
        return 0;
    }

    @Override
    public UserCaseType getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<UserCaseType> findByDynamicParam(UserCaseType userCaseType) {
        return null;
    }
}
