package com.sicmed.remote.live.service;

import com.sicmed.remote.live.entity.CurriculumSchedule;
import com.sicmed.remote.live.mapper.CurriculumScheduleMapper;
import com.sicmed.remote.web.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CurriculumScheduleService implements BaseService<CurriculumSchedule> {

    @Autowired
    private CurriculumScheduleMapper curriculumScheduleMapper;

    @Override
    public int insertSelective(CurriculumSchedule curriculumSchedule) {
        return curriculumScheduleMapper.insertSelective(curriculumSchedule);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(CurriculumSchedule curriculumSchedule) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(CurriculumSchedule curriculumSchedule) {
        return 0;
    }

    @Override
    public CurriculumSchedule getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<CurriculumSchedule> findByDynamicParam(CurriculumSchedule curriculumSchedule) {
        return null;
    }

    public int deleteByUser(CurriculumSchedule curriculumSchedule) {
        return curriculumScheduleMapper.deleteByUser(curriculumSchedule);
    }
}
