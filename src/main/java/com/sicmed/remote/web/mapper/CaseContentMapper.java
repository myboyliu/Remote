package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.CaseContent;

public interface CaseContentMapper {
    int deleteByPrimaryKey(String id);

    int insert(CaseContent record);

    int insertSelective(CaseContent record);

    CaseContent selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CaseContent record);

    int updateByPrimaryKey(CaseContent record);
}