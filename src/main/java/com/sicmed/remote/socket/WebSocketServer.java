package com.sicmed.remote.socket;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @program: my-springboot
 * @description: websocket服务
 * @author: Xue0601
 * @create: 2018-12-25 10:59
 **/
@Component
@ServerEndpoint(value = "/websocket/{id}")
public class WebSocketServer {
    private static int onlineCount = 0;
    private static ConcurrentHashMap <String, WebSocketServer> webSocketSet = new ConcurrentHashMap <>( );

    /**
     * 与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    private Session session;
    private static Logger log = LogManager.getLogger(WebSocketServer.class);
    private String id = "";

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(@PathParam(value = "id") String id, Session session) {
        this.session = session;
        //接收到发送消息的人员编号
        this.id = id;
        //加入set中
        webSocketSet.put(id, this);
        addOnlineCount( );           //在线数加1
        log.info("用户" + id + "加入！当前在线人数为" + getOnlineCount( ));
        try {
            sendMessage("连接成功");
        } catch (IOException e) {
            log.error("websocket IO异常");
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        //从set中删除
        webSocketSet.remove(this);
        //在线数减1
        subOnlineCount( );
        log.info("有一连接关闭！当前在线人数为" + getOnlineCount( ));
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(@PathParam("id") String userId,String message, Session session) {
        //可以自己约定字符串内容，比如 内容|0 表示信息群发，内容|X 表示信息发给id为X的用户
        System.out.println("当前登录id="+userId );
        String sendMessage = message.split("[|]")[0];
        String sendUserId = message.split("[|]")[1];
        try {
            if (sendUserId.equals("0")) {
                sendtoAll(sendMessage);
            } else {
                sendtoUser(sendMessage, sendUserId);
            }
        } catch (IOException e) {
            e.printStackTrace( );
        }

    }

    /**
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("发生错误");
        error.printStackTrace( );
    }


    /**
     * 服务器主动推送
     * @param message
     * @throws IOException
     */
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote( ).sendText(message);
    }

    /**
     * 发送信息给指定ID用户，如果用户不在线则返回不在线信息给自己
     *
     * @param message
     * @param sendUserId
     * @throws IOException
     */
    public void sendtoUser(String message, String sendUserId) throws IOException {
        if (webSocketSet.get(sendUserId) != null) {
            if (!id.equals(sendUserId)) {

                webSocketSet.get(sendUserId).sendMessage(getNowTime() +"用户" + id + "发来消息：" + " <br/> " + message);
            } else {

                webSocketSet.get(sendUserId).sendMessage(getNowTime() +"用户" + id + "发来消息：" + " <br/> " + message);
            }
        } else {
            //如果用户不在线则返回不在线信息给自己
            sendtoUser("当前用户不在线", id);
        }
    }

    /**
     * 获取当前时间
     *
     * @return
     */
    private String getNowTime() {
        Date date = new Date( );
        DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = format.format(date);
        return time;
    }

    /**
     * 发送信息给所有人
     *
     * @param message
     * @throws IOException
     */
    public void sendtoAll(String message) throws IOException {
        for (String key : webSocketSet.keySet( )) {
            try {
                webSocketSet.get(key).sendMessage(getNowTime() +"用户" + id + "发来消息：" + " <br/> " + message);
            } catch (IOException e) {
                e.printStackTrace( );
            }
        }
    }


    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocketServer.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebSocketServer.onlineCount--;
    }
}




