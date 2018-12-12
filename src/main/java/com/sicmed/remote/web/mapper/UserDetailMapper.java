package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.UserControllerBean;
import com.sicmed.remote.web.entity.UserDetail;

public interface UserDetailMapper {
    int deleteByPrimaryKey(String id);

    int insert(UserDetail record);

    int insertSelective(UserDetail record);

    UserDetail selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(UserDetail record);

    int updateByPrimaryKey(UserDetail record);

    UserControllerBean selectPersonalCenter(String userId);
}