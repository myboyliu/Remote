package com.sicmed.remote.task;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.common.ApplyNodeConstant;
import com.sicmed.remote.web.entity.ApplyNode;
import com.sicmed.remote.web.mapper.ApplyFormMapper;
import com.sicmed.remote.web.mapper.ApplyNodeMapper;
import com.sicmed.remote.web.mapper.UserDetailMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class TaskService {

    @Autowired
    private ApplyNodeMapper applyNodeMapper;

    @Autowired
    private ApplyFormMapper applyFormMapper;


    /**
     * 执行转诊结束任务
     *
     * @param jsonObject
     */

    @Transactional
    public void executeReferralEndTask(JSONObject jsonObject) {
        //1.修改转诊订单状态
        String applyId = jsonObject.getString("aboutId");
        applyFormMapper.updateReferralStatusToEnd(applyId);
        //2.添加转诊订单线
        String nodeOperator =  jsonObject.getString("nodeOperator");
        ApplyNode applyNode = new ApplyNode();
        applyNode.setApplyId(applyId);
        applyNode.setNodeName(String.valueOf(ApplyNodeConstant.已结束));
        applyNode.setNodeOperator(nodeOperator);
        applyNodeMapper.insertSelective(applyNode);
    }

}
