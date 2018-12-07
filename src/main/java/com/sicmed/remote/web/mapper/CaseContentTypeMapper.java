package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.CaseContentType;

public interface CaseContentTypeMapper {
    int deleteByPrimaryKey(String id);

    int insert(CaseContentType record);

    int insertSelective(CaseContentType record);

    CaseContentType selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CaseContentType record);

    int updateByPrimaryKey(CaseContentType record);
}