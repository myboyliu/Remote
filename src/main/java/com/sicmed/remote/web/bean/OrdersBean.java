package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

/**
 * @program: tele-medicine
 * @description:
 * @author: Xue0601
 * @create: 2018-10-19 15:35
 **/
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrdersBean implements Serializable {

    private String id;

    private String name;

    private String idCard;

    private String phone;

    private String address;

    private String age;

    private String high;

    private String weight;

    private String sex;

    private String isurgent;

    private String diagnosis;

    private String telemedicineTarget;

    private String orders;

}
