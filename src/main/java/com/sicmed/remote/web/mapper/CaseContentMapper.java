package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.CaseContentBean;
import com.sicmed.remote.web.entity.CaseContent;

import java.util.List;


public interface CaseContentMapper {
    int deleteByPrimaryKey(String id);

    int insert(CaseContent record);

    int insertSelective(CaseContent record);

    CaseContent selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CaseContent record);

    int updateByPrimaryKey(CaseContent record);

    int insertByMap(CaseContentBean caseContentBean);

    int deleteByCaseRecordId(String caseRecordId);

    int selectRecordId(String recordId);

    int softDeleteById(String id);

    List<CaseContent> findByCaseRecordId(String caseRecordId);

}