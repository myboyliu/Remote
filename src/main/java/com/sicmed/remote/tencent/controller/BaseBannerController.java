package com.sicmed.remote.tencent.controller;

import com.sicmed.remote.tencent.entity.BaseBanner;
import com.sicmed.remote.tencent.service.BaseBannerService;
import com.sicmed.remote.web.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "banner")
public class BaseBannerController extends BaseController {

    @Autowired
    private BaseBannerService baseBannerService;


    @GetMapping(value = "getBannerList")
    public Object getBannerList() {
        List<BaseBanner> baseBannerList = baseBannerService.getList();
        return succeedRequest(baseBannerList);
    }

}
