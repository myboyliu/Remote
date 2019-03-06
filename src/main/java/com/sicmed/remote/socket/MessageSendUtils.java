package com.sicmed.remote.socket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.socket.WebSocketSession;

@Slf4j
public class MessageSendUtils {

    @Autowired
    private static SimpMessagingTemplate template;

    public static void sendUser(String token, String messageJson) {
        log.debug(token);
        log.debug(messageJson);
        //1.发送在线消息
        WebSocketSession webSocketSession = SocketManager.get(token);
        if (webSocketSession != null) {
            /**
             * 主要防止broken pipe
             */
            template.convertAndSendToUser(token, "/queue/sendUser", "您好");
        }

        //2.存储离线消息


    }


    public static void sendTopic(String messageJson) {
        log.debug(messageJson);
        //1.发送在线消息
        template.convertAndSend("/topic/sendTopic", "大家晚上好");
        //2.存储离线消息
    }
}
