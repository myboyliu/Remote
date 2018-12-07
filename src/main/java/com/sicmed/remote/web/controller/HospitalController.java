package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.entity.Hospital;
import com.sicmed.remote.web.service.HospitalServce;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description hospital/insert(添加),hospital/update(更新),hospital/softdel(软删除)
 * @data 2018/12/7
 */
@RestController
@RequestMapping(value = "hospital")
public class HospitalController extends BaseController {

    @Autowired
    private HospitalServce hs;

    /**
     * 查询hospital
     *
     * @param hospital
     */
    @GetMapping(value = "select")
/*    public Map selectHospital(Hospital hospital) {
    }*/

    /**
     * 添加hospital
     *
     * @param hospital
     * @param br
     */
    @PostMapping(value = "insert")
    public Map addHospital(@Validated Hospital hospital, BindingResult br) {

        if (br.hasErrors()) {
            return BadRequestOfArguments("传入参数有误!");
        }

        int i = hs.insertSelective(hospital);
        if (i > 0) {
            return SucceedRequestOfInsert("添加医院成功");
        }
        return BadRequestOfInsert("添加医院失败");
    }

    /**
     * 更新hospital
     *
     * @param hospital
     */
    @PostMapping(value = "update")
    public Map updateHospital(Hospital hospital) {

        if (StringUtils.isBlank(hospital.getId())) {
            return BadRequestOfArguments("HospitalId为空");
        }

        int i = hs.updateByPrimaryKeySelective(hospital);
        if (i > 0) {
            return SucceedRequestOfUpdate("更新hospital成功");
        }
        return BadRequestOfUpdate("更新hospital失败");
    }

    /**
     * 删除hospital
     *
     * @param hospital
     */
    @PostMapping(value = "update")
    public Map softDelHospital(Hospital hospital) {

        if (StringUtils.isBlank(hospital.getId())) {
            return BadRequestOfArguments("HospitalId为空");
        }

        int i = hs.deleteByPrimaryKey(hospital.getId());
        if (i > 0) {
            return SucceedRequestOfUpdate("更新hospital成功");
        }
        return BadRequestOfUpdate("更新hospital失败");
    }

}
