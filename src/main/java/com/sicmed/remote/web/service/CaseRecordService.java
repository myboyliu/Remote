package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.CaseRecord;
import com.sicmed.remote.web.mapper.CaseRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseRecordService implements BaseService<CaseRecord> {

    @Autowired
    private CaseRecordMapper caseRecordMapper;


    @Override
    public int insertSelective(CaseRecord caseRecord) {
        return caseRecordMapper.insertSelective(caseRecord);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(CaseRecord caseRecord) {
        return caseRecordMapper.updateByPrimaryKeySelective(caseRecord);
    }

    @Override
    public int updateByPrimaryKey(CaseRecord caseRecord) {
        return 0;
    }

    @Override
    public CaseRecord getByPrimaryKey(String id) {
        return caseRecordMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<CaseRecord> findByDynamicParam(CaseRecord caseRecord) {
        return null;
    }
}
