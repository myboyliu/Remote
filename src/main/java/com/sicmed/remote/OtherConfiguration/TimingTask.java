package com.sicmed.remote.OtherConfiguration;

import com.sicmed.remote.socket.MessageSendService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TimingTask {
    @Autowired
    private MessageSendService messageSendService;

    // 直播点播系统,新课程推送每周一早上8点触发
    @Scheduled(cron = "0 0 8 ? * MON")
    public void pushMessage() {
        String str = "有新内容了！上周更新的课程都在这里，点击立即去观看";
        messageSendService.sendTopic(str);
    }
}
