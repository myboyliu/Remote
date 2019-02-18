package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author YoonaLt
 * @version 1.0 This Version Running JDK 1.8
 * 统计Bean
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StatisticsSearchBean implements Serializable {


    // 选择的开始时间
    private Date startTime;

    // 选择的结束时间
    private Date endTime;

    // 发出列表
    private String apply;

    // 受邀列表
    private String invite;

    // 查询条件
    private String queryCondition1;
    private String queryCondition2;

    // 医院id
    private String hospitalId;

    // 会诊状态
    private String status;

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

    // 费用

}
