package com.sicmed.remote.socket.controller;

import com.sicmed.remote.socket.bean.NewMessageBean;
import com.sicmed.remote.socket.service.NewMessageService;
import com.sicmed.remote.web.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "message")
public class NewMessageController extends BaseController {

    @Autowired
    private NewMessageService newMessageService;

    /**
     * 给指定用户发送消息
     * @return
     */
    @PostMapping(value = "insertMessage")
    public String insertMessage(String type,String title,String detail,String inviteUserId){
        int i = newMessageService.insertMessage(type,title,detail,inviteUserId,getRequestToken());
        if (i>0){
            return "成功";
        }else {
            return "失败";
        }
    }

    /**
     * 群发消息
     * @return
     */
    @PostMapping(value = "sendGroupMessage")
    public String sendGroupMessage(String type,String title,String detail){
        int i = newMessageService.insertMessage(type,title,detail,getRequestToken());
        if (i>0){
            return "成功";
        }else {
            return "失败";
        }
    }

    /**
     * 查询我的消息
     */
    @PostMapping(value = "findMyMessage")
    public Object findMyMessage(){
        List<NewMessageBean> newsList = newMessageService.findMyMessage(getRequestToken());
        return newsList;
    }

    /**
     * 读取未读消息(修改成已读,如果是公共消息,需要重新创建一条个人的已读消息)
     * @return
     */
    @PostMapping(value = "lookGroupMessage")
    public Object lookGroupMessage(String id){
        int i = newMessageService.lookGroupMessage(id,getRequestToken());
        if (i > 0){
            return "成功";
        }else {
            return "失败";
        }
    }

}
