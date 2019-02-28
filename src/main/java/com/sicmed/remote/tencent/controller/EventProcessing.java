package com.sicmed.remote.tencent.controller;

import com.alibaba.fastjson.JSON;
import com.sicmed.remote.tencent.service.VideoOnDemandService;
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
    @Autowired
    private VideoOnDemandService videoOnDemandService;

    public static final String EVENT_TYPE_NAME = "TranscodeComplete";
    public static final String EVENT_TYPE = "eventType";

    /**
     * 事件回调函数,目前只处理转码后回调
     * @param str
     * @throws Exception
     */
    @PostMapping(value = "eventProcessing")
    public void eventProcessing(@RequestBody String str) throws Exception {
        TencentVideo video = new TencentVideo();
        Map <String, Object> map = (Map) JSON.parse(str.toString());
        if (EVENT_TYPE_NAME.equals(map.get(EVENT_TYPE).toString())) {
            Map <String, Object> map1 = (Map) JSON.parse(map.get("data").toString());
            int i = videoOnDemandService.updataByEventResult(map1);
            if (i < 0){
                log.info("视频id:"+video.getVideoFileId()+"的文件转码成功,但未修改本地转码状态");
            }
        }
    }
}
