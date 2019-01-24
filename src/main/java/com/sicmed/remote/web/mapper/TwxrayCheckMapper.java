package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.FuzzySearchBean;
import com.sicmed.remote.web.entity.TwxrayCheck;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TwxrayCheckMapper {

    int deleteByPrimaryKey(String id);

    int insert(TwxrayCheck record);

    int insertSelective(TwxrayCheck record);

    TwxrayCheck selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(TwxrayCheck record);

    int updateByPrimaryKey(TwxrayCheck record);

    List<TwxrayCheck> findCheckByClassId(String id);

    List<TwxrayCheck> fuzzySearchCheck(FuzzySearchBean fuzzySearchBean);

    int fuzzySearchCheckSize(String param);
}