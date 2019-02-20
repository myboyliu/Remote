package com.sicmed.remote.common.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;

import java.util.List;

/**
 * 会诊 受邀医生列表JSON 解析工具类
 */
public class ConsultationUserListUtils {
    public static List<ConsultationUserBean> consultationUserListJsonToObj(String consultationUserListJson) {

        return JSON.parseObject(consultationUserListJson, new TypeReference<List<ConsultationUserBean>>() {
        }, Feature.OrderedField);
    }
}