package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.InquiryStatus;
import com.sicmed.remote.web.YoonaLtUtils.YtDateUtils;
import com.sicmed.remote.web.bean.ApplyTimeBean;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.ApplyTime;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.ApplyTimeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(value = "apply/dispose")
public class ApplyDisposeController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private ApplyTimeService applyTimeService;

    /**
     * 医政 工作台 重新分配医生
     */
    @PostMapping(value = "sirUpdateDoctor")
    public Map sirUpdate(ApplyForm applyForm) {

        String userId = getRequestToken();

        if (StringUtils.isBlank(applyForm.getId())) {
            return badRequestOfArguments("传入参数为空");
        }

        applyForm.setUpdateUser(userId);
        int i = applyFormService.updateByPrimaryKeySelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("重新分配医生失败医生失败");
        }

        return succeedRequest(applyForm);
    }

    /**
     * 医政 工作台 修改日期
     */
    @PostMapping(value = "sirUpdateDate")
    public Map sirUpdateDate(String applyFormId, String eventStartTime, String eventEndTime) {
        if (StringUtils.isBlank(eventStartTime) || StringUtils.isBlank(eventEndTime) || StringUtils.isBlank(applyFormId)) {
            return badRequestOfArguments("传入参数不全");
        }

        int j = applyTimeService.delByApplyForm(applyFormId);
        if (j < 1) {
            return badRequestOfArguments("删除原applyTime失败");
        }

        String userId = getRequestToken();

        ApplyTime applyTime = new ApplyTime();
        applyTime.setApplyFormId(applyFormId);
        applyTime.setUpdateUser(userId);
        applyTime.setEventStartTime(YtDateUtils.stringToDate(eventStartTime));
        applyTime.setEventEndTime(YtDateUtils.stringToDate(eventEndTime));
        int k = applyTimeService.updateByForm(applyTime);
        if (k < 1) {
            return badRequestOfArguments("确认时间,time修改失败");
        }

        return succeedRequest(applyTime);
    }

    // 医政 工作台 修改价格 数据库暂无表格

    /**
     * 确认转诊,视频会诊时间
     */
/*    public Map dateTime(ApplyForm applyForm, String startEndTime, String applyStatus) {

        // 删除原时间
        if (applyForm == null || StringUtils.isBlank(startEndTime)) {
            return badRequestOfArguments("applyForm or startEndTime is null");
        }

        int i = applyTimeService.delByApplyForm(applyForm.getId());
        if (i < 1) {
            return badRequestOfArguments("删除原applyTime失败");
        }

        String userId = getRequestToken();

        int j = applyFormService.updateStatus(applyForm, applyStatus, userId);
        if (j < 1) {
            return badRequestOfArguments("确认时间,form修改失败");
        }

        ApplyTimeBean applyTimeBean = new ApplyTimeBean();
        applyTimeBean.setApplyFormId(applyForm.getId());
        applyTimeBean.setApplyStatus(applyStatus);
        applyTimeBean.setUpdateUser(userId);
        int k = applyTimeService.insertStartEndTimes(applyTimeBean);
        if (k < 1) {
            return badRequestOfArguments("确认时间,time修改失败");
        }
        return succeedRequest(applyForm);
    }*/

    /**
     * 确认转诊时间
     */
/*    @PostMapping(value = "sendDateTime")
    public Map sendDateTime(ApplyForm applyForm, String startEndTime) {

        String applyStatus = String.valueOf(InquiryStatus.INQUIRY_DATETIME_LOCKED);

        return dateTime(applyForm, startEndTime, applyStatus);
    }*/


}
