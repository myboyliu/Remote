package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.validation.Insert;
import com.sicmed.remote.common.validation.Select;
import com.sicmed.remote.common.validation.Update;
import com.sicmed.remote.web.entity.SpecialistType;
import com.sicmed.remote.web.service.SpecialistTypeService;
import com.sicmed.remote.web.service.SpecialistTypeService;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * @author MaxCoder
 * @version 1.0
 */
@RestController
@RequestMapping(value = "specialistType")
public class SpecialistTypeController extends BaseController {

    @Autowired
    private SpecialistTypeService specialistTypeService;

    /**
     * 添加专家类型信息接口
     *
     * @param specialistType
     * @return
     */
    @PostMapping(value = "add")
    public Object addSpecialistType(@Validated(Insert.class) SpecialistType specialistType, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return fieldErrorsBuilder(bindingResult);
        }
        int i = specialistTypeService.insertSelective(specialistType);

        while (i > 0) {
            return succeedRequestOfInsert(specialistType);
        }
        return badRequestOfInsert(specialistType);
    }

    /**
     * 专家类型删除
     *
     * @param specialistTypeId
     * @return
     */
    @PostMapping(value = "remove")
    public Object removeSpecialistType(String specialistTypeId) {

        int i = specialistTypeService.deleteByPrimaryKey(specialistTypeId);

        while (i > 0) {
            return succeedRequestOfDelete("");
        }
        return badRequestOfDelete(specialistTypeId);
    }

    /**
     * 专家类型修改
     *
     * @param specialistType
     * @return
     */
    @PostMapping(value = "update")
    public Object updateSpecialistType(@Validated(Update.class) SpecialistType specialistType, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return fieldErrorsBuilder(bindingResult);
        }
        int i = specialistTypeService.updateByPrimaryKeySelective(specialistType);

        while (i > 0) {
            return succeedRequestOfUpdate(specialistType);
        }
        return badRequestOfUpdate(specialistType);
    }


    /**
     * 根据ID查询专家类型
     *
     * @return
     */
    @GetMapping(value = "getById")
    public Object getById(String specialistTypeId) {

        SpecialistType specialistType = specialistTypeService.getByPrimaryKey(specialistTypeId);

        while (specialistType == null) {
            return badRequestOfSelect(specialistTypeId);
        }
        return succeedRequestOfSelect(specialistType);
    }

    /**
     * 根据条件查询专家类型
     *
     * @return
     */
    @GetMapping(value = "findByParam")
    public Object findByParam(@Validated(Select.class) SpecialistType specialistType, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return fieldErrorsBuilder(bindingResult);
        }

        List<SpecialistType> specialistTypeList = specialistTypeService.findByDynamicParam(specialistType);

        while (specialistTypeList.isEmpty()) {
            return badRequestOfSelect("");
        }
        return succeedRequestOfSelect(specialistTypeList);
    }
}
