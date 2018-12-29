package com.sicmed.remote.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

/**
 * @program: my-springboot
 * @description: webSocket配置类
 * 注解开启使用STOMP协议来传输基于代理(message broker)的消息,这时控制器支持使用@MessageMapping,就像使用@RequestMapping一样
 * @author: Xue0601
 * @create: 2018-12-25 09:21
 **/
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter( );
    }


    /**
     * 注册stomp的端点
     *
     * @param registry
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {//注册STOMP协议的节点(endpoint),并映射指定的url
        // 允许使用socketJs方式访问，访问点为webSocketServer，允许跨域
        // 在网页上我们就可以通过这个链接
        // http://localhost:8080/webSocketServer
        // 来和服务器的WebSocket连接
        registry.addEndpoint("/webSocketServer").setAllowedOrigins("*").withSockJS( );

    }

    /**
     * 配置信息代理
     *
     * @param registry
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {//配置消息代理(Message Broker)
        // 订阅Broker名称
        registry.enableSimpleBroker("/queue", "/topic");
        // 全局使用的消息前缀（客户端订阅路径上会体现出来）
        registry.setApplicationDestinationPrefixes("/app");
        // 点对点使用的订阅前缀（客户端订阅路径上会体现出来），不设置的话，默认也是/user/
        // registry.setUserDestinationPrefix("/user/");
    }
}
