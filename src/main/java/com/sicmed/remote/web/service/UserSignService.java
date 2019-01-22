package com.sicmed.remote.web.service;

import com.sicmed.remote.common.DoctorCertified;
import com.sicmed.remote.web.entity.UserAccount;
import com.sicmed.remote.web.entity.UserCaseType;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.entity.UserSign;
import com.sicmed.remote.web.mapper.UserAccountMapper;
import com.sicmed.remote.web.mapper.UserCaseTypeMapper;
import com.sicmed.remote.web.mapper.UserDetailMapper;
import com.sicmed.remote.web.mapper.UserSignMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserSignService implements BaseService<UserSign> {

    @Autowired
    private UserSignMapper userSignMapper;

    @Autowired
    private UserAccountMapper userAccountMapper;

    @Autowired
    private UserDetailMapper userDetailMapper;

    @Autowired
    private UserCaseTypeMapper userCaseTypeMapper;

    // 医生注册审核未通过
    @Transactional
    public int auditNotPass(String userId, String doctorId) {
        UserAccount userAccount = new UserAccount();
        userAccount.setId(doctorId);
        userAccount.setUpdateUser(userId);
        userAccount.setDelFlag("1");
        userAccountMapper.updateByPrimaryKeySelective(userAccount);

        UserDetail userDetail = new UserDetail();
        userDetail.setId(doctorId);
        userDetail.setUpdateUser(userId);
        userDetail.setDelFlag("1");
        userDetailMapper.updateByPrimaryKeySelective(userDetail);

        userCaseTypeMapper.deleteByUserId(doctorId);

        UserSign userSign = new UserSign();
        userSign.setId(doctorId);
        userSign.setUpdateUser(userId);
        userSign.setApproveStatus(DoctorCertified.AUTHENTICATION_FAILED.toString());
        userSign.setDelFlag("1");
        return userSignMapper.updateByPrimaryKeySelective(userSign);
    }

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
