package com.sicmed.remote.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping(value = "case")
public class CaseController extends BaseController {

    public Map insertNewCase() {
        return null;
    }

}
