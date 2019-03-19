package com.sicmed.remote.live.mapper;

import com.alibaba.fastjson.JSONArray;
import com.sicmed.remote.live.entity.CurriculumSchedule;

import java.util.List;

public interface CurriculumScheduleMapper {

    int deleteByPrimaryKey(String id);

    int insert(CurriculumSchedule record);

    int insertSelective(CurriculumSchedule record);

    CurriculumSchedule selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(CurriculumSchedule record);

    int updateByPrimaryKey(CurriculumSchedule record);

    int deleteByUser(CurriculumSchedule curriculumSchedule);

    JSONArray findByCurriculumId(String curriculumId);
}