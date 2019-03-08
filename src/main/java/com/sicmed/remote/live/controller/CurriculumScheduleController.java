package com.sicmed.remote.live.controller;

import com.sicmed.remote.live.entity.CurriculumSchedule;
import com.sicmed.remote.live.service.CurriculumScheduleService;
import com.sicmed.remote.live.service.LiveService;
import com.sicmed.remote.web.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 */
@RestController
@RequestMapping(value = "curriculum/schedule")
public class CurriculumScheduleController extends BaseController {

    @Autowired
    private CurriculumScheduleService curriculumScheduleService;

    @Autowired
    private LiveService liveService;

    @PostMapping("add")
    public Object addSchedule(CurriculumSchedule curriculumSchedule) {
        curriculumSchedule.setCreateUser(getRequestToken());
        //1.数据库 插入操作
        curriculumScheduleService.insertSelective(curriculumSchedule);
        //2.直播关注数量加1
        liveService.addSubscriptionNumber(curriculumSchedule.getCurriculumId());

        return succeedRequest("SUCCESS");
    }

    @PostMapping("delete")
    public Object deleteSchedule(String curriculumId) {
        CurriculumSchedule curriculumSchedule = new CurriculumSchedule();
        curriculumSchedule.setCreateUser(getRequestToken());
        curriculumSchedule.setCurriculumId(curriculumId);
        //1.数据库 删除操作
        curriculumScheduleService.deleteByUser(curriculumSchedule);
        //2.直播关注数量减1
        liveService.lessSubscriptionNumber(curriculumId);


        return succeedRequest("SUCCESS");
    }
}
