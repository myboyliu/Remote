package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.FuzzySearchBean;
import com.sicmed.remote.web.entity.Medical;
import com.sicmed.remote.web.mapper.MedicalMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalService implements BaseService<Medical>{

    @Autowired
    private MedicalMapper medicalMapper;

    @Override
    public int insertSelective(Medical medical) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(Medical medical) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(Medical medical) {
        return 0;
    }

    @Override
    public Medical getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<Medical> findByDynamicParam(Medical medical) {
        return null;
    }


    /**
     * 模糊查询药品(通过药品名和药品简称)
     *
     * @param fuzzySearchBean
     * @return
     */
    public List <Medical> fuzzySearchMedical(FuzzySearchBean fuzzySearchBean) {
        return medicalMapper.fuzzySearchMedical(fuzzySearchBean);
    }

    /**
     * 通过药品id查询药品信息
     *
     * @param medicalId
     * @return
     */
    public Medical findMedicalById(String medicalId) {
        return medicalMapper.selectByPrimaryKey(medicalId);
    }
}
