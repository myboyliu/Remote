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
public class YqyLiveService implements BaseService<YqyLive> {

    @Autowired
    private YqyLiveMapper yqyLiveMapper;
    @Value("${img.location}")
    private String staticPathImage;

    @Override
    public int insertSelective(YqyLive yqyLive) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(YqyLive yqyLive) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(YqyLive yqyLive) {
        return 0;
    }

    /**
     * 通过id查询详情
     *
     * @param id
     * @return
     */
    @Override
    public YqyLive getByPrimaryKey(String id) {
        return yqyLiveMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<YqyLive> findByDynamicParam(YqyLive yqyLive) {
        return null;
    }

    /**
     * 云起云创建接口
     *
     * @param accessToken   token
     * @param title         会议标题
     * @param startDate     会议开始时间字符串(yyyy-MM-dd HH:mm:ss)
     * @param endDate       会议结束时间字符串(yyyy-MM-dd HH:mm:ss)
     * @param isLive        是否开启直播(true/false)
     * @param isMute        参会者进入时是否静音(true/false)
     * @param isRecord      是否开启录制(true/false)
     * @param concurrentNum 所需并发数(int类型)
     * @return
     */
    public String svocCreateInterface(String accessToken, String title, String startDate, String endDate, boolean isLive, boolean isMute, boolean isRecord, int concurrentNum) {
        //调用云起云创建会议接口
        Map params = new LinkedHashMap();
        params.put("appointmentName", title);
        params.put("appointmentPeriod", YtDateUtils.timeDifference(startDate, endDate));
        params.put("appointmentType", "1");
        params.put("hostPwd", (int) ((Math.random() * 9 + 1) * 1000) + "");
        params.put("isLive", isLive);
        params.put("isMute", isMute);
        params.put("isRecord", isRecord);
        params.put("livePwd", "");
        params.put("startTime", YtDateUtils.stringToDates(startDate).getTime());
        params.put("concurrentNum", concurrentNum);
        return HttpClientUtils.createMeeting(Constant.BASEPATH + Constant.APPOINTMENTS_URL, accessToken, params);
    }

    /**
     * 云起云修改接口
     *
     * @param accessToken   token
     * @param title         会议标题
     * @param liveRoomId    房间号
     * @param livePwd       直播密码
     * @param startDate     会议开始时间字符串(yyyy-MM-dd HH:mm:ss)
     * @param endDate       会议结束时间字符串(yyyy-MM-dd HH:mm:ss)
     * @param isLive        是否开启直播(true/false)
     * @param isMute        参会者进入时是否静音(true/false)
     * @param isRecord      是否开启录制(true/false)
     * @param concurrentNum 所需并发数(int类型)
     * @return
     */
    public String svocUpdateInterface(String accessToken, String title, String liveRoomId, String livePwd, String startDate, String endDate, boolean isLive, boolean isMute, boolean isRecord, int concurrentNum) {
        //调用云起云创建会议接口
        Map params = new LinkedHashMap();
        params.put("appointmentName", title);
        params.put("appointmentId", liveRoomId);
        params.put("appointmentPeriod", YtDateUtils.timeDifference(startDate, endDate));
        params.put("appointmentType", "1");
        params.put("hostPwd", livePwd);
        params.put("isLive", isLive);
        params.put("isMute", isMute);
        params.put("isRecord", isRecord);
        params.put("livePwd", "");
        params.put("startTime", YtDateUtils.stringToDates(startDate).getTime());
        params.put("concurrentNum", concurrentNum);
        return HttpClientUtils.updateMeeting(params, Constant.BASEPATH + Constant.APPOINTMENTS_URL, accessToken);
    }

    /**
     * 解析云起云返回结果json
     *
     * @param json
     * @return
     */
    public Map<String, Object> resultAnalysis(String json) {
        Map<String, Object> response = (Map) JSON.parse(json);
        if (response.get("code") != null && "200".equals(response.get("code").toString())) {
            Map<String, Object> map1 = (Map) JSON.parse(response.get("data").toString());
            return map1;
        } else {
            return null;
        }
    }

    /**
     * 保存直播信息(有封面路径)
     *
     * @param title
     * @param customBranchId
     * @param map1
     * @param liveClass
     * @param liveDescribe
     * @param startDate
     * @param endDate
     * @param pictureUrl
     * @param userId
     * @return
     */
    public int saveLive(String title, String customBranchId, Map<String, Object> map1, String liveClass, String liveDescribe, String startDate, String endDate, String pictureUrl, String userId) {
        CustomBranch customBranch = new CustomBranch();
        YqyLive yqyLive = new YqyLive();
        yqyLive.setLiveName(title);
        customBranch.setId(customBranchId);
        yqyLive.setLiveRoomId(map1.get("appointmentId")!= null ? map1.get("appointmentId").toString() : "");
        yqyLive.setAdminUrl(map1.get("webrtcUrl") != null ? map1.get("webrtcUrl").toString() : "");
        yqyLive.setAdminPwd(map1.get("hostPwd") != null ? map1.get("hostPwd").toString() : "");
        yqyLive.setLiveUrl(map1.get("liveUrl") != null ? map1.get("liveUrl").toString() : "");
        yqyLive.setCustomBranch(customBranch);
        yqyLive.setLiveClass(liveClass);
        yqyLive.setLiveDescribe(liveDescribe);
        yqyLive.setLiveStartTime(YtDateUtils.stringToDates(startDate));
        yqyLive.setLiveEndTime(YtDateUtils.stringToDates(endDate));
        yqyLive.setLiveCoverUrl(pictureUrl);
        yqyLive.setLiveUserId(userId);
        yqyLive.setCreateUser(userId);
        return yqyLiveMapper.insertSelective(yqyLive);
    }

    /**
     * 保存直播信息(无有封面路径)
     *
     * @param title
     * @param customBranchId
     * @param map1
     * @param liveClass
     * @param liveDescribe
     * @param startDate
     * @param endDate
     * @param userId
     * @return
     */
    public int saveLive(String title, String customBranchId, Map<String, Object> map1, String liveClass, String liveDescribe, String startDate, String endDate, String userId) {
        YqyLive yqyLive = new YqyLive();
        CustomBranch customBranch = new CustomBranch();
        yqyLive.setLiveName(title);
        customBranch.setId(customBranchId);
        yqyLive.setLiveRoomId(map1.get("appointmentId") != null ? map1.get("appointmentId").toString() : "");
        yqyLive.setAdminUrl(map1.get("webrtcUrl") != null ? map1.get("webrtcUrl").toString() : "");
        yqyLive.setAdminPwd(map1.get("hostPwd") != null ? map1.get("hostPwd").toString() : "");
        yqyLive.setLiveUrl(map1.get("liveUrl") != null ? map1.get("liveUrl").toString() : "");
        yqyLive.setCustomBranch(customBranch);
        yqyLive.setLiveClass(liveClass);
        yqyLive.setLiveDescribe(liveDescribe);
        yqyLive.setLiveStartTime(YtDateUtils.stringToDates(startDate));
        yqyLive.setLiveEndTime(YtDateUtils.stringToDates(endDate));
        yqyLive.setLiveUserId(userId);
        yqyLive.setCreateUser(userId);
        return yqyLiveMapper.insertSelective(yqyLive);
    }

    /**
     * 修改直播信息(有封面路径)
     *
     * @param title
     * @param customBranchId
     * @param map1
     * @param liveClass
     * @param liveDescribe
     * @param startDate
     * @param endDate
     * @param pictureUrl
     * @param userId
     * @return
     */
    public int updateLive(String id, String title, String customBranchId, Map<String, Object> map1, String liveClass, String liveDescribe, String startDate, String endDate, String pictureUrl, String userId) {
        YqyLive yqyLive = new YqyLive();
        CustomBranch customBranch = new CustomBranch();
        yqyLive.setLiveName(title);
        customBranch.setId(customBranchId);
        yqyLive.setId(id);
        yqyLive.setLiveRoomId(map1.get("appointmentId") != null ? map1.get("appointmentId").toString() : "");
        yqyLive.setAdminUrl(map1.get("webrtcUrl") != null ? map1.get("webrtcUrl").toString() : "");
        yqyLive.setAdminPwd(map1.get("hostPwd") != null ? map1.get("hostPwd").toString() : "");
        yqyLive.setLiveUrl(map1.get("liveUrl") != null ? map1.get("liveUrl").toString() : "");
        yqyLive.setCustomBranch(customBranch);
        yqyLive.setLiveClass(liveClass);
        yqyLive.setLiveDescribe(liveDescribe);
        yqyLive.setLiveStartTime(YtDateUtils.stringToDates(startDate));
        yqyLive.setLiveCoverUrl(pictureUrl);
        yqyLive.setLiveEndTime(YtDateUtils.stringToDates(endDate));
        yqyLive.setUpdateUser(userId);
        yqyLive.setUpdateTime(new Date());
        return yqyLiveMapper.updateByPrimaryKeySelective(yqyLive);
    }

    /**
     * 修改直播信息(无有封面路径)
     *
     * @param title
     * @param customBranchId
     * @param map1
     * @param liveClass
     * @param liveDescribe
     * @param startDate
     * @param endDate
     * @param userId
     * @return
     */
    public int updateLive(String id, String title, String customBranchId, Map<String, Object> map1, String liveClass, String liveDescribe, String startDate, String endDate, String userId) {
        YqyLive yqyLive = new YqyLive();
        CustomBranch customBranch = new CustomBranch();
        yqyLive.setLiveName(title);
        customBranch.setId(customBranchId);
        yqyLive.setId(id);
        yqyLive.setLiveRoomId(map1.get("appointmentId") != null ? map1.get("appointmentId").toString() : "");
        yqyLive.setAdminUrl(map1.get("webrtcUrl") != null ? map1.get("webrtcUrl").toString() : "");
        yqyLive.setAdminPwd(map1.get("hostPwd") != null ? map1.get("hostPwd").toString() : "");
        yqyLive.setLiveUrl(map1.get("liveUrl") != null ? map1.get("liveUrl").toString() : "");
        yqyLive.setCustomBranch(customBranch);
        yqyLive.setLiveClass(liveClass);
        yqyLive.setLiveDescribe(liveDescribe);
        yqyLive.setLiveStartTime(YtDateUtils.stringToDates(startDate));
        yqyLive.setLiveEndTime(YtDateUtils.stringToDates(endDate));
        yqyLive.setUpdateUser(userId);
        yqyLive.setUpdateTime(new Date());
        return yqyLiveMapper.updateByPrimaryKeySelective(yqyLive);
    }

    /**
     * 上传封面
     *
     * @param multipartFile
     * @return
     */
    public String uploadPicture(MultipartFile multipartFile) {
        String fileNameAndSuffixName = multipartFile.getOriginalFilename();
        String contentType = fileNameAndSuffixName.substring(fileNameAndSuffixName.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + contentType;
        String pictureUrl = "";
        try {
            FileUtils.uploadFile(multipartFile.getBytes(), staticPathImage + "/coverUrl", fileName);
            pictureUrl = "coverUrl/" + fileName;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            return pictureUrl;
        }

    }

    /**
     * 添加直播信息
     *
     * @param multipartFile
     * @param title
     * @param customBranchId
     * @param liveDescribe
     * @param startDate
     * @param endDate
     * @param liveClass
     * @param userDetail
     * @return
     */
    @Transactional
    public int announcement(MultipartFile multipartFile, String title, String customBranchId, String liveDescribe, String startDate, String endDate, String liveClass, UserDetail userDetail) {
        //调用云起云授权认证接口
        String accessToken = HttpClientUtils.getMethod(userDetail.getTelephone(), userDetail.getUserName());
        //判断授权是否成功    授权成功有返回值
        if (accessToken == null) {
            log.info("云起云授权失败");
            return 0;
        }
        //调用云起云创建会议接口
        String res = svocCreateInterface(accessToken, title, startDate, endDate, true, true, false, 1);
        Map<String, Object> resultObject = resultAnalysis(res);
        if (resultObject != null) {
            if (multipartFile != null) {
                String pictureUrl = uploadPicture(multipartFile);
                return saveLive(title, customBranchId, resultObject, liveClass, liveDescribe, startDate, endDate, pictureUrl, userDetail.getId());
            } else {
                return saveLive(title, customBranchId, resultObject, liveClass, liveDescribe, startDate, endDate, userDetail.getId());
            }
        } else {
            log.info("云起云接口调用失败");
            return 0;
        }
    }

    /**
     * 通过id查询直播信息
     *
     * @param liveId
     * @return
     */
    public LiveInfoBean getLiveMessage(String liveId) {
        return yqyLiveMapper.getLiveMessage(liveId);
    }

    /**
     * 修改直播信息
     *
     * @param id
     * @param multipartFile
     * @param liveRoomId
     * @param livePwd
     * @param title
     * @param customBranchId
     * @param liveDescribe
     * @param startDate
     * @param endDate
     * @param liveClass
     * @param userDetail
     * @return
     */
    @Transactional
    public int updateAnnouncement(String id, MultipartFile multipartFile, String liveRoomId, String livePwd, String title, String customBranchId, String liveDescribe, String startDate, String endDate, String liveClass, UserDetail userDetail) {
        //调用云起云授权认证接口
        String accessToken = HttpClientUtils.getMethod(userDetail.getTelephone(), userDetail.getUserName());
        if (accessToken == null) {
            log.info("云起云授权失败");
            return 0;
        }
        Map<String, Object> response = (Map) JSON.parse(svocUpdateInterface(accessToken, title, liveRoomId, livePwd, startDate, endDate, true, true, false, 1));
        if (response != null) {
            if (multipartFile != null) {
                String pictureUrl = uploadPicture(multipartFile);
                return updateLive(id, title, customBranchId, response, liveClass, liveDescribe, startDate, endDate, pictureUrl, userDetail.getId());
            } else {
                return updateLive(id, title, customBranchId, response, liveClass, liveDescribe, startDate, endDate, userDetail.getId());
            }
        } else {
            log.info("云起云接口调用失败");
            return 0;
        }
    }

    /**
     * 查询自己发出的预告列表
     *
     * @param pageNo
     * @param pageSize
     * @return
     */
    public List<YqyLiveBean> findMyAnnouncementList(String token, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive();
        yqyLive.setLiveUserId(token);
        yqyLive.setDelFlag("0");
        yqyLive.setPageNo((pageNo - 1) * pageSize);
        yqyLive.setPageSize(pageSize);
        return yqyLiveMapper.findMyAnnouncementList(yqyLive);
    }

    /**
     * 查询自己发出的预告列表数量
     *
     * @param token
     * @return
     */
    public int findMyAnnouncementListSize(String token) {
        YqyLive yqyLive = new YqyLive();
        yqyLive.setLiveUserId(token);
        yqyLive.setDelFlag("0");
        return yqyLiveMapper.findMyAnnouncementListSize(yqyLive);
    }

    /**
     * 删除预告
     *
     * @param id
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public int deleteAnnouncement(String id, String liveRoomId, String coverUrl, UserDetail userDetail) {
        YqyLive yqyLive = new YqyLive();
        //获取token
        String accessToken = HttpClientUtils.getMethod(userDetail.getTelephone(), userDetail.getUserName());
        String res = HttpClientUtils.deleteMethod(liveRoomId, Constant.BASEPATH + Constant.APPOINTMENTS_URL, accessToken);
        Map<String, Object> map1 = (Map) JSON.parse(res);
        if (map1.get("code") != null && "200".equals(map1.get("code").toString())) {
            yqyLive.setId(id);
            yqyLive.setDelFlag("1");
            yqyLive.setDeleteTime(new Date());
            yqyLive.setDeleteUser(userDetail.getId());
            yqyLiveMapper.updateByPrimaryKeySelective(yqyLive);
            delFile(coverUrl);
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * 删除封面图片
     *
     * @param path
     */
    protected void delFile(String path) {
        //TODO 路径截取
        File file = new File(staticPathImage + "/" + path);
        if (file.exists()) {
            file.delete();
        }
    }

    /**
     * 根据直播类型查询直播列表数量
     *
     * @param liveClass
     * @return
     */
    public int findAnnouncementByTypeSize(String liveClass) {
        YqyLive yqyLive = new YqyLive();
        yqyLive.setLiveClass(liveClass);
        yqyLive.setDelFlag("0");
        //结束时间大于当前时间
        yqyLive.setLiveEndTime(new Date());
        return yqyLiveMapper.findAnnouncementByTypeSize(yqyLive);
    }

    /**
     * 根据直播类型查询直播列表根据最新排序
     */
    public List<YqyLiveBean> findAnnouncementByTypeNew(String liveClass, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive();
        yqyLive.setLiveClass(liveClass);
        yqyLive.setDelFlag("0");
        yqyLive.setPageNo((pageNo - 1) * pageSize);
        yqyLive.setPageSize(pageSize);
        //结束时间大于当前时间
        yqyLive.setLiveEndTime(new Date());
        return yqyLiveMapper.findAnnouncementByTypeNew(yqyLive);
    }

    /**
     * 根据直播类型查询直播列表根据关注量排序
     */
    public List<YqyLiveBean> findAnnouncementByTypeFollow(String liveClass, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive();
        yqyLive.setLiveClass(liveClass);
        yqyLive.setDelFlag("0");
        yqyLive.setPageNo((pageNo - 1) * pageSize);
        yqyLive.setPageSize(pageSize);
        //结束时间大于当前时间
        yqyLive.setLiveEndTime(new Date());
        return yqyLiveMapper.findAnnouncementByTypeFollow(yqyLive);
    }

    /**
     * 模糊查询,查询总数量
     *
     * @param liveName
     * @return
     */
    public int searchAnnouncementSize(String liveName) {
        YqyLive yqyLive = new YqyLive();
        yqyLive.setLiveName(liveName);
        yqyLive.setLiveEndTime(new Date());
        yqyLive.setDelFlag("0");
        return yqyLiveMapper.searchAnnouncementSize(yqyLive);
    }

    /**
     * 模糊查询,根据最新排序
     *
     * @param liveName
     * @param pageNo
     * @param pageSize
     * @return
     */
    public List<YqyLiveBean> searchAnnouncementNew(String liveName, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive();
        yqyLive.setLiveName(liveName);
        yqyLive.setLiveEndTime(new Date());
        yqyLive.setDelFlag("0");
        yqyLive.setPageNo((pageNo - 1) * pageSize);
        yqyLive.setPageSize(pageSize);
        return yqyLiveMapper.searchAnnouncementNew(yqyLive);
    }

    /**
     * 模糊查询,根据热度排序
     *
     * @param liveName
     * @param pageNo
     * @param pageSize
     * @return
     */
    public List<YqyLiveBean> searchAnnouncementHot(String liveName, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive();
        yqyLive.setLiveName(liveName);
        yqyLive.setDelFlag("0");
        yqyLive.setLiveEndTime(new Date());
        yqyLive.setPageNo((pageNo - 1) * pageSize);
        yqyLive.setPageSize(pageSize);
        return yqyLiveMapper.searchAnnouncementHot(yqyLive);
    }

    /**
     * 设置默认封面
     *
     * @param yqyLive
     * @param path
     * @return
     */
    public int setDefaultCover(YqyLive yqyLive, String path) {
        //删除原来的封面
        int i = yqyLiveMapper.setDefaultCover(yqyLive);
        if (i > 0) {
            if (!path.equals(Constant.DEFAULT_COVER_URL)) {
                delFile(path);
            }
        }
        return i;
    }

    public YqyLiveBean getLiveByRoomId(String appointmentId) {
        return yqyLiveMapper.getLiveByRoomId(appointmentId);
    }
}
