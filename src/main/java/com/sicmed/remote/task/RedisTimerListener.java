package com.sicmed.remote.task;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.live.service.CurriculumScheduleService;
import com.sicmed.remote.socket.MessageSendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

/**
 * redis过期key回调函数
 */
public class RedisTimerListener extends KeyExpirationEventMessageListener {
    @Autowired
    private MessageSendService messageSendService;

    @Autowired
    private CurriculumScheduleService curriculumScheduleService;

    public RedisTimerListener(RedisMessageListenerContainer listenerContainer) {
        super(listenerContainer);
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        //1.获取任务内容
        RedisTimer redisTimer = TaskManager.get(message.toString());
        //2.判断任务是否存在
        if (redisTimer == null) {
            return;
        }
        //3.获取任务内容
        JSONObject jsonObject = redisTimer.getJsonObject();
        //4.处理任务
        switch (jsonObject.getString("type")) {
            case "LIVE_ALERT_MESSAGE":
                JSONArray jsonArray = curriculumScheduleService.findByCurriculumId(jsonObject.getString("aboutId"));
                jsonObject.put("userList", jsonArray);
                messageSendService.send(jsonObject);
                break;
            case "LIVE_PUSH_MESSAGE":
                jsonObject.put("userList", null);
                messageSendService.sendTopic(jsonObject);
                break;
            default:
                messageSendService.send(jsonObject);
                break;

        }

    }

}
