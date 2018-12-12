package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.validation.Insert;
import com.sicmed.remote.common.validation.Select;
import com.sicmed.remote.common.validation.Update;
import com.sicmed.remote.web.entity.SpecialistType;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.service.SpecialistTypeService;
import com.sicmed.remote.web.service.SpecialistTypeService;
import lombok.extern.slf4j.Slf4j;
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

/**
 * @author MaxCoder
 * @version 1.0
 */
@Slf4j
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

    /**
     * 根据登陆用户查询本院的专家类型
     *
     * @return
     */
    @GetMapping(value = "findByCurrentUser")
    public Object findByCurrentUser() {

        String userId = getRequestToken();
        UserDetail ud = new UserDetail();
        ud.setId(userId);
        ud.setHospitalId("4274cdcbfc1e11e88ede487b6bd31bf7");
        ud.setBranchId("0dba2e83fc4411e88ede487b6bd31bf7");
        ud.setTitleName("医师");
        ud.setConsultationPicturePrice("100");
        ud.setConsultationVideoPrice("800");
        ud.setNeedCaseType("首页-封面、首页-正面、首页-反面、病例-入院记录、病例-病史确认单、病例-病程记录、病例-手术资料、病例-高值耗材、病例-谈话记录、病例-讨论记录、病例-出院记录、病例-出院诊断证明书、病例-住院通知单、病例-死亡记录、病例-会诊记录、病例-其他文书");
        log.debug(userId);
        redisTemplate.opsForValue().set(userId,ud);
        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);
        SpecialistType specialistType = new SpecialistType();

        specialistType.setHospitalId(userDetail.getHospitalId());

        List<SpecialistType> specialistTypeList = specialistTypeService.findByDynamicParam(specialistType);

        while (specialistTypeList != null && !specialistTypeList.isEmpty()) {
            return succeedRequestOfSelect(specialistTypeList);
        }
        return badRequestOfSelect("查询结果为空!");
    }
}
