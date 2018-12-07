package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.UserAccount;
import com.sicmed.remote.web.mapper.UserAccountMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserAccountMapper userAccountMapper;

    public int insertUser(UserAccount userAccount) {
        return userAccountMapper.insertSelective(userAccount);
    }


}
