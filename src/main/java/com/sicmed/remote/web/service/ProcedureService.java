package com.sicmed.remote.web.service;

import com.sicmed.remote.web.mapper.ProcedureMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProcedureService {

    @Autowired
    private ProcedureMapper procedureMapper;

    public void applyChecked(){
        procedureMapper.applyChecked();
    }

    public void referralChecked(){
        procedureMapper.referralChecked();
    }
}
