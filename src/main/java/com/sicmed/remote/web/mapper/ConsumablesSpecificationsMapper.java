package com.sicmed.remote.web.mapper;

import com.sicmed.remote.web.entity.ConsumablesSpecifications;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsumablesSpecificationsMapper {

    int deleteByPrimaryKey(String id);

    int insert(ConsumablesSpecifications record);

    int insertSelective(ConsumablesSpecifications record);

    ConsumablesSpecifications selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(ConsumablesSpecifications record);

    int updateByPrimaryKey(ConsumablesSpecifications record);

    List<ConsumablesSpecifications> findSpecificationsById(String id);
}