package com.sicmed.remote.web.service;

import com.sicmed.remote.common.util.FileUtils;
import com.sicmed.remote.web.controller.FileController;
import com.sicmed.remote.web.entity.Banner;
import com.sicmed.remote.web.mapper.BannerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @program: remote
 * @description: 横幅service
 * @author: Xue0601
 * @create: 2018-12-21 11:09
 **/
@Service
public class BannerService implements BaseService <Banner> {

    @Autowired
    private BannerMapper bannerMapper;

    @Override
    public int insertSelective(Banner banner) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(Banner banner) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(Banner banner) {
        return 0;
    }

    @Override
    public Banner getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List <Banner> findByDynamicParam(Banner banner) {
        return null;
    }

    /**
     * 添加横幅
     * @param multipartFile 图片文件
     * @param linkPath      链接
     * @param location      本地存储url
     * @param token         登录人id
     * @return
     */
    public int addBanner(MultipartFile multipartFile, String linkPath, String location, String token) {
        String pictureUrl = null;
        if (multipartFile != null) {
            String fileNameAndSuffixName = multipartFile.getOriginalFilename( );
            String contentType = fileNameAndSuffixName.substring(fileNameAndSuffixName.lastIndexOf("."));
            String fileName = UUID.randomUUID( ).toString( ) + contentType;
            try {
                FileUtils.uploadFile(multipartFile.getBytes( ), location + "/banner", fileName);
                pictureUrl = "banner/" + fileName;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        Banner banner = new Banner( );
        banner.setBannerPictureStatus("0");
        banner.setCreateTime(new Date( ));
        banner.setCreateUser(token);
        banner.setLinkPath(linkPath);
        banner.setPicturePath(pictureUrl);
        return bannerMapper.insertSelective(banner);
    }

    /**
     * 开关横幅
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public int switchBanner(Banner banner) {
        return bannerMapper.updateByPrimaryKeySelective(banner);
    }

    /**
     * 查询所有横幅
     * @return
     */
    public List<Banner> findList() {
        return bannerMapper.findList();
    }

    /**
     * 根据条件查询横幅(启用/未启用)
     * @param banner
     * @return
     */
    public List<Banner> findBannerListByParam(Banner banner) {
        return bannerMapper.findBannerListByParam(banner);
    }
}
