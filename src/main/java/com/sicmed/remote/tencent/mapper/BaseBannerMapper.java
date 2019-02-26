package com.sicmed.remote.tencent.mapper;

import com.sicmed.remote.tencent.entity.BaseBanner;

public interface BaseBannerMapper {
    int deleteByPrimaryKey(String id);

    int insert(BaseBanner record);

    int insertSelective(BaseBanner record);

    BaseBanner selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(BaseBanner record);

    int updateByPrimaryKey(BaseBanner record);
}