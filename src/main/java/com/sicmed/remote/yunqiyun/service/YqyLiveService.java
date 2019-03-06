package com.sicmed.remote.yunqiyun.service;

import com.alibaba.fastjson.JSON;
import com.sicmed.remote.common.Constant;
import com.sicmed.remote.common.util.FileUtils;
import com.sicmed.remote.web.YoonaLtUtils.HttpClientUtils;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.service.BaseService;
import com.sicmed.remote.yunqiyun.bean.LiveInfoBean;
import com.sicmed.remote.yunqiyun.bean.YqyLiveBean;
import com.sicmed.remote.web.controller.FileController;
import com.sicmed.remote.web.entity.CustomBranch;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.yunqiyun.entity.YqyLive;
import com.sicmed.remote.yunqiyun.mapper.YqyLiveMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;

/**
 * @program: remote
 * @description: 云起云直播service
 * @author: Xue0601
 * @create: 2018-12-19 11:28
 **/
@Slf4j
@Service
public class YqyLiveService {

    @Autowired
    private YqyLiveMapper yqyLiveMapper;
    @Value("${img.location}")
    private String staticPathImage;


    public YqyLiveBean getLiveByRoomId(String appointmentId) {
        return yqyLiveMapper.getLiveByRoomId(appointmentId);
    }
}
