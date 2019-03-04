package com.sicmed.remote.live.controller;

import com.sicmed.remote.common.util.FileUtils;
import com.sicmed.remote.live.bean.FuzzySearchLiveBean;
import com.sicmed.remote.live.bean.GetLiveParamBean;
import com.sicmed.remote.live.entity.Live;
import com.sicmed.remote.live.service.LiveService;
import com.sicmed.remote.web.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
    @Value("${img.location}")
    private String location;

    /**
     * 创建直播
     *
     * @param live
     * @return
     */
    @PostMapping(value = "create")
    public Object createLive(@RequestParam(value = "file", required = false) MultipartFile file, Live live) {
        String fileName = file.getOriginalFilename();
        try {
            FileUtils.uploadFile(file.getBytes(), location, fileName);
        } catch (IOException e) {

        }
        live.setLiveCoverUrl(fileName);
        liveService.insertSelective(live);

        return succeedRequest(live);
    }


    /**
     * 根据条件查询直播列表数量
     */
    @GetMapping(value = "selectCountByParam")
    public Object selectCountByParam(GetLiveParamBean getLiveParamBean) {

        int listCount = liveService.selectCountByParam(getLiveParamBean);

        return succeedRequest(listCount);
    }
    /**
     * 根据条件查询直播列表内容
     */
    @GetMapping(value = "selectListByParam")
    public Object selectListByParam(GetLiveParamBean getLiveParamBean) {

        List<Live> liveList = liveService.selectListByParam(getLiveParamBean);

        return succeedRequest(liveList);
    }

    /**
     * 根据条件查询直播列表数量
     */
    @GetMapping(value = "searchCountByParam")
    public Object searchCountByParam(FuzzySearchLiveBean fuzzySearchLiveBean) {

        int listCount = liveService.searchCountByParam(fuzzySearchLiveBean);

        return succeedRequest(listCount);
    }
    /**
     * 根据条件查询直播列表内容
     */
    @GetMapping(value = "searchListByParam")
    public Object searchListByParam(FuzzySearchLiveBean fuzzySearchLiveBean) {

        List<Live> liveList = liveService.searchListByParam(fuzzySearchLiveBean);

        return succeedRequest(liveList);
    }
}
