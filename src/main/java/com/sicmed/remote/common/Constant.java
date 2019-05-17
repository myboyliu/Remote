package com.sicmed.remote.common;

/**
 * @program: remote
 * @description: 常量类
 * @author: Xue0601
 * @create: 2018-12-18 13:47
 **/
public class Constant {

    private Constant(){}

    /**
     * 腾讯云api 密匙
     */
    public static final String PRIVATEKEY = "KF7xhKo7FE2fAXkmfNuHamogU7cwHSVN";
    public static final String SECRETID = "AKIDlQ5CIFRjDYijaIMgEhOyOejfQCtUcFOc";

    /**
     * 点播筛选条件关键字
     */
    public static final String VIDEO_HOT = "热度";
    public static final String VIDEO_NEW = "最新";

    /**
     * 直播筛选条件关键字
     */
    public static final String LIVE_FOLLOW= "关注度";
    public static final String LIVE_NEW = "最新";

    /**
     * 直播默认封面
     */
    public static final String DEFAULT_COVER_URL ="picture/default/default.png";




    /**
     * 云启云相关参数
     * 服务器url
     * 盐
     * token接口
     * 其他接口
     */
    public static final String BASEPATH = "https://ent.uc.bjcyh.info:8443";
    public static final String CLIENTSECRET = "MIICXQIBAAKBgQCxwfRs7dncpWJ27OQ9rIjHeBbkaigRY4in+DEKBsbmT3lpb2C6JQyqgxl9C+l5zSbONp0OIibaAVsLPSbUPVwIDAQABAoGAK76VmKIuiI2fZJQbdq6oDQ";
    public static final String AUTHTOKEN_URL = "/appapi/api/authToken/ylyw";
    public static final String APPOINTMENTS_URL = "/appapi/api/appointments";
    public static final String CONFERENCES_URL = "/appapi/api/conferences";

    /**
     * 过期时间90分钟的毫秒值
     */
    public static final int EXPIRATION_DATE = 1200;

    /**
     *  群发消息标记
     */
    public static final String MESSAGE_GRADE = "all";

}
