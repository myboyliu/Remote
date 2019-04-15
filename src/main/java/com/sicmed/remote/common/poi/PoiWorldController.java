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
     * https://127.0.0.1/download/statOrder?orderId=3ebd3e2d5cd211e98ede487b6bd31bf7
     */
    @GetMapping(value = "statOrder")
    public void StatOrder(@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String orderId, HttpServletRequest request, HttpServletResponse response) {
        ApplyFormBean applyFormBean = applyFormService.detailById(orderId);
        //1.获取会诊报告+医嘱
        JSONArray jsonArray = JSONObject.parseArray(applyFormBean.getConsultantReport());
        //2.获取医嘱信息
        JSONObject doctorEnjoin = jsonArray.getJSONObject(0).getJSONObject("doctorEnjoin");
        //3.获取临时医嘱信息
        JSONArray temporaryDrugArr = doctorEnjoin.getJSONArray("temporaryDrugArr");
        JSONArray temporaryTreatArr = doctorEnjoin.getJSONArray("temporaryTreatArr");


        Map<String, Object> params = new HashMap<>();
        for (int i = 1; i < 25; i++) {
            params.put("date" + i, "_");
            params.put("time" + i, "_");
            params.put("orders" + i, "_");
            params.put("doctor" + i, "_");
        }

        //记录诊疗条数
        int number = temporaryTreatArr.size();
        //诊疗
        for (int i = 1; i <= temporaryTreatArr.size(); i++) {
            JSONObject temporaryTreatObject = temporaryTreatArr.getJSONObject(i - 1);

            params.put("date" + i, temporaryTreatObject.getString("arriveTime").substring(0, 10) != null ? temporaryTreatObject.getString("arriveTime").substring(0, 10) : "_");
            params.put("date" + i, temporaryTreatObject.getString("arriveTime").substring(0, 10) != null ? temporaryTreatObject.getString("arriveTime").substring(0, 10) : "_");
            params.put("time" + i, temporaryTreatObject.getString("arriveTime").substring(10) != null ? temporaryTreatObject.getString("arriveTime").substring(10) : "_");
            params.put("orders" + i, temporaryTreatObject.getString("name") != null ? temporaryTreatObject.getString("name") : "_");
            params.put("doctor" + i, doctorEnjoin.get("doctor") != null ? doctorEnjoin.get("doctor") : "_");
        }

        //药品
        List<Map<String, String>> mapList = new LinkedList<>();
        for (int i = 1; i <= temporaryDrugArr.size(); i++) {
            JSONObject temporaryDrugObject = temporaryDrugArr.getJSONObject(i-1);
            JSONArray drugArr = temporaryDrugObject.getJSONArray("drugArr");
            for (int j = 1; j <= drugArr.size(); j++) {
                Map<String, String> map = new LinkedHashMap<>();
                JSONObject drugObject = drugArr.getJSONObject(j-1);
                map.put("date", temporaryDrugObject.get("arriveTime").toString().substring(0, 10) != null ? temporaryDrugObject.get("arriveTime").toString().substring(0, 10) : "_");
                map.put("time", temporaryDrugObject.get("arriveTime").toString().substring(10) != null ? temporaryDrugObject.get("arriveTime").toString().substring(10) : "_");
                map.put("orders", drugObject.getString("name") != null ? drugObject.getString("name") : "_");
                map.put("doctor", doctorEnjoin.getString("doctor") != null ? doctorEnjoin.getString("doctor") : "_");
                mapList.add(map);
            }
        }
        for (int i = 1; i <= mapList.size(); i++) {
            int num = number + i;
            mapList.get(i - 1);
            params.put("date" + num, mapList.get(i - 1).get("date"));
            params.put("time" + num, mapList.get(i - 1).get("time"));
            params.put("orders" + num, mapList.get(i - 1).get("orders"));
            params.put("doctor" + num, mapList.get(i - 1).get("doctor"));
        }
        params.put("name", applyFormBean.getPatientName() != null ? applyFormBean.getPatientName() : "(空)");
        params.put("sex", applyFormBean.getPatientSex() != null ? applyFormBean.getPatientSex() : "(空)");
        params.put("age", applyFormBean.getPatientAge() != null ? applyFormBean.getPatientAge() : "(空)");
        params.put("remarks", doctorEnjoin.get("temporaryArea") != null ? doctorEnjoin.get("temporaryArea") : "(空)");

        FileUtil.exportWord("tempWord/临时医嘱单模板.docx", "D:/temp", "临时医嘱单.docx", params, request, response);

    }

    /**
     * 长期医嘱下载
     *
     * @param orderId
     * @param request
     * @param response
     * https://127.0.0.1/download/standingOrders?orderId=3ebd3e2d5cd211e98ede487b6bd31bf7
     */
    @GetMapping(value = "standingOrders")
    public void standingOrders(@NotEmpty @Length(min = 32, max = 32, message = "请求参数有误") String orderId, HttpServletRequest request, HttpServletResponse response) {
        ApplyFormBean applyFormBean = applyFormService.detailById(orderId);
        //1.获取会诊报告+医嘱
        JSONArray jsonArray = JSONObject.parseArray(applyFormBean.getConsultantReport());
        //2.获取医嘱信息
        JSONObject doctorEnjoin = jsonArray.getJSONObject(0).getJSONObject("doctorEnjoin");
        //3.获取长期医嘱信息
        JSONArray longTimeEnjoinArr = doctorEnjoin.getJSONArray("longTimeArr");

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
        for (int i = 1; i <= longTimeEnjoinArr.size(); i++) {
//            Map<String, Object> longArr = (Map) JSON.parse(longTimeEnjoinArr.getJSONObject(i - 1));
            JSONObject longTimeEnjoinObject = longTimeEnjoinArr.getJSONObject(i - 1);
            JSONArray drugArr = longTimeEnjoinObject.getJSONArray("drugArr");
            for (int j = 1; j <= drugArr.size(); j++) {
                Map<String, String> map = new LinkedHashMap<>();
                JSONObject drugObject = drugArr.getJSONObject(j - 1);
                map.put("date", longTimeEnjoinObject.get("startTime").toString().substring(0, 10) != null ? longTimeEnjoinObject.get("startTime").toString().substring(0, 10) : "_");
                map.put("time", longTimeEnjoinObject.get("startTime").toString().substring(11, 16) != null ? longTimeEnjoinObject.get("startTime").toString().substring(11, 16) : "_");
                map.put("doctor", doctorEnjoin.get("doctor") != null ? doctorEnjoin.get("doctor").toString() : "_");
                map.put("orders", drugObject.getString("name") != null ? drugObject.getString("name") : "_");
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
        params.put("remarks", doctorEnjoin.get("longTimeArea") != null ? doctorEnjoin.get("longTimeArea") : "(空)");

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
        //1.获取会诊报告+医嘱
        JSONArray jsonArray = JSONObject.parseArray(applyFormBean.getConsultantReport());
        //2.获取医嘱信息
        JSONObject doctorEnjoin = jsonArray.getJSONObject(0).getJSONObject("doctorEnjoin");
        //3.获取手术备品信息
        JSONArray surgeryArr = doctorEnjoin.getJSONArray("surgeryArr");
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
