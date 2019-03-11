package com.sicmed.remote.task;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.tomcat.util.codec.binary.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
public class RedisTimerService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 初始化一个Redis定时器
     *
     * @param time
     */
    public RedisTimer init(long time, JSONObject jsonObject) {
        RedisTimer redisTimer = new RedisTimer();
        String key = RandomStringUtils.random(16);
        redisTimer.setKey("REDIS_TIMER_" + key.toUpperCase());
        redisTimer.setTime(time);
        redisTimer.setJsonObject(jsonObject);
        TaskManager.add("REDIS_TIMER_" + key, redisTimer);

        return redisTimer;
    }

    /**
     * 启动Redis定时器
     *
     * @param key
     */
    public void start(String key) {
        RedisTimer redisTimer = TaskManager.get(key);
        if (redisTimer.getTime() > 5000) {
            redisTemplate.opsForValue().set(redisTimer.getKey(), "", redisTimer.getTime(), TimeUnit.MILLISECONDS);
        }

    }

    /**
     * 销毁Redis定时器
     *
     * @param key
     */
    public void destroy(String key) {
        redisTemplate.delete(key);
        TaskManager.remove(key);
    }

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

    public void ss(String applyFormId, Date consultationStartTime) {

        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append("01:" + applyFormId);
        JSONObject jsonObject = new JSONObject();
        long before60Time = YtDateUtils.before60Time(consultationStartTime);
        long before15Time = YtDateUtils.before15Time(consultationStartTime);
        long before5Time = YtDateUtils.before5Time(consultationStartTime);
        this.init(before60Time, jsonObject);
    }
}
