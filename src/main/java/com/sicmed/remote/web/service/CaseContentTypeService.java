package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.CaseContentType;
import com.sicmed.remote.web.mapper.CaseContentTypeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseContentTypeService implements BaseService<CaseContentType> {

    @Autowired
    private CaseContentTypeMapper caseContentTypeMapper;

    @Override
    public int insertSelective(CaseContentType caseContentType) {
        return caseContentTypeMapper.insertSelective(caseContentType);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return caseContentTypeMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(CaseContentType caseContentType) {
        return caseContentTypeMapper.updateByPrimaryKeySelective(caseContentType);
    }

    @Override
    public int updateByPrimaryKey(CaseContentType caseContentType) {
        return 0;
    }

    @Override
    public CaseContentType getByPrimaryKey(String id) {
        return caseContentTypeMapper.selectByPrimaryKey(id);
    }

    @Override
    public List findByDynamicParam(CaseContentType caseContentType) {
        return caseContentTypeMapper.findByDynamicParam(caseContentType);
    }
}
