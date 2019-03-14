package com.sicmed.remote.task;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.message.bean.MessageConstant;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class RedisTimerService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;


    /**
     * 明天有新直播 创建 直播推送
     */
    public void createLivePush(Date date) {

        long beforDay17Time = YtDateUtils.distance17Points(date);
        if (beforDay17Time <= 0) {
            return;
        }
        String beforDay17Str = YtDateUtils.dateToString(YtDateUtils.getBefor17Points(date));
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("cid", "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
        jsonObject.put("type", MessageConstant.LIVE_PUSH_MESSAGE);
        jsonObject.put("title", "有新直播了！明日的热门直播课程不要错过，立即点击查看");
        new RedisTimer(beforDay17Str, beforDay17Time, jsonObject).start();
    }

    /**
     * 创建已关注直播 提醒
     *
     * @param liveId
     * @param liveName
     * @param date
     */
    public void createLiveRemind(String liveId, String liveName, Date date) {
        long before5Time = YtDateUtils.before5Time(date);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", MessageConstant.LIVE_ALERT_MESSAGE);
        jsonObject.put("aboutId", liveId);
        jsonObject.put("prefix", "");
        jsonObject.put("suffix", "");
        jsonObject.put("title", "您关注的直播“" + liveName + "”即将开始，请及时查看");
        new RedisTimer(liveId, before5Time, jsonObject).start();
    }

    /**
     * 创建 视频会诊 会议开始提醒
     *
     * @param applyFormId
     * @param consultationStartTime
     * @param jsonArray
     */
    public void createMeetingRemind(String applyFormId, Date consultationStartTime, JSONArray jsonArray) {


        //创建60分钟提醒
        long before60Time = YtDateUtils.before60Time(consultationStartTime);
        if (before60Time > 5000) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("type", MessageConstant.MEETING_ALERT_MESSAGE);
            jsonObject.put("aboutId", applyFormId);
            jsonObject.put("userList", jsonArray);
            jsonObject.put("prefix", "您预约了60分钟后进行视频会诊");
            jsonObject.put("suffix", "");
            jsonObject.put("title", "您您预约了60分钟后进行视频会诊");
            new RedisTimer(applyFormId, before60Time, jsonObject).start();
        }

        //创建15分钟提醒
        long before15Time = YtDateUtils.before15Time(consultationStartTime);
        if (before15Time > 5000) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("type", MessageConstant.MEETING_ALERT_MESSAGE);
            jsonObject.put("aboutId", applyFormId);
            jsonObject.put("userList", jsonArray);
            jsonObject.put("prefix", "您预约了15分钟后进行视频会诊，请提前5分钟进入会诊室做准备");
            jsonObject.put("suffix", "");
            jsonObject.put("title", "您预约了15分钟后进行视频会诊，请提前5分钟进入会诊室做准备");
            new RedisTimer(applyFormId, before15Time, jsonObject).start();
        }

        //创建5分钟提醒
        long before5Time = YtDateUtils.before5Time(consultationStartTime);
        if (before5Time > 5000) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("type", MessageConstant.MEETING_ALERT_MESSAGE);
            jsonObject.put("aboutId", applyFormId);
            jsonObject.put("userList", jsonArray);
            jsonObject.put("prefix", "您预约的会诊室已激活，如还未进入，请通知相关人员尽快加入。如已准备妥当请忽略本消息");
            jsonObject.put("suffix", "");
            jsonObject.put("title", "您预约的会诊室已激活，如还未进入，请通知相关人员尽快加入。如已准备妥当请忽略本消息");

            new RedisTimer(applyFormId, before5Time, jsonObject).start();
        }
    }


}
