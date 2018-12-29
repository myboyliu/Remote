package com.sicmed.remote.socket;

/**
 * @program: my-springboot
 * @description: 服务端发送消息实体
 * @author: Xue0601
 * @create: 2018-12-25 09:58
 **/
public class ServerMessage {
    private String responseMessage;

    public ServerMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }
}
