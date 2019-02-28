package com.sicmed.remote.tencent.controller;

import com.sicmed.remote.common.Constant;
import com.sicmed.remote.web.YoonaLtUtils.HttpConnectionUtils;
import com.sicmed.remote.web.YoonaLtUtils.SignatureUtils;
import com.sicmed.remote.web.controller.BaseController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

/**
 * @program: tele-medicine
 * @description: 视频处理
 * @author: Xue0601
 * @create: 2018-11-02 17:26
 **/
@RestController
@RequestMapping(value = "video/processing")
public class VideoProcessing extends BaseController {


    /**
     * 获取视频信息
     *
     * @param fileId
     * @return
     * @throws Exception
     */
//    @GetMapping(value = "getVideoInfo")
//    public Object getVideoInfo(String fileId) throws Exception {
//        String action = "GetVideoInfo";
//        String Region = "gz";
//        long timestamp = System.currentTimeMillis() / 1000;   //当前UNIX时间戳
//        int Nonce = new Random().nextInt(Integer.MAX_VALUE);       //随机正整数
//        String param = "Action=" + action  + "&Nonce=" + Nonce + "&Region=" + Region + "&SecretId=" + Constant.SECRETID + "&Timestamp=" + timestamp + "&fileId=" + fileId + "&infoFilter.0=basicInfo"+"&infoFilter.5=transcodeInfo";
//        String url = "GETvod.api.qcloud.com/v2/index.php?" + param;
//        SignatureUtils test = new SignatureUtils();
//        String signature = test.hmacSHA1(url, Constant.PRIVATEKEY);
//        signature = java.net.URLEncoder.encode(signature, "utf8");
//        String a = HttpConnectionUtils.get("https://vod.api.qcloud.com/v2/index.php", "Action=" + action + "&Region=" + Region + "&Timestamp=" + timestamp + "&Nonce=" + Nonce + "&SecretId=" + Constant.SECRETID + "&fileId=" + fileId +"&infoFilter.0=basicInfo" +"&infoFilter.5=transcodeInfo" + "&Signature=" + signature);
//        return succeedRequest(a);
//    }


    /**
     * 删除视频
     * @param fileId
     * @return
     * @throws Exception
     */
//    @PostMapping(value = "deleteVodFile")
//    public void deleteVodFile(String fileId) throws Exception{
//        String action = "DeleteVodFile";
//        String Region = "gz";
//        long timestamp = System.currentTimeMillis() / 1000;   //当前UNIX时间戳
//        int Nonce = new Random().nextInt(Integer.MAX_VALUE);       //随机正整数
//        String param = "Action=" + action + "&Nonce=" + Nonce + "&Region=" + Region + "&SecretId=" + Constant.SECRETID + "&Timestamp=" + timestamp + "&fileId=" + fileId + "&priority=1";
//        String url = "GETvod.api.qcloud.com/v2/index.php?" + param;
//        SignatureUtils signatures = new SignatureUtils();
//        String signature = signatures.hmacSHA1(url, Constant.PRIVATEKEY);
//        signature = java.net.URLEncoder.encode(signature, "utf8");
//        HttpConnectionUtils.get("https://vod.api.qcloud.com/v2/index.php", "Action=" + action + "&Region=" + Region + "&Timestamp=" + timestamp + "&Nonce=" + Nonce + "&SecretId=" + Constant.SECRETID + "&fileId=" + fileId + "&priority=1" + "&Signature=" + signature);
//    }


}
