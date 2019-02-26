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
            Map map = new LinkedHashMap();
            map.put("signature", signature);
            return succeedRequest(map);
        } catch (Exception e) {
            log.info("获取签名失败");
            e.printStackTrace();
            return null;
        }
    }

    public static void main(String[] args) {
        //当前时间戳精确到毫秒
        long timestamp = (System.currentTimeMillis() / 1000);
        System.out.println(timestamp);

        //将其转换为十六进制并输出
        String strHex = Integer.toHexString((int) timestamp);
        System.out.println(strHex);

        //腾讯云key防盗链获取sign
        //生成规则 sign = md5(KEY + Dir + t + exper + rlimit + us)
        //key 腾讯云管理平台生成, dir 文件源存储路径 t 时间戳精确到秒 exper 是看时间 rlimit 同时观看最大人数 us 随机数
        System.out.println(md5("UvxKt2I71n80ulh2dIZg/d3387d33vodcq1257546586/fafd38775285890784376686033/"+strHex+"72d4cd1101"));
    }
}
