package com.sicmed.remote.tencent.controller;

import com.sicmed.remote.tencent.bean.FuzzySearchVideoBean;
import com.sicmed.remote.tencent.bean.SelectVideoListParamBean;
import com.sicmed.remote.tencent.bean.VideoListBean;
import com.sicmed.remote.tencent.entity.VideoOnDemand;
import com.sicmed.remote.tencent.service.VideoOnDemandService;
import com.sicmed.remote.tencent.util.VideoOnDemandUtils;
import com.sicmed.remote.web.controller.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(value = "vod")
public class VideoOnDemandController extends BaseController {

    @Autowired
    private VideoOnDemandService videoOnDemandService;

    /**
     * 根据视频类型 查询 视频列表数量
     *
     * @param selectVideoListParamBean
     * @return
     */
    @GetMapping(value = "getVideoListCount")
    public Object getVideoListCount(SelectVideoListParamBean selectVideoListParamBean) {

        int count = videoOnDemandService.getVideoListCountByParam(selectVideoListParamBean);

        return succeedRequest(count);

    }

    /**
     * 根据视频类型 查询 视频列表
     *
     * @param selectVideoListParamBean
     * @return
     */
    @GetMapping(value = "getVideoList")
    public Object getVideoList(SelectVideoListParamBean selectVideoListParamBean) {

        List<VideoListBean> videoOnDemandList = videoOnDemandService.getVideoListByParam(selectVideoListParamBean);

        return succeedRequest(videoOnDemandList);
    }

    @GetMapping(value = "fuzzySearchVideoListCount")
    public Object fuzzySearchVideoListCount(FuzzySearchVideoBean fuzzySearchVideoBean) {
        log.debug(fuzzySearchVideoBean.toString());
        int count = videoOnDemandService.fuzzyVideoListCountByParam(fuzzySearchVideoBean);

        return succeedRequest(count);
    }


    /**
     * 根据视频名称 模糊查询 视频列表
     *
     * @param fuzzySearchVideoBean
     * @return
     */
    @GetMapping(value = "fuzzySearchVideoList")
    public Object fuzzySearchVideoList(FuzzySearchVideoBean fuzzySearchVideoBean) {
        log.debug(fuzzySearchVideoBean.toString());
        List<VideoListBean> videoOnDemandList = videoOnDemandService.fuzzyVideoListByParam(fuzzySearchVideoBean);

        return succeedRequest(videoOnDemandList);
    }


    @PostMapping(value = "addVideo")
    public Object addVideo(VideoOnDemand videoOnDemand) {
        //存入相关数据
        videoOnDemand.setUploadUser(getRequestToken());
        videoOnDemand.setCreateUser(getRequestToken());
        videoOnDemand.setHospitalId(getCurrentUser().getHospitalId());
        int i = videoOnDemandService.insertSelective(videoOnDemand);
        if (i > 0) {
            try {
                VideoOnDemandUtils.convertVodFile(videoOnDemand.getVideoFileId());
            } catch (Exception e) {
                e.printStackTrace();
            }
            return succeedRequest(null);
        } else {
            return badRequestOfInsert("添加优享课程失败");
        }
    }


    /**
     * 增加一个点击量
     *
     * @param videoId
     */
    @PostMapping(value = "addClickCount")
    public Object addClickCount(String videoId) {

        videoOnDemandService.addClickCount(videoId);

        return succeedRequest("SUCCESS");

    }

    /**
     * 点播视频管理功能接口
     */

    /**
     * 根据视频创建者 查询 视频列表数量
     *
     * @param
     * @return
     */
    @GetMapping(value = "getVideoListCountByUser")
    public Object getVideoListCountByUser() {

        int count = videoOnDemandService.getVideoListCountByUser(getRequestToken());

        return succeedRequest(count);

    }

    /**
     * 根据视频创建者 查询 视频列表
     *
     * @param
     * @return
     */
    @GetMapping(value = "getVideoListByUser")
    public Object getVideoListByUser() {
        VideoOnDemand videoOnDemand = new VideoOnDemand();
        videoOnDemand.setCreateUser(getRequestToken());
        List<VideoListBean> videoOnDemandList = videoOnDemandService.getVideoListByUser(videoOnDemand);

        return succeedRequest(videoOnDemandList);

    }

    /**
     * 删除 一条点播视频
     *
     * @param videoOnDemand
     * @return
     * @throws Exception
     */
    @GetMapping(value = "removeVideoByUser")
    public Object removeVideoByUser(VideoOnDemand videoOnDemand) throws Exception {
        videoOnDemand.setCreateUser(getRequestToken());
        int i = videoOnDemandService.deleteVideoByParam(videoOnDemand);
        if (i > 0) {
            VideoOnDemandUtils.deleteVodFile(videoOnDemand.getVideoFileId());
            return succeedRequest("SUCCESS");
        }
        return badRequestOfArguments("FAILED");

    }

    /**
     * 根据ID 查询 一条点播视频信息
     *
     * @param id
     * @return
     */
    @GetMapping(value = "getVideoInfo")
    public Object removeVideoByUser(String id) {

        VideoOnDemand videoOnDemand = videoOnDemandService.getByPrimaryKey(id);

        return succeedRequest(videoOnDemand);

    }


    @PostMapping(value = "updateVideo")
    public Object updateVideo(VideoOnDemand videoOnDemand, String coverData) {

        if (coverData != null) {
            String result = VideoOnDemandUtils.modifyMediaInfo(videoOnDemand.getVideoFileId(), coverData);
            if ("FAILURE".equals(result)) {
                return badRequestOfArguments("操作失败!");
            }
            videoOnDemand.setVideoCoverUrl(result);
        }
        int i = videoOnDemandService.updateByPrimaryKeySelective(videoOnDemand);
        return i == 1 ? succeedRequest("操作成功!") : badRequestOfArguments("操作失败!");
    }
}
