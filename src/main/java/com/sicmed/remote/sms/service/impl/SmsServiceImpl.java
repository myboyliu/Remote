package com.sicmed.remote.sms.service.impl;

import com.github.qcloudsms.*;
import com.github.qcloudsms.httpclient.HTTPException;
import com.sicmed.remote.sms.service.SmsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;

@Slf4j
@Service
public class SmsServiceImpl implements SmsService {

    @Autowired
    private SmsSingleSender smsSingleSender;

    @Autowired
    private SmsMultiSender smsMultiSender;

    @Autowired
    private SmsVoicePromptSender smsVoicePromptSender;

    @Autowired
    private SmsVoiceVerifyCodeSender smsVoiceVerifyCodeSender;


    /**
     * 指定模版单发
     *
     * @param nationCode
     * @param phoneNumber
     * @param templateId
     * @param param
     * @return
     * @throws HTTPException
     * @throws IOException
     */


    @Override
    public boolean singleSendByTemplate(String nationCode, String phoneNumber, int templateId, ArrayList<String> param) {

        SmsSingleSenderResult smsSingleSenderResult = null;
        try {
            smsSingleSenderResult = smsSingleSender.sendWithParam(nationCode, phoneNumber, templateId, param, null, null, null);
        } catch (Exception e) {
            return false;
        }
        log.info("短信发送结果:" + smsSingleSenderResult.toString());
        //判断 短信发送是否成功
        if (smsSingleSenderResult.result == 0) {
            return true;
        }
        return false;
    }


    /**
     * 指定模板群发短信
     *
     * @param nationCode
     * @param phoneNumbers
     * @param templateId
     * @param params
     * @return
     * @throws HTTPException
     * @throws IOException
     */


    @Override
    public boolean multiSendByTemplate(String nationCode, ArrayList<String> phoneNumbers, int templateId, ArrayList<String> params) {

        //发送短信
        SmsMultiSenderResult smsMultiSenderResult = null;
        try {
            smsMultiSenderResult = smsMultiSender.sendWithParam(nationCode, phoneNumbers, templateId, params, null, null, null);
        } catch (Exception e) {
            return false;
        }
        //判断 短信发送是否成功
        if (smsMultiSenderResult.result == 0) {
            return true;
        }
        return false;
    }

    /**
     * 单发短信
     *
     * @param type
     * @param nationCode
     * @param phoneNumber
     * @param msg
     * @return
     * @throws HTTPException
     * @throws IOException
     */

    @Override
    public boolean singleSend(int type, String nationCode, String phoneNumber, String msg) {

        SmsSingleSenderResult smsSingleSenderResult = null;
        try {
            smsSingleSenderResult = smsSingleSender.send(type, nationCode, phoneNumber, msg, null, null);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        //判断 短信发送是否成功
        if (smsSingleSenderResult.result == 0) {
            return true;
        }
        System.out.println(smsSingleSenderResult.errMsg);
        return false;
    }

    /**
     * 群发短信
     *
     * @param type
     * @param nationCode
     * @param phoneNumbers
     * @param params
     * @param msg
     * @return
     * @throws HTTPException
     * @throws IOException
     */

    @Override
    public boolean multiSend(int type, String nationCode, ArrayList<String> phoneNumbers, ArrayList<String> params, String msg) {

        try {
            //判断 短信发送是否成功
            return smsMultiSender.send(type, nationCode, phoneNumbers, msg, null, null).result == 0 ? true : false;
        } catch (Exception e) {
            return false;
        }
    }

}
