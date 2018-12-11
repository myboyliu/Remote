/*
package com.sicmed.remote.web.YoonaLtUtils;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;


*/
/**
 * @author YoonaLt
 * @version Running JDK 1.8
 * @description
 * @data 2018/12/11
 *//*

public class HttpUtils {
    public static String getUserIp(HttpServletRequest request) {
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
}
*/
