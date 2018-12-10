package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.CaseContentTypeBean;
import com.sicmed.remote.web.entity.CaseContentType;

import java.util.List;

public interface CaseContentTypeMapper {
    int deleteByPrimaryKey(String id);

    int insert(CaseContentType record);

    int insertSelective(CaseContentType record);

    CaseContentType selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CaseContentType record);

    int updateByPrimaryKey(CaseContentType record);

    List findByDynamicParam(CaseContentType caseContentType);

    List<CaseContentTypeBean> selectMultilevel(CaseContentType caseContentType);
}