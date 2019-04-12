package com.sicmed.remote.common.poi;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.web.bean.ApplyFormBean;
import com.sicmed.remote.web.service.ApplyFormService;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotEmpty;
import java.util.*;

/**
 * @program: tele-medicine
 * @description: world下载
 * @author: Xue0601
 * @create: 2018-10-19 13:32
 **/
@Validated
@RestController
@RequestMapping(value = "download")
public class PoiWorldController {

    @Autowired
    private ApplyFormService applyFormService;

    /**
     * 下载患者基本信息下载
     *
     * @param applyFormId 订单id
     * @param request
     * @param response
     */
    @GetMapping(value = "patientDetail")
    public void patientDetail(@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String applyFormId, HttpServletRequest request, HttpServletResponse response) {
        ApplyFormBean applyFormBean = applyFormService.detailById(applyFormId);

        Map<String, Object> params = new HashMap<>();
        params.put("name", applyFormBean.getPatientName() != null ? applyFormBean.getPatientName() : "(空)");
        params.put("sex", applyFormBean.getPatientSex() != null ? applyFormBean.getPatientSex() : "(空)");
        params.put("age", applyFormBean.getPatientAge() != null ? applyFormBean.getPatientAge() : "(空)");
        params.put("height", applyFormBean.getPatientHeight() != null ? applyFormBean.getPatientHeight() + "cm" : "(空)");
        params.put("weight", applyFormBean.getPatientWeight() != null ? applyFormBean.getPatientWeight() / 1000 + "kg" : "(空)");
        params.put("address", applyFormBean.getDetailAddress() != null ? applyFormBean.getDetailAddress() : "(空)");
        params.put("urgent", applyFormBean.getApplyUrgent().equals("1") ? "是" : "否");
        params.put("diagnosis", applyFormBean.getCaseDiagnosis() != null ? applyFormBean.getCaseDiagnosis() : "(空)");
        params.put("telemedicineTarget", applyFormBean.getApplyRemark() != null ? applyFormBean.getApplyRemark() : "(空)");
        FileUtil.exportWord("tempWord/患者病例基本信息.docx", "D:/temp", "患者病例基本信息.docx", params, request, response);
    }

    /**
     * 临时医嘱下载
     *
     * @param orderId
     * @param request
     * @param response
     */
//    @GetMapping(value = "statOrder")
//    public void StatOrder(@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String orderId, HttpServletRequest request, HttpServletResponse response) {
//        ApplyFormBean applyFormBean = applyFormService.detailById(orderId);
//
////        Map<String, Object> orderMap = (Map) JSON.parse();
//        JSONObject jsonObject = JSONObject.parseObject(applyFormBean.getConsultantReport());
//        JSONObject doctorEnjoin = jsonObject.getJSONObject("doctorEnjoin");
//
//        JSONArray shortArray = doctorEnjoin.getJSONArray("longTimeArr");
//        Map<String, Object> params = new HashMap<>();
//        for (int i = 1; i < 25; i++) {
//            params.put("date" + i, "_");
//            params.put("time" + i, "_");
//            params.put("orders" + i, "_");
//            params.put("doctor" + i, "_");
//        }
//
//        //记录诊疗条数
//        int number = shortArray.size();
//        //诊疗
//        for (int i = 1; i <= shortArray.size(); i++) {
//            JSONObject jsonObject1 = shortArray.getJSONObject(i + 1);
//            Map<String, String> shortArr = (Map) JSON.parse(shortArray.get(i - 1).toString());
//            params.put("date" + i, shortArr.get("arriveTime").substring(0, 10) != null ? shortArr.get("arriveTime").substring(0, 10) : "_");
//            params.put("date" + i, shortArr.get("arriveTime").substring(0, 10) != null ? shortArr.get("arriveTime").substring(0, 10) : "_");
//            params.put("time" + i, shortArr.get("arriveTime").substring(10, 16) != null ? shortArr.get("arriveTime").substring(10, 16) : "_");
//            params.put("orders" + i, shortArr.get("name") != null ? shortArr.get("name") : "_");
//            params.put("doctor" + i, orderMap.get("doctor") != null ? orderMap.get("doctor") : "_");
//        }
//
//        //药品
//        JSONArray medicalArray = JSONArray.parseArray(orderMap.get("temporaryDrugArr").toString());
//        List<Map<String, String>> mapList = new LinkedList<>();
//        for (int i = 1; i <= medicalArray.size(); i++) {
//            Map<String, Object> longArr = (Map) JSON.parse(medicalArray.get(i - 1).toString());
//            JSONArray drugArr = JSONArray.parseArray(longArr.get("drugArr").toString());
//            for (int j = 1; j <= drugArr.size(); j++) {
//                Map<String, String> map = new LinkedHashMap<>();
//                Map<String, String> temp = (Map) JSON.parse(drugArr.get(j - 1).toString());
//                map.put("date", longArr.get("arriveTime").toString().substring(0, 10) != null ? longArr.get("arriveTime").toString().substring(0, 10) : "_");
//                map.put("time", longArr.get("arriveTime").toString().substring(10, 16) != null ? longArr.get("arriveTime").toString().substring(10, 16) : "_");
//                map.put("orders", temp.get("name") != null ? temp.get("name") : "_");
//                map.put("doctor", orderMap.get("doctor") != null ? orderMap.get("doctor").toString() : "_");
//                mapList.add(map);
//            }
//        }
//        for (int i = 1; i <= mapList.size(); i++) {
//            int num = number + i;
//            mapList.get(i - 1);
//            params.put("date" + num, mapList.get(i - 1).get("date"));
//            params.put("time" + num, mapList.get(i - 1).get("time"));
//            params.put("orders" + num, mapList.get(i - 1).get("orders"));
//            params.put("doctor" + num, mapList.get(i - 1).get("doctor"));
//        }
//        params.put("name", applyFormBean.getPatientName() != null ? applyFormBean.getPatientName() : "(空)");
//        params.put("sex", applyFormBean.getPatientSex() != null ? applyFormBean.getPatientSex() : "(空)");
//        params.put("age", applyFormBean.getPatientAge() != null ? applyFormBean.getPatientAge() : "(空)");
//        params.put("remarks", orderMap.get("temporaryArea") != null ? orderMap.get("temporaryArea") : "(空)");
//
//        FileUtil.exportWord("tempWord/临时医嘱单模板.docx", "D:/temp", "临时医嘱单.docx", params, request, response);
//
//    }

    /**
     * 长期医嘱下载
     *
     * @param orderId
     * @param request
     * @param response
     */
    @GetMapping(value = "standingOrders")
    public void standingOrders(@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String orderId, HttpServletRequest request, HttpServletResponse response) {
        ApplyFormBean applyFormBean = applyFormService.detailById(orderId);
        Map<String, Object> orderMap = (Map) JSON.parse(applyFormBean.getConsultantReport());
        JSONArray longArray = JSONArray.parseArray(orderMap.get("longTimeArr").toString());
        List<Map<String, String>> mapList = new LinkedList<>();
        Map<String, Object> params = new HashMap<>();
        //设置默认占位符
        for (int i = 1; i < 25; i++) {
            params.put("date" + i, "_");
            params.put("orders" + i, "_");
            params.put("time" + i, "_");
            params.put("doctor" + i, "_");
        }
        //长期医嘱
        for (int i = 1; i <= longArray.size(); i++) {
            Map<String, Object> longArr = (Map) JSON.parse(longArray.get(i - 1).toString());
            JSONArray drugArr = JSONArray.parseArray(longArr.get("drugArr").toString());
            for (int j = 1; j <= drugArr.size(); j++) {
                Map<String, String> map = new LinkedHashMap<>();
                Map<String, String> temp = (Map) JSON.parse(drugArr.get(j - 1).toString());
                map.put("date", longArr.get("startTime").toString().substring(0, 10) != null ? longArr.get("startTime").toString().substring(0, 10) : "_");
                map.put("time", longArr.get("startTime").toString().substring(11, 16) != null ? longArr.get("startTime").toString().substring(11, 16) : "_");
                map.put("doctor", orderMap.get("doctor") != null ? orderMap.get("doctor").toString() : "_");
                map.put("orders", temp.get("name") != null ? temp.get("name") : "_");
                mapList.add(map);
            }
        }
        for (int i = 1; i <= mapList.size(); i++) {
            params.put("date" + i, mapList.get(i - 1).get("date"));
            params.put("time" + i, mapList.get(i - 1).get("time"));
            params.put("orders" + i, mapList.get(i - 1).get("orders"));
            params.put("doctor" + i, mapList.get(i - 1).get("doctor"));
        }
        params.put("name", applyFormBean.getPatientName() != null ? applyFormBean.getPatientName() : "(空)");
        params.put("sex", applyFormBean.getPatientSex() != null ? applyFormBean.getPatientSex() : "(空)");
        params.put("age", applyFormBean.getPatientAge() != null ? applyFormBean.getPatientAge() : "(空)");
        params.put("remarks", orderMap.get("longTimeArea") != null ? orderMap.get("longTimeArea") : "(空)");

        //这里是我说的一行代码
        FileUtil.exportWord("tempWord/长期医嘱单模板.docx", "D:/temp", "长期医嘱单模板.docx", params, request, response);
    }


    /**
     * 手术备品医嘱下载
     *
     * @param orderId
     * @param request
     * @param response
     */
    @GetMapping(value = "specificationsOrder")
    public void specificationsOrder(@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String orderId, HttpServletRequest request, HttpServletResponse response) {
        ApplyFormBean applyFormBean = applyFormService.detailById(orderId);
        JSONArray jsonArray = JSONObject.parseArray(applyFormBean.getConsultantReport());
        JSONObject doctorEnjoin = jsonArray.getJSONObject(0).getJSONObject("doctorEnjoin");
        JSONArray surgeryArr = doctorEnjoin.getJSONArray("surgeryArr");

//        Map<String, Object> orderMap = (Map) JSON.parse(applyFormBean.getConsultantReport());
//        JSONArray surgeryArray = JSONArray.parseArray(orderMap.get("surgeryArr").toString());
        Map<String, Object> params = new HashMap<>();
        for (int i = 1; i < 25; i++) {
            params.put("name" + i, "_");
            params.put("specifications" + i, "_");
            params.put("num" + i, "_");
        }
        for (int i = 1; i <= surgeryArr.size(); i++) {
//            Map<String, String> surgeryMap = (Map) JSON.parse(surgeryArr.get(i - 1).toString());
            JSONObject surgeryObj = surgeryArr.getJSONObject(i - 1);
            params.put("name" + i, surgeryObj.get("surgeryName"));
            params.put("specifications" + i, "-");
            params.put("num" + i, surgeryObj.get("surgeryNum"));
        }
        params.put("name", applyFormBean.getPatientName() != null ? applyFormBean.getPatientName() : "(空)");
        params.put("sex", applyFormBean.getPatientSex() != null ? applyFormBean.getPatientSex() : "(空)");
        params.put("age", applyFormBean.getPatientAge() != null ? applyFormBean.getPatientAge() : "(空)");
        params.put("remarks", doctorEnjoin.getString("surgeryArea") != null ? doctorEnjoin.getString("surgeryArea") : "(空)");

        FileUtil.exportWord("tempWord/手术备品模板.docx", "D:/temp", "手术备品模板.docx", params, request, response);
    }
}
