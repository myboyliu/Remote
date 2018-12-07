package com.sicmed.remote;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan({"com.sicmed.remote.web.mapper"})
public class RemoteApplication {

    public static void main(String[] args) {
        SpringApplication.run(RemoteApplication.class, args);
    }
}
