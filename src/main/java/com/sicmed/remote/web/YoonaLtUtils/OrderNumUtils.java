package com.sicmed.remote.web.YoonaLtUtils;

import org.springframework.data.redis.core.RedisTemplate;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @program: tele-medicine
 * @description:
 * @author: Xue0601
 * @create: 2018-04-27 13:25
 **/
public class OrderNumUtils {

    /**
     * 生成订单号存redis数据库中
     * @param redisClient
     * @return
     */
    public static String getOrderNo(RedisTemplate redisClient) {
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
        String keys = formatter.format(date);
        String number;
        if (redisClient.opsForValue().get(keys) != null) {
            number = redisClient.opsForValue().get(keys).toString();
            DecimalFormat df = new DecimalFormat("000000");
            String nextNum = df.format(1 + Integer.parseInt(number));
            redisClient.opsForValue().set(keys,(Object)nextNum);
            number = keys+ nextNum;
        } else {
            redisClient.delete((Integer.parseInt(keys)-1)+"");
            redisClient.opsForValue().set(keys, "000001");
            number = "000001";
            redisClient.opsForValue().set(keys, (Object)number);
            number = keys +"000001";
        }
        return number;
    }

}
