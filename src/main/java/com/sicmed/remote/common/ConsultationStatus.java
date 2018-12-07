package com.sicmed.remote.common;

/**
 * 会诊状态
 *
 * @author MaxCoder
 */
public enum ConsultationStatus {

    /**发起会诊*/
    //会诊申请创建成功
    CONSULTATION_APPLY_CREATE_SUCCESS,
    /**首诊医政待审核   首诊医政已拒收*/
    //会诊申请审核通过
    CONSULTATION_APPLY_ACCEDE,
    //会诊申请审核已拒绝
    CONSULTATION_APPLY_REJECT,
    /**待收诊*/
    //会诊申请医生已接受
    CONSULTATION_SLAVE_ACCEDE,
    //会诊申请医生已拒绝
    CONSULTATION_SLAVE_REJECT,
    //会诊申请医政已接受
    CONSULTATION_MASTER_ACCEDE,
    /**会诊已拒收*/
    //会诊申请医政已拒绝
    CONSULTATION_MASTER_REJECT,
    /**专家协调*/
    //会诊专家已选定
    CONSULTATION_DOCTOR_LOCKED,
    /**排期审核*/
    //会诊时间已选定
    CONSULTATION_DATETIME_LOCKED,
    /**已排期*/
    //会诊开始
    CONSULTATION_BEGIN,
    /**会诊中*/
    //会诊报告已提交
    CONSULTATION_REPORT_SUBMITTED,
    /**待反馈*/
    //会诊反馈已提交
    CONSULTATION_FEEDBACK_SUBMITTED,
    //会诊结束
    CONSULTATION_END
    /**已结束*/




}
