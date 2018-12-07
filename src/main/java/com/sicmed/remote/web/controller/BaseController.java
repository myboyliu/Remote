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

    private Map<String, Object> responseMap;

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

    /**
     * 请求操作成功
     *
     * @param result
     * @return responseMap
     */
    public Map SucceedRequest(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "20000");
        responseMap.put("msg", "Request_Succeed");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 参数错误致请求操作失败
     *
     * @param result
     * @return responseMap
     */
    public Map BadRequestOfArguments(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "40000");
        responseMap.put("msg", "Request_Bad_Of_Arguments");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 添加数据请求操作失败
     *
     * @param result
     * @return responseMap
     */
    public Map BadRequestOfInsert(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "41000");
        responseMap.put("msg", "Request_Bad_Of_Insert");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 添加数据请求操作成功
     *
     * @param result
     * @return responseMap
     */
    public Map SucceedRequestOfInsert(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "41001");
        responseMap.put("msg", "Request_Succeed_Of_Insert");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 更新数据请求操作失败
     *
     * @param result
     * @return responseMap
     */
    public Map BadRequestOfUpdate(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "41002");
        responseMap.put("msg", "Request_Bad_Of_Update");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 更新数据请求操作成功
     *
     * @param result
     * @return responseMap
     */
    public Map SucceedRequestOfUpdate(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "41003");
        responseMap.put("msg", "Request_Succeed_Of_Update");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 删除数据请求操作失败
     *
     * @param result
     * @return responseMap
     */
    public Map BadRequestOfDelete(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "41004");
        responseMap.put("msg", "Request_Bad_Of_Delete");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 删除数据请求操作成功
     *
     * @param result
     * @return responseMap
     */
    public Map SucceedRequestOfDelete(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "41005");
        responseMap.put("msg", "Request_Bad_Of_Delete");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 查找数据请求操作失败
     *
     * @param result
     * @return responseMap
     */
    public Map BadRequestOfSelect(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "41006");
        responseMap.put("msg", "Request_Bad_Of_Select");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 查找数据请求操作成功
     *
     * @param result
     * @return responseMap
     */
    public Map SucceedRequestOfSelect(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "41007");
        responseMap.put("msg", "Request_Bad_Of_Select");
        responseMap.put("result", result);
        return responseMap;
    }
}
