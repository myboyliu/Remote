package com.sicmed.remote.socket.service;

import com.alibaba.fastjson.JSONObject;
import com.sicmed.remote.socket.bean.NewMessageBean;
import com.sicmed.remote.socket.entity.NewMessage;
import com.sicmed.remote.socket.mapper.NewMessageMapper;
import com.sicmed.remote.web.entity.PageEntity;
import com.sicmed.remote.web.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NewMessageService implements BaseService<NewMessage> {

    @Autowired
    private NewMessageMapper newMessageMapper;

    @Override
    public int insertSelective(NewMessage newMessage) {
        return 0;
    }

    @Override
    public int deleteByPrimaryKey(String id) {
        return 0;
    }

    @Override
    public int updateByPrimaryKeySelective(NewMessage newMessage) {
        return 0;
    }

    @Override
    public int updateByPrimaryKey(NewMessage newMessage) {
        return 0;
    }

    @Override
    public NewMessage getByPrimaryKey(String id) {
        return null;
    }

    @Override
    public List<NewMessage> findByDynamicParam(NewMessage newMessage) {
        return null;
    }

    /**
     * 指定用户发送
     *
     * @param type
     * @param title
     * @param detail
     * @param inviteUserId
     * @param applyFormId
     * @return
     */
    public int insertMessage(String type, String title, String detail, String inviteUserId, String applyFormId) {
        NewMessage newMessage = new NewMessage();
        newMessage.setMsgType(type);
        newMessage.setMsgTitle(title);
        newMessage.setMsgDetails(detail);
        newMessage.setInviteUserId(inviteUserId);
        newMessage.setApplyFormId(applyFormId);
        newMessage.setCreateTime(new Date());
        newMessage.setCreateUser(applyFormId);
        return newMessageMapper.insertSelective(newMessage);
    }

    /**
     * 群发
     *
     * @param type
     * @param title
     * @param detail
     * @param applyFormId
     * @return
     */
    public int insertMessage(String type, String title, String detail, String applyFormId) {
        NewMessage newMessage = new NewMessage();
        newMessage.setMsgType(type);
        newMessage.setMsgTitle(title);
        newMessage.setInviteUserId("all");
        newMessage.setMsgDetails(detail);
        newMessage.setApplyFormId(applyFormId);
        newMessage.setCreateTime(new Date());
        newMessage.setCreateUser(applyFormId);
        return newMessageMapper.insertSelective(newMessage);
    }


    /**
     * 查询我的消息
     *
     * @param id 登录用户id
     * @return
     */
    public List<NewMessageBean> findMyMessage(String id) {
        NewMessage newMessage = new NewMessage();
        PageEntity pageEntity = new PageEntity();
        newMessage.setInviteUserId(id);
        newMessage.setPageNo(pageEntity.getBeginNo());
        newMessage.setPageSize(pageEntity.getPageSize());
        return newMessageMapper.findMyMessage(newMessage);
    }

    /**
     * 读取未读消息
     *
     * @param id     消息id
     * @param userId 登录用户id
     * @return
     */
    public int lookGroupMessage(String id, String userId) {
        NewMessage msg = new NewMessage();
        msg.setId(id);
        msg.setReadSign("1");
        return newMessageMapper.updateUnreadMark(msg);
    }

    public String getMyMessageCount(String id) {
        NewMessage newMessage = new NewMessage();
        newMessage.setInviteUserId(id);
        return newMessageMapper.getMyMessageCount(newMessage);
    }


    public int insertSelectiveByJSONObject(JSONObject jsonObject) {

        return newMessageMapper.insertByJSONObject(jsonObject);
    }

    public String getUnReadMsgCount(String requestToken) {
        return newMessageMapper.getUnReadMsgCount(requestToken);
    }
}
