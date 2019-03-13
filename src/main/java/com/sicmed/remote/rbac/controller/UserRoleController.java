package com.sicmed.remote.rbac.controller;

import com.alibaba.fastjson.JSONArray;
import com.sicmed.remote.rbac.entity.UserRole;
import com.sicmed.remote.rbac.service.UserRoleService;
import com.sicmed.remote.web.controller.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping(value = "userRole")
public class UserRoleController extends BaseController {
    @Autowired
    private UserRoleService userRoleService;

    @PostMapping(value = "addUserRole")
    public Object addUserRole(UserRole userRole) {

        userRoleService.insertSelective(userRole);

        return succeedRequest(userRole);
    }
}
