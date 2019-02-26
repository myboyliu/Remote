$(function () {
    var videoInfo = null;// 上传视频信息
    var uploadCos;
    var uploadTaskId;
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
                    _html += '<option value="' + tempArr[i].hospitalDeptId + '">' + tempArr[i].deptName + '</option>'
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
                    _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].videoClassName + '</option>'
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

    // 协议选择
    $(".checkObj").click(function () {
        $(".checkBox").toggleClass("active");
    })
    // 获取视频
    $(".videoObj").click(function () {
        if ($(".checkBox").hasClass("active")) {
            $(this).change(function () {
                var videoFile = $(this)[0].files[0];
                var size = parseInt(videoFile.size / 1024 / 1024);
                if (size > 1024) {
                    layer.msg("文件过大");
                } else if (!/(.avi|.mov|.mpeg|.mp4|.wmv|.flv|.f4v|.mkv|.rmvb|.rm)$/gi.test(videoFile.name)) {
                    layer.msg("文件类型暂不支持")
                } else {
                    $(".stepObj").hide().eq(1).show();
                    $(".stepBox > span").removeClass("active").eq(1).addClass("active");
                    $(".fileSizeObj").html(size);
                    // 渲染页面 layer 控件
                    qcVideo.ugcUploader.start({
                        videoFile: videoFile,
                        // coverFile: coverFile,//封面，类型为 File
                        getSignature: getSignature,
                        error: function (result) {
                            console.log(result)
                        },
                        progress: function (result) {
                            // console.log('上传进度：' + result.curr);
                            $(".progressObj").html(parseInt(result.curr * 100) + "%").css("width", result.curr * 100 + "%");
                            uploadCos = result.cos;
                            uploadTaskId = result.taskId;
                        },
                        finish: function (result) {
                            videoInfo = result;
                            console.log('上传结果的 fileId：' + result.fileId);
                            console.log('上传结果的视频名称：' + result.videoName);
                            console.log('上传结果的视频地址：' + result.videoUrl);
                            console.log('上传结果的封面名称：' + result.coverName);
                            console.log('上传结果的封面地址：' + result.coverUrl);
                        }
                    });
                }
            })
        } else {
            layer.msg("请先点击同意服务条款");
            return false;
        }
    })
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
        } else if (videoInfo == null || !videoInfo.fileId) {
            layer.msg("请等待视频上传完成")
        } else {
            var postData = new FormData();
            postData.append("fileId", videoInfo.fileId);//视频id
            postData.append("videoPath", videoInfo.videoUrl);//视频路径	
            postData.append("classTitle", $(".titleInputObj").val());//课程标题		
            postData.append("hospitalDeptId", $(".deptObj").val());//录课科室
            postData.append("videoDescribe", $(".textAreaObj").html());//直播描述
            postData.append("classId", $(".classifyObj").val());//课程分类id	
            // 发布预告
            $.ajax({
                type: 'POST',
                url: IP + 'video/addVideo',
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
                        $(".videoTitleObj").html($(".titleInputObj").val());
                        $(".stepObj").hide().eq(2).show();
                        $(".stepBox > span").removeClass("active").eq(2).addClass("active");
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
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shadeClose: false,
            content: $('.optionContent'),
        })
    })
    $(".optionContent").find(".yesBtn").click(function () {
        qcVideo.ugcUploader.cancel({
            cos: uploadCos,
            taskId: uploadTaskId
        });
        layer.closeAll();
        $(".optionContent").hide();
        window.location = '/yilaiyiwang/premierCourseRelease/release.html'
    })
    $(".optionContent").find(".noBtn").click(function () {
        layer.closeAll();
        $(".optionContent").hide();
    })
})