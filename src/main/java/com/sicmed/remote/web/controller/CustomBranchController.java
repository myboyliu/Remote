package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.bean.BranchBean;
import com.sicmed.remote.web.bean.CustomBranchBean;
import com.sicmed.remote.web.entity.CustomBranch;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.service.CustomBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author MaxCoder
 * @version 1.0
 */
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

        UserDetail userDetail = (UserDetail) redisTemplate.opsForValue().get(userId);

        List<BranchBean> customBranchList = customBranchService.selectByHospitalId(userDetail.getHospitalId());

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
}
