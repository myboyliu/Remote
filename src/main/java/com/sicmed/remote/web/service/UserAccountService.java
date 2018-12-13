package com.sicmed.remote.web.service;

import com.sicmed.remote.web.entity.UserAccount;
import com.sicmed.remote.web.mapper.UserAccountMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;


@Service
public class UserAccountService implements BaseService<UserAccount> {

    @Autowired
    private UserAccountMapper userAccountMapper;

    public int selectCountPhone(String phoneNumber) {
        return userAccountMapper.selectCountPhone(phoneNumber);
    }

    public String getUserIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)) {
            //多次反向代理后会有多个ip值，第一个ip才是真实ip
            int index = ip.indexOf(",");
            if (index != -1) {
                return ip.substring(0, index);
            } else {
                return ip;
            }
        }
        ip = request.getHeader("X-Real-IP");
        if (StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)) {
            return ip;
        }
        return request.getRemoteAddr();
    }

    public UserAccount selectSaltPw(String phoneNumber) {
        return userAccountMapper.selectSaltPw(phoneNumber);
    }

    public int insertSelective(UserAccount userAccount, HttpServletRequest httpServletRequest) {
        String createIp = getUserIp(httpServletRequest);
        userAccount.setCreateIp(createIp);
        return userAccountMapper.insertSelective(userAccount);
    }

    public int updateByPrimaryKeySelective(UserAccount userAccount, HttpServletRequest httpServletRequest) {
        String lastLoginIp = getUserIp(httpServletRequest);
        userAccount.setLastLoginIp(lastLoginIp);
        return userAccountMapper.updateByPrimaryKeySelective(userAccount);
    }

    @Override
    public int insertSelective(UserAccount userAccount) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(UserAccount userAccount) {
        return userAccountMapper.updateByPrimaryKeySelective(userAccount);
    }

    @Override
    public int updateByPrimaryKey(UserAccount userAccount) {
        return 0;
    }

    @Override
    public UserAccount getByPrimaryKey(String id) {
        return userAccountMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<UserAccount> findByDynamicParam(UserAccount userAccount) {
        return userAccountMapper.findByDynamicParam(userAccount);
    }
}
