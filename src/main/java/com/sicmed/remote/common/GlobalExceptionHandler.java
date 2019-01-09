package com.sicmed.remote.common;


import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

/**
 * @author MaxCoder
 * @version 1.0
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(value = Exception.class)
    public Map<String, Object> allExceptionHandler(Exception exception) {

        Map<String, Object> resultMap = new LinkedHashMap<>();
        if (exception instanceof ConstraintViolationException) {
            get(((ConstraintViolationException) exception).getConstraintViolations());
            log.error("我报错了：{}", ((ConstraintViolationException) exception).getConstraintViolations());
            log.error("我报错了：{}", exception.getMessage());
            log.error("我报错了：{}", exception.getStackTrace());
            resultMap.put("code", "40000");
            resultMap.put("msg", "Request_Bad_Of_Arguments");
            resultMap.put("result", exception);
            return resultMap;
        }
        exception.printStackTrace();
        log.error("我报错了：{}", (Object) exception.getStackTrace());

        resultMap.put("code", "50000");
        resultMap.put("msg", "SYSTEM_ERROR");
        resultMap.put("result", "服务器异常!");
        return resultMap;
    }

    private Object get(Set<ConstraintViolation<?>> message) {
        Map<String, Object> fieldErrorsMap = new LinkedHashMap<>();
        for (ConstraintViolation<?> constraintViolation : message) {
            String path = constraintViolation.getPropertyPath().toString();
            String errorMessage = constraintViolation.getMessage();
            fieldErrorsMap.put(path, errorMessage);
        }
        return fieldErrorsMap;

    }

}
