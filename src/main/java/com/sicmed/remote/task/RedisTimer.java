package com.sicmed.remote.task;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

import java.io.Serializable;

@Data
public class RedisTimer implements Serializable {

    private String key;

    private long time;

    private JSONObject jsonObject;

}
