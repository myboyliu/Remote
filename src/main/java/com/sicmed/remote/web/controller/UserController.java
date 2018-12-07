package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.entity.UserAccount;
import com.sicmed.remote.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "add/account")
    public Object register(UserAccount userAccount) {

        int i = userService.insertUser(userAccount);

        return userAccount;
    }

}
