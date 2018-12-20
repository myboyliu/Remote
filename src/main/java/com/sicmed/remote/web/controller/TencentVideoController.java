package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.Constant;
import com.sicmed.remote.web.YoonaLtUtils.HttpConnectionUtils;
import com.sicmed.remote.web.YoonaLtUtils.SignatureUtils;
import com.sicmed.remote.web.bean.VideoBean;
import com.sicmed.remote.web.entity.CustomBranch;
import com.sicmed.remote.web.entity.TencentVideo;
import com.sicmed.remote.web.service.TencentVideoService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotEmpty;
import java.util.*;

/**
 * @program: remote
 * @description:
 * @author: Xue0601
 * @create: 2018-12-18 11:34
 **/
@Slf4j
@Validated
@RestController
@RequestMapping(value = "tencentVideo")
public class TencentVideoController extends BaseController {


    @Autowired
    private TencentVideoService tencentVideoService;

    /**
     * 上传课程
     *
     * @param fileId         视频id
     * @param videoPath      视频路径
     * @param coverPath      封面路径
     * @param classTitle     课程标题
     * @param customBranchId 录课科室
     * @param videoDescribe  直播描述
     * @param videoClass     课程类型
     * @return
     */
    @PostMapping(value = "addVideo")
    public Object addVideo(@NotEmpty String fileId,@NotEmpty String videoPath,@NotEmpty String coverPath,@NotEmpty String classTitle,@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String customBranchId,@NotEmpty String videoDescribe, @NotEmpty String videoClass) {
        TencentVideo video = new TencentVideo( );
        //存入相关数据
        video.setVideoFileId(fileId);
        video.setVideoName(classTitle);
        CustomBranch customBranch = new CustomBranch( );
        customBranch.setId(customBranchId);
        video.setCustomBranch(customBranch);
        video.setVideoClass(videoClass);
        video.setVideoDescribe(videoDescribe);
        video.setVideoUrl(videoPath);
        video.setVideoCoverUrl(coverPath);
        video.setUploadUser(getRequestToken( ));
        video.setCreateUser(getRequestToken( ));
        video.setCreateTime(new Date( ));
        int i = tencentVideoService.insertSelective(video);
        if (i > 0) {
            try {
                convertVodFile(fileId);
            } catch (Exception e) {
                e.printStackTrace( );
            }
            return succeedRequest(null);
        } else {
            return badRequestOfInsert("添加优享课程失败");
        }
    }

    /**
     * 通过id查询视频信息
     *
     * @param id
     * @return
     */
    @PostMapping(value = "findVideoById")
    public Object findVideoById(@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String id) {
        TencentVideo video = tencentVideoService.findVideoById(id);
        return succeedRequest(video);
    }

    /**
     * 修改课程信息
     *
     * @param id             id
     * @param classTitle     课程标题
     * @param customBranchId 录课科室
     * @param videoClass     课程分类
     * @param videoDescribe  课程描述
     * @param coverPath      封面路径
     * @return
     */
    @PostMapping(value = "updateVideo")
    public Object updateVideo(@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String id, @NotEmpty String classTitle,@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误")String customBranchId,@NotEmpty String videoClass,@NotEmpty String videoDescribe,@NotEmpty String coverPath) {
        TencentVideo video = new TencentVideo( );
        video.setId(id);
        video.setVideoName(classTitle);
        CustomBranch customBranch = new CustomBranch( );
        customBranch.setId(customBranchId);
        video.setCustomBranch(customBranch);
        video.setVideoClass(videoClass);
        video.setVideoDescribe(videoDescribe);
        video.setVideoCoverUrl(coverPath);
        video.setUpdateUser(getRequestToken( ));
        video.setUpdateTime(new Date( ));
        int i = tencentVideoService.updateByPrimaryKeySelective(video);
        if (i > 0) {
            return succeedRequest(null);
        } else {
            return badRequestOfInsert("修改优享课程失败");
        }
    }

    /**
     * 删除优享课程
     *
     * @param id
     * @param fileId
     * @return
     */
    @PostMapping(value = "deleteVideo")
    public Object deleteVideo(@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String id,@NotEmpty String fileId) {
        int i = tencentVideoService.deleteVideo(id, getRequestToken( ));
        if (i > 0) {
            try {
                deleteVodFile(fileId);
            } catch (Exception e) {
                log.info("腾讯端视频id:" + fileId + "的会员优享删除失败");
                e.printStackTrace( );
            }
            return succeedRequest(null);
        } else {
            return badRequestOfInsert("删除优享课程失败");
        }
    }

    /**
     * 查询我发出的视频
     *
     * @param pageNo
     * @param pageSize
     * @return
     */
    @PostMapping(value = "findMyVideoList")
    public Object findMyVideoList(@RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo, @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
        Map map = new LinkedHashMap( );
        //todo 总条数
        int i = tencentVideoService.findMyVideoListSize(getRequestToken( ), pageNo, pageSize);
        List <TencentVideo> videoList = new LinkedList <>( );
        if (i > 0) {
            videoList = tencentVideoService.findMyVideoList(getRequestToken( ), pageNo, pageSize);
        }
        map.put("pageTotal", i);
        map.put("videoList", videoList);
        return succeedRequest(map);
    }

