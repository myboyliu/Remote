package com.sicmed.remote.meeting.mapper;

import com.sicmed.remote.meeting.entity.Meeting;

public interface MeetingMapper {
    int deleteByPrimaryKey(String id);

    int insert(Meeting record);

    int insertSelective(Meeting record);

    Meeting selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Meeting record);

    int updateByPrimaryKey(Meeting record);
}