package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.VideoBean;
import com.sicmed.remote.web.entity.TencentVideo;
import com.sicmed.remote.web.mapper.TencentVideoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class TencentVideoService implements BaseService<TencentVideo> {

    @Autowired
    private TencentVideoMapper tencentVideoMapper;


    @Override
    public int insertSelective(TencentVideo tencentVideo) {
        return tencentVideoMapper.insertSelective(tencentVideo);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    /**
     * 修改优享课程
     * @param tencentVideo
     * @return
     */
    @Override
    public int updateByPrimaryKeySelective(TencentVideo tencentVideo) {
        return tencentVideoMapper.updateByPrimaryKeySelective(tencentVideo);
    }

    @Override
    public int updateByPrimaryKey(TencentVideo tencentVideo) {
        return 0;
    }

    @Override
    public TencentVideo getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List <TencentVideo> findByDynamicParam(TencentVideo tencentVideo) {
        return null;
    }

    public int updateVideoFile(TencentVideo video) {
        return tencentVideoMapper.updateVideoFile(video);
    }

    /**
     * 通过id查询优享课程内容
     * @param id
     * @return
     */
    public TencentVideo findVideoById(String id) {
        return tencentVideoMapper.findVideoById(id);
    }

    /**
     * 删除优享课程
     * @param id
     * @return
     */
    @Transactional(rollbackFor=Exception.class)
    public int deleteVideo(String id,String token) {
        TencentVideo video = new TencentVideo();
        video.setId(id);
        video.setDeleteUser(token);
        video.setDeleteTime(new Date());
        video.setDelFlag("1");
        //修改本地删除标记
        return tencentVideoMapper.updateByPrimaryKeySelective(video);
    }

    /**
     * 查询我发出的视频条数
     * @param pageNo
     * @param pageSize
     * @return
     */
    public int findMyVideoListSize(String requestToken, int pageNo, int pageSize) {
        TencentVideo tencentVideo = new TencentVideo();
        tencentVideo.setPageNo((pageNo-1)*pageSize);
        tencentVideo.setPageSize(pageSize);
        tencentVideo.setUploadUser(requestToken);
        return tencentVideoMapper.findMyVideoListSize(tencentVideo);
    }

    /**
     * 查询我发出的视频
     * @param pageNo
     * @param pageSize
     * @return
     */
    public List<TencentVideo> findMyVideoList(String token, int pageNo, int pageSize) {
        TencentVideo tencentVideo = new TencentVideo();
        tencentVideo.setPageNo((pageNo-1)*pageSize);
        tencentVideo.setPageSize(pageSize);
        tencentVideo.setUploadUser(token);
        return tencentVideoMapper.findMyVideoList(tencentVideo);
    }

    /**
     * 模糊查询总条数
     * @param tencentVideo
     * @return
     */
    public int searchVideoSize(TencentVideo tencentVideo) {
        return tencentVideoMapper.searchVideoSize(tencentVideo);
    }

    /**
     * 按最新模糊查询
     * @param tencentVideo
     * @return
     */
    public List<VideoBean> searchVideoNew(TencentVideo tencentVideo) {
        return tencentVideoMapper.searchVideoNew(tencentVideo);
    }

    /**
     * 按热度模糊查询
     * @param tencentVideo
     * @return
     */
    public List<VideoBean> searchVideoHot(TencentVideo tencentVideo) {
        return tencentVideoMapper.searchVideoHot(tencentVideo);
    }

    /**
     * 根据类型查询列表总条数
     * @param tencentVideo
     * @return
     */
    public int findVideoListByTypeSize(TencentVideo tencentVideo) {
        return tencentVideoMapper.findVideoListByTypeSize(tencentVideo);
    }

    /**
     * 按最新根据类型查询列表
     * @param tencentVideo
     * @return
     */
    public List<VideoBean> findVideoListByTypeNew(TencentVideo tencentVideo) {
        return tencentVideoMapper.findVideoListByTypeNew(tencentVideo);
    }

    /**
     * 按热度根据类型查询列表
     * @param tencentVideo
     * @return
     */
    public List<VideoBean> findVideoListByTypeHot(TencentVideo tencentVideo) {
        return tencentVideoMapper.findVideoListByTypeHot(tencentVideo);
    }

    /**
     * 根据id获取直播播放量
     * @param videoId
     * @return
     */
    public int getNumberById(String videoId) {
        return tencentVideoMapper.getNumberById(videoId);
    }

    /**
     * 新增一个播放量
     * @param video
     */
    public void updateNum(TencentVideo video) {
        tencentVideoMapper.updateByPrimaryKeySelective(video);
    }
}
