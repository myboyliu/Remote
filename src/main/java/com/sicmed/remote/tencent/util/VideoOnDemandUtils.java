package com.sicmed.remote.tencent.util;

import com.alibaba.fastjson.JSON;
import com.sicmed.remote.common.Constant;
import com.sicmed.remote.web.YoonaLtUtils.HttpConnectionUtils;
import com.sicmed.remote.web.YoonaLtUtils.SignatureUtils;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.Random;

@Slf4j
public class VideoOnDemandUtils {
    /**
     * 腾讯云返回json关键数据
     */
    private static final String PARAM = "code";
    private static final String SUCCESS_CODE = "0";

    /**
     * 视频转码
     *
     * @param fileId
     * @throws Exception
     */
    public static void convertVodFile(String fileId) throws Exception {
        String action = "ConvertVodFile";
        String Region = "gz";
        //当前UNIX时间戳
        long timestamp = System.currentTimeMillis( ) / 1000;
        //随机正整数
        int Nonce = new Random( ).nextInt(Integer.MAX_VALUE);
        String privateKey = Constant.PRIVATEKEY;
        String SecretId = Constant.SECRETID;
        String param = "Action=" + action + "&Nonce=" + Nonce + "&Region=" + Region + "&SecretId=" + SecretId + "&Timestamp=" + timestamp + "&fileId=" + fileId + "&isScreenshot=1";
        String url = "GETvod.api.qcloud.com/v2/index.php?" + param;
        SignatureUtils signatureUtils = new SignatureUtils( );
        String signature = signatureUtils.hmacSHA1(url, privateKey);
        signature = java.net.URLEncoder.encode(signature, "utf8");
        String result = HttpConnectionUtils.get("https://vod.api.qcloud.com/v2/index.php", "Action=" + action + "&Region=" + Region + "&Timestamp=" + timestamp + "&Nonce=" + Nonce + "&SecretId=" + SecretId + "&fileId=" + fileId + "&isScreenshot=" + "1" + "&Signature=" + signature);
        Map<String, Object> map = (Map) JSON.parse(result);
        if (!map.get(PARAM).toString().equals(SUCCESS_CODE)){
            log.info("filedId:"+ fileId + "的视频转码失败!!"+map.get("message").toString());
        }
    }

}
