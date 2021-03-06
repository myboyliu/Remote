package com.sicmed.remote.web.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.DoctorCertified;
import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.meeting.util.YqyMeetingUtils;
import com.sicmed.remote.message.service.MessageService;
import com.sicmed.remote.web.entity.UserRole;
import com.sicmed.remote.web.service.UserRoleService;
import com.sicmed.remote.socket.service.NewMessageService;
import com.sicmed.remote.web.bean.*;
import com.sicmed.remote.web.entity.UserAccount;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.entity.UserSign;
import com.sicmed.remote.web.service.UserAccountService;
import com.sicmed.remote.web.service.UserCaseTypeService;
import com.sicmed.remote.web.service.UserDetailService;
import com.sicmed.remote.web.service.UserSignService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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
import java.util.concurrent.TimeUnit;

/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description 用户相关
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

    @Autowired
    private UserRoleService userRoleService;
    @Autowired
    private NewMessageService newMessageService;
    @Autowired
    private MessageService messageService;

    /**
     * 判断注册手机号是否可用
     *
     * @param phoneNumber
     */
    @GetMapping(value = "checkout")
    public Map checkoutPhone(@NotBlank(message = "电话号不能为空") String phoneNumber) {

        int i = userAccountService.selectCountPhone(phoneNumber);
        if (i != 0) {
            return badRequestOfArguments("账号已存在");
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
    @Transactional
    @PostMapping(value = "register")
    public Map userRegister(@Validated UserAccount userAccount, BindingResult brOfUserAccount,
                            @Validated UserDetail userDetail, BindingResult brOfUserDet,
                            UserSign userSign, String idTypeName,String smsCode, HttpServletRequest httpServletRequest) {

        if (brOfUserAccount.hasErrors()) {
            return fieldErrorsBuilder(brOfUserAccount);
        } else if (brOfUserDet.hasErrors()) {
            return fieldErrorsBuilder(brOfUserDet);
        }
        String signCode = redisTemplate.opsForValue().get(userAccount.getUserPhone());
        if(StringUtils.isBlank(signCode) || !signCode.equals(smsCode)){
            return badRequestOfArguments("验证码已过期!");
        }
        String userPhone = userAccount.getUserPhone();
        int q = userAccountService.selectCountPhone(userPhone);
        if (q != 0) {
            return badRequestOfArguments("账号已存在");
        }

        LinkedHashMap<String, String> resultMap = JSON.parseObject(idTypeName, new TypeReference<LinkedHashMap<String, String>>() {
        }, Feature.OrderedField);

        // 添加UserAccount使用md5将随机生成的32位字母数字salt与password混合加密
        String salt = RandomStringUtils.randomAlphanumeric(32);
        String encryptionPassWord = DigestUtils.md5DigestAsHex((userAccount.getUserPassword() + salt).getBytes());
        userAccount.setUserPassword(encryptionPassWord);
        userAccount.setSalt(salt);
        userAccountService.insertSelective(userAccount, httpServletRequest);

        // 病例类型id列表
        List<String> idList = new ArrayList<>();
        String userId = userAccount.getId();

        if (resultMap != null && !resultMap.isEmpty()) {

            StringBuffer stringBuffer = new StringBuffer();
            for (Map.Entry<String, String> m : resultMap.entrySet()) {
                idList.add(m.getKey());
                stringBuffer.append(m.getValue() + "、");
            }
            stringBuffer.deleteCharAt(stringBuffer.length() - 1);
            // 病例类型名称集合
            String typeName = stringBuffer.toString();

            userDetail.setNeedCaseType(typeName);

            // 添加 UserCaseType
            Map<String, String> userCaseTypeMap = new LinkedHashMap<>();
            for (String id : idList) {
                userCaseTypeMap.put(id, userId);
            }
            userCaseTypeService.insertMulitple(userCaseTypeMap);

        }

        // 添加UserDetail
        userDetail.setId(userId);
        userDetailService.insertSelective(userDetail);

        // 添加UserSign
        userSign.setId(userId);
        userSignService.insertSelective(userSign);

        //创建消息 推送给医政
        messageService.sendRegistAlertToHospitalAdmin(userId, userDetail.getUserName(), userDetail.getHospitalId());

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
    public Map userLogin(@Validated UserAccount userAccount, BindingResult br, HttpServletRequest
            httpServletRequest) {

        if (br.hasErrors()) {
            return fieldErrorsBuilder(br);
        }

        UserAccount resultUserAccount = userAccountService.selectSaltPw(userAccount.getUserPhone());
        if (resultUserAccount == null) {
            return badRequestOfSelect("用户名错误");
        }

        String userAccountId = resultUserAccount.getId();
        UserSign userSign = userSignService.getByPrimaryKey(userAccountId);
        if (DoctorCertified.AUTHENTICATION_CREATE_SUCCESS.toString().equals(userSign.getApproveStatus())) {
            return badRequestOfArguments("未认证");
        }

        String salt = resultUserAccount.getSalt();
        String encryptionPassWord = DigestUtils.md5DigestAsHex((userAccount.getUserPassword() + salt).getBytes());
        if (!encryptionPassWord.equals(resultUserAccount.getUserPassword())) {
            return badRequestOfArguments("密码错误");
        }

        userAccount.setUserPassword(encryptionPassWord);
        Date lastLoginTime = new Date();
        userAccount.setLastLoginTime(lastLoginTime);
        userAccount.setId(resultUserAccount.getId());
        userAccountService.updateByPrimaryKeySelective(userAccount, httpServletRequest);


        String userId = resultUserAccount.getId();
//        UserDetail userDetail = userDetailService.getByPrimaryKey(userId);
        CurrentUserBean currentUserBean = userDetailService.selectCurrentUser(userId);
        currentUserBean.setUserPhone(userAccount.getUserPhone());
        YqyMeetingUtils.checkToken(userAccount.getUserPhone(), currentUserBean.getUserName());
//        redisTemplate.opsForValue().set(userId, userDetail);
        redisTemplate.opsForValue().set(userId, JSONObject.toJSONString(currentUserBean));

        return succeedRequest(currentUserBean);
    }

    /**
     * 退出登陆接口
     *
     * @return
     */
    @PostMapping(value = "signOut")
    public Map signOut() {
        String userId = getRequestToken();
        redisTemplate.opsForValue().set(userId, "", 10);
        return succeedRequest(null);
    }

    /**
     * 医政管理中心医生详细信息展示
     */
    @GetMapping(value = "personalCenter")
    public Map personalCenter(String userId) {

        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("参数为空");
        }

        UserControllerBean userControllerBean = userDetailService.selectPersonalCenter(userId);
        if (userControllerBean == null) {
            return badRequestOfSelect("医政个人中心查询医生信息失败");
        }

        return succeedRequestOfSelect(userControllerBean);
    }

    /**
     * 个人中心信息展示
     */
    @GetMapping(value = "dorPersonalCenter")
    public Map dorPersonalCenter() {

        String userId = getRequestToken();
        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("获取登录用户id失败");
        }
        CurrentUserBean currentUserBean = getCurrentUser();
        UserControllerBean userControllerBean = userDetailService.selectPersonalCenter(userId);
        if (userControllerBean == null) {
            return badRequestOfSelect("个人中心查询信息失败");
        }

        userControllerBean.setBranchName(currentUserBean.getBranchName());
        userControllerBean.setSpecialistTypeName(currentUserBean.getSpecialistTypeName());
        return succeedRequestOfSelect(userControllerBean);
    }

    /**
     * 个人中心密码修改
     *
     * @param oldPassword
     * @param newPassword
     */
    @PostMapping(value = "modifyPassword")
    public Map personalModifyPassword(@NotBlank String oldPassword, @NotBlank String newPassword) {

        String userId = getRequestToken();
        UserAccount userAccount = userAccountService.getByPrimaryKey(userId);

        if (userAccount == null) {
            return badRequestOfArguments("查询用户信息失败");
        }
        String salt = userAccount.getSalt();
        String passWord = userAccount.getUserPassword();
        String encryptionOldPassWord = DigestUtils.md5DigestAsHex((oldPassword + salt).getBytes());

        if (!passWord.equals(encryptionOldPassWord)) {
            return badRequestOfArguments("旧密码输入错误");
        }

        String newSalt = RandomStringUtils.randomAlphanumeric(32);
        String encryptionNewPassWord = DigestUtils.md5DigestAsHex((newPassword + newSalt).getBytes());

        userAccount.setSalt(newSalt);
        userAccount.setUserPassword(encryptionNewPassWord);
        userAccount.setUpdateTime(new Date());
        int i = userAccountService.updateByPrimaryKeySelective(userAccount);
        if (i > 0) {
            return succeedRequest("修改密码成功");
        }

        return badRequestOfUpdate("修改密码失败");
    }

    /**
     * 个人中心信息修改
     *
     * @param phoneNumber
     * @param idTypeName
     * @param userStrong
     */
    @Transactional
    @PostMapping(value = "modifyPersonal")
    public Map modifyPersonal(String phoneNumber, String idTypeName, String userStrong,
                              String signature, String doctorCardFront) {

        String userId = getRequestToken();
        LinkedHashMap<String, String> resultMap = null;
        List<String> idList = new ArrayList<>();

        UserDetail userDetail = new UserDetail();
        userDetail.setId(userId);

        if (StringUtils.isNotBlank(phoneNumber)) {
            // 更新用户电话
            userDetail.setTelephone(phoneNumber);
        }

        if (StringUtils.isNotBlank(userStrong)) {
            // 更新擅长
            userDetail.setUserStrong(userStrong);
        }

        if (StringUtils.isNotBlank(idTypeName)) {
            try {
                resultMap = JSON.parseObject(idTypeName, new TypeReference<LinkedHashMap<String, String>>() {
                }, Feature.OrderedField);
            } catch (Exception e) {
                return badRequestOfArguments("idTypeName 格式错误");
            }
            // 病例类型名称集合
            StringBuffer stringBuffer = new StringBuffer();
            String typeName = "";
            if (resultMap.size() > 0) {
                for (Map.Entry<String, String> m : resultMap.entrySet()) {
                    idList.add(m.getKey());
                    stringBuffer.append(m.getValue() + "、");
                }
                stringBuffer.deleteCharAt(stringBuffer.length() - 1);
                typeName = stringBuffer.toString();
            }

            userDetail.setNeedCaseType(typeName);

            // 删除原userId对应的UserCaseType字段,并添加新的 UserCaseType
            int i = userCaseTypeService.deleteByUserId(userId);
            if (i < 0) {
                return badRequestOfDelete("删除原UserCaseType失败");
            }

            Map<String, String> userCaseTypeMap = new LinkedHashMap<>();
            for (String id : idList) {
                userCaseTypeMap.put(id, userId);
            }
            int k = userCaseTypeService.insertMulitple(userCaseTypeMap);
            if (k < 0) {
                return badRequestOfInsert("添加UserCaseType失败");
            }
        }

        // 修改UserSing
        if (StringUtils.isNotBlank(signature) || StringUtils.isNotBlank(doctorCardFront)) {
            UserSign userSign = new UserSign();
            userSign.setUpdateUser(userId);
            if (StringUtils.isNotBlank(signature)) {
                userSign.setSignature(signature);
            }
            if (StringUtils.isNotBlank(doctorCardFront)) {
                userSign.setDoctorCardFront(doctorCardFront);
            }
            userSign.setId(userId);
            int l = userSignService.updateByPrimaryKeySelective(userSign);
            if (l < 1) {
                throw new RuntimeException();
            }
        }

        int j = userDetailService.updateByPrimaryKeySelective(userDetail);
        if (j < 1) {
            return badRequestOfUpdate("更新个人信息失败");
        }

        return succeedRequest(userDetail);
    }

    /**
     * 医政管理中心医生列表
     */
    @GetMapping(value = "managementDoctor")
    public Map managementDoctor() {

        String userId = getRequestToken();
        CurrentUserBean currentUserBean = getCurrentUser();
        if (currentUserBean == null) {
            return badRequestOfSelect("redis查询userId对应数据失败");
        }

        String hospitalId = currentUserBean.getHospitalId();
        // 查出该医院所有医生,并按照科室分类
        List<BranchBean> branchBeans = userDetailService.selectByHospital(hospitalId);
        return succeedRequest(branchBeans);

    }

    /**
     * 管理中心修改医生信息
     */
    @Transactional
    @PostMapping(value = "managementUpdateUser")
    public Map managementUpdateUser(UserDetail userDetail, String userDetailId, String accountNum,
                                    String idTypeName, String signature, String doctorCardFront,String roleId) {

        if (StringUtils.isBlank(userDetailId)) {
            return badRequestOfArguments("被修改用户id为空");
        }


        // 修改UserAccount账户
        if (StringUtils.isNotBlank(accountNum)) {

            UserAccount userAccount = userAccountService.selectByUserPhone(accountNum);
            if (userAccount != null) {
                return badRequestOfArguments("账户名已存在");
            }

            userAccount = new UserAccount();
            String salt = RandomStringUtils.randomAlphanumeric(32);
            String newPsd = "yc123456";
            String encryptionPassWord = DigestUtils.md5DigestAsHex((newPsd + salt).getBytes());
            userAccount.setUserPhone(accountNum);
            userAccount.setId(userDetailId);
            userAccount.setUpdateUser(UserTokenManager.getCurrentUserId());
            userAccount.setSalt(salt);
            userAccount.setUserPassword(encryptionPassWord);
            int i = userAccountService.updateByPrimaryKeySelective(userAccount);
            if (i < 1) {
                return succeedRequest("修改账号失败");
            }
        }

        // 修改UserSign
        if (StringUtils.isNotBlank(signature) || StringUtils.isNotBlank(doctorCardFront)) {
            UserSign userSign = new UserSign();
            userSign.setUpdateUser(UserTokenManager.getCurrentUserId());
            if (StringUtils.isNotBlank(signature)) {
                userSign.setSignature(signature);
            }
            if (StringUtils.isNotBlank(doctorCardFront)) {
                userSign.setDoctorCardFront(doctorCardFront);
            }
            userSign.setId(userDetailId);
            int i = userSignService.updateByPrimaryKeySelective(userSign);
            if (i < 1) {
                throw new RuntimeException();
            }
        }

        // 修改UserCaseType
        if (StringUtils.isNotBlank(idTypeName)) {

            LinkedHashMap<String, String> resultMap;
            try {
                resultMap = JSON.parseObject(idTypeName, new TypeReference<LinkedHashMap<String, String>>() {
                }, Feature.OrderedField);
            } catch (Exception e) {
                return badRequestOfArguments("idTypeName 格式错误");
            }

            List<String> idList = new ArrayList<>();

            // 删除原病例需求
            int i = userCaseTypeService.deleteByUserId(userDetailId);
            if (i < 0) {
                return badRequestOfArguments("删除原病例要求失败");
            }

            // 病例类型名称集合
            StringBuffer stringBuffer = new StringBuffer();
            String typeName = "";
            if (resultMap.size() > 0) {
                for (Map.Entry<String, String> m : resultMap.entrySet()) {
                    idList.add(m.getKey());
                    stringBuffer.append(m.getValue() + "、");
                }
                stringBuffer.deleteCharAt(stringBuffer.length() - 1);
                typeName = stringBuffer.toString();
            }

            userDetail.setNeedCaseType(typeName);

            // 添加新的UserCaseType
            Map<String, String> userCaseTypeMap = new LinkedHashMap<>();
            for (String id : idList) {
                userCaseTypeMap.put(id, userDetailId);
            }
            int j = userCaseTypeService.insertMulitple(userCaseTypeMap);
            if (j < 0) {
                return badRequestOfArguments("添加新的病例需求失败");
            }
        }

        // 修改UserDetail
        userDetail.setUpdateUser(UserTokenManager.getCurrentUserId());
        userDetail.setId(userDetailId);
        userDetailService.updateByPrimaryKeySelective(userDetail);

        UserRole userRole = new UserRole();
        userRole.setUserId(userDetail.getId());
        userRole.setRoleId(roleId);
        userRoleService.updateUserRoleByUser(userRole);
        return succeedRequest("修改成功");
    }

    /**
     * 医生通讯录医生信息展示
     *
     * @param branchId
     */
    @GetMapping(value = "addressBook")
    public Map addressBook(String branchId) {

        if (StringUtils.isBlank(branchId)) {
            return badRequestOfArguments("branchId为空");
        }

        List<UserBean> userBeans = userDetailService.selectByBranchId(branchId);
        return succeedRequest(userBeans);
    }

    /**
     * 医生注册审核通过
     */
    @PostMapping(value = "agreeRegister")
    public Map agreeRegister(String userId) {

        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("userSing为空");
        }

        UserSign userSign = new UserSign();
        userSign.setId(userId);
        userSign.setUpdateUser(getRequestToken());
        userSign.setApproveStatus(DoctorCertified.AUTHENTICATION_ACCEDE.toString());
        int i = userSignService.updateByPrimaryKeySelective(userSign);
        if (i > 0) {
            //创建消息 推送给医生
            messageService.sendRegistSuccessAlertToDoctor(userId);
            return succeedRequest("审核通过");
        }

        return badRequestOfArguments("审核通过出错");
    }

    /**
     * 医生注册审核未通过
     */
    @PostMapping(value = "disagreeRegister")
    public Map disagreeRegister(String userId) {

        String operatorId = getRequestToken();
        if (StringUtils.isBlank(userId)) {
            return badRequestOfArguments("医生id为空或医政id未获取");
        }

        int i = userSignService.auditNotPass(operatorId, userId);
        if (i > 0) {
            return succeedRequest("审核未通过");
        }

        return badRequestOfArguments("审核未通过出错");
    }

    /**
     * 医政修改医生密码
     */
    @PostMapping(value = "adminChangePassWord")
    public Map changePassWord(String id) {

        String userId = getRequestToken();
        UserAccount userAccount = new UserAccount();

        String salt = RandomStringUtils.randomAlphanumeric(32);
        String newPsd = "yc123456";
        String encryptionPassWord = DigestUtils.md5DigestAsHex((newPsd + salt).getBytes());
        userAccount.setId(id);
        userAccount.setUpdateUser(userId);
        userAccount.setSalt(salt);
        userAccount.setUserPassword(encryptionPassWord);
        int i = userAccountService.updateByPrimaryKeySelective(userAccount);
        if (i > 0) {
            return succeedRequest("修改密码成功");
        }
        return badRequestOfArguments("修改密码失败");
    }


    @PostMapping("sendSignCode")
    public Object sendSignCode(String phone){
        ArrayList<String> smsContext = new ArrayList<>();
        String signCode = RandomStringUtils.randomNumeric(6);
        smsContext.add(signCode);
        smsContext.add("5");
        redisTemplate.opsForValue().set(phone,signCode,300, TimeUnit.SECONDS);
        smsService.singleSendByTemplate("86",phone,331466, smsContext);
        return succeedRequest("发送成功");
    }
}
