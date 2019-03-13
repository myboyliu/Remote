package com.sicmed.remote.task;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.message.bean.MessageConstant;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class RedisTimerService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;


    /**
     * 新直播推送
     */
    public void newLiveStreaming() {
        String key = "05:" + YtDateUtils.dateToString(YtDateUtils.getTomorrow17Points());
        redisTemplate.opsForValue().set(key, "直播预报", YtDateUtils.distance17Points(), TimeUnit.MILLISECONDS);
    }

    /**
     * 已关注直播开始前提醒
     */
    public void alreadyFocused(String curriculumId, Date date) {
        String key = "06:" + curriculumId;
        redisTemplate.opsForValue().set(key, "关注直播提醒", YtDateUtils.before5Time(date), TimeUnit.MILLISECONDS);

    }

    public void createVideoRemind(String applyFormId, Date consultationStartTime, JSONArray jsonArray) {

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", MessageConstant.MEETING_ALERT_MESSAGE);
        jsonObject.put("fill","");
        jsonObject.put("linked",applyFormId);
        jsonObject.put("userList",jsonArray);

        //创建60分钟提醒
        long before60Time = YtDateUtils.before60Time(consultationStartTime);
        if (before60Time > 5000) {
            jsonObject.put("prefix","您预约了60分钟后进行视频会诊");
            jsonObject.put("suffix","");
            jsonObject.put("message","您您预约了60分钟后进行视频会诊");
            new RedisTimer(applyFormId, before60Time, jsonObject).start();
        }

        //创建15分钟提醒
        long before15Time = YtDateUtils.before15Time(consultationStartTime);
        if (before15Time > 5000) {
            jsonObject.put("prefix","您预约了15分钟后进行视频会诊，请提前5分钟进入会诊室做准备");
            jsonObject.put("suffix","");
            jsonObject.put("message","您预约了15分钟后进行视频会诊，请提前5分钟进入会诊室做准备");
            new RedisTimer(applyFormId, before15Time, jsonObject).start();
        }

        //创建5分钟提醒
        long before5Time = YtDateUtils.before5Time(consultationStartTime);
        if (before5Time > 5000) {
            jsonObject.put("prefix","您预约的会诊室已激活，如还未进入，请通知相关人员尽快加入。如已准备妥当请忽略本消息");
            jsonObject.put("suffix","");
            jsonObject.put("message","您预约的会诊室已激活，如还未进入，请通知相关人员尽快加入。如已准备妥当请忽略本消息");

            new RedisTimer(applyFormId, before5Time, jsonObject).start();
        }
    }
}
