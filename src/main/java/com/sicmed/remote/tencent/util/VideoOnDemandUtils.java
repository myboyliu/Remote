package com.sicmed.remote.tencent.util;

import com.alibaba.fastjson.JSON;
import com.sicmed.remote.common.Constant;
import com.sicmed.remote.web.YoonaLtUtils.HttpConnectionUtils;
import com.sicmed.remote.web.YoonaLtUtils.SignatureUtils;
import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.vod.v20180717.VodClient;
import com.tencentcloudapi.vod.v20180717.models.ModifyMediaInfoRequest;
import com.tencentcloudapi.vod.v20180717.models.ModifyMediaInfoResponse;
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
        long timestamp = System.currentTimeMillis() / 1000;
        //随机正整数
        int Nonce = new Random().nextInt(Integer.MAX_VALUE);
        String privateKey = Constant.PRIVATEKEY;
        String SecretId = Constant.SECRETID;
        String param = "Action=" + action + "&Nonce=" + Nonce + "&Region=" + Region + "&SecretId=" + SecretId + "&Timestamp=" + timestamp + "&fileId=" + fileId + "&isScreenshot=1";
        String url = "GETvod.api.qcloud.com/v2/index.php?" + param;
        SignatureUtils signatureUtils = new SignatureUtils();
        String signature = signatureUtils.hmacSHA1(url, privateKey);
        signature = java.net.URLEncoder.encode(signature, "utf8");
        String result = HttpConnectionUtils.get("https://vod.api.qcloud.com/v2/index.php", "Action=" + action + "&Region=" + Region + "&Timestamp=" + timestamp + "&Nonce=" + Nonce + "&SecretId=" + SecretId + "&fileId=" + fileId + "&isScreenshot=" + "1" + "&Signature=" + signature);
        Map<String, Object> map = (Map) JSON.parse(result);
        if (!map.get(PARAM).toString().equals(SUCCESS_CODE)) {
            log.info("filedId:" + fileId + "的视频转码失败!!" + map.get("message").toString());
        }
    }

    /**
     * 删除视频
     *
     * @param fileId
     * @throws Exception
     */
    public static void deleteVodFile(String fileId) throws Exception {
        String action = "DeleteVodFile";
        String Region = "gz";
        long timestamp = System.currentTimeMillis() / 1000;   //当前UNIX时间戳
        int Nonce = new Random().nextInt(Integer.MAX_VALUE);       //随机正整数
        String param = "Action=" + action + "&Nonce=" + Nonce + "&Region=" + Region + "&SecretId=" + Constant.SECRETID + "&Timestamp=" + timestamp + "&fileId=" + fileId + "&priority=1";
        String url = "GETvod.api.qcloud.com/v2/index.php?" + param;
        SignatureUtils signatures = new SignatureUtils();
        String signature = signatures.hmacSHA1(url, Constant.PRIVATEKEY);
        signature = java.net.URLEncoder.encode(signature, "utf8");
        HttpConnectionUtils.get("https://vod.api.qcloud.com/v2/index.php", "Action=" + action + "&Region=" + Region + "&Timestamp=" + timestamp + "&Nonce=" + Nonce + "&SecretId=" + Constant.SECRETID + "&fileId=" + fileId + "&priority=1" + "&Signature=" + signature);
    }

    /**
     * 修改点播媒体文件属性
     *
     * @param fileId
     * @throws Exception
     */
    public static String modifyMediaInfo(String fileId, String coverData) {
        try {

            Credential cred = new Credential(Constant.SECRETID, Constant.PRIVATEKEY);

            HttpProfile httpProfile = new HttpProfile();
            httpProfile.setEndpoint("vod.tencentcloudapi.com");

            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setHttpProfile(httpProfile);

            VodClient client = new VodClient(cred, "ap-guangzhou", clientProfile);

            String params = "{\"FileId\":\"" + fileId + "\",\"CoverData\":\"" + coverData + "\"}";
            ModifyMediaInfoRequest req = ModifyMediaInfoRequest.fromJsonString(params, ModifyMediaInfoRequest.class);
            ModifyMediaInfoResponse resp = client.ModifyMediaInfo(req);

            log.debug(ModifyMediaInfoRequest.toJsonString(resp));
            return resp.getCoverUrl();
        } catch (TencentCloudSDKException e) {
            log.info(e.toString());
        }
        return "FAILURE";
    }

}
