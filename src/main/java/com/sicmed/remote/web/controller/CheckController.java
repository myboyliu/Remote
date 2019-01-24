package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.bean.FuzzySearchBean;
import com.sicmed.remote.web.entity.TwxrayCheck;
import com.sicmed.remote.web.service.CheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @program: sicmed-order
 * @description: 检查controller
 * @author: Xue0601
 * @create: 2018-09-04 17:07
 **/
@RestController
@RequestMapping(value = "check")
public class CheckController extends BaseController{

    @Autowired
    private CheckService checkService;

    /**
     * 模糊搜索检查项
     * @param fuzzySearchBean
     * @return
     */
    @PostMapping(value = "fuzzySearchCheck")
    public Object fuzzySearchCheck(@Validated FuzzySearchBean fuzzySearchBean, BindingResult fuzzySearch){
        if (fuzzySearch.hasErrors()) {
            return fieldErrorsBuilder(fuzzySearch);
        }
        fuzzySearchBean.setParam(fuzzySearchBean.getParam().trim());
        int pageTotal = checkService.fuzzySearchCheckSize(fuzzySearchBean.getParam());
        List<TwxrayCheck> twxrayCheckList = checkService.fuzzySearchCheck(fuzzySearchBean);
        Map map = new HashMap();
        map.put("pageTotal",pageTotal);
        map.put("twxrayCheckList",twxrayCheckList);
        return succeedRequest(map);
    }



}
