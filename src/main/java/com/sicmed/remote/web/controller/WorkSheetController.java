package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.util.UserTokenManager;
import com.sicmed.remote.live.service.LiveService;
import com.sicmed.remote.web.bean.ScheduledParam;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.service.ApplyFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 科室工作日历 接口
 */
@RestController
@RequestMapping("worksheet")
public class WorkSheetController extends BaseController {

    @Autowired
    private LiveService liveService;
    @Autowired
    private ApplyFormService applyFormService;
    /**
     * Query the scheduled list of dates through the branchId and month
     * @param scheduledParam
     * @return
     */
    @PostMapping("findScheduling")
    public Object findScheduling(ScheduledParam scheduledParam){
        scheduledParam.setHospitalId(UserTokenManager.getCurrentUser().getHospitalId());

        List<String> liveTimeList = liveService.selectTimeByParam(scheduledParam);

        List<String> consultationTimeList = applyFormService.selectTimeByParam(scheduledParam);

        liveTimeList.addAll(consultationTimeList);

        return succeedRequest(liveTimeList);

    }

    /**
     * Query the live and consultation list through the branchId and date
     * @param scheduledParam
     * @return
     */
    @PostMapping("findScheduled")
    public Object findScheduled(ScheduledParam scheduledParam){
        scheduledParam.setHospitalId(UserTokenManager.getCurrentUser().getHospitalId());

        List<ApplyForm> applyFormList = applyFormService.selectScheduledByParam(scheduledParam);
//        List<String> liveList = liveService.selectScheduledByParam(scheduledParam);


//        liveTimeList.addAll(consultationTimeList);

        return succeedRequest(applyFormList);

    }
}
