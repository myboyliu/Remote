package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.web.entity.TencentVideo;
import com.sicmed.remote.web.service.TencentVideoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


/**
 * @program: tele-medicine
 * @description: 腾讯回调事件处理
 * @author: Xue0601
 * @create: 2018-11-02 11:12
 **/
@Slf4j
@RestController
@RequestMapping(value = "event")
public class EventProcessing {

    @Autowired
    private TencentVideoService tencentVideoService;

    /**
     * 事件回调函数,目前只处理转码后回调
     * @param str
     * @throws Exception
     */
    @PostMapping(value = "eventProcessing")
    public void eventProcessing(@RequestBody String str) throws Exception {
        TencentVideo video = new TencentVideo();
        Map <String, Object> map = (Map) JSON.parse(str.toString());
        if ("TranscodeComplete".equals(map.get("eventType").toString())) {
            Map <String, Object> map1 = (Map) JSON.parse(map.get("data").toString());
            video.setVideoFileId(map1.get("fileId").toString());
            video.setVideoCoverUrl(map1.get("coverUrl").toString());
            JSONArray jsonArray = JSONArray.parseArray(map1.get("playSet").toString());
            JSONObject video1 = jsonArray.getJSONObject(1);
            video.setVideoUrl(video1.get("url").toString());
            video.setTransCode("1");
            int i = tencentVideoService.updateVideoFile(video);
            if (i < 0){
                log.info("视频id:"+video.getVideoFileId()+"的文件转码成功,但未修改本地转码状态");
            }
        }
    }

    //删除事件
//    public static void main(String[] args) {
//        String a = "{\"data\":{\"fileInfo\":[{\"fileId\":\"5285890782778373724\"}],\"message\":\"\",\"status\":0},\"eventType\":\"FileDeleted\",\"version\":\"4.0\"}";
//        System.out.println(JSON.parse(a.toString()));
//        Map <String, Object> map = (Map) JSON.parse(a.toString());
//        System.out.println("version=" + map.get("version"));
//        System.out.println("eventType=" + map.get("eventType"));
////        System.out.println("data="+map.get("data").toString());
//        Map <String, Object> map1 = (Map) JSON.parse(map.get("data").toString());
//        JSONArray jsonArray = JSONArray.parseArray(map1.get("fileInfo").toString());
//        if (jsonArray.size() > 0) {
//            for (int i = 0; i < jsonArray.size(); i++) {
//                JSONObject doctor = jsonArray.getJSONObject(i);
//                System.out.println("fileId=" + doctor.get("fileId"));
//            }
//        }
//    }

//    //上传事件
//    public static void main(String[] args) {
//        String str = "{\"version\":\"4.0\",\"eventType\":\"NewFileUpload\",\"data\":{\"status\":0,\"message\":\"\",\"vodTaskId\":\"\",\"fileId\":\"5285890782840573784\",\"fileUrl\":\"http://1257546586.vod2.myqcloud.com/d3387d33vodcq1257546586/a44a98395285890782840573784/hy7mALpmTWAA.mp4\",\"fileName\":\"test\",\"continued\":0,\"author\":\"\",\"sourceType\":\"ClientUpload\",\"sourceContext\":\"\",\"metaData\":{\"audioDuration\":8.034104347229004,\"audioStreamList\":[{\"bitrate\":131080,\"codec\":\"aac\",\"samplingRate\":44100}],\"bitrate\":1171634,\"container\":\"mov,mp4,m4a,3gp,3g2,mj2\",\"duration\":8,\"floatDuration\":8.034104347229004,\"height\":544,\"md5\":\"\",\"rotate\":0,\"size\":1177451,\"totalSize\":1177451,\"videoDuration\":8,\"videoStreamList\":[{\"bitrate\":1040554,\"codec\":\"h264\",\"fps\":25,\"height\":544,\"width\":960}],\"width\":960}}}";
//        Map <String, Object> map = (Map) JSON.parse(str.toString());
//        System.out.println(map.get("eventType").toString());
//        if ("NewFileUpload".equals(map.get("eventType").toString())) {
//            System.out.println("这是上传事件");
//        }
//    }


}
