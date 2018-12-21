package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.entity.Banner;
import com.sicmed.remote.web.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @program: remote
 * @description: 横幅controller
 * @author: Xue0601
 * @create: 2018-12-21 11:06
 **/
@RestController
@RequestMapping(value = "banner")
public class BannerController extends BaseController {


    @Autowired
    private BannerService bannerService;
    @Value("${img.location}")
    private String location;

    /**
     * 添加横幅(默认不启用)
     * @param multipartFile
     * @param linkPath
     * @return
     */
    @PostMapping(value = "addBanner")
    public Object addBanner(@RequestParam(value = "file", required = false) MultipartFile multipartFile, String linkPath) {

        int i = bannerService.addBanner(multipartFile, linkPath, location,getRequestToken());
        if (i > 0) {
            return succeedRequestOfInsert(null);
        } else {
            return badRequestOfInsert("数据库插入失败");
        }
    }

    /**
     * 开关横幅
     * @param id
     * @param marker (true:启用,false:不启用)
     * @return
     */
    @PostMapping(value = "switchBanner")
    public Object switchBanner(String id,boolean marker){
        Banner banner = new Banner();
        banner.setId(id);
        if (marker){
            banner.setBannerPictureStatus("1");
        }else {
            banner.setBannerPictureStatus("0");
        }
        int i = bannerService.switchBanner(banner);
        if (i>0){
            return succeedRequestOfUpdate(null);
        }else {
            return badRequestOfUpdate("数据库修改失败");
        }
    }

    /**
     * 查询所有横幅
     * @return
     */
    @PostMapping(value = "findList")
    public Object findList(){
        List<Banner> bannerList = bannerService.findList();
        return succeedRequestOfSelect(bannerList);
    }

    /**
     * 根据条件查询启用/未启用横幅
     * @param marker
     * @return
     */
    @PostMapping(value = "findBannerListByParam")
    public Object findBannerListByParam(boolean marker){
        Banner banner = new Banner();
        if (marker){
            banner.setBannerPictureStatus("1");
        }else {
            banner.setBannerPictureStatus("0");
        }
        List<Banner> bannerList = bannerService.findBannerListByParam(banner);
        return succeedRequestOfSelect(bannerList);
    }

}
