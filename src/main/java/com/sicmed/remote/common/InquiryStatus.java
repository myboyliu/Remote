package com.sicmed.remote.common;

/**
 * 发起转诊
 *
 * @author MaxCoder
 */
public enum InquiryStatus {

    //转诊申请创建成功
    INQUIRY_APPLY_CREATE_SUCCESS,

    //转诊申请审核通过
    INQUIRY_APPLY_ACCEDE,

    //转诊申请审核已拒绝
    INQUIRY_APPLY_REJECT,

    //转诊申请医生已接受
    INQUIRY_SLAVE_ACCEDE,

    //转诊申请医生已拒绝
    INQUIRY_SLAVE_REJECT,

    //转诊申请医政已接受
    INQUIRY_MASTER_ACCEDE,

    //转诊申请医政已拒绝
    INQUIRY_MASTER_REJECT,

    //转诊时间已选定
    INQUIRY_DATETIME_LOCKED,

    //发起人 确认转诊
    INQUIRY_SENDER_CONFIRM,

    //发起人 取消转诊
    INQUIRY_SENDER_CANCEL,

    // 转诊已结束
    INQUIRY_END,
}
