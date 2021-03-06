package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.validation.Insert;
import com.sicmed.remote.common.validation.Select;
import com.sicmed.remote.common.validation.Update;
import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.entity.SpecialistType;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.mapper.UserDetailMapper;
import com.sicmed.remote.web.service.SpecialistTypeService;
import com.sicmed.remote.web.service.SpecialistTypeService;
import com.sicmed.remote.web.service.UserDetailService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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
    @Autowired
    private UserDetailService userDetailService;

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

        String userId = getRequestToken();

        CurrentUserBean currentUserBean = getCurrentUser();
        if (currentUserBean != null) {
            specialistType.setHospitalId(currentUserBean.getHospitalId());
        }
        int i = specialistTypeService.insertSelective(specialistType);

        if (i > 0) {
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

        if (i > 0) {
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
    @Transactional
    @PostMapping(value = "update")
    public Object updateSpecialistType(@Validated(Update.class) SpecialistType specialistType, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return fieldErrorsBuilder(bindingResult);
        }
        int i = specialistTypeService.updateByPrimaryKeySelective(specialistType);

        if (i > 0) {
            UserDetail userDetail = new UserDetail();
            userDetail.setConsultationPicturePrice(specialistType.getConsultationPicturePrice().toString());
            userDetail.setConsultationVideoPrice(specialistType.getConsultationVideoPrice().toString());
            userDetail.setHospitalId(specialistType.getHospitalId());
            userDetail.setSpecialistTypeId(specialistType.getId());
            userDetailService.updateUserPrice(userDetail);
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

        if (specialistType == null) {
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

        if (specialistTypeList != null && specialistTypeList.size() > 0) {
            return succeedRequestOfSelect(specialistTypeList);
        }
        return badRequestOfSelect(null);
    }

    /**
     * 根据登陆用户查询本院的专家类型
     *
     * @return
     */
    @GetMapping(value = "findByCurrentUser")
    public Object findByCurrentUser() {

        String userId = getRequestToken();

        CurrentUserBean currentUserBean = getCurrentUser();

        SpecialistType specialistType = new SpecialistType();

        specialistType.setHospitalId(currentUserBean.getHospitalId());

        List<SpecialistType> specialistTypeList = specialistTypeService.findByDynamicParam(specialistType);

        return succeedRequestOfSelect(specialistTypeList);

    }
}
