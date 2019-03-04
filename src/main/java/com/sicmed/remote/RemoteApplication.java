package com.sicmed.remote;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;


@EnableCaching
@SpringBootApplication
@MapperScan({"com.sicmed.remote.web.mapper","com.sicmed.remote.tencent.mapper","com.sicmed.remote.yunqiyun.mapper","com.sicmed.remote.live.mapper","com.sicmed.remote.meeting.mapper"})
public class RemoteApplication {
    public static void main(String[] args) {
        SpringApplication.run(RemoteApplication.class, args);
    }
}
