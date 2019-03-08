package com.sicmed.remote.OtherConfiguration;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.sicmed.remote.common.ConsultationStatus;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.entity.CaseConsultant;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.ApplyTimeService;
import com.sicmed.remote.web.service.CaseConsultantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 视频会诊进入已排期,创建对应的Redis key,并设置对应的过期时间
 */
public class StorageRedisKey {

    @Autowired
    private CaseConsultantService caseConsultantService;

    @Autowired
    private ApplyTimeService applyTimeService;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private ApplyFormService applyFormService;

    /**
     * 会诊提醒 key 格式为 type:applyFormId:inviteUserId1-inviteUserId2...
     * 05提醒的 key 格式为 type:提醒时间(Ex:2018-11-11 05:00:00)
     * 06提醒的 key 格式为 type:直播id
     * type类型有 01,02,03,04,05,06
     * 01会诊开始前60分钟提醒  02会诊开始前15分钟提醒  03会诊开始前5分钟提醒
     * 04新课程推送提醒        05新直播推送提醒        06已关注直播提醒
     */

    /**
     * 视频会诊提醒
     */
    public void timeBoundKey(String applyFormId) {

        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append("01:" + applyFormId + ":");
        CaseConsultant caseConsultant = caseConsultantService.getByPrimaryKey(applyFormId);
        String userListString = caseConsultant.getConsultantUserList();
        List<Map<String, String>> mapList;
        mapList = JSON.parseObject(userListString, new TypeReference<List<Map<String, String>>>() {
        }, Feature.OrderedField);
        for (Map map : mapList) {
            stringBuffer.append(map.get("doctorId") + "-");
        }
        stringBuffer.deleteCharAt(stringBuffer.length() - 1);


        ApplyTime applyTime = applyTimeService.getByApplyFormId(applyFormId);
        Date consultationStartTime = applyTime.getEventStartTime();
        long before60Time = YtDateUtils.before60Time(consultationStartTime);
        long before15Time = YtDateUtils.before15Time(consultationStartTime);
        long before5Time = YtDateUtils.before5Time(consultationStartTime);

        redisTemplate.opsForValue().set(stringBuffer.toString(), "60min", before60Time, TimeUnit.MILLISECONDS);
        redisTemplate.opsForValue().set(stringBuffer.replace(0, 2, "02").toString(), "15min", before15Time, TimeUnit.MILLISECONDS);
        redisTemplate.opsForValue().set(stringBuffer.replace(0, 2, "03").toString(), "5min", before5Time, TimeUnit.MILLISECONDS);

    }

    /**
     * 视频会诊提醒,重新选择了医生或者时间
     */
    public void delTimeBoundKey(String applyFormId) {

        ApplyForm applyForm = applyFormService.getByPrimaryKey(applyFormId);
        if (ConsultationStatus.CONSULTATION_DATETIME_LOCKED.toString().equals(applyForm.getApplyStatus())) {
            StringBuffer stringBuffer = new StringBuffer();
            stringBuffer.append("01:" + applyFormId + ":");
            CaseConsultant quondamCaseConsultant = caseConsultantService.getByPrimaryKey(applyFormId);
            String quondamUserListString = quondamCaseConsultant.getConsultantUserList();
            List<Map<String, String>> quondamMapList;
            quondamMapList = JSON.parseObject(quondamUserListString, new TypeReference<List<Map<String, String>>>() {
            }, Feature.OrderedField);
            for (Map map : quondamMapList) {
                stringBuffer.append(map.get("doctorId") + "-");
            }
            stringBuffer.deleteCharAt(stringBuffer.length() - 1);
            redisTemplate.delete(stringBuffer.toString());
            redisTemplate.delete(stringBuffer.replace(0, 2, "02").toString());
            redisTemplate.delete(stringBuffer.replace(0, 2, "03").toString());
        }

    }

    /**
     * 新直播推送
     */
    public void newLiveStreaming() {
        String key = "05:" + YtDateUtils.dateToString(YtDateUtils.getTomorrow17Points());
        redisTemplate.opsForValue().set(key, "直播预报", YtDateUtils.distance17Points(), TimeUnit.MILLISECONDS);
    }

    /**
     * 已关注直播开始前提醒
     */
    public void alreadyFocused(String curriculumId, Date date) {
        String key = "06:" + curriculumId;
        redisTemplate.opsForValue().set(key, "关注直播提醒", YtDateUtils.before5Time(date), TimeUnit.MILLISECONDS);

    }

}
