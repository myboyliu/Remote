package com.sicmed.remote.tencent.mapper;

import com.sicmed.remote.tencent.bean.VideoBean;
import com.sicmed.remote.tencent.entity.TencentVideo;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TencentVideoMapper {
    int deleteByPrimaryKey(String id);

    int insert(TencentVideo record);

    int insertSelective(TencentVideo record);

    TencentVideo selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(TencentVideo record);

    int updateByPrimaryKey(TencentVideo record);

    int updateVideoFile(TencentVideo video);

    TencentVideo findVideoById(String id);

    List<TencentVideo> findMyVideoList(TencentVideo tencentVideo);

    List<VideoBean> searchVideoNew(TencentVideo tencentVideo);

    List<VideoBean> searchVideoHot(TencentVideo tencentVideo);

    List<VideoBean> findVideoListByTypeNew(TencentVideo tencentVideo);

    List<VideoBean> findVideoListByTypeHot(TencentVideo tencentVideo);

    int findMyVideoListSize(TencentVideo tencentVideo);

    int findVideoListByTypeSize(TencentVideo tencentVideo);

    int searchVideoSize(TencentVideo tencentVideo);

    int getNumberById(String videoId);
}