package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.ApplyForm;

import java.util.List;

public interface ApplyFormMapper {
    int deleteByPrimaryKey(String id);

    int insert(ApplyForm record);

    int insertSelective(ApplyForm record);

    ApplyForm selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(ApplyForm record);

    int updateByPrimaryKey(ApplyForm record);

    List<ApplyForm> findByDynamicParam(ApplyForm applyForm);

    List<ApplyForm> selectSendConsultant(ApplyForm applyForm);

}