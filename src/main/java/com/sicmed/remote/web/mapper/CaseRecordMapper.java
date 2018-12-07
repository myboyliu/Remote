package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.CaseRecord;

public interface CaseRecordMapper {
    int deleteByPrimaryKey(String id);

    int insert(CaseRecord record);

    int insertSelective(CaseRecord record);

    CaseRecord selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CaseRecord record);

    int updateByPrimaryKey(CaseRecord record);
}