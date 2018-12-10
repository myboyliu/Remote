package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.UserAccount;
import com.sicmed.remote.web.mapper.UserAccountMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements BaseService<UserAccount> {

    @Autowired
    private UserAccountMapper userAccountMapper;

    @CacheEvict(value = "FANS_STAR", key = "'FANS_STAR_'+#fansStar.getFansId()")
    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }
    @Override
    public int insertSelective(UserAccount userAccount) {
        return userAccountMapper.insertSelective(userAccount);
    }

    @Cacheable(value = "FANS_STAR", key = "'FANS_STAR_'+#id", unless = "#result == null")
    @Override
    public UserAccount getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public int updateByPrimaryKeySelective(UserAccount userAccount) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(UserAccount userAccount) {
        return 0;
    }

    @Override
    public List<UserAccount> findByDynamicParam(UserAccount userAccount) {
        return null;
    }








}
