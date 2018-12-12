package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.web.entity.UserAccount;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.entity.UserSign;
import com.sicmed.remote.web.service.UserAccountService;
import com.sicmed.remote.web.service.UserCaseTypeService;
import com.sicmed.remote.web.service.UserDetailService;
import com.sicmed.remote.web.service.UserSignService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description
 * @data 2018/12/11
 */
@Slf4j
@RestController
@RequestMapping(value = "user")
public class UserController extends BaseController {

    @Autowired
    private UserAccountService userAccountService;

    @Autowired
    private UserDetailService userDetailService;

    @Autowired
    private UserCaseTypeService userCaseTypeService;

    @Autowired
    private UserSignService userSignService;

    /**
     * 判断注册手机号是否可用
     *
     * @param phoneNumber
     */
    @GetMapping(value = "checkout")
    public Map checkoutPhone(@NotBlank(message = "电话号不能为空") String phoneNumber) {

        int i = userAccountService.selectCountPhone(phoneNumber);
        if (i != 0) {
            return badRequestOfSelect("账号已存在");
        }
        return succeedRequest("用户名可用");
    }

    /**
     * 注册接口
     *
     * @param userAccount
     * @param brOfUserAccount
     * @param userDetail
     * @param brOfUserDet
     * @param userSign
     * @param idTypeName
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "register")
    public Map userRegister(@Validated UserAccount userAccount, BindingResult brOfUserAccount,
                            @Validated UserDetail userDetail, BindingResult brOfUserDet,
                            UserSign userSign, String idTypeName, HttpServletRequest httpServletRequest) {

        if (brOfUserAccount.hasErrors()) {
            return fieldErrorsBuilder(brOfUserAccount);
        } else if (brOfUserDet.hasErrors()) {
            return fieldErrorsBuilder(brOfUserDet);
        }

        Map<String, String> resultMap = null;
        try {
            resultMap = (Map<String, String>) JSONObject.parse(idTypeName);
        } catch (Exception e) {
            badRequestOfArguments("idTypeName 格式错误");
        }

        // 添加UserAccount使用md5将随机生成的32位字母数字salt与password混合加密
        String salt = RandomStringUtils.randomAlphanumeric(32);
        String encryptionPassWord = DigestUtils.md5DigestAsHex((userAccount.getUserPassword() + salt).getBytes());
        userAccount.setUserPassword(encryptionPassWord);
        userAccount.setSalt(salt);
        int i = userAccountService.insertSelective(userAccount, httpServletRequest);
        if (i < 1) {
            return badRequestOfInsert("添加UserAccount失败");
        }

        List<String> idList = new ArrayList<>(); // 病例类型id列表
        String userId = userAccount.getId();

        // 添加UserDetail
        StringBuffer stringBuffer = new StringBuffer();
        for (Map.Entry<String, String> m : resultMap.entrySet()) {
            idList.add(m.getKey());
            stringBuffer.append(m.getValue() + "、");
        }
        stringBuffer.deleteCharAt(stringBuffer.length() - 1);
        String typeName = stringBuffer.toString();  // 病例类型名称集合
        userDetail.setNeedCaseType(typeName);
        userDetail.setId(userId);
        int j = userDetailService.insertSelective(userDetail);
        if (j < 1) {
            return badRequestOfInsert("添加UserDetail失败");
        }

        // 添加 UserCaseType
        Map<String, String> userCaseTypeMap = new LinkedHashMap<>();
        for (String id : idList) {
            userCaseTypeMap.put(id, userId);
        }
        int k = userCaseTypeService.insertMulitple(userCaseTypeMap);
        if (k < 1) {
            return badRequestOfInsert("添加UserCaseType失败");
        }

        // 添加UserSign
        userSign.setId(userId);
        int l = userSignService.insertSelective(userSign);
        if (l < 1) {
            return badRequestOfInsert("添加UserSign失败");
        }

        return succeedRequest("注册成功");
    }


    /*    @PostMapping(value = "login")
        public Map loginDoctor(String doctorPhone, String doctorPassword) {
            Doctor doctor = doctorService.selectByPhone(doctorPhone);
            if (doctor == null) {
                return loginFailedResponse("用户名或密码不正确");
            }
                        System.out.println("key:" + m.getKey() + " value:" + m.getValue());
            String salt = doctor.getSalt();
            if (doctor.getDoctorPassword().equals(DigestUtils.md5DigestAsHex((doctorPassword + salt).getBytes()))) {
                String token = doctor.getId();
                redisSerive.insert(token, jsonUtil.objectToJsonStr(doctor));
                log.info("======登陆成功====");
                return loginSuccessResponse(token);
            } else {
                log.info("======登陆失败====");
                return loginFailedResponse("用户名或密码不正确");
            }
        }*/
    /*
    @PostMapping(value = "mytest")
    public Map testJ() {
        log.debug("---------------");
        String userId = "4111111142";
        List<String> idList = new ArrayList<>();
        idList.add("1");
        idList.add("2");
        idList.add("3");
        Map<String, String> userCaseTypeMap = new LinkedHashMap<>();
        for (String id : idList) {
            userCaseTypeMap.put(id, userId);
        }
        log.debug("------2---------");
        int k = userCaseTypeService.insertMulitple(userCaseTypeMap);
        if (k < 1) {
            return badRequestOfInsert("添加UserCaseType失败");
        }
        return succeedRequestOfInsert("222");
    }*/
}
