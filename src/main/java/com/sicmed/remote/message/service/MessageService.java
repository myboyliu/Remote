package com.sicmed.remote.message.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.message.bean.MessageConstant;
import com.sicmed.remote.web.entity.UserRole;
import com.sicmed.remote.web.mapper.UserRoleMapper;
import com.sicmed.remote.socket.InstantMessageUtils;
import com.sicmed.remote.socket.entity.NewMessage;
import com.sicmed.remote.socket.mapper.NewMessageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
    @Autowired
    private UserRoleMapper userRoleMapper;

    @Autowired
    private NewMessageMapper newMessageMapper;

    public void sendRegistAlertToHospitalAdmin(String doctorId, String userName, String hospitalId) {
        String messageTitle = "<a href=\"javascript:;\">“" + userName + "”</a>请求认证为您的医院医生，点击查看审核";
        //1.查询医政列表
        UserRole userRole = new UserRole();
        userRole.setUserId(hospitalId);
        userRole.setRoleId("352905f2455711e98ede487b6bd31bf7");
        JSONArray userArray = userRoleMapper.getUserByParam(userRole);
        //2.添加消息记录
        JSONObject msgJson = new JSONObject();
        msgJson.put("type", MessageConstant.NEW_DOCTOR_REGISTER_ALERT_MESSAGE);
        msgJson.put("title", messageTitle);
        msgJson.put("doctorId", doctorId);
        msgJson.put("userList", userArray);
        newMessageMapper.insertByJSONObject(msgJson);
        //3.发送在线消息
        InstantMessageUtils.sendToOnlineUser(msgJson);
    }

    public void sendRegistSuccessAlertToDoctor(String doctorId) {
        String messageTitle = "您的账号已通过医院身份认证审核，相关权限已为您开通。";
        NewMessage newMessage = new NewMessage();
        newMessage.setInviteUserId(doctorId);
        newMessage.setMsgTitle(messageTitle);
        newMessage.setMsgType(String.valueOf(MessageConstant.SYSTEM_ALERT_MESSAGE));
        newMessageMapper.insertSelective(newMessage);
    }
}
