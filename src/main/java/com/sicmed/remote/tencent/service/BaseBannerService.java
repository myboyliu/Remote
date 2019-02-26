package com.sicmed.remote.tencent.service;

import com.sicmed.remote.tencent.entity.BaseBanner;
import com.sicmed.remote.tencent.mapper.BaseBannerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BaseBannerService {

    @Autowired
    private BaseBannerMapper baseBannerMapper;


    public List<BaseBanner> getList(){
        return baseBannerMapper.getList();
    }

}
