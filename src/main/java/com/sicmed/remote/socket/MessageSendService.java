package com.sicmed.remote.socket;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.socket.mapper.NewMessageMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

/**
 * 消息分发工具类
 */
@Slf4j
@Service
public class MessageSendService {

    @Autowired
    private SimpMessagingTemplate template;

    /**
     * 发送消息给指定用户
     */
    public void send(JSONObject jsonObject) {
        log.debug("===============================发送消息给用户开始===========================================");
        //1.获取接收用户列表
        JSONArray userList = jsonObject.getJSONArray("userList");
        //2.获取消息内容
        String message = jsonObject.getString("title");
        //3.发送在线消息
        if (userList != null && userList.size() > 0) {
            new Thread(() -> {
                WebSocketSession webSocketSession;
                for (int i = 0; i < userList.size(); i++) {
                    String token = userList.getString(i);
                    webSocketSession = SocketManager.get(token);
                    if (webSocketSession != null) {
                        /**
                         * 主要防止broken pipe
                         */
                        template.convertAndSendToUser(token, "/queue/sendUser", message);
                        log.debug("发送消息:" + message + "---TO:" + token + "---成功");
                    }
                }
            }).start();
        } else {
            template.convertAndSend("/topic/sendTopic", jsonObject.toJSONString());
        }
        //4.添加消息记录
//        messageMapper.insertSelectiveByJSONObject(jsonObject);
        log.debug("===============================发送消息给用户结束===========================================");

    }

    /**
     * 发送消息给指定用户
     *
     * @param token       用户ID
     * @param messageJson 消息内容 JSON 字符串
     */
    public void sendUser(String token, String messageJson) {

        log.debug(token);
        log.debug(messageJson);
        //TODO 发送在线消息
        WebSocketSession webSocketSession = SocketManager.get(token);
        if (webSocketSession != null) {
            /**
             * 主要防止broken pipe
             */
            template.convertAndSendToUser(token, "/queue/sendUser", messageJson);
        }
        //TODO 存储离线消息

    }

    /**
     * 发送消息给所有用户
     *
     */
    public void sendTopic(JSONObject jsonObject) {
        log.debug(jsonObject.toJSONString());
        //1.发送在线消息
        template.convertAndSend("/topic/sendTopic", jsonObject.get("title"));
    }
}
