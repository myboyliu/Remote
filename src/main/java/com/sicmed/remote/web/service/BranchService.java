package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.BranchBean;
import com.sicmed.remote.web.entity.Branch;
import com.sicmed.remote.web.mapper.BranchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author MaxCoder
 * @version 1.0
 * @Description TODO
 **/
@Service
public class BranchService implements BaseService<Branch> {

    @Autowired
    private BranchMapper branchMapper;

    @Override
    public int insertSelective(Branch branch) {
        return branchMapper.insertSelective(branch);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return branchMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(Branch branch) {
        return branchMapper.updateByPrimaryKeySelective(branch);
    }

    @Override
    public int updateByPrimaryKey(Branch branch) {
        return branchMapper.updateByPrimaryKey(branch);
    }

    @Override
    public Branch getByPrimaryKey(String id) {
        return branchMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<Branch> findByDynamicParam(Branch branch) {
        return branchMapper.findByDynamicParam(branch);
    }

    public List<BranchBean> findMultilevelListByDynamicParam(Branch branch) {
        return branchMapper.findMultilevelListByDynamicParam(branch);
    }

    public List<Branch> getSecondList() {
       return branchMapper.getSecondList();
    }
}
