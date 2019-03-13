package com.sicmed.remote;

import com.sicmed.remote.meeting.util.SpringUtil;
import org.apache.catalina.connector.Connector;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableCaching
@SpringBootApplication
@EnableScheduling
@MapperScan({"com.sicmed.remote.web.mapper", "com.sicmed.remote.tencent.mapper", "com.sicmed.remote.yunqiyun.mapper", "com.sicmed.remote.live.mapper", "com.sicmed.remote.meeting.mapper", "com.sicmed.remote.socket.mapper", "com.sicmed.remote.rbac.mapper"})
public class RemoteApplication {


    @Value("${http.port}")
    private Integer port;

    public static void main(String[] args) {
        ApplicationContext app = SpringApplication.run(RemoteApplication.class, args);
        SpringUtil.setApp(app);
    }

    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        tomcat.addAdditionalTomcatConnectors(createStandardConnector()); // 添加http
        return tomcat;
    }

    private Connector createStandardConnector() {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setPort(port);
        return connector;
    }
}
