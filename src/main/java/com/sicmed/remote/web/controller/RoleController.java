package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.entity.Role;
import com.sicmed.remote.web.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping(value = "getRoleList")
    public Object getRoleList(){

        List<Role> roleList = roleService.getRoleList();

        return succeedRequest(roleList);
    }

}
