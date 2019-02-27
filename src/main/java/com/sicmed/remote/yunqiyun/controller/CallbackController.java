package com.sicmed.remote.yunqiyun.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.yunqiyun.bean.YqyLiveBean;
import com.sicmed.remote.yunqiyun.entity.YqyLive;
import com.sicmed.remote.yunqiyun.service.YqyLiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * @program: remote
 * @description: 云起云回调接口
 * @author: Xue0601
 * @create: 2018-12-18 11:53
 **/
@RestController
@RequestMapping(value = "/api/conference/")
public class CallbackController {

    @Autowired
    private YqyLiveService yqyLiveService;

    /**
     * 云起云视频同步回调接口
     * @param appointmentId
     * @param obj
     * @return
     */
    @PutMapping(value = "{appointmentId}/synchFile")
    public Object VideoAddress(@PathVariable String appointmentId,@RequestBody(required = false) String obj) {
        Map map = new HashMap();
        YqyLiveBean yqyLiveBean = yqyLiveService.getLiveByRoomId(appointmentId);
        if (yqyLiveBean!=null){
            YqyLive yqyLive = new YqyLive();
            yqyLive.setId(yqyLiveBean.getId());
            //解析json数据
            JSONObject json = JSON.parseObject(obj);
            System.out.println("会议存储路径为:"+json.get("filePath"));
            //TODO 未把视频路径存到本地
            map.put("code",200);
            map.put("msg","SUCCESS");
        }else {
            map.put("code",4004);
            map.put("msg","预约会议不存在");
        }
        return map;
    }

}
