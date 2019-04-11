package com.sicmed.remote.task;

public enum TaskTypeConstant {

    //        01会诊开始前60分钟提醒
    REMIND_60_MINUTE,
    //        02会诊开始前15分钟提醒,
    REMIND_15_MINUTE,
    //        03会诊开始前5分钟提醒
    REMIND_5_MINUTE,
    //        04新课程推送提醒
    COURSE_PUSH,
    //        05新直播推送提醒
    LIVE_PUSH,
    //        06已关注直播提醒
    REMIND_LIVE,
    //转诊结束监听
    REFERRAL_END_LISTENER,
    //会诊开始监听
    CONSULTATION_START_LISTENER

}
