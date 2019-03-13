package com.sicmed.remote.config;

import com.alibaba.fastjson.support.spring.GenericFastJsonRedisSerializer;
import com.sicmed.remote.task.RedisTimerListener;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Scope;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
public class LettuceRedisConfig {
 
    @Bean
    @ConfigurationProperties(prefix = "spring.redis.lettuce.pool")
    @Scope(value = "prototype")
    public GenericObjectPoolConfig redisPool(){
        return new GenericObjectPoolConfig();
    }
 
    @Bean
    @ConfigurationProperties(prefix = "spring.redis.redis-a")
    public RedisStandaloneConfiguration redisConfigA(){
        return new RedisStandaloneConfiguration();
    }
 
    @Bean
    @ConfigurationProperties(prefix = "spring.redis.redis-b")
    public RedisStandaloneConfiguration redisConfigB(){
        return new RedisStandaloneConfiguration();
    }

    @Bean
    @ConfigurationProperties(prefix = "spring.redis.redis-c")
    public RedisStandaloneConfiguration redisConfigC(){
        return new RedisStandaloneConfiguration();
    }

//    @Autowired
//    private LettuceConnectionFactory lettuceConnectionFactory;

    @Bean
    @Primary
    public LettuceConnectionFactory factoryA(GenericObjectPoolConfig config, RedisStandaloneConfiguration redisConfigA){
        LettuceClientConfiguration clientConfiguration = LettucePoolingClientConfiguration.builder()
                .poolConfig(config).commandTimeout(Duration.ofMillis(config.getMaxWaitMillis())).build();
        return new LettuceConnectionFactory(redisConfigA, clientConfiguration);
    }
 
    @Bean
    public LettuceConnectionFactory factoryB(GenericObjectPoolConfig config, RedisStandaloneConfiguration redisConfigB){
        LettuceClientConfiguration clientConfiguration = LettucePoolingClientConfiguration.builder()
                .poolConfig(config).commandTimeout(Duration.ofMillis(config.getMaxWaitMillis())).build();
        return new LettuceConnectionFactory(redisConfigB, clientConfiguration);
    }
 
    @Bean
    public LettuceConnectionFactory factoryC(GenericObjectPoolConfig config, RedisStandaloneConfiguration redisConfigC){
        LettuceClientConfiguration clientConfiguration = LettucePoolingClientConfiguration.builder()
                .poolConfig(config).commandTimeout(Duration.ofMillis(config.getMaxWaitMillis())).build();
        return new LettuceConnectionFactory(redisConfigC, clientConfiguration);
    }
 
    @Bean
    @Primary
    public StringRedisTemplate redisTemplateA(LettuceConnectionFactory factoryA){
        StringRedisTemplate template = getRedisTemplate();
        template.setConnectionFactory(factoryA);
        return template;
    }
 
    @Bean
    public StringRedisTemplate redisTemplateB(LettuceConnectionFactory factoryB){
        StringRedisTemplate template = getRedisTemplate();
        template.setConnectionFactory(factoryB);
        return template;
    }
 
    @Bean
    public StringRedisTemplate redisTemplateC(LettuceConnectionFactory factoryC){
        StringRedisTemplate template = getRedisTemplate();
        template.setConnectionFactory(factoryC);
        return template;
    }
 
    private StringRedisTemplate getRedisTemplate(){
        StringRedisTemplate template = new StringRedisTemplate();
        template.setValueSerializer(new GenericFastJsonRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }

    @Bean
    public ChannelTopic expiredTopic() {
        return new ChannelTopic("__keyevent@0__:expired");  // @0选择0号数据库
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(LettuceConnectionFactory factoryA) {
        RedisMessageListenerContainer redisMessageListenerContainer = new RedisMessageListenerContainer();
        redisMessageListenerContainer.setConnectionFactory(factoryA);
        return redisMessageListenerContainer;
    }

    @Bean
    public RedisTimerListener redisTimerListener(RedisMessageListenerContainer redisMessageListenerContainer) {
        RedisTimerListener redisTimerListener = new RedisTimerListener(redisMessageListenerContainer);
        return redisTimerListener;
    }
}
