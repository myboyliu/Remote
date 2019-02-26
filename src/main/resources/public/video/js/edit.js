$(function () {
    var videoInfo = null;// 上传视频信息
    var uploadCos;
    var uploadTaskId;
    // 获取上传签名
    var getSignature = function (callback) {
        $.ajax({
            url: IP + 'signature/video/getSignature',
            data: JSON.stringify({
                "Action": "GetVodSignatureV2"
            }),
            type: 'POST',
            dataType: 'json',
            success: function (res) {
                if (res.data && res.data.signature) {
                    callback(res.data.signature);
                } else {
                    return '获取签名失败';
                }
            }
        });
    };
    // 获取视频信息
    var videoInfo = {};
    $.ajax({
        type: 'POST',
        url: IP + 'video/findVideoById',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: {
            "id": window.location.href.split("?")[1],
        },
        async: false,
        crossDomain: true,
        success: function (data) {
            console.log(data)
            if (data.code == 1) {
                videoInfo = data.data;
            } else {
                layer.msg("获取直播信息失败");
            }
        },
        error: function (err) {
            console.log(err);
        },
    });
    $(".titleInputObj").val(videoInfo.videoName);// 标题
    $(".textInputNum").html(videoInfo.videoName.length)
    $(".textAreaObj").html(videoInfo.videoDescribe);// 描述
    $(".textAreaNum").html(videoInfo.videoDescribe.length);
    $(".coverImg").attr("src", videoInfo.videoCoverUrl);

    function double(n) {
        return n < 10 ? '0' + n : n;
    }
    // 查询此医院下所有二级科室
    $.ajax({
        type: 'POST',
        url: IP + 'hospitalDept/selectAllDeptList',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: {
            "hospitalId": localStorage.getItem("hospitalId"),
        },
        async: false,
        crossDomain: true,
        success: function (data) {
            console.log(data)
            if (data.status == 200) {
                var _html = '<option value="">请选择</option>';
                var tempArr = data.hospitalDeptsList;
                for (var i = 0; i < tempArr.length; i++) {
                    if (videoInfo.hospitalDept.id == tempArr[i].hospitalDeptId) {
                        _html += '<option selected="selected" value="' + tempArr[i].hospitalDeptId + '">' + tempArr[i].deptName + '</option>'
                    } else {
                        _html += '<option value="' + tempArr[i].hospitalDeptId + '">' + tempArr[i].deptName + '</option>'
                    }
                }
                $(".deptObj").html(_html);
            } else {
                layer.msg("获取科室列表失败");
            }
        },
        error: function (err) {
            console.log(err);
        },
    });
    // 查询直播分类列表
    $.ajax({
        type: 'GET',
        url: IP + 'videoClass/findList',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        crossDomain: true,
        success: function (data) {
            console.log(data)
            if (data.code == 1) {
                var _html = '<option value="">请选择</option>';
                var tempArr = data.data;
                for (var i = 0; i < tempArr.length; i++) {
                    if (videoInfo.videoClass.id == tempArr[i].id) {
                        _html += '<option selected="selected" value="' + tempArr[i].id + '">' + tempArr[i].videoClassName + '</option>'
                    } else {
                        _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].videoClassName + '</option>'
                    }
                }
                $(".classifyObj").html(_html);
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

    // 渲染页面 layer 控件
    layui.use(['form', 'layedit', 'laydate'], function () {
        var laydate = layui.laydate;
        var form = layui.form;//高版本建议把括号去掉，有的低版本，需要加()
        form.render();
    })

    // 标题输入 校验长度
    $(".titleInputObj")[0].oninput = function () {
        $(".textInputNum").html($(this).val().length);
        if ($(this).val().length > 20) {

        } else {

        }
    }
    // 描述输入 校验长度
    $(".textAreaObj")[0].oninput = function () {
        $(".textAreaNum").html($(this).html().length)
    }

    $(".coverInput").change(function () {
        var file = this.files[0];
        qcVideo.ugcUploader.start({
            fileId: videoInfo.videoFileId,
            coverFile: file,
            getSignature: getSignature,
            success: function (result) {
                console.log(result)
            },
            error: function (result) {
                console.log(result)
            },
            progress: function (result) {
                console.log(result)
            },
            finish: function (result) {
                videoInfo.videoCoverUrl = result.coverUrl;
                $(".coverImg").attr("src", videoInfo.videoCoverUrl);
            }
        })
    })

    // 发布按钮
    $(".submitBtn").click(function () {
        if ($(".titleInputObj").val() == '') {
            layer.msg("请填写课程标题");
        } else if ($(".titleInputObj").val().length > 20) {
            layer.msg("课程标题过长");
        } else if ($(".deptObj").val() == '') {
            layer.msg("请选择录课科室");
        } else if ($(".classifyObj").val() == '') {
            layer.msg("请选择直播类型");
        } else {
            var postData = new FormData();
            postData.append("id", videoInfo.id);//视频id
            postData.append("classTitle", $(".titleInputObj").val());//课程标题		
            postData.append("hospitalDeptId", $(".deptObj").val());//录课科室
            postData.append("classId", $(".classifyObj").val());//课程分类id	
            postData.append("videoDescribe", $(".textAreaObj").html());//直播描述
            postData.append("coverPath", videoInfo.videoCoverUrl);//视频路径	
            // 发布预告
            $.ajax({
                type: 'POST',
                url: IP + 'video/updateVideo',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                data: postData,
                crossDomain: true,
                cache: false,
                contentType: false,
                processData: false,
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (data.code == 1) {
                        layer.msg("编辑成功");
                        setTimeout(function () {
                            window.location = '/yilaiyiwang/premierCourseMain/main.html'
                        }, 1500)
                    } else if (data.code == 250) {
                        // 未登录操作
                        window.location = '/yilaiyiwang/login/login.html';
                    } else if (data.status == 251) {
                        layer.msg("权限不足")
                    } else {
                        // 其他操作
                        layer.msg("请稍后重试")
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            });
        }
    })

    // 取消按钮
    $(".cancelBtn").click(function () {
        window.history.back();
    })
})