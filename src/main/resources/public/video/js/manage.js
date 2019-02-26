$(function () {
    var countNum = 0;
    var pageSize = 2;
    var pageNo = 1;


    // 查询自己发出的预告总数量
    function findMyVideoListCount(pageNo) {
        $.ajax({
            type: 'POST',
            url: IP + 'video/findMyVideoList',
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
                    $(".videoCount").html(countNum);
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
                                findMyVideoList(obj.curr);
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
    function findMyVideoList(pageNo) {
        $.ajax({
            type: 'POST',
            url: IP + 'video/findMyVideoList',
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
                    var tempArr = data.data.videoList;
                    var _html = "";
                    if (tempArr.length > 0) {
                        for (var i = 0; i < tempArr.length; i++) {
                            _html += '<li name="' + tempArr[i].id + '" class="videoItem clearfix">\
                            <div class="leftBox">\
                                <div class="videoBox">\
                                    <img src="'+ tempArr[i].videoCoverUrl + '" alt="">'
                            if (new Date().getTime() > new Date(tempArr[i].liveEndTime).getTime()) {
                                _html += '<p class="videoTime"><img src="./liveOver.png" alt=""></p>'
                            }
                            _html += '</div>\
                            </div>\
                            <div class="centerBox">\
                                <h2 class="videoName">'+ tempArr[i].videoName + '</h2>\
                                <p class="uploadTime">直播时间：'+ tempArr[i].uploadTime + '</p>\
                                <div class="popularBox">\
                                    <a href="javascript:;">\
                                        <img src="premierCourseManage/playNum.png" alt="">\
                                    </a>\
                                    <span>播放</span>\
                                    <i>'+ tempArr[i].playback + '</i>\
                                </div>\
                            </div>'
                            _html += '<div class="optionBox">\
                                <a class="editBtn" href="javascript:;">编辑</a>\
                                <a class="deleteBtn" href="javascript:;">删除</a>\
                            </div>'
                            if (tempArr[i].transCode == 1) {
                                _html += '<p class="state">已转码</p></li>'
                            } else {
                                _html += '<p class="state">转码中</p></li>'
                            }
                        }
                    } else {
                        _html = '<p style="text-align: center; margin-top: 50px;">暂无数据</p>'
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

    findMyVideoListCount(pageNo);
    findMyVideoList(pageNo);
    // 删除事件
    $(".videoList").delegate(".deleteBtn", "click", function () {
        deleteVideo($(this).parents(".videoItem").attr("name"), $(this));
        // layer.open({
        //     type: 1,
        //     title: '',
        //     area: ['500px', '200px'],
        //     closeBtn: false,
        //     shadeClose: false,
        //     content: $('.optionContent')
        // });
    })
    function deleteVideo(id, obj) {
        $.ajax({
            type: 'POST',
            url: IP + 'video/deleteVideo',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                "id": id,
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.code == 1) {
                    obj.remove();
                    findMyVideoListCount(1);
                    findMyVideoList(1);
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
        window.location = '/yilaiyiwang/premierCourseEdit/edit.html?' + $(this).parents(".videoItem").attr("name")
    })

    // 发布点播按钮
    $(".releaseBtn").click(function () {
        // 检测是否有发布点播视频权限
        $.ajax({
            type: 'GET',
            url: IP + 'video/testPermissions',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            cache: false,
            contentType: false,
            dataType: "json",
            async: false,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    window.location = '/yilaiyiwang/premierCourseRelease/release.html';
                } else if (data.code == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 251) {
                    layer.msg("您没有上传视频的权限");
                    return false;
                } else {
                    // 其他操作
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