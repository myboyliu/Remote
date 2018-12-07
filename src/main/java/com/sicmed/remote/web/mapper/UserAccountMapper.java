package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.UserAccount;
import org.apache.ibatis.annotations.Mapper;

public interface UserAccountMapper {
    int deleteByPrimaryKey(String id);

    int insert(UserAccount record);

    int insertSelective(UserAccount record);

    UserAccount selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(UserAccount record);

    int updateByPrimaryKey(UserAccount record);
}