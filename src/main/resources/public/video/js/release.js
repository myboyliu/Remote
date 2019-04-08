function getSecondBranchListSuccess(branchList){
    console.log(branchList)
    let _html = '<option value="">请选择</option>';
    for (let i = 0; i < branchList.length; i++) {
        _html += '<option value="' + branchList[i].id + '">' + branchList[i].branchName + '</option>'
    }
    $(".deptObj").html(_html);
}
$(function () {
    // 查询此医院下所有二级科室
    ajaxRequest("GET", getSecondBranchList, "", false, false, true, getSecondBranchListSuccess, null, null);

    // 获取上传签名
    let getSignature = function (callback) {
        ajaxRequest("POST", getSignatureUrl, "", false, false, true, callback, null, null);
    };

    var videoInfo = null;// 上传视频信息
    var uploadCos;
    var uploadTaskId;

    function double(n) {
        return n < 10 ? '0' + n : n;
    }

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
            postData.append("videoFileId", videoInfo.fileId);//视频id
            postData.append("videoUrl", videoInfo.videoUrl);//视频路径
            postData.append("videoName", $(".titleInputObj").val());//课程标题
            postData.append("branchId", $(".deptObj").val());//录课科室
            postData.append("videoDescribe", $(".textAreaObj").html());//直播描述
            postData.append("videoType", $(".classifyObj").val());//课程分类id
            function saveVideoSuccess(resultJson){
                console.log(resultJson);
                $(".videoTitleObj").html($(".titleInputObj").val());
                $(".stepObj").hide().eq(2).show();
                $(".stepBox > span").removeClass("active").eq(2).addClass("active");
                // layer.msg("权限不足")
                // layer.msg("请稍后重试")
            }
            // 发布预告
            ajaxRequest("POST",saveVideoUrl,postData,false,false,true,saveVideoSuccess,null,null);

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
        window.location = '../video/release.html'
    })
    $(".optionContent").find(".noBtn").click(function () {
        layer.closeAll();
        $(".optionContent").hide();
    })
})