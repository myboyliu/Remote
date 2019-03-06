package com.sicmed.remote.web.mapper;


import com.sicmed.remote.web.bean.BranchBean;
import com.sicmed.remote.web.bean.CustomBranchBean;
import com.sicmed.remote.web.bean.HospitalBean;
import com.sicmed.remote.web.bean.UpdateCustomBranchBean;
import com.sicmed.remote.web.entity.CustomBranch;
import com.sicmed.remote.web.entity.Hospital;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CustomBranchMapper {

    int deleteByPrimaryKey(String id);

    int insert(CustomBranch record);

    int insertSelective(CustomBranch record);

    CustomBranch selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CustomBranch record);

    int updateByPrimaryKey(CustomBranch record);

    List<CustomBranch> findByDynamicParam(CustomBranch branch);

    List<BranchBean> selectByHospitalId(@Param("hospitalId") String hospitalId);

    int insertCustomBranchList(@Param("addCustomBranchBeanList") List<UpdateCustomBranchBean> addCustomBranchBeanList);

    int deleteCustomBranchIdList(@Param("removeCustomBranchBeanList") List<String> removeCustomBranchBeanList);

    List<HospitalBean> selectHospitalBranchList(Hospital hospital);

    List<HospitalBean> getMasterHospitalBranchList(Hospital hospital);

    List<CustomBranch> selectByHosId(String hospitalId);
}