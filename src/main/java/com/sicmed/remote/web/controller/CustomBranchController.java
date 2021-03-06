package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.CustomBranchType;
import com.sicmed.remote.web.bean.*;
import com.sicmed.remote.web.entity.CustomBranch;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.service.CustomBranchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * @author MaxCoder
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("custom/branch")
public class CustomBranchController extends BaseController {

    @Autowired
    private CustomBranchService customBranchService;

    /**
     * 添加自定义科室
     *
     * @param customBranch
     * @return
     */
    @PostMapping(value = "add")
    public Object addCustomBranch(CustomBranch customBranch) {

        int i = customBranchService.insertSelective(customBranch);
        if (i > 0) {
            return succeedRequestOfInsert(customBranch);
        }
        return badRequestOfInsert("添加科室失败");
    }

    /**
     * 批量自定义科室
     *
     * @return
     */
    @PostMapping(value = "addList")
    public Object addListCustomBranch(String customBranchStr) {
        log.debug(customBranchStr);

        return badRequestOfInsert("添加科室失败");
    }

    /**
     * 批量操作自定义科室
     *
     * @return
     */
    @PostMapping(value = "update")
    public Object update(String customBranchStr) {
        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();
        // json 解析
        List<UpdateCustomBranchBean> updateCustomBranchBeanList;
        updateCustomBranchBeanList = JSON.parseObject(customBranchStr, new TypeReference<List<UpdateCustomBranchBean>>() {
        }, Feature.OrderedField);

        List<UpdateCustomBranchBean> addCustomBranchBeanList = new ArrayList<>();
        List<String> removeCustomBranchBeanList = new ArrayList<>();
        // 数据分类
        for (UpdateCustomBranchBean updateCustomBranchBean : updateCustomBranchBeanList) {
            if (updateCustomBranchBean.getType().equals(CustomBranchType.REMOVE_BRANCH.toString())) {
                removeCustomBranchBeanList.add(updateCustomBranchBean.getCustomBranchId());
            } else {
                updateCustomBranchBean.setHospitalId(currentUserBean.getHospitalId());
                addCustomBranchBeanList.add(updateCustomBranchBean);
            }
            log.debug(updateCustomBranchBean.toString());
        }
        // 添加科室业务调用
        int i = 0;
        if (addCustomBranchBeanList.size() > 0) {
            i = customBranchService.insertCustomBranchList(addCustomBranchBeanList);
        }
        //删除科室业务调用
        if (removeCustomBranchBeanList.size() > 0) {
            //有医生的科室校验
            i = customBranchService.deleteCustomBranchIdList(removeCustomBranchBeanList);

        }
        if (i > 0) {
            return succeedRequest(null);
        }
        return badRequestOfInsert("失败");
    }

    /**
     * 删除自定义科室
     *
     * @param customBranchId
     * @return
     */
    @PostMapping(value = "delete")
    public Object deleteCustomBranch(String customBranchId) {

        int i = customBranchService.deleteByPrimaryKey(customBranchId);
        if (i > 0) {
            return succeedRequestOfDelete(customBranchId);
        }
        return badRequestOfDelete(customBranchId);
    }

    @GetMapping(value = "getByCurrentUser")
    public Object getByCurrentUser() {

        String userId = getRequestToken();

        CurrentUserBean currentUserBean = getCurrentUser();

        List<BranchBean> customBranchList = customBranchService.selectByHospitalId(currentUserBean.getHospitalId());

        return succeedRequestOfSelect(customBranchList);
    }

    @GetMapping(value = "getByHospitalId")
    public Object getByHospitalId(String hospitalId) {

        List<BranchBean> customBranchList = customBranchService.selectByHospitalId(hospitalId);
        if (customBranchList != null && customBranchList.size() > 0) {
            return succeedRequestOfSelect(customBranchList);
        }
        return badRequestOfSelect(null);
    }


    @GetMapping(value = "getLocalHospitalBranch")
    public Object getLocalHospitalBranch() {
        List<CustomBranch> customBranchList = customBranchService.selectByHosId(getCurrentUser().getHospitalId());

        return succeedRequestOfSelect(customBranchList);
    }

    /**
     *  查询 当前登陆用户所属医院二级联动科室列表
     *
     *  select Tow-level linkage branch list by current login user hospital
     *
     * @return
     */
    @GetMapping(value = "getTwoLevelLinkageBranch")
    public Object getTwoLevelLinkageBranch() {
        List<BranchBean> twoLevelLinkageBranchList = customBranchService.selectTwoLevelLinkageBranch(getCurrentUser().getHospitalId());

        return succeedRequestOfSelect(twoLevelLinkageBranchList);
    }


    /**
     *
     *
     * @return
     */
    @GetMapping(value = "getHospitalBranchList")
    public Object getHospitalBranchList() {

        List<HospitalBean> hospitalBeanList = customBranchService.getHospitalBranchList(null);

        if (hospitalBeanList.isEmpty()) {
            return badRequestOfSelect("");
        }
        return succeedRequestOfSelect(hospitalBeanList);
    }

    /**
     * 查询上级医院科室三级联动列表
     *
     * @return
     */
    @GetMapping(value = "getMasterHospitalBranchList")
    public Object getMasterHospitalBranchList() {

        List<HospitalBean> hospitalBeanList = customBranchService.getMasterHospitalBranchList(null);

        if (hospitalBeanList.isEmpty()) {
            return badRequestOfSelect("");
        }
        return succeedRequestOfSelect(hospitalBeanList);
    }
}
