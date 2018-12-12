package com.sicmed.remote.common;


import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author MaxCoder
 *
 * @version 1.0
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    public Map<String, Object> allExceptionHandler(Exception exception) {

        Map<String, Object> resultMap = new LinkedHashMap<>();

        log.error("我报错了：{}", (Object) exception.getStackTrace());

        resultMap.put("code", "50000");
        resultMap.put("msg", "SYSTEM_ERROR");
        resultMap.put("result", "服务器异常!");
        return resultMap;
    }

}
