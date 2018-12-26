package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.Constant;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.bean.LiveInfoBean;
import com.sicmed.remote.web.bean.YqyLiveBean;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.entity.YqyLive;
import com.sicmed.remote.web.service.YqyLiveService;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import java.util.*;

/**
 * @program: remote
 * @description: 云起云直播
 * @author: Xue0601
 * @create: 2018-12-18 11:53
 **/
@Validated
@RestController
@RequestMapping(value = "yqyLive")
public class YqyLiveController extends BaseController {

    @Autowired
    private YqyLiveService yqyLiveService;

    /**
     * 发布预告
     *
     * @param file         封面图片
     * @param title        直播标题
     * @param customBranchId 科室id
     * @param liveDescribe 直播描述
     * @param startDate    直播开始时间
     * @param endDate      直播结束时间
     * @param liveClass    直播分类
     * @return
     */
    @PostMapping(value = "announcement")
    public Object announcement(@RequestParam(value = "file", required = false) MultipartFile file, @NotEmpty String title, @Length(min = 32, max = 32, message = "请求参数有误") String customBranchId, @NotEmpty String liveDescribe, @NotEmpty @NotEmpty @Length(min = 19, max = 19, message = "请求参数有误") String startDate, @NotEmpty @NotEmpty @Length(min = 19, max = 19, message = "请求参数有误") String endDate, String liveClass) {
        //申请的直播开始时间必须在当前时间十五分钟之后
        if (!YtDateUtils.compareDate(startDate)){
            return badRequestOfArguments("开始时间必须在十五分钟之后");
        }
        if (YtDateUtils.timeDifference(startDate, endDate)<=0){
            return badRequestOfArguments("结束时间必须大于开始时间");
        }
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue( ).get(getRequestToken( ));
        int i = yqyLiveService.announcement(file, title, customBranchId, liveDescribe, startDate, endDate, liveClass, userDetail);
        if (i > 0) {
            return succeedRequestOfInsert(null);
        } else {
            return badRequestOfInsert("添加失败");
        }
    }

    /**
     * 查询直播预告详情
     *
     * @param liveId
     * @return
     */
    @PostMapping(value = "findLiveDetail")
    public Object findLiveDetail(@Length(min = 32, max = 32, message = "请求参数有误") String liveId) {
        YqyLive yqyLive = yqyLiveService.getByPrimaryKey(liveId);
        return succeedRequest(yqyLive);
    }

    /**
     * 查询直播信息(弹框显示)
     *
     * @param liveId
     * @return
     */
    @PostMapping(value = "getLiveMessage")
    public Object getLiveMessage(@Length(min = 32, max = 32, message = "请求参数有误") String liveId) {
        LiveInfoBean liveInfoBean = yqyLiveService.getLiveMessage(liveId);
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue( ).get(getRequestToken( ));
        liveInfoBean.setUsername(userDetail.getUserName( ));
        return succeedRequest(liveInfoBean);
    }

    /**
     * 修改预告
     *
     * @param file         封面图片
     * @param liveRoomId   直播id(查询有)
     * @param livePwd      直播密码
     * @param id           id
     * @param title        直播标题
     * @param customBranchId       科室id
     * @param liveDescribe 直播描述
     * @param startDate    直播开始时间
     * @param endDate      直播结束时间
     * @param liveClass    直播分类
     * @return
     */
    @PostMapping(value = "updateAnnouncement")
    public Object updateAnnouncement(@RequestParam(value = "file", required = false) MultipartFile file, @NotEmpty String liveRoomId, @NotEmpty String livePwd, @Length(min = 32, max = 32, message = "请求参数有误") String id, @NotEmpty String title, @Length(min = 32, max = 32, message = "请求参数有误") String customBranchId, @NotEmpty String liveDescribe, @NotEmpty @Length(min = 19, max = 19, message = "请求参数有误") String startDate, @NotEmpty @Length(min = 19, max = 19, message = "请求参数有误") String endDate, String liveClass) {
        //申请的直播开始时间必须在当前时间十五分钟之后
        if (!YtDateUtils.compareDate(startDate)){
            return badRequestOfArguments("开始时间必须在十五分钟之后");
        }
        if (YtDateUtils.timeDifference(startDate, endDate)<=0){
            return badRequestOfArguments("结束时间必须大于开始时间");
        }
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue( ).get(getRequestToken( ));
        int i = yqyLiveService.updateAnnouncement(id, file, liveRoomId, livePwd, title, customBranchId, liveDescribe, startDate, endDate, liveClass, userDetail);
        if (i > 0) {
            return succeedRequest(null);
        } else {
            return badRequestOfUpdate("添加失败");
        }
    }

    /**
     * 查询自己发出的预告列表
     *
     * @param pageNo   页数
     * @param pageSize 每页显示数
     * @return
     */
    @PostMapping(value = "findMyAnnouncementList")
    public Object findMyAnnouncementList(@RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo, @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
        int i = yqyLiveService.findMyAnnouncementListSize(getRequestToken( ));
        Map map = new LinkedHashMap( );
        if (i > 0) {
            List <YqyLiveBean> liveList = yqyLiveService.findMyAnnouncementList(getRequestToken( ), pageNo, pageSize);
            map.put("pageTotal", i);
            map.put("liveList", liveList);
            return succeedRequest(map);
        } else {
            return succeedRequest(map);
        }
    }


