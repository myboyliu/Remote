package com.sicmed.remote.common.util;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.meeting.util.SpringUtil;
import com.sicmed.remote.web.bean.CurrentUserBean;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@Slf4j
public class UserTokenManager {

    private static RedisTemplate<String, String> redisTemplate = SpringUtil.getBean(StringRedisTemplate.class);

    public static CurrentUserBean getCurrentUser() {
        String str = getCurrentUserId();
        return JSONObject.parseObject(redisTemplate.opsForValue().get(str), CurrentUserBean.class);

    }

    public static String getCurrentUserId() {
        HttpServletRequest request = ((ServletRequestAttributes) (RequestContextHolder.currentRequestAttributes())).getRequest();
        return request.getHeader("token");
    }
}
