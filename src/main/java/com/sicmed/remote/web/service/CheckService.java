package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.FuzzySearchBean;
import com.sicmed.remote.web.entity.TwxrayCheck;
import com.sicmed.remote.web.mapper.TwxrayCheckMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckService implements BaseService<TwxrayCheck>{

    @Autowired
    private TwxrayCheckMapper twxrayCheckMapper;

    @Override
    public int insertSelective(TwxrayCheck twxrayCheck) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(TwxrayCheck twxrayCheck) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(TwxrayCheck twxrayCheck) {
        return 0;
    }

    @Override
    public TwxrayCheck getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<TwxrayCheck> findByDynamicParam(TwxrayCheck twxrayCheck) {
        return null;
    }

    /**
     * 模糊搜索检查项
     * @param fuzzySearchBean
     * @return
     */
    public List <TwxrayCheck> fuzzySearchCheck(FuzzySearchBean fuzzySearchBean) {
        return twxrayCheckMapper.fuzzySearchCheck(fuzzySearchBean);
    }

    public int fuzzySearchCheckSize(String param) {
        return twxrayCheckMapper.fuzzySearchCheckSize(param);
    }
}
