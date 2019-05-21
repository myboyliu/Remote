package com.sicmed.remote.task;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.message.bean.MessageConstant;
import com.sicmed.remote.socket.MessageSendService;
import com.sicmed.remote.socket.service.NewMessageService;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.entity.UserAccount;
import com.sicmed.remote.web.service.UserAccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 定时器
 */
@Slf4j
@Component
public class SchedulingTimer {
    @Autowired
    private MessageSendService messageSendService;
    @Autowired
    private UserAccountService userAccountService;
    @Autowired
    private NewMessageService newMessageService;
    // 新课程推送每周一早上8点触发
    @Scheduled(cron = "0 0 8 * * MON")
    public void pushMessage() {
        List<String> userList = userAccountService.getAllUserId();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", MessageConstant.VIDEO_PUSH_MESSAGE);
        jsonObject.put("title", "有新内容了！上周更新的课程都在这里，点击立即去观看");
        jsonObject.put("doctorId",null);
        jsonObject.put("userList",userList);
        newMessageService.insertSelectiveByJSONObject(jsonObject);
        messageSendService.sendTopic(jsonObject);

    }
}
