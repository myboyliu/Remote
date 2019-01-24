package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.bean.FuzzySearchBean;
import com.sicmed.remote.web.entity.Consumables;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsumablesMapper {

    int deleteByPrimaryKey(String id);

    int insert(Consumables record);

    int insertSelective(Consumables record);

    Consumables selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Consumables record);

    int updateByPrimaryKey(Consumables record);

    List<Consumables> fuzzySearchConsumables(FuzzySearchBean fuzzySearchBean);
}