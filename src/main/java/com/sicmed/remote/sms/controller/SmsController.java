package com.sicmed.remote.sms.controller;

import com.sicmed.remote.sms.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("sms")
public class SmsController {

    @Autowired
    private SmsService smsService;

    /**
     * https://127.0.0.1/sms/send
     */
    @GetMapping("send")
    public Object tSend(){
        ArrayList<String> smsContext = new ArrayList<>();
        smsContext.add("您收到一份来自XX医院XX科室XX的会诊申请，请前往医来医往远程平台处理");
        return smsService.singleSendByTemplate("86", "17778155280", 313661, smsContext);
//        return smsService.singleSend(0,"86","17778155280","下班了");
    }
}
