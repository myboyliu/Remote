package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.CaseContentBean;
import com.sicmed.remote.web.entity.CaseContent;
import com.sicmed.remote.web.entity.CasePatient;
import com.sicmed.remote.web.entity.CaseRecord;
import com.sicmed.remote.web.mapper.CaseContentMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class CaseContentService implements BaseService<CaseContent> {

    @Autowired
    private CaseContentMapper caseContentMapper;

    @Autowired
    private CasePatientService casePatientService;

    @Autowired
    private CaseRecordService caseRecordService;

    // 创建病例
    @Transactional
    public int insertByMap(CaseContentBean caseContentBean) {

        caseContentBean.getCasePatient().setCreateUser(caseContentBean.getCreateUser());
        CasePatient rel = casePatientService.selectByCard(caseContentBean.getCasePatient().getPatientCard());
        if (rel == null) {
            casePatientService.insertSelective(caseContentBean.getCasePatient());
        }
        if (rel != null) {
            caseContentBean.getCasePatient().setId(rel.getId());
            casePatientService.updateByCard(caseContentBean.getCasePatient());
        }

        caseContentBean.getCaseRecord().setCreateUser(caseContentBean.getCreateUser());
        caseContentBean.getCaseRecord().setPatientId(caseContentBean.getCasePatient().getId());
        caseRecordService.insertSelective(caseContentBean.getCaseRecord());

        caseContentBean.setRecordId(caseContentBean.getCaseRecord().getId());

        return caseContentMapper.insertByMap(caseContentBean);
    }

    // 草稿创建完整病例
    @Transactional
    public int draftInsertFullCase(CasePatient casePatient, String casePatientId, CaseRecord caseRecord, String caseRecordId,
                                   List<CaseContent> resultList, String userId) {
        casePatient.setId(casePatientId);
        casePatient.setUpdateUser(userId);
        casePatientService.updateByPrimaryKeySelective(casePatient);

        caseRecord.setId(caseRecordId);
        caseRecord.setUpdateUser(userId);
        caseRecordService.updateByPrimaryKeySelective(caseRecord);

        caseContentMapper.deleteByCaseRecordId(caseRecordId);

        CaseContentBean caseContentBean = new CaseContentBean();
        caseContentBean.setCasePatient(casePatient);
        caseContentBean.setRecordId(caseRecordId);
        caseContentBean.setCreateUser(userId);
        caseContentBean.setWeightPathTypeId(resultList);
        return caseContentMapper.insertByMap(caseContentBean);
    }

    // 创建病例
    public int insertContentByMap(CaseContentBean caseContentBean) {

        return caseContentMapper.insertByMap(caseContentBean);
    }

    public int deleteByCaseRecordId(String caseRecordId) {
        return caseContentMapper.deleteByCaseRecordId(caseRecordId);
    }

    // id删除病例中的图片
    public int softDeleteById(String id) {
        return caseContentMapper.softDeleteById(id);
    }

    public int selectRecordId(String recordId) {
        return caseContentMapper.selectRecordId(recordId);
    }

    // 由recordId查询
    public List<CaseContent> findByCaseRecordId(String caseRecordId) {
        return caseContentMapper.findByCaseRecordId(caseRecordId);
    }

    @Override
    public int insertSelective(CaseContent caseContent) {
        return caseContentMapper.insertSelective(caseContent);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(CaseContent caseContent) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(CaseContent caseContent) {
        return 0;
    }

    @Override
    public CaseContent getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<CaseContent> findByDynamicParam(CaseContent caseContent) {
        return null;
    }
}
