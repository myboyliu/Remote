package com.sicmed.remote.task;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.live.service.CurriculumScheduleService;
import com.sicmed.remote.socket.MessageSendService;
import com.sicmed.remote.socket.service.NewMessageService;
import com.sicmed.remote.web.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

import java.util.List;

/**
 * redis过期key回调函数
 */
public class RedisTimerListener extends KeyExpirationEventMessageListener {
    @Autowired
    private MessageSendService messageSendService;

    @Autowired
    private CurriculumScheduleService curriculumScheduleService;
    @Autowired
    private TaskService taskService;
    @Autowired
    private UserAccountService userAccountService;
    @Autowired
    private NewMessageService newMessageService;
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
        switch (redisTimer.getTimerType()){
            case "REFERRAL_END_LISTENER":
                //TODO
                taskService.executeReferralEndTask(jsonObject);
                break;
            case "CONSULTATION_START_LISTENER":
                //TODO

                break;
            default:
                //4.处理任务
                switch (jsonObject.getString("type")) {
                    case "LIVE_ALERT_MESSAGE":
                        JSONArray jsonArray = curriculumScheduleService.findByCurriculumId(jsonObject.getString("aboutId"));
                        jsonObject.put("userList", jsonArray);
                        newMessageService.insertSelectiveByJSONObject(jsonObject);
                        messageSendService.send(jsonObject);
                        break;
                    case "LIVE_PUSH_MESSAGE":
                        List<String> userList = userAccountService.getAllUserId();
                        jsonObject.put("userList", userList);
                        newMessageService.insertSelectiveByJSONObject(jsonObject);
                        messageSendService.sendTopic(jsonObject);
                        break;
                    default:
                        newMessageService.insertSelectiveByJSONObject(jsonObject);
                        messageSendService.send(jsonObject);
                        break;
                }
                break;
        }

    }

}
