package com.sicmed.remote.task;

import com.sicmed.remote.live.service.CurriculumScheduleService;
import com.sicmed.remote.socket.MessageSendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

import java.util.Arrays;
import java.util.List;

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

        /**
         * 会诊提醒 key 格式为 type:applyFormId:inviteUserId1-inviteUserId2...
         * 05提醒的 key 格式为 type:提醒时间(Ex:2018-11-11 05:00:00)
         * 06提醒的 key 格式为 type:直播id
         * type类型有 01,02,03,04,05,06
         * 01会诊开始前60分钟提醒  02会诊开始前15分钟提醒  03会诊开始前5分钟提醒
         * 04新课程推送提醒        05新直播推送提醒        06已关注直播提醒
         */
        String key = message.toString();
        String type = key.substring(0, 2);
        String resultMessage;
        switch (type) {
            case "01":
                resultMessage = "您预约了60分钟后进行视频会诊" + key.substring(3, 35);
                sendOperation(key, resultMessage);
                break;
            case "02":
                resultMessage = "您预约了15分钟后进行视频会诊，请提前5分钟进入会诊室做准备" + key.substring(3, 35);
                sendOperation(key, resultMessage);
                break;
            case "03":
                resultMessage = "您预约的会诊室已激活，如还未进入，请通知相关人员尽快加入。如已准备妥当请忽略本消息" + key.substring(3, 35);
                sendOperation(key, resultMessage);
                break;
//            case "04": //定时器中执行此功能
//                resultMessage = "有新内容了！上周更新的课程都在这里，点击立即去观看";
//                break;
            case "05":
                resultMessage = "有新直播了！明日的热门直播课程不要错过，立即点击查看";
                messageSendService.sendTopic(resultMessage);
                break;
            case "06":
                resultMessage = "您关注的直播“直播名称”即将开始，请及时查看";
                // 获取关注人id,并向其发送消息
                List<String> curriculumIdList = curriculumScheduleService.findByCurriculumId(key.substring(3, 35));
                for (String userId : curriculumIdList) {
                    messageSendService.sendUser(userId, resultMessage);
                }
                break;
            default:
                break;
        }
    }

    public void sendOperation(String key, String resultMessage) {
        List<String> idLists = Arrays.asList(key.substring(36).split("-"));
        // 获取发送用户Id,并发送信息
        for (String userId : idLists) {
            messageSendService.sendUser(userId, resultMessage);
        }
    }
}
