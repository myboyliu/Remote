package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.BranchBean;
import com.sicmed.remote.web.bean.CustomBranchBean;
import com.sicmed.remote.web.entity.CustomBranch;
import com.sicmed.remote.web.mapper.CustomBranchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomBranchService implements BaseService<CustomBranch> {

    @Autowired
    private CustomBranchMapper customBranchMapper;


    @Override
    public int insertSelective(CustomBranch customBranch) {
        return customBranchMapper.insertSelective(customBranch);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return customBranchMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(CustomBranch customBranch) {
        return customBranchMapper.updateByPrimaryKeySelective(customBranch);
    }

    @Override
    public int updateByPrimaryKey(CustomBranch customBranch) {
        return customBranchMapper.updateByPrimaryKey(customBranch);
    }

    @Override
    public CustomBranch getByPrimaryKey(String id) {
        return customBranchMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<CustomBranch> findByDynamicParam(CustomBranch customBranch) {
        return customBranchMapper.findByDynamicParam(customBranch);
    }

    public List<BranchBean> selectByHospitalId(String hospitalId) {
        return customBranchMapper.selectByHospitalId(hospitalId);
    }
}