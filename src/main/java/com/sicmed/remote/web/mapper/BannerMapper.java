package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.Banner;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerMapper {
    int deleteByPrimaryKey(String id);

    int insert(Banner record);

    int insertSelective(Banner record);

    Banner selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Banner record);

    int updateByPrimaryKey(Banner record);

    List<Banner> findList();

    List<Banner> findBannerListByParam(Banner banner);
}