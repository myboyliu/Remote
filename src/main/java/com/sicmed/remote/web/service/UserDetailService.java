package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.BranchBean;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.bean.UserBean;
import com.sicmed.remote.web.bean.UserControllerBean;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.mapper.UserDetailMapper;
import com.sun.org.apache.bcel.internal.generic.RETURN;
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

    /**
     * hospitalId查询userDetail,并按照branchId分类
     */
    public List<BranchBean> selectByHospital(String hospitalId) {
        return userDetailMapper.selectByHospital(hospitalId);
    }

    /**
     * branchId查询对应医生
     */
    public List<UserBean> selectByBranchId(String branchId) {
        return userDetailMapper.selectByBranchId(branchId);
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
        return userDetailMapper.updateByPrimaryKeySelective(userDetail);
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

    public CurrentUserBean selectCurrentUser(String userId) {
        return userDetailMapper.selectCurrentUser(userId);
    }

    public int updateUserPrice(UserDetail userDetail) {
       return userDetailMapper.updateUserPrice(userDetail);
    }
}
