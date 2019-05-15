package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.entity.UserRole;
import com.sicmed.remote.web.service.UserRoleService;
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
