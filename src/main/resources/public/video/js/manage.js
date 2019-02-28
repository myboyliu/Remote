function renderVideoList(videoList) {
    let tempArr = videoList;
    let _html = "";
    if (tempArr.length > 0) {
        for (let i = 0; i < tempArr.length; i++) {
            _html += '<li id="' + tempArr[i].id + '" name="' + tempArr[i].videoFileId + '" class="videoItem clearfix">\
                            <div class="leftBox">\
                                <div class="videoBox">\
                                    <img src="' + tempArr[i].videoCoverUrl + '" alt="">'
            _html += '</div>\
                            </div>\
                            <div class="centerBox">\
                                <h2 class="videoName">' + tempArr[i].videoName + '</h2>\
                                <p class="uploadTime">上传时间：' + tempArr[i].uploadTime + '</p>\
                                <div class="popularBox">\
                                    <a href="javascript:;">\
                                        <img src="premierCourseManage/playNum.png" alt="">\
                                    </a>\
                                    <span>播放</span>\
                                    <i>' + tempArr[i].playback + '</i>\
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
        $(".videoList").html(_html);
    }
}

function getVideoListCountByUserSuccess(videoListCount) {
    console.log(videoListCount);
    if (videoListCount === 0) {
        let _html = "";
        _html = '<p style="text-align: center; margin-top: 50px;">暂无数据</p>'
        $(".videoList").html(_html);
        return false;
    } else {
        pageSize = 2;
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: videoListCount,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    pageNo = obj.curr;
                    ajaxRequest("GET", getVideoListByUserUrl, "", false, false, true, renderVideoList, null, null);
                }
            });
        });
    }
}
// let videoDom;
function removeVideoSuccess(result){
    // videoDom.remove();
    ajaxRequest("GET", getVideoListCountByUserUrl, "", false, false, true, getVideoListCountByUserSuccess, null, null);
}
$(function () {
    // 查询自己发出的预告总数量
    ajaxRequest("GET", getVideoListCountByUserUrl, "", false, false, true, getVideoListCountByUserSuccess, null, null);

    // 删除事件
    $(".videoList").delegate(".deleteBtn", "click", function () {

        let deleteData = {id:$(this).parents(".videoItem").attr("id"),
            videoFileId:$(this).parents(".videoItem").attr("name")}
        console.log(deleteData);
        // videoDom = $(this);
        ajaxRequest("GET", removeVideoByUserUrl, deleteData, true, "application/json", true, removeVideoSuccess, null, null);
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
        window.location = '/video/edit.html?' + $(this).parents(".videoItem").attr("name")
    })

    // 发布点播按钮
    $(".releaseBtn").click(function () {
        window.location = '/video/release.html';
        // 检测是否有发布点播视频权限
        // $.ajax({
        //     type: 'GET',
        //     url: IP + 'video/testPermissions',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     crossDomain: true,
        //     cache: false,
        //     contentType: false,
        //     dataType: "json",
        //     async: false,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.status == 200) {
        //             window.location = '/yilaiyiwang/premierCourseRelease/release.html';
        //         } else if (data.code == 250) {
        //             // 未登录操作
        //             window.location = '/yilaiyiwang/login/login.html';
        //         } else if (data.status == 251) {
        //             layer.msg("您没有上传视频的权限");
        //             return false;
        //         } else {
        //             // 其他操作
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