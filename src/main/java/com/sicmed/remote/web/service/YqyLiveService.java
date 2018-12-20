package com.sicmed.remote.web.service;

import com.alibaba.fastjson.JSON;
import com.sicmed.remote.common.Constant;
import com.sicmed.remote.web.YoonaLtUtils.HttpClientUtils;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.bean.LiveInfoBean;
import com.sicmed.remote.web.bean.YqyLiveBean;
import com.sicmed.remote.web.controller.FileController;
import com.sicmed.remote.web.entity.CustomBranch;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.entity.YqyLive;
import com.sicmed.remote.web.mapper.YqyLiveMapper;
import org.apache.commons.lang3.RandomStringUtils;
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
    public List <YqyLive> findByDynamicParam(YqyLive yqyLive) {
        return null;
    }

    /**
     * 添加直播信息
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
    public int announcement(MultipartFile multipartFile, String title, String customBranchId, String liveDescribe, String startDate, String endDate, String liveClass, UserDetail userDetail) {
        //调用云起云授权认证接口
        String accessToken = HttpClientUtils.getMethod(userDetail.getTelephone( ), userDetail.getUserName( ));
        //判断授权是否成功    授权成功有返回值
        if (accessToken == null) {
            return 0;
        }
        //调用云起云创建会议接口
        Map params = new LinkedHashMap( );
        params.put("appointmentName", title);
        params.put("appointmentPeriod", YtDateUtils.timeDifference(startDate, endDate));
        params.put("appointmentType", "1");
        params.put("hostPwd", (int) ((Math.random( ) * 9 + 1) * 1000) + "");
        params.put("isLive", true);
        params.put("isMute", true);
        params.put("isRecord", false);
        params.put("livePwd", "");
        params.put("startTime", YtDateUtils.stringToDates(startDate).getTime( ));
        params.put("concurrentNum", 1);
        String res = HttpClientUtils.createMeeting(Constant.BASEPATH + Constant.APPOINTMENTS_URL, accessToken, params);
        Map <String, Object> response = (Map) JSON.parse(res);
        if (response.get("code") != null && "200".equals(response.get("code").toString( ))) {
            Map <String, Object> map1 = (Map) JSON.parse(response.get("data").toString( ));
            //文件不等于null说明自己上传封面图片
            if (multipartFile != null) {
                String fileNameAndSuffixName = multipartFile.getOriginalFilename();
                String contentType = fileNameAndSuffixName.substring(fileNameAndSuffixName.lastIndexOf("."));
                String fileName = UUID.randomUUID().toString()+contentType;
                String pictureUrl = null;
                try {
                    FileController.uploadFile(multipartFile.getBytes( ), staticPathImage+"/coverUrl",fileName);
                    pictureUrl = "coverUrl/"+fileName;
                } catch (Exception e) {
                    e.printStackTrace( );
                }
                YqyLive yqyLive = new YqyLive( );
                CustomBranch customBranch = new CustomBranch( );
                yqyLive.setLiveName(title);
                customBranch.setId(customBranchId);
                yqyLive.setLiveRoomId(map1.get("appointmentId").toString( ));
                yqyLive.setAdminUrl(map1.get("webrtcUrl").toString( ));
                yqyLive.setAdminPwd(map1.get("hostPwd").toString( ));
                yqyLive.setLiveUrl(map1.get("liveUrl").toString( ));
                yqyLive.setCustomBranch(customBranch);
                yqyLive.setLiveClass(liveClass);
                yqyLive.setLiveDescribe(liveDescribe);
                yqyLive.setLiveStartTime(YtDateUtils.stringToDates(startDate));
                yqyLive.setLiveEndTime(YtDateUtils.stringToDates(endDate));
                yqyLive.setLiveCoverUrl(pictureUrl);
                yqyLive.setLiveUserId(userDetail.getId( ));
                yqyLive.setCreateUser(userDetail.getId( ));
                return yqyLiveMapper.insertSelective(yqyLive);
            } else {
                YqyLive yqyLive = new YqyLive( );
                CustomBranch customBranch = new CustomBranch( );
                yqyLive.setLiveName(title);
                customBranch.setId(customBranchId);
                yqyLive.setLiveRoomId(map1.get("appointmentId").toString( ));
                yqyLive.setAdminUrl(map1.get("webrtcUrl").toString( ));
                yqyLive.setAdminPwd(map1.get("hostPwd").toString( ));
                yqyLive.setLiveUrl(map1.get("liveUrl").toString( ));
                yqyLive.setCustomBranch(customBranch);
                yqyLive.setLiveClass(liveClass);
                yqyLive.setLiveDescribe(liveDescribe);
                yqyLive.setLiveStartTime(YtDateUtils.stringToDates(startDate));
                yqyLive.setLiveEndTime(YtDateUtils.stringToDates(endDate));
                yqyLive.setLiveUserId(userDetail.getId( ));
                yqyLive.setCreateUser(userDetail.getId( ));
                return yqyLiveMapper.insertSelective(yqyLive);
            }
        } else {
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
     * @param id
     * @param file
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
    public int updateAnnouncement(String id, MultipartFile file, String liveRoomId, String livePwd, String title, String customBranchId, String liveDescribe, String startDate, String endDate, String liveClass, UserDetail userDetail) {
        //调用云起云授权认证接口
        String accessToken = HttpClientUtils.getMethod(userDetail.getTelephone( ), userDetail.getUserName( ));
        if (accessToken == null) {
            return 0;
        }
        Map params = new LinkedHashMap( );
        params.put("appointmentName", title);
        params.put("appointmentId", liveRoomId);
        params.put("appointmentPeriod", YtDateUtils.timeDifference(startDate, endDate));
        params.put("appointmentType", 1);
        params.put("hostPwd", livePwd);
        params.put("isLive", true);
        params.put("isMute", true);
        params.put("isRecord", false);
        params.put("livePwd", "");
        params.put("startTime", YtDateUtils.stringToDates(startDate).getTime( ));
        params.put("concurrentNum", 1);
        String res = HttpClientUtils.updateMeeting(params, Constant.BASEPATH + Constant.APPOINTMENTS_URL, accessToken);
        Map <String, Object> response = (Map) JSON.parse(res);
        if (response.get("code") != null && "200".equals(response.get("code").toString( ))) {
            Map <String, Object> map1 = (Map) JSON.parse(response.get("data").toString( ));
            //文件不等于null说明自己上传封面图片
            if (file != null) {
                String fileNameAndSuffixName = file.getOriginalFilename();
                String contentType = fileNameAndSuffixName.substring(fileNameAndSuffixName.lastIndexOf("."));
                String fileName = UUID.randomUUID().toString()+contentType;
                String pictureUrl = null;
                try {
                    FileController.uploadFile(file.getBytes( ), staticPathImage+"/coverUrl",fileName);
                    pictureUrl = "coverUrl/"+fileName;
                } catch (Exception e) {
                    e.printStackTrace( );
                }
                YqyLive yqyLive = new YqyLive( );
                CustomBranch customBranch = new CustomBranch( );
                yqyLive.setLiveName(title);
                customBranch.setId(customBranchId);
                yqyLive.setId(id);
                yqyLive.setLiveRoomId(map1.get("appointmentId").toString( ));
                yqyLive.setAdminUrl(map1.get("webrtcUrl").toString( ));
                yqyLive.setAdminPwd(map1.get("hostPwd")!=null?map1.get("hostPwd").toString( ):"");
                yqyLive.setLiveUrl(map1.get("liveUrl")!=null?map1.get("liveUrl").toString( ):"");
                yqyLive.setCustomBranch(customBranch);
                yqyLive.setLiveClass(liveClass);
                yqyLive.setLiveDescribe(liveDescribe);
                yqyLive.setLiveStartTime(YtDateUtils.stringToDates(startDate));
                yqyLive.setLiveEndTime(YtDateUtils.stringToDates(endDate));
                yqyLive.setLiveCoverUrl(pictureUrl);
                yqyLive.setLiveUserId(userDetail.getId( ));
                yqyLive.setCreateUser(userDetail.getId( ));
                return yqyLiveMapper.updateByPrimaryKeySelective(yqyLive);
            } else {
                YqyLive yqyLive = new YqyLive( );
                CustomBranch customBranch = new CustomBranch( );
                yqyLive.setLiveName(title);
                customBranch.setId(customBranchId);
                yqyLive.setLiveRoomId(map1.get("appointmentId").toString( ));
                yqyLive.setAdminUrl(map1.get("webrtcUrl").toString( ));
                yqyLive.setAdminPwd(map1.get("hostPwd")!=null?map1.get("hostPwd").toString():"");
                yqyLive.setLiveUrl(map1.get("liveUrl").toString( ));
                yqyLive.setId(id);
                yqyLive.setCustomBranch(customBranch);
                yqyLive.setLiveClass(liveClass);
                yqyLive.setLiveDescribe(liveDescribe);
                yqyLive.setLiveStartTime(YtDateUtils.stringToDates(startDate));
                yqyLive.setLiveEndTime(YtDateUtils.stringToDates(endDate));
                yqyLive.setLiveUserId(userDetail.getId( ));
                yqyLive.setCreateUser(userDetail.getId( ));
                return yqyLiveMapper.updateByPrimaryKeySelective(yqyLive);
            }
        } else {
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
    public List <YqyLiveBean> findMyAnnouncementList(String token, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive( );
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
        YqyLive yqyLive = new YqyLive( );
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
        YqyLive yqyLive = new YqyLive( );
        //获取token
        String accessToken = HttpClientUtils.getMethod(userDetail.getTelephone( ), userDetail.getUserName( ));
        String res = HttpClientUtils.deleteMethod(liveRoomId, Constant.BASEPATH + Constant.APPOINTMENTS_URL, accessToken);
        Map <String, Object> map1 = (Map) JSON.parse(res);
        if (map1.get("code") != null && "200".equals(map1.get("code").toString( ))) {
            yqyLive.setId(id);
            yqyLive.setDelFlag("1");
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
        File file = new File(staticPathImage +"/"+path);
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
        YqyLive yqyLive = new YqyLive( );
        yqyLive.setLiveClass(liveClass);
        yqyLive.setDelFlag("0");
        //结束时间大于当前时间
        yqyLive.setLiveEndTime(new Date( ));
        return yqyLiveMapper.findAnnouncementByTypeSize(yqyLive);
    }

    /**
     * 根据直播类型查询直播列表根据最新排序
     */
    public List <YqyLiveBean> findAnnouncementByTypeNew(String liveClass, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive( );
        yqyLive.setLiveClass(liveClass);
        yqyLive.setDelFlag("0");
        yqyLive.setPageNo(pageNo);
        yqyLive.setPageSize(pageSize);
        //结束时间大于当前时间
        yqyLive.setLiveEndTime(new Date( ));
        return yqyLiveMapper.findAnnouncementByTypeNew(yqyLive);
    }

    /**
     * 根据直播类型查询直播列表根据关注量排序
     */
    public List <YqyLiveBean> findAnnouncementByTypeFollow(String liveClass, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive( );
        yqyLive.setLiveClass(liveClass);
        yqyLive.setDelFlag("0");
        yqyLive.setPageNo(pageNo);
        yqyLive.setPageSize(pageSize);
        //结束时间大于当前时间
        yqyLive.setLiveEndTime(new Date( ));
        return yqyLiveMapper.findAnnouncementByTypeFollow(yqyLive);
    }

    /**
     * 模糊查询,查询总数量
     *
     * @param liveName
     * @return
     */
    public int searchAnnouncementSize(String liveName) {
        YqyLive yqyLive = new YqyLive( );
        yqyLive.setLiveName(liveName);
        yqyLive.setLiveEndTime(new Date( ));
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
    public List <YqyLiveBean> searchAnnouncementNew(String liveName, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive( );
        yqyLive.setLiveName(liveName);
        yqyLive.setLiveEndTime(new Date( ));
        yqyLive.setDelFlag("0");
        yqyLive.setPageNo(pageNo);
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
    public List <YqyLiveBean> searchAnnouncementHot(String liveName, int pageNo, int pageSize) {
        YqyLive yqyLive = new YqyLive( );
        yqyLive.setLiveName(liveName);
        yqyLive.setDelFlag("0");
        yqyLive.setLiveEndTime(new Date( ));
        yqyLive.setPageNo(pageNo);
        yqyLive.setPageSize(pageSize);
        return yqyLiveMapper.searchAnnouncementHot(yqyLive);
    }

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
}
