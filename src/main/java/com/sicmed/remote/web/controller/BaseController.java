package com.sicmed.remote.web.controller;

import com.sicmed.remote.web.entity.PageEntity;
import com.sicmed.remote.web.service.ProcedureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description Controller基类
 * @data 2018/12/7
 */
public abstract class BaseController {

    @Autowired
    public RedisTemplate redisTemplate;

    @Autowired
    public StringRedisTemplate stringRedisTemplate;

    @Autowired
    public ProcedureService procedureService;

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
     * 获取分页 参数
     *
     * @return
     */
    public PageEntity getPageEntity() {
        PageEntity pageEntity = new PageEntity();
        return pageEntity;
    }

    /**
     * 处理Bean validation 返回的 错误信息
     *
     * @param bindingResult
     * @return
     */
    public Map fieldErrorsBuilder(BindingResult bindingResult) {
        List<FieldError> fieldErrorList = bindingResult.getFieldErrors();
        Map<String, Object> fieldErrorsMap = new LinkedHashMap<>();
        for (FieldError fieldError : fieldErrorList) {
            fieldErrorsMap.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return badRequestOfArguments(fieldErrorsMap);
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
    public Map succeedRequest(Object result) {
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
    public Map badRequestOfArguments(Object result) {
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
    public Map badRequestOfInsert(Object result) {
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
    public Map succeedRequestOfInsert(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "20000");
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
    public Map badRequestOfUpdate(Object result) {
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
    public Map succeedRequestOfUpdate(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "20000");
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
    public Map badRequestOfDelete(Object result) {
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
    public Map succeedRequestOfDelete(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "20000");
        responseMap.put("msg", "Request_Succeed_Of_Delete");
        responseMap.put("result", result);
        return responseMap;
    }

    /**
     * 查找数据请求操作失败
     *
     * @param result
     * @return responseMap
     */
    public Map badRequestOfSelect(Object result) {
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
    public Map succeedRequestOfSelect(Object result) {
        responseMap = new LinkedHashMap<>();
        responseMap.put("code", "20000");
        responseMap.put("msg", "Request_Succeed_Of_Select");
        responseMap.put("result", result);
        return responseMap;
    }
}
