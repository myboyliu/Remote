package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
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
import java.util.*;

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

        LinkedHashMap<String, String> resultMap;
        try {
            resultMap = JSON.parseObject(idTypeName, new TypeReference<LinkedHashMap<String, String>>() {
            }, Feature.OrderedField);
        } catch (Exception e) {
            return badRequestOfArguments("idTypeName 格式错误");
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

        if (resultMap != null && !resultMap.isEmpty()) {

            StringBuffer stringBuffer = new StringBuffer();
            for (Map.Entry<String, String> m : resultMap.entrySet()) {
                idList.add(m.getKey());
                stringBuffer.append(m.getValue() + "、");
            }
            stringBuffer.deleteCharAt(stringBuffer.length() - 1);
            String typeName = stringBuffer.toString();  // 病例类型名称集合

            userDetail.setNeedCaseType(typeName);

            // 添加 UserCaseType
            Map<String, String> userCaseTypeMap = new LinkedHashMap<>();
            for (String id : idList) {
                userCaseTypeMap.put(id, userId);
            }
            int k = userCaseTypeService.insertMulitple(userCaseTypeMap);
            if (k < 1) {
                return badRequestOfInsert("添加UserCaseType失败");
            }
        }


        // 添加UserDetail
        userDetail.setId(userId);
        int j = userDetailService.insertSelective(userDetail);
        if (j < 1) {
            return badRequestOfInsert("添加UserDetail失败");
        }

        // 添加UserSign
        userSign.setId(userId);
        int l = userSignService.insertSelective(userSign);
        if (l < 1) {
            return badRequestOfInsert("添加UserSign失败");
        }

        return succeedRequest("注册成功");
    }

    /**
     * 登录
     *
     * @param userAccount
     * @param br
     * @param httpServletRequest
     */
    @PostMapping(value = "login")
    public Map userLogin(@Validated UserAccount userAccount, BindingResult br, HttpServletRequest httpServletRequest) {

        if (br.hasErrors()) {
            return fieldErrorsBuilder(br);
        }

        UserAccount resultUserAccount = userAccountService.selectSaltPw(userAccount.getUserPhone());
        if (resultUserAccount == null) {
            return badRequestOfSelect("userPhone查询salt,password失败");
        }

        String salt = resultUserAccount.getSalt();
        String encryptionPassWord = DigestUtils.md5DigestAsHex((userAccount.getUserPassword() + salt).getBytes());
        if (!encryptionPassWord.equals(resultUserAccount.getUserPassword())) {
            return badRequestOfArguments("输入的密码有误");
        }

        userAccount.setUserPassword(encryptionPassWord);
        Date lastLoginTime = new Date();
        userAccount.setLastLoginTime(lastLoginTime);
        userAccount.setId(resultUserAccount.getId());
        int i = userAccountService.updateByPrimaryKeySelective(userAccount, httpServletRequest);
        if (i < 1) {
            return badRequestOfInsert("更新用户登录信息失败");
        }

        return succeedRequest(resultUserAccount.getId());
    }

}
