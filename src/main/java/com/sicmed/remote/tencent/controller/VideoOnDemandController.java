package com.sicmed.remote.tencent.controller;

import com.sicmed.remote.tencent.bean.FuzzySearchVideoBean;
import com.sicmed.remote.tencent.entity.TencentVideo;
import com.sicmed.remote.tencent.entity.VideoOnDemand;
import com.sicmed.remote.tencent.service.VideoOnDemandService;
import com.sicmed.remote.web.controller.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(value = "vod")
public class VideoOnDemandController extends BaseController {

    @Autowired
    private VideoOnDemandService videoOnDemandService;

    @GetMapping(value = "fuzzySearchVideoListCount")
    public Object getVideoListCount(FuzzySearchVideoBean fuzzySearchVideoBean) {
        log.debug(fuzzySearchVideoBean.toString());
        int count = videoOnDemandService.fuzzyVideoListCountByParam(fuzzySearchVideoBean);

        return succeedRequest(count);
    }

    @GetMapping(value = "fuzzySearchVideoList")
    public Object getVideoList(FuzzySearchVideoBean fuzzySearchVideoBean) {
        log.debug(fuzzySearchVideoBean.toString());
        List<VideoOnDemand> videoOnDemandList = videoOnDemandService.fuzzyVideoListByParam(fuzzySearchVideoBean);

        return succeedRequest(videoOnDemandList);
    }

}
