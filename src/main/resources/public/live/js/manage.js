function getLiveList() {
    ajaxRequest("GET", getCountByParamUrl, "", false, false, true, getCountSuccess, null, null);
}

function getCountSuccess(liveCount) {
    if (liveCount === 0) {
        let _html = '<p style="text-align: center;">暂无数据</p>'
        $(".videoList").html(_html);
    } else {
        $(".listCountObj").html(liveCount);
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: liveCount,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    pageNo = obj.curr;
                    ajaxRequest("GET", getListByParamUrl, "", false, false, true, renderLiveList, null, null);
                }
            });
        });
    }
}

function renderLiveList(liveList) {
    console.log(liveList);
    let _html = "";
    for (let i = 0; i < liveList.length; i++) {
        sessionStorage.setItem(liveList[i].id, JSON.stringify(liveList[i]))
        let isDone = false;
        let isGoing = false;
        if (new Date().getTime() > new Date(liveList[i].liveEndTime).getTime()) {
            isDone = true;
        }
        if (new Date().getTime() > new Date(liveList[i].liveStartTime).getTime() && new Date().getTime() < new Date(liveList[i].liveEndTime).getTime()) {
            isGoing = true;
        }
        _html += '<li liveId="' + liveList[i].liveId + '" name="' + liveList[i].id + '" liveRoomId="' + liveList[i].liveNumber + '" class="videoItem clearfix" coverUrl="' + baseUrl + "/" + liveList[i].liveCoverUrl + '">\
                            <div class="leftBox">\
                                <div class="videoBox">\
                                    <img src="' + baseUrl + "/" + liveList[i].liveCoverUrl + '" alt="">';
        if (isDone) {
            _html += '<p class="videoTime"><img src="../live/img/liveOver.png" alt=""></p>';
        }
        _html += '</div>\
                            </div>\
                            <div class="centerBox">\
                                <h2 class="videoName">' + liveList[i].liveName + '</h2>\
                                <p class="">' + liveList[i].liveHospitalName + '-' + liveList[i].liveBranchName + '</p>\
                                <p class="uploadTime">直播时间：' + liveList[i].liveStartTime + '</p>\
                                <div class="popularBox">\
                                    <a href="javascript:;">\
                                        <img src="../live/img/follow.png" alt="">\
                                    </a>\
                                    <span>关注</span>\
                                    <i>' + liveList[i].subscriptionNumber + '</i>\
                                </div>\
                            </div>'

        if (!isDone && !isGoing) {
            _html += '<div class="optionBox">\
                        <a class="editBtn" href="javascript:;">编辑</a>\
                        <a class="deleteBtn" href="javascript:;">删除</a>\
                      </div>'
        }
        if (isDone && liveList[i].liveRecord) {
            _html += '<div class="optionBox" style="margin-right: 10px;">\
                    <a class="getLiveInfoBtn" href="javascript:;">播放视频</a>'
        }
        if (isGoing) {
            _html += '<div class="optionBox" style="margin-right: 10px;">\
                    <a class="getLiveInfoBtn" href="javascript:;">查看信息</a>\
                    <a class="liveControlBtn" href="javascript:;">直播控制</a>\
                   </div>\
                  </li>'
        }
        _html += '</div>\
                  </li>'
    }
    $(".videoList").html(_html);
}

/**
 * 删除直播
 * @param id
 */
function deleteLive(id,liveId) {
    let deleteData = new FormData();
    deleteData.append("id", id);
    deleteData.append("liveId", liveId);
    ajaxRequest("POST", deleteByIdUrl, deleteData, false, false, true, deleteLiveSuccess, null, null);

    function deleteLiveSuccess(result) {
        console.log(result)
        getLiveList();
    }
}

$(function () {
    var liveInfo = null;
    getLiveList();

    // 删除事件
    $(".videoList").delegate(".deleteBtn", "click", function () {
        deleteLive($(this).parents(".videoItem").attr("name"),$(this).parents(".videoItem").attr("liveId"));
        // layer.open({
        //     type: 1,
        //     title: '',
        //     area: ['500px', '200px'],
        //     closeBtn: false,
        //     shadeClose: false,
        //     content: $('.optionContent')
        // });
    })

    // 编辑事件
    $(".videoList").delegate(".editBtn", "click", function () {
        window.location = '/live/edit.html?' + $(this).parents(".videoItem").attr("name")
    })

    // 查看直播详情
    $(".videoList").delegate(".getLiveInfoBtn", "click", function () {
        let liveJsonItem = JSON.parse(sessionStorage.getItem($(this).parents(".videoItem").attr("name")));
        let liveJson = liveJsonItem.liveJson;
        // http://www.qlxlm.com/#/webrtc/13812345678/1000021/9411/企业管理员
        //     liveJson.account
        // liveJson.appointmentNumber
        // liveJson.hostPwd
        // userInfo.userName
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        $("#webrtcUrl").html(baseUrl + "/#/webrtc/" + liveJson.account + "/" + liveJson.appointmentNumber + "/" + liveJson.hostPwd + "/" + userInfo.userName)
        $("#hostPwd").html(liveJson.hostPwd)
        $("#liveUrl").html(baseUrl + "/#/page/watch-live/" + liveJson.appointmentId)

        layer.open({
            type: 1,
            title: '',
            area: ['640px', '300px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: true,
            content: $('#liveInfoBox'),
            end: function () {
                $('#liveInfoBox').hide();
            }
        });
        $("#liveInfoBoxSubmitBtn").click(function () {
            //新窗口打开直播控制功能
            window.open($("#webrtcUrl").html(), "_blank");
            return false;
        })
    })

    // 直播控制
    $(".videoList").delegate(".liveControlBtn", "click", function () {
        console.log($(this).parents(".videoItem").attr("name"));
        let selectData = {"liveNumber": $(this).parents(".videoItem").attr("liveRoomId")}
        console.log(selectData);
        ajaxRequest("GET", getLiveUrl, selectData, true, "application/json", true, getLiveInfoSuccess, null, null);

    })

    function getLiveInfoSuccess(liveInfo) {
        //新窗口打开直播控制功能
        // window.open("http://www.qlxlm.com/#/to/" + liveInfo.account + "/meeting-control/" + liveInfo.cid, "_blank");
        // return false;
        //本窗口悬浮打开直播控制功能
        $("#liveControlIframe").attr('src', baseUrl + "/#/to/" + liveInfo.account + "/meeting-control/" + liveInfo.cid);
        layer.open({
            type: 1,
            title: '',
            area: ['1566px', '768px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('#liveControlBox'),
        });
    }

    $("#liveControlBoxCloseBtn").click(function () {
        layer.closeAll();
        $('#liveControlBox').hide();
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
        window.location = '../live/release.html';
        // 检测是否有发布直播的权限
        // $.ajax({
        //     type: 'GET',
        //     url: IP + 'live/testPermissions',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     crossDomain: true,
        //     dataType: "json",
        //     async: false,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.status == 200) {
        //             window.location = '/yilaiyiwang/liveRelease/release.html';
        //         } else if (data.status == 251) {
        //             layer.msg("您没有发布直播的权限");
        //             return false;
        //         } else {
        //             layer.msg("请稍后重试");
        //             return false;
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
    })
})