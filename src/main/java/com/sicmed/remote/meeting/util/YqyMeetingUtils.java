package com.sicmed.remote.meeting.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.sicmed.remote.common.Constant;
import com.sicmed.remote.meeting.bean.MeetingBean;
import com.sicmed.remote.meeting.entity.RequestMeeting;
import com.sicmed.remote.web.YoonaLtUtils.HttpClientUtils;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 云启云 会议服务 调用 工具类
 *
 * @author Xue
 */
@Slf4j
public class YqyMeetingUtils {

    static private RedisTemplate redisTemplate = null;


    /**
     * 创建会议
     *
     * @param requestMeeting
     * @return
     */
    public static MeetingBean createMeeting(RequestMeeting requestMeeting) throws Exception {
        //获取token
        String accessToken = getToken(requestMeeting.getMobile(), requestMeeting.getRealName());
        if (accessToken == null) {
            throw new CustomException("鉴权接口调用失败");
        }
        //调用云起云创建会议接口
        String res = svocCreateInterface(accessToken, requestMeeting.getAppointmentName(), requestMeeting.getStartTime(), requestMeeting.getEndTime(), requestMeeting.isLive(), requestMeeting.isMute(), requestMeeting.isRecord(), requestMeeting.getConcurrentNum());
        return responseObject(res);
    }

    /**
     * 修改会议
     *
     * @param requestMeeting
     * @return
     */
    public static MeetingBean updateMeeting(RequestMeeting requestMeeting) throws Exception {
        //获取token
        String accessToken = getToken(requestMeeting.getMobile(), requestMeeting.getRealName());
        if (accessToken == null) {
            throw new CustomException("鉴权接口调用失败");
        }
        //调用修改接口
        String res = svocUpdateInterface(accessToken, requestMeeting.getAppointmentName(), requestMeeting.getAppointmentId(), requestMeeting.getHostPwd(), requestMeeting.getLivePwd(), requestMeeting.getStartTime(), requestMeeting.getEndTime(), requestMeeting.isLive(), requestMeeting.isMute(), requestMeeting.isRecord(), requestMeeting.getConcurrentNum());
        return responseObject(res);
    }

    /**
     * 删除会议
     *
     * @return
     */
    public static MeetingBean deleteMeeting(RequestMeeting requestMeeting) throws Exception {
        //获取token
        String accessToken = getToken(requestMeeting.getMobile(), requestMeeting.getRealName());
        if (accessToken == null) {
            throw new CustomException("鉴权接口调用失败");
        }
        String res = svocDeleteInterface(accessToken, requestMeeting.getAppointmentId());
        return responseObject(res);
    }

    /**
     * 根据会议号获取会议id,预约id
     *
     * @param requestMeeting
     * @return
     */
    public static MeetingBean getMeetingId(RequestMeeting requestMeeting) throws Exception {
        //获取token
        String accessToken = getToken(requestMeeting.getMobile(), requestMeeting.getRealName());
        if (accessToken == null) {
            throw new CustomException("鉴权接口调用失败");
        }
        String res = svocGetInterface(accessToken, requestMeeting.getAppointmentNumber());
        return responseObject(res);
    }


    /**
     * 获取当前登录人token
     *
     * @param phone
     * @param realName
     * @return
     */
    private static String getToken(String phone, String realName) {
        YqyMeetingUtils.redisTemplate = SpringUtil.getBean(StringRedisTemplate.class);
        Object authToken = redisTemplate.opsForValue().get("yqy:" + phone);
        String token;
        if (authToken == null) {
            token = HttpClientUtils.getMethod(phone, realName);
            //存入redis数据库
            redisTemplate.opsForValue().set("yqy:" + phone, token, Constant.EXPIRATION_DATE, TimeUnit.MILLISECONDS);
        } else {
            token = authToken.toString();
        }
        return token;
    }

    public static void checkToken(String phone, String realName) {
        getToken(phone, realName);
    }

    /**
     * 云起云创建接口
     *
     * @param accessToken     token
     * @param appointmentName 会议标题
     * @param startDate       会议开始时间字符串(yyyy-MM-dd HH:mm:ss)
     * @param endDate         会议结束时间字符串(yyyy-MM-dd HH:mm:ss)
     * @param isLive          是否开启直播(true/false)
     * @param isMute          参会者进入时是否静音(true/false)
     * @param isRecord        是否开启录制(true/false)
     * @param concurrentNum   所需并发数(int类型)
     * @return
     */
    private static String svocCreateInterface(String accessToken, String appointmentName, Date startDate, Date endDate, boolean isLive, boolean isMute, boolean isRecord, int concurrentNum) {
        //调用云起云创建会议接口
        Map params = new LinkedHashMap();
        params.put("appointmentName", appointmentName);
        params.put("appointmentPeriod", YtDateUtils.timeDifference(startDate, endDate));
        params.put("appointmentType", "1");
        params.put("hostPwd", (int) ((Math.random() * 9 + 1) * 1000) + "");
        params.put("isLive", isLive);
        params.put("isMute", isMute);
        params.put("isRecord", isRecord);
        params.put("livePwd", "");
        params.put("startTime", startDate.getTime());
        params.put("concurrentNum", concurrentNum);
        return HttpClientUtils.createMeeting(Constant.BASEPATH + Constant.APPOINTMENTS_URL, accessToken, params);
    }

    /**
     * 云起云修改接口
     *
     * @param accessToken     token
     * @param appointmentName 会议标题
     * @param appointmentId   房间号
     * @param livePwd         直播密码
     * @param startDate       会议开始时间字符串(yyyy-MM-dd HH:mm:ss)
     * @param endDate         会议结束时间字符串(yyyy-MM-dd HH:mm:ss)
     * @param isLive          是否开启直播(true/false)
     * @param isMute          参会者进入时是否静音(true/false)
     * @param isRecord        是否开启录制(true/false)
     * @param concurrentNum   所需并发数(int类型)
     * @return
     */
    private static String svocUpdateInterface(String accessToken, String appointmentName, String appointmentId, String hostPwd, String livePwd, Date startDate, Date endDate, boolean isLive, boolean isMute, boolean isRecord, int concurrentNum) {
        //调用云起云创建会议接口
        Map params = new LinkedHashMap();
        params.put("appointmentName", appointmentName);
        params.put("appointmentId", appointmentId);
        params.put("appointmentPeriod", YtDateUtils.timeDifference(startDate, endDate));
        params.put("appointmentType", "1");
        params.put("hostPwd", hostPwd);
        params.put("isLive", isLive);
        params.put("isMute", isMute);
        params.put("isRecord", isRecord);
        params.put("livePwd", livePwd);
        params.put("startTime", startDate.getTime());
        params.put("concurrentNum", concurrentNum);
        return HttpClientUtils.updateMeeting(params, Constant.BASEPATH + Constant.APPOINTMENTS_URL, accessToken);
    }

    /**
     * 云起云删除接口
     *
     * @param accessToken
     * @param appointmentId
     * @return
     */
    private static String svocDeleteInterface(String accessToken, String appointmentId) {
        return HttpClientUtils.deleteMethod(appointmentId, Constant.BASEPATH + Constant.APPOINTMENTS_URL, accessToken);
    }

    /**
     * 获取云起云会议id接口
     */
    private static String svocGetInterface(String accessToken, String roomNumber) {
        return HttpClientUtils.getMeetingId(roomNumber, Constant.BASEPATH + Constant.CONFERENCES_URL, accessToken);
    }

    /**
     * json字符串转对象,返回自定义云起云返回类
     *
     * @param resultJson
     * @return
     */
    private static MeetingBean responseObject(String resultJson) throws CustomException {
        Map<String, Object> response = (Map) JSON.parse(resultJson);
        if (response.get("code") != null && "200".equals(response.get("code").toString())) {
            return JSON.parseObject(response.get("data").toString(), new TypeReference<MeetingBean>() {
            });
        } else {
            log.error(response.get("msg").toString());
            throw new CustomException("云起云接口调用失败");
        }
    }

}
