package com.sicmed.remote.web.service;

import com.sicmed.remote.web.bean.CurrentUserBean;
import com.sicmed.remote.web.entity.ApplyNode;
import com.sicmed.remote.web.mapper.ApplyNodeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Service
public class ApplyNodeService implements BaseService<ApplyNode> {

    @Autowired
    private ApplyNodeMapper applyNodeMapper;

    @Autowired
    public RedisTemplate redisTemplate;

    @Override
    public int insertSelective(ApplyNode applyNode) {
        return applyNodeMapper.insertSelective(applyNode);
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(ApplyNode applyNode) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(ApplyNode applyNode) {
        return 0;
    }

    @Override
    public ApplyNode getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<ApplyNode> findByDynamicParam(ApplyNode applyNode) {
        return null;
    }

    private String getNodeOperator() {
        HttpServletRequest request = ((ServletRequestAttributes) (RequestContextHolder.currentRequestAttributes())).getRequest();
        String userId = request.getHeader("token");
        CurrentUserBean currentUserBean = (CurrentUserBean) redisTemplate.opsForValue().get(userId);
        return "<" + currentUserBean.getUserName() + "/" + currentUserBean.getTitleName() + "/" + currentUserBean.getBranchName() + "/" + currentUserBean.getHospitalName() + ">";
    }

    public int insertByStatus(String applyId,String nodeName) {
        ApplyNode applyNode = new ApplyNode();
        applyNode.setApplyId(applyId);
        applyNode.setNodeName(nodeName);
        applyNode.setNodeOperator(getNodeOperator());
        return applyNodeMapper.insertSelective(applyNode);
    }
    public int insertByNodeOperator(String applyId,String nodeName,String nodeOperator) {
        ApplyNode applyNode = new ApplyNode();
        applyNode.setApplyId(applyId);
        applyNode.setNodeName(nodeName);
        applyNode.setNodeOperator(nodeOperator);
        return applyNodeMapper.insertSelective(applyNode);
    }
}
