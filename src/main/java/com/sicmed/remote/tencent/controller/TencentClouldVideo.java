package com.sicmed.remote.tencent.controller;

import com.sicmed.remote.common.Constant;
import com.sicmed.remote.web.YoonaLtUtils.Signature;
import com.sicmed.remote.web.controller.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Random;

import static com.alibaba.druid.util.Utils.md5;

/**
 * @program: tele-medicine
 * @description: 腾讯云点播获取签名
 * @author: Xue0601
 * @create: 2018-11-02 17:13
 **/
@Slf4j
@RestController
@RequestMapping(value = "signature/video")
public class TencentClouldVideo extends BaseController {

    /**
     * 获取视频上传签名
     *
     * @return
     */
    @PostMapping(value = "getSignature")
    public Object getSignature() {
        Signature sign = new Signature();
        sign.setSecretKey(Constant.PRIVATEKEY);
        sign.setSecretId(Constant.SECRETID);
        sign.setCurrentTime(System.currentTimeMillis() / 1000);
        sign.setRandom(new Random().nextInt(Integer.MAX_VALUE));
        sign.setSignValidDuration(3600 * 24 * 2);
        try {
            String signature = sign.getUploadSignature();
            return succeedRequest(signature);
        } catch (Exception e) {
            log.info("获取签名失败");
            e.printStackTrace();
            return null;
        }
    }
}
