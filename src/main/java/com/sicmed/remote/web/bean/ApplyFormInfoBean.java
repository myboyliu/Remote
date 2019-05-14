package com.sicmed.remote.web.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class ApplyFormInfoBean {

    private String caseSummary;         //会诊病历主题信息

    private String applyHospitalName;   //发起会诊申请医院名称

    private String applyBranchName;     //发起会诊申请科室

    private String applyUserName;       //发起会诊申请医生姓名

    private String applyUserPhone;      //发起会诊医生电话号码

    private String applyAdminPhone;     //发起会诊医政电话号码

    private String inviteHospitalName;  //受邀会诊申请医院名称

    private String inviteBranchName;    //受邀会诊申请科室

    private String inviteUserName;      //受邀会诊申请医生姓名

    private String inviteUserPhone;     //受邀会诊医生电话号码

    private String inviteAdminPhone;    //受邀会诊医政电话号码

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date meetingStartTime;    //视频会诊会议开始时间
}