    /**
     * 根据分类查询课程
     *
     * @param videoClass
     * @param typeName
     * @param pageNo
     * @param pageSize
     * @return
     */
    @PostMapping(value = "findVideoListByType")
    public Object findVideoListByType(@NotEmpty String videoClass,@NotEmpty String typeName, @RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo, @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
        Map map = new LinkedHashMap( );
        TencentVideo tencentVideo = new TencentVideo( );
        tencentVideo.setVideoClass(videoClass);
        tencentVideo.setPageNo((pageNo - 1) * pageSize);
        tencentVideo.setPageSize(pageSize);
        tencentVideo.setDelFlag("0");
        List <VideoBean> videoList;
        //TODO 总条数
        int i = tencentVideoService.findVideoListByTypeSize(tencentVideo);
        if (i > 0){
            if (typeName != null && typeName.equals(Constant.VIDEO_NEW)) {
                videoList = tencentVideoService.findVideoListByTypeNew(tencentVideo);
                map.put("pageTotal", i);
                map.put("videoList", videoList);
                return succeedRequest(map);
            } else if (typeName != null && typeName.equals(Constant.VIDEO_HOT)) {
                videoList = tencentVideoService.findVideoListByTypeHot(tencentVideo);
                map.put("pageTotal", i);
                map.put("videoList", videoList);
                return succeedRequest(map);
            } else {
                return badRequestOfArguments("查询失败,参数有误");
            }
        }else {
            return succeedRequest(map);
        }
    }

    /**
     * 增加一个点击量
     * @param videoId
     */
    @PostMapping(value = "addClicks")
    public void addClicks(@NotEmpty String videoId){
        synchronized (this){
            int num = tencentVideoService.getNumberById(videoId);
            TencentVideo video = new TencentVideo();
            video.setId(videoId);
            video.setPlayback(++num);
            tencentVideoService.updateNum(video);
        }
    }

    /**
     * 模糊搜索直播
     *
     * @param videoName 搜索内容
     * @param pageNo    页数
     * @param pageSize  每页显示数
     * @param typeName
     * @return
     */
    @PostMapping(value = "searchVideo")
    public Object searchLive(@NotEmpty String videoName, @NotEmpty String typeName, @RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo, @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
        Map map = new LinkedHashMap();
        TencentVideo tencentVideo = new TencentVideo( );
        tencentVideo.setVideoName(videoName);
        tencentVideo.setPageNo((pageNo - 1) * pageSize);
        tencentVideo.setPageSize(pageSize);
        tencentVideo.setDelFlag("0");
        List <VideoBean> videoList;
        //todo 总条数
        int i = tencentVideoService.searchVideoSize(tencentVideo);
        if (i > 0){
            if (Constant.VIDEO_NEW.equals(typeName)) {
                videoList = tencentVideoService.searchVideoNew(tencentVideo);
                map.put("pageTotal",i);
                map.put("videoList",videoList);
                return succeedRequest(map);
            } else if (Constant.VIDEO_HOT.equals(typeName)) {
                videoList = tencentVideoService.searchVideoHot(tencentVideo);
                map.put("pageTotal",i);
                map.put("videoList",videoList);
                return succeedRequest(map);
            } else {
                return badRequestOfArguments("查询失败,参数有误");
            }
        }else {
            return succeedRequest(map);
        }
    }

    /**
     * 视频转码接口
     *
     * @param fileId
     * @throws Exception
     */
    public void convertVodFile(String fileId) throws Exception {
        String action = "ConvertVodFile";
        String Region = "gz";
        //当前UNIX时间戳
        long timestamp = System.currentTimeMillis( ) / 1000;
        //随机正整数
        int Nonce = new Random( ).nextInt(Integer.MAX_VALUE);
        String privateKey = Constant.PRIVATEKEY;
        String SecretId = Constant.SECRETID;
        String param = "Action=" + action + "&Nonce=" + Nonce + "&Region=" + Region + "&SecretId=" + SecretId + "&Timestamp=" + timestamp + "&fileId=" + fileId + "&isScreenshot=1";
        String url = "GETvod.api.qcloud.com/v2/index.php?" + param;
        SignatureUtils signatureUtils = new SignatureUtils( );
        String signature = signatureUtils.hmacSHA1(url, privateKey);
        signature = java.net.URLEncoder.encode(signature, "utf8");
        HttpConnectionUtils.get("https://vod.api.qcloud.com/v2/index.php", "Action=" + action + "&Region=" + Region + "&Timestamp=" + timestamp + "&Nonce=" + Nonce + "&SecretId=" + SecretId + "&fileId=" + fileId + "&isScreenshot=" + "1" + "&Signature=" + signature);
    }

    /**
     * 删除视频
     *
     * @param fileId
     * @throws Exception
     */
    public void deleteVodFile(String fileId) throws Exception {
        String action = "DeleteVodFile";
        String Region = "gz";
        //当前UNIX时间戳
        long timestamp = System.currentTimeMillis( ) / 1000;
        //随机正整数
        int Nonce = new Random( ).nextInt(Integer.MAX_VALUE);
        String param = "Action=" + action + "&Nonce=" + Nonce + "&Region=" + Region + "&SecretId=" + Constant.SECRETID + "&Timestamp=" + timestamp + "&fileId=" + fileId + "&priority=1";
        String url = "GETvod.api.qcloud.com/v2/index.php?" + param;
        SignatureUtils signatures = new SignatureUtils( );
        String signature = signatures.hmacSHA1(url, Constant.PRIVATEKEY);
        signature = java.net.URLEncoder.encode(signature, "utf8");
        HttpConnectionUtils.get("https://vod.api.qcloud.com/v2/index.php", "Action=" + action + "&Region=" + Region + "&Timestamp=" + timestamp + "&Nonce=" + Nonce + "&SecretId=" + Constant.SECRETID + "&fileId=" + fileId + "&priority=1" + "&Signature=" + signature);
    }

}
