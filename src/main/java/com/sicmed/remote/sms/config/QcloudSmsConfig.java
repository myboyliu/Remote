package com.sicmed.remote.sms.config;


import com.github.qcloudsms.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QcloudSmsConfig {


    @Value("${qcloud.appid}")
    private int appid;

    @Value("${qcloud.secretkey}")
    private String secretkey;

    @Value("${qcloud.smssign}")
    private String smssign;

    @Bean(name = "smsSingleSender")
    public SmsSingleSender getSmsSingleSender() {
        //单发
        SmsSingleSender smsSingleSender = new SmsSingleSender(appid, secretkey);

        return smsSingleSender;
    }

    @Bean(name = "smsMultiSender")
    public SmsMultiSender getSmsMultiSender() {
        //群发
        SmsMultiSender smsMultiSender = new SmsMultiSender(appid, secretkey);
        return smsMultiSender;
    }

    @Bean(name = "smsVoicePromptSender")
    public SmsVoicePromptSender getSmsVoicePromptSender() {
        //语音通知
        SmsVoicePromptSender smsVoicePromptSender = new SmsVoicePromptSender(appid, secretkey);

        return smsVoicePromptSender;
    }

    @Bean(name = "smsVoiceVerifyCodeSender")
    public SmsVoiceVerifyCodeSender getSmsVoiceVerifyCodeSender() {
        //语音验证码
        SmsVoiceVerifyCodeSender smsVoiceVerifyCodeSender = new SmsVoiceVerifyCodeSender(appid, secretkey);

        return smsVoiceVerifyCodeSender;
    }

    @Bean(name = "fileVoiceSender")
    public FileVoiceSender getFileVoiceSender() {
        FileVoiceSender fileVoiceSender = new FileVoiceSender(appid, secretkey);
        return fileVoiceSender;
    }

    @Bean(name = "ttsVoiceSender")
    public TtsVoiceSender getTtsVoiceSender() {
        TtsVoiceSender ttsVoiceSender = new TtsVoiceSender(appid, secretkey);
        return ttsVoiceSender;
    }

    @Bean(name = "voiceFileUploader")
    public VoiceFileUploader getVoiceFileUploader() {
        VoiceFileUploader voiceFileUploader = new VoiceFileUploader(appid, secretkey);
        return voiceFileUploader;
    }
}
