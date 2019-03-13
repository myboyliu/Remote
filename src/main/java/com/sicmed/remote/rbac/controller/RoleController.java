package com.sicmed.remote.rbac.controller;

import com.sicmed.remote.rbac.entity.Role;
import com.sicmed.remote.rbac.service.RoleService;
import com.sicmed.remote.web.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "role")
public class RoleController extends BaseController {
    @Autowired
    private RoleService roleService;

    @PostMapping(value = "addRole")
    public Object addRole(Role role) {

        roleService.insertSelective(role);

        return succeedRequest(role);
    }
}
