package com.sicmed.remote.yunqiyun.mapper;

import com.sicmed.remote.yunqiyun.bean.LiveInfoBean;
import com.sicmed.remote.yunqiyun.bean.YqyLiveBean;
import com.sicmed.remote.yunqiyun.entity.YqyLive;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YqyLiveMapper {
    int deleteByPrimaryKey(String id);

    int insert(YqyLive record);

    int insertSelective(YqyLive record);

    YqyLive selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(YqyLive record);

    int updateByPrimaryKey(YqyLive record);

    LiveInfoBean getLiveMessage(String liveId);

    List<YqyLiveBean> findMyAnnouncementList(YqyLive yqyLive);

    int findMyAnnouncementListSize(YqyLive yqyLive);

    int findAnnouncementByTypeSize(YqyLive yqyLive);

    List<YqyLiveBean> findAnnouncementByTypeNew(YqyLive yqyLive);

    List<YqyLiveBean> findAnnouncementByTypeFollow(YqyLive yqyLive);

    int searchAnnouncementSize(YqyLive yqyLive);

    List<YqyLiveBean> searchAnnouncementNew(YqyLive yqyLive);

    List<YqyLiveBean> searchAnnouncementHot(YqyLive yqyLive);

    int setDefaultCover(YqyLive yqyLive);

    YqyLiveBean getLiveByRoomId(String appointmentId);
}