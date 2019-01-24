package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.bean.FuzzySearchBean;
import com.sicmed.remote.web.entity.Medical;
import com.sicmed.remote.web.service.MedicalService;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotEmpty;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @program: sicmed-order
 * @description: 药品Controller
 * @author: Xue0601
 * @create: 2018-09-04 17:02
 **/
@RestController
@RequestMapping(value = "medical")
public class MedicalController extends BaseController{

    @Autowired
    private MedicalService medicalService;

    /**
     * 模糊查询药品(通过药品名和药品简称)
     * @param fuzzySearchBean
     * @return
     */
    @PostMapping(value = "fuzzySearchMedical")
    public Object fuzzySearchMedical(@Validated FuzzySearchBean fuzzySearchBean, BindingResult fuzzySearch){
        if (fuzzySearch.hasErrors()) {
            return fieldErrorsBuilder(fuzzySearch);
        }
        fuzzySearchBean.setParam(fuzzySearchBean.getParam().trim());
        List<Medical> medicalList = medicalService.fuzzySearchMedical(fuzzySearchBean);
        Map map = new LinkedHashMap();
        map.put("medicalList",medicalList);
        return succeedRequest(medicalList);
    }

    /**
     * 通过药品id查询药品信息
     * @param medicalId
     * @return
     */
    @PostMapping(value = "findMedicalById")
    public Object findMedicalById(@Validated @NotEmpty @Length(max = 32,min = 32) String medicalId){
        Medical medical = medicalService.findMedicalById(medicalId);
        return succeedRequest(medical);
    }

}
