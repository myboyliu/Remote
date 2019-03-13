package com.sicmed.remote.socket;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.meeting.util.SpringUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.socket.WebSocketSession;

@Slf4j
public class InstantMessageUtils {

    private static SimpMessagingTemplate template = SpringUtil.getBean(SimpMessagingTemplate.class);

    /**
     * 发送消息给指定用户
     */
    public static void sendToOnlineUser(JSONObject jsonObject) {
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
                        template.convertAndSendToUser(token, "/queue/sendUser", message);
                    }
                }
            }).start();
        } else {
            template.convertAndSend("/topic/sendTopic", jsonObject.toJSONString());
        }

    }
}
