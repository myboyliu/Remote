package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.BranchBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.bean.UserBean;
import com.sicmed.remote.web.bean.UserControllerBean;
import com.sicmed.remote.web.entity.UserDetail;

import java.util.List;

public interface UserDetailMapper {
    int deleteByPrimaryKey(String id);

    int insert(UserDetail record);

    int insertSelective(UserDetail record);

    UserDetail selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(UserDetail record);

    int updateByPrimaryKey(UserDetail record);

    UserControllerBean selectPersonalCenter(String userId);

    // hospitalId查询所有UserDetail并按照branchId分类
    List<BranchBean> selectByHospital(String hospitalId);

    // branchId查询所有医生
    List<UserBean> selectByBranchId(String branchId);

    CurrentUserBean selectCurrentUser(String userId);

    int updateUserPrice(UserDetail userDetail);
}