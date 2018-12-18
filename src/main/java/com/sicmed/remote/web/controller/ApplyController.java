package com.sicmed.remote.web.controller;

import com.sicmed.remote.common.ApplyType;
import com.sicmed.remote.web.entity.ApplyForm;
import com.sicmed.remote.web.entity.CaseRecord;
import com.sicmed.remote.web.entity.UserDetail;
import com.sicmed.remote.web.service.ApplyFormService;
import com.sicmed.remote.web.service.UserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(value = "apply")
public class ApplyController extends BaseController {

    @Autowired
    private ApplyFormService applyFormService;

    @Autowired
    private UserDetailService userDetailService;

    /**
     * 保存草稿
     *
     * @param caseRecord
     * @param applyForm
     */
    @PostMapping(value = "draft")
    public Map draft(CaseRecord caseRecord, ApplyForm applyForm) {

        if (caseRecord == null) {
            return badRequestOfArguments("参数为空");
        }

        String userId = getRequestToken();

        UserDetail userDetail = userDetailService.getByPrimaryKey(userId);
        if (userDetail == null) {
            return badRequestOfArguments("获取医生详细信息失败");
        }

        applyForm.setCaseRecordId(caseRecord.getId());
        applyForm.setApplyUserId(userId);
        applyForm.setApplyBranchId(userDetail.getBranchId());
        String applyStatus = String.valueOf(ApplyType.APPLY_DRAFT);
        applyForm.setApplyStatus(applyStatus);
        int i = applyFormService.insertSelective(applyForm);
        if (i < 1) {
            return badRequestOfArguments("添加草稿失败");
        }
        return succeedRequest(applyForm);
    }
    // 转诊

    // 图文会诊

    // 视频会诊
}
