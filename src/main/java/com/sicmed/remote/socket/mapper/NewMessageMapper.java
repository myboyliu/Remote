package com.sicmed.remote.socket.mapper;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.socket.bean.NewMessageBean;
import com.sicmed.remote.socket.entity.NewMessage;

import java.util.List;

public interface NewMessageMapper {
    int deleteByPrimaryKey(String id);

    int insert(NewMessage record);

    int insertSelective(NewMessage record);

    NewMessage selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(NewMessage record);

    int updateByPrimaryKey(NewMessage record);

    List<NewMessageBean> findMyMessage(NewMessage record);

    NewMessage findMsgById(String id);

    NewMessage findNewsByNews(NewMessage msg);

    int updateUnreadMark(NewMessage msg);

    int insertMessage(NewMessage msg);

    int insertSelectiveByJSONObject(JSONObject jsonObject);

    String getMyMessageCount(NewMessage newMessage);
}