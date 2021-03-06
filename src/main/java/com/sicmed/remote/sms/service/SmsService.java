package com.sicmed.remote.sms.service;


import com.github.qcloudsms.httpclient.HTTPException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;


@Service
public interface SmsService {

    /**
     * 指定模板单发短信
     */
    /**
     *
     * @param nationCode 短信地区码 中国 86
     * @param phoneNumber 手机号码
     * @param templateId 模版ID
     * @param param 模版参数
     * @return
     */
    boolean singleSendByTemplate(String nationCode, String phoneNumber, int templateId, ArrayList<String> param);

    /**
     * 指定模板群发短信
     */
    boolean multiSendByTemplate(String nationCode, ArrayList<String> phoneNumbers, int templateId, ArrayList<String> params);

    /**
     * 单发短信
     */
    boolean singleSend(int type, String nationCode, String phoneNumber, String msg);

    /**
     * 群发短信
     */
    boolean multiSend(int type, String nationCode, ArrayList<String> phoneNumbers, ArrayList<String> params, String msg);

}
