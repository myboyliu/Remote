package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.CaseContentBean;
import com.sicmed.remote.web.entity.CaseContent;
import com.sicmed.remote.web.mapper.CaseContentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseContentService implements BaseService<CaseContent> {

    @Autowired
    private CaseContentMapper caseContentMapper;

    public int insertByMap(CaseContentBean caseContentBean) {
        return caseContentMapper.insertByMap(caseContentBean);
    }

    public int deleteByCaseRecordId(String caseRecordId) {
        return caseContentMapper.deleteByCaseRecordId(caseRecordId);
    }

    public int selectRecordId(String recordId) {
        return caseContentMapper.selectRecordId(recordId);
    }

    @Override
    public int insertSelective(CaseContent caseContent) {
        return caseContentMapper.insertSelective(caseContent);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(CaseContent caseContent) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(CaseContent caseContent) {
        return 0;
    }

    @Override
    public CaseContent getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<CaseContent> findByDynamicParam(CaseContent caseContent) {
        return null;
    }
}
