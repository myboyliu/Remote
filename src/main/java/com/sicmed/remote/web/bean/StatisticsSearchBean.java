package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @author YoonaLt
 * @version 1.0 This Version Running JDK 1.8
 * 统计Bean
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StatisticsSearchBean implements Serializable {

    // 选择的开始时间
    private String startTime;

    // 选择的结束时间
    private String endTime;

    // 医院id
    private String hospitalId;

    // 会/转 诊标识
    private String status;

    // 发出列表查询标识
    private String apply;

    // 受邀列表查询标识
    private String invite;

    // 会诊高级统计 统计方式  日-%Y-%m-%d   月-%Y-%m  年-%Y
    private String dayMouthYear;

    // 查询条件
    private String queryCondition1;
    private String queryCondition2;

    // 单学科会诊
    private String singleSubject;

    // 多学科会诊
    private String multiSubject;

    // 图文会诊
    private String picture;

    // 视频会诊
    private String video;

    // 次数
    private String amountStatistics;

    // 发件医院名称
    private String applyHospital;

    // 收件医院名称
    private String inviteHospital;

    // 发件科室名称
    private String applyBranch;

    // 收件科室名称
    private String inviteBranch;

    // 发件医生职称
    private String applyDoctorName;

    // 收件医生职称
    private String inviteDoctorName;

    // 医生名字
    private String doctorName;

    // 返回日期
    private String dates;

    // 总费用
    private BigDecimal totalPrice;

    // 费用
    private BigDecimal otherPrice;

}
