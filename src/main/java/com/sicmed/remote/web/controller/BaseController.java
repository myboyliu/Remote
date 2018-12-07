package com.sicmed.remote.web.controller;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * controller基类
 */
public abstract class BaseController {

    /**
     * 获取token
     *
     * @return str 请求头中获取token
     */
    public String getRequestToken() {
        HttpServletRequest request = ((ServletRequestAttributes) (RequestContextHolder.currentRequestAttributes())).getRequest();
        String str = request.getHeader("token");
        return str;
    }

    /**
     * 传入date类型参数报错解决
     *
     * @param sb
     */
    @InitBinder
    public void initBinder(ServletRequestDataBinder sb) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        CustomDateEditor ce = new CustomDateEditor(sdf, true);
        sb.registerCustomEditor(Date.class, ce);
    }
    

}