    /**
     * 删除预告
     *
     * @param id 直播id
     * @param coverUrl      封面url
     * @param liveRoomId    直播房间id
     * @return
     */
    @PostMapping(value = "deleteAnnouncement")
    public Object deleteAnnouncement(@Length(min = 32, max = 32, message = "请求参数有误") String id, @NotEmpty String liveRoomId, @NotEmpty String coverUrl) {
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue( ).get(getRequestToken( ));
        int i = yqyLiveService.deleteAnnouncement(id, liveRoomId, coverUrl,userDetail);
        if (i > 0) {
            return succeedRequest(null);
        } else {
            return badRequestOfDelete("删除失败");
        }
    }

    /**
     * 根据直播类型查询直播列表
     *
     * @param liveClass   直播分类
     * @param findType 查询类型(最新/关注度)
     * @param pageNo   页数
     * @param pageSize 每页显示数
     * @return
     */
    @PostMapping(value = "findAnnouncementByType")
    public Object findAnnouncementByType(String liveClass, String findType, @RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo, @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
        int pageTotal = yqyLiveService.findAnnouncementByTypeSize(liveClass);
        if (pageTotal > 0){
            List <YqyLiveBean> yqyLiveBeanList = new LinkedList <>();
            Map map = new LinkedHashMap( );
            if (Constant.LIVE_NEW.equals(findType)) {
                yqyLiveBeanList = yqyLiveService.findAnnouncementByTypeNew(liveClass, pageNo, pageSize);
            } else if (Constant.LIVE_FOLLOW.equals(findType)) {
                yqyLiveBeanList = yqyLiveService.findAnnouncementByTypeFollow(liveClass, pageNo, pageSize);
            }
//        //判断是否关注
//        LiveFollow liveFollow;
//        for (int i = 0; i < liveBroadcastList.size(); i++) {
//            liveFollow = new LiveFollow();
//            liveFollow.setUserurl(getRequestToken());
//            liveFollow.setLiveId(liveBroadcastList.get(i).getId());
//            if (liveFollowService.findFollowByParam(liveFollow) != null) {
//                liveBroadcastList.get(i).setIsFollow(true);
//            } else {
//                liveBroadcastList.get(i).setIsFollow(false);
//            }
//        }
            map.put("pageTotal", pageTotal);
            map.put("yqyLiveBeanList",yqyLiveBeanList);
            return succeedRequest(map);
        }else {
            return succeedRequest(null);
        }
    }


    /**
     * 模糊搜索直播
     *
     * @param liveName 搜索内容
     * @param pageNo   页数
     * @param pageSize 每页显示数
     * @param findType 查询类型
     * @return
     */
    @PostMapping(value = "searchLive")
    public Object searchLive(@NotEmpty String liveName, @NotEmpty String findType, @RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo, @RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
        Map map = new LinkedHashMap( );
        int pageTotal = yqyLiveService.searchAnnouncementSize(liveName.trim());
        if (pageTotal > 0){
            List <YqyLiveBean> liveList;
            if (Constant.LIVE_NEW.equals(findType)) {
                liveList = yqyLiveService.searchAnnouncementNew(liveName.trim(), pageNo, pageSize);
                map.put("pageTotal",pageTotal);
                map.put("liveList",liveList);
            } else if (Constant.LIVE_FOLLOW.equals(findType)) {
                liveList = yqyLiveService.searchAnnouncementHot(liveName.trim(), pageNo, pageSize);
                map.put("pageTotal",pageTotal);
                map.put("liveList",liveList);
            }
            //判断是否关注
//        for (int i = 0; i < liveBroadcastList.size(); i++) {
//            LiveFollow liveFollow = new LiveFollow();
//            liveFollow.setUserId(TokenManageUtils.getToken().getId());
//            liveFollow.setLiveId(liveBroadcastList.get(i).getId());
//            if (liveFollowService.findFollowByParam(liveFollow) != null) {
//                liveBroadcastList.get(i).setIsFollow(true);
//            } else {
//                liveBroadcastList.get(i).setIsFollow(false);
//            }
//        }
            return succeedRequest(map);
        }else {
            return succeedRequest(null);
        }
    }

    /**
     * 设置默认封面
     * @param id
     * @param path
     * @return
     */
    @PostMapping(value = "defaultCover")
    public Object defaultCover(@Length(min = 32, max = 32, message = "请求参数有误") String id, @NotEmpty String path) {
        YqyLive yqyLive = new YqyLive( );
        yqyLive.setId(id);
        yqyLive.setLiveCoverUrl(Constant.DEFAULT_COVER_URL);
        int i = yqyLiveService.setDefaultCover(yqyLive, path);
        if (i > 0) {
            return succeedRequest(null);
        } else {
            return badRequestOfUpdate("设置失败");
        }
    }

}
