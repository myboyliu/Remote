package com.sicmed.remote.live.controller;

import com.sicmed.remote.live.entity.Live;
import com.sicmed.remote.live.service.LiveService;
import com.sicmed.remote.web.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 直播 接口
 *
 * @author MaxCoder
 */
@RestController
@RequestMapping(value = "live")
public class LiveController extends BaseController {

    @Autowired
    private LiveService liveService;

    /**
     * 创建直播
     * @param live
     * @return
     */
    @PostMapping(value = "create")
    public Object createLive(Live live) {

        liveService.insertSelective(live);

        return succeedRequest("SUCCESS");
    }

}
