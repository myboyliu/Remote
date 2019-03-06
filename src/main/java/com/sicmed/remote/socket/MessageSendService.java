package com.sicmed.remote.socket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.socket.WebSocketSession;

/**
 * 消息分发工具类
 */
@Slf4j
public class MessageSendService {

    @Autowired
    private  SimpMessagingTemplate template;

    /**
     * 发送消息给指定用户
     * @param token 用户ID
     * @param messageJson 消息内容 JSON 字符串
     */
    public void sendUser(String token, String messageJson) {
        log.debug(token);
        log.debug(messageJson);
        //1.发送在线消息
        WebSocketSession webSocketSession = SocketManager.get(token);
        if (webSocketSession != null) {
            /**
             * 主要防止broken pipe
             */
            template.convertAndSendToUser(token, "/queue/sendUser", messageJson);
        }
        log.debug("获取 socket 用户 失败");
        //2.存储离线消息


    }

    /**
     * 发送消息给所有用户
     * @param messageJson 消息内容 JSON 字符串
     */
    public void sendTopic(String messageJson) {
        log.debug(messageJson);
        //1.发送在线消息
        template.convertAndSend("/topic/sendTopic", messageJson);
        //2.存储离线消息
    }
}