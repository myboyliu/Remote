package com.sicmed.remote.task;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.meeting.util.SpringUtil;
import lombok.Data;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.io.Serializable;
import java.util.concurrent.TimeUnit;

@Data
public class RedisTimer implements Serializable {

    private static RedisTemplate<String, String> redisTemplate = SpringUtil.getBean(StringRedisTemplate.class);

    private String key;

    private long time;

    private String timerType;

    private JSONObject jsonObject;


    /**
     * 初始化一个Redis定时器
     *
     * @param time
     */
    public RedisTimer(String key, long time, JSONObject jsonObject) {
        this.key = "REDIS_TIMER:" + key + ":" + time;
        this.time = time;
        this.jsonObject = jsonObject;
        TaskManager.add(this.key, this);
    }
    /**
     * 初始化一个带任务类型的Redis定时器
     *
     * @param time
     */
    public RedisTimer(String key, long time, String timerType, JSONObject jsonObject) {
        this.key = "REDIS_TIMER:" + key + ":" + time;
        this.time = time;
        this.timerType = timerType;
        this.jsonObject = jsonObject;
        TaskManager.add(this.key, this);
    }

    /**
     * 启动Redis定时器
     */
    public void start() {
        if (time > 5000) {
            redisTemplate.opsForValue().set(key, "", time, TimeUnit.MILLISECONDS);
        }
    }

    /**
     * 销毁Redis定时器
     */
    public void destroy() {
        redisTemplate.delete(key);
        TaskManager.remove(key);
    }

}
