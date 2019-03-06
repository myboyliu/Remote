package com.sicmed.remote.live.controller;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.common.util.FileUtils;
import com.sicmed.remote.live.bean.FuzzySearchLiveBean;
import com.sicmed.remote.live.bean.GetLiveParamBean;
import com.sicmed.remote.live.entity.Live;
import com.sicmed.remote.live.service.LiveService;
import com.sicmed.remote.meeting.bean.MeetingBean;
import com.sicmed.remote.meeting.entity.RequestMeeting;
import com.sicmed.remote.meeting.util.YqyMeetingUtils;
import com.sicmed.remote.web.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * 直播 接口
 *
 * @author MaxCoder
 */
@RestController
@RequestMapping(value = "live")
public class LiveController extends BaseController {

    @Autowired
    private LiveService liveService;
    @Value("${img.location}")
    private String location;

    /**
     * 创建直播
     *
     * @param live
     * @return
     */
    @PostMapping(value = "create")
    public Object createLive(@RequestParam(value = "file", required = false) MultipartFile file, Live live) throws Exception {
        String fileName = file.getOriginalFilename();
        try {
            FileUtils.uploadFile(file.getBytes(), location, fileName);
        } catch (IOException e) {

        }
        live.setLiveCoverUrl(fileName);
        live.setCreateUser(getRequestToken());
        RequestMeeting requestMeeting = new RequestMeeting();

        requestMeeting.setMobile(getCurrentUser().getUserPhone());
        requestMeeting.setRealName(getCurrentUser().getUserName());
        requestMeeting.setAppointmentName(live.getLiveName());
        requestMeeting.setStartTime(live.getLiveStartTime());
        requestMeeting.setEndTime(live.getLiveEndTime());
        requestMeeting.setLive(live.getLiveStart());
        requestMeeting.setMute(live.getLiveMute());
        requestMeeting.setRecord(live.getLiveRecord());
        requestMeeting.setConcurrentNum(1);

        MeetingBean meetingBean = YqyMeetingUtils.createMeeting(requestMeeting);

        live.setLiveUrl(meetingBean.getLiveUrl());
        live.setLivePassword(meetingBean.getLivePwd());
        live.setLiveNumber(meetingBean.getAppointmentNumber());
        live.setLiveUser(meetingBean.getAccount());
        live.setLiveId(meetingBean.getAppointmentId());
        live.setLiveId(meetingBean.getAppointmentId());
        live.setLiveJson(JSONObject.toJSONString(meetingBean));

        liveService.insertSelective(live);


        return succeedRequest(live);
    }

    /**
     * 创建直播
     *
     * @return
     */
    @GetMapping(value = "getLive")
    public Object getLive(String liveNumber) throws Exception {

        RequestMeeting requestMeeting = new RequestMeeting();
        requestMeeting.setMobile(getCurrentUser().getUserPhone());
        requestMeeting.setRealName(getCurrentUser().getUserName());
        requestMeeting.setAppointmentNumber(liveNumber);

        MeetingBean meetingBean = YqyMeetingUtils.getMeetingId(requestMeeting);
        meetingBean.setAccount(getCurrentUser().getUserPhone());

        return succeedRequest(meetingBean);
    }

    /**
     * 根据条件查询直播列表数量
     */
    @GetMapping(value = "selectCountByParam")
    public Object selectCountByParam(GetLiveParamBean getLiveParamBean) {

        int listCount = liveService.selectCountByParam(getLiveParamBean);

        return succeedRequest(listCount);
    }

    /**
     * 根据条件查询直播列表内容
     */
    @GetMapping(value = "selectListByParam")
    public Object selectListByParam(GetLiveParamBean getLiveParamBean) {

        List<Live> liveList = liveService.selectListByParam(getLiveParamBean);

        return succeedRequest(liveList);
    }

    /**
     * 根据条件查询直播列表数量
     */
    @GetMapping(value = "searchCountByParam")
    public Object searchCountByParam(FuzzySearchLiveBean fuzzySearchLiveBean) {

        int listCount = liveService.searchCountByParam(fuzzySearchLiveBean);

        return succeedRequest(listCount);
    }

    /**
     * 根据条件查询直播列表内容
     */
    @GetMapping(value = "searchListByParam")
    public Object searchListByParam(FuzzySearchLiveBean fuzzySearchLiveBean) {

        List<Live> liveList = liveService.searchListByParam(fuzzySearchLiveBean);

        return succeedRequest(liveList);
    }

    /**
     * 根据创建人查询直播列表数量
     */
    @GetMapping(value = "getCountByParam")
    public Object getCountByParam() {
        int listCount = liveService.getCountByUser(getRequestToken());

        return succeedRequest(listCount);
    }

    /**
     * 根据创建人查询直播列表内容
     */
    @GetMapping(value = "getListByParam")
    public Object getListByParam() {
        GetLiveParamBean getLiveParamBean = new GetLiveParamBean();
        getLiveParamBean.setCreateUser(getRequestToken());
        List<Live> liveList = liveService.getListByUser(getLiveParamBean);

        return succeedRequest(liveList);
    }


    /**
     * 根据ID 删除一条直播信息
     */
    @PostMapping(value = "deleteById")
    public Object deleteById(String liveId) {
        int i = liveService.deleteByPrimaryKey(liveId);

        return succeedRequest(i);
    }
}
