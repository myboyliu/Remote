$(function () {
    var countNum = 0;
    var pageSize = 10;
    var pageNo = 1;
    var liveInfo = null;


    // 查询自己发出的预告总数量
    function findMyAnnouncementCount(pageNo) {
        $.ajax({
            type: 'POST',
            url: IP + 'live/findMyAnnouncementList',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.code == 1) {
                    countNum = data.data.page;
                    $(".listCountObj").html(countNum);
                    // 分页
                    layui.use('laypage', function () {
                        var laypage = layui.laypage;
                        //执行一个laypage实例
                        laypage.render({
                            elem: 'listBox',
                            count: countNum,
                            limit: pageSize,
                            theme: '#f6c567',
                            jump: function (obj, first) {
                                findMyAnnouncementList(obj.curr);
                            }
                        });
                    });
                } else if (data.code == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    }
    // 查询自己发出的预告列表
    function findMyAnnouncementList(pageNo) {
        $.ajax({
            type: 'POST',
            url: IP + 'live/findMyAnnouncementList',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.code == 1) {
                    var tempArr = data.data.liveBroadcastList;
                    var _html = "";
                    if (tempArr.length > 0) {
                        for (var i = 0; i < tempArr.length; i++) {
                            _html += '<li name="' + tempArr[i].id + '" liveRoomId="' + tempArr[i].liveRoomId + '" class="videoItem clearfix" coverUrl="' + imgIp + tempArr[i].liveCoverUrl + '">\
                            <div class="leftBox">\
                                <div class="videoBox">\
                                    <img src="'+ imgIp + tempArr[i].liveCoverUrl + '" alt="">'
                            if (new Date().getTime() > new Date(tempArr[i].liveEndTime).getTime()) {
                                _html += '<p class="videoTime"><img src="../img/liveOver.png" alt=""></p>'
                            }
                            _html += '</div>\
                            </div>\
                            <div class="centerBox">\
                                <h2 class="videoName">'+ tempArr[i].liveName + '</h2>\
                                <p class="">'+ tempArr[i].hospitalName + '-' + tempArr[i].deptName + '</p>\
                                <p class="uploadTime">直播时间：'+ tempArr[i].liveStartTime + '</p>\
                                <div class="popularBox">\
                                    <a href="javascript:;">\
                                        <img src="../liveManage/follow.png" alt="">\
                                    </a>\
                                    <span>关注</span>\
                                    <i>'+ tempArr[i].followNum + '</i>\
                                </div>\
                            </div>\
                            <div class="optionBox">\
                                <a class="editBtn" href="javascript:;">编辑</a>\
                                <a class="deleteBtn" href="javascript:;">删除</a>\
                            </div>\
                            <div class="optionBox" style="margin-right: 10px;">\
                                <a class="getLiveInfoBtn" href="javascript:;">查看信息</a>\
                            </div>\
                        </li>';
                        }
                    } else {
                        _html = '<p style="text-align: center;">暂无数据</p>'
                    }
                    $(".videoList").html(_html);
                } else if (data.code == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    }

    findMyAnnouncementList(pageNo);
    findMyAnnouncementCount(pageNo);
    // 删除事件
    $(".videoList").delegate(".deleteBtn", "click", function () {
        deleteAnnouncement($(this).parents(".videoItem").attr("name"), $(this).parents(".videoItem").attr("liveRoomId"), $(this).parents(".videoItem").attr("coverUrl"), $(this));
        // layer.open({
        //     type: 1,
        //     title: '',
        //     area: ['500px', '200px'],
        //     closeBtn: false,
        //     shadeClose: false,
        //     content: $('.optionContent')
        // });
    })
    function deleteAnnouncement(id, liveRoomId, coverUrl, obj) {
        $.ajax({
            type: 'POST',
            url: IP + 'live/deleteAnnouncement',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                "id": id,
                "liveRoomId": liveRoomId,
                "coverUrl": coverUrl,
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.code == 1) {
                    obj.remove();
                    findMyAnnouncementList(1);
                    findMyAnnouncementCount(1);
                } else if (data.code == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    }

    // 编辑事件
    $(".videoList").delegate(".editBtn", "click", function () {
        window.location = '/yilaiyiwang/liveEdit/edit.html?' + $(this).parents(".videoItem").attr("name")
    })

    // 查看直播详情
    $(".videoList").delegate(".getLiveInfoBtn", "click", function () {
        $.ajax({
            type: 'POST',
            url: IP + 'live/getLiveMessage',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                "liveId": $(this).parents(".videoItem").attr("name"),
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.code == 1) {
                    liveInfo = data;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['700px', '350px'],
                        closeBtn: false,
                        shadeClose: true,
                        content: $('.liveInfoContent'),
                        end: function () {
                            $('.liveInfoContent').hide();
                        }
                    });
                    $('.liveInfoContent').find(".loginAccount").html("云起云登录账号: " + data.data.username);
                    $('.liveInfoContent').find(".openUrl").html("直播开启地址: " + data.data.adminUrl);
                    $('.liveInfoContent').find(".openPasswrod").html("直播开启密码: " + data.data.adminPwd);
                    $('.liveInfoContent').find(".watchUrl").html("观看直播: " + data.data.liveUrl);
                } else if (data.code == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    })

    var clipboard = new ClipboardJS('.openBtn', {
        text: function () {
            return '【医来医往远程会诊】链接:' + liveInfo.data.adminUrl + '  密码:' + liveInfo.data.adminPwd + '';
        }
    });

    clipboard.on('success', function (e) {
        layer.msg("复制成功")
    });

    clipboard.on('error', function (e) {
        console.log(e);
    });

    var clipboard1 = new ClipboardJS('.watchBtn', {
        text: function () {
            return '【医来医往远程会诊】直播链接:' + liveInfo.data.liveUrl;
        }
    });

    clipboard1.on('success', function (e) {
        layer.msg("复制成功")
    });

    clipboard1.on('error', function (e) {
        console.log(e);
    });

    // 发布直播按钮
    $(".releaseBtn").click(function () {
        // 检测是否有发布直播的权限
        $.ajax({
            type: 'GET',
            url: IP + 'live/testPermissions',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            dataType: "json",
            async: false,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    window.location = '/yilaiyiwang/liveRelease/release.html';
                } else if (data.status == 251) {
                    layer.msg("您没有发布直播的权限");
                    return false;
                } else {
                    layer.msg("请稍后重试");
                    return false;
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    })
})