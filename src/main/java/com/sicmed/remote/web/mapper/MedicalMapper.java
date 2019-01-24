package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.FuzzySearchBean;
import com.sicmed.remote.web.entity.Medical;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalMapper{

    int deleteByPrimaryKey(String id);

    int insert(Medical record);

    int insertSelective(Medical record);

    Medical selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Medical record);

    int updateByPrimaryKey(Medical record);

    List<Medical> fuzzySearchMedical(FuzzySearchBean fuzzySearchBean);
}