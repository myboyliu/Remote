package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.UserAccount;

import java.util.List;

public interface UserAccountMapper {
    int deleteByPrimaryKey(String id);

    int insert(UserAccount record);

    int insertSelective(UserAccount record);

    UserAccount selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(UserAccount record);

    int updateByPrimaryKey(UserAccount record);

    List<UserAccount> findByDynamicParam(UserAccount userAccount);

    int selectCountPhone(String phoneNumber);

    UserAccount selectSaltPw(String userPhone);

    UserAccount selectByUserPhone(String userPhone);

    List<String> getAllUserId();
}