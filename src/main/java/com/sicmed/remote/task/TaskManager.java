package com.sicmed.remote.task;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

/**
 * Task管理器
 */
@Slf4j
public class TaskManager {
    private static ConcurrentHashMap<String, RedisTimer> manager = new ConcurrentHashMap();

    public static void add(String key, RedisTimer s) {
        log.debug("添加新Task{} ", key);
        manager.put(key, s);
    }

    public static void remove(String key) {
        log.debug("移除Task {} ", key);
        manager.remove(key);
    }

    public static RedisTimer get(String key) {
        log.debug("获取Task {}", key);
        return manager.get(key);
    }


}