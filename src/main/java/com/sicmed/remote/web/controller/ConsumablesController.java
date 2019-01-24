package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.bean.FuzzySearchBean;
import com.sicmed.remote.web.entity.Consumables;
import com.sicmed.remote.web.entity.ConsumablesSpecifications;
import com.sicmed.remote.web.service.ConsumablesService;
import com.sicmed.remote.web.service.ConsumablesSpecificationsService;
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
 * @program: tele-medicine
 * @description: 手术备品
 * @author: Xue0601
 * @create: 2018-10-17 09:54
 **/
@Validated
@RestController
@RequestMapping(value = "consumables")
public class ConsumablesController extends BaseController{

    @Autowired
    private ConsumablesService consumablesService;
    @Autowired
    private ConsumablesSpecificationsService consumablesSpecificationsService;

    /**
     * 通过名称模糊搜索耗材
     * @param fuzzySearchBean
     * @return
     */
    @PostMapping(value = "fuzzySearchConsumables")
    public Object fuzzySearchConsumables(@Validated FuzzySearchBean fuzzySearchBean , BindingResult fuzzySearch){
        if (fuzzySearch.hasErrors()) {
            return fieldErrorsBuilder(fuzzySearch);
        }
        fuzzySearchBean.setParam(fuzzySearchBean.getParam().trim());
        List<Consumables> consumablesList = consumablesService.fuzzySearchConsumables(fuzzySearchBean);
        Map map = new LinkedHashMap();
        map.put("consumablesList",consumablesList);
        return succeedRequest(map);
    }


    /**
     * 通过手术备品id查询手术备品对应型号
     * @param id
     * @return
     */
    @PostMapping(value = "findSpecificationsById")
    public Object findSpecificationsById(@NotEmpty @Length(min = 32,max = 32) String id){
        List<ConsumablesSpecifications> specificationsList = consumablesSpecificationsService.findSpecificationsById(id);
        return succeedRequest(specificationsList);
    }

}
