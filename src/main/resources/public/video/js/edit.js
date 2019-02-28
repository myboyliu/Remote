let videoInfo = {};

function renderBranchSelect(branchList) {
    let _html = '<option value="">请选择</option>';
    for (let i = 0; i < branchList.length; i++) {
        _html += '<option value="' + branchList[i].id + '">' + branchList[i].branchName + '</option>'
    }
    $(".deptObj").html(_html);
}

function renderVideoInfo(result) {
    videoInfo = result;
    console.log(videoInfo);
    $(".titleInputObj").val(videoInfo.videoName);// 标题
    $(".textInputNum").html(videoInfo.videoName.length)
    $(".textAreaObj").html(videoInfo.videoDescribe);// 描述
    $(".textAreaNum").html(videoInfo.videoDescribe.length);
    $(".coverImg").attr("src", videoInfo.videoCoverUrl);
    $(".classifyObj option[value='" + videoInfo.videoType + "']").attr("selected", "selected");
    $(".deptObj option[value='" + videoInfo.branchId + "']").attr("selected", "selected");
}

function updateVideoInfoSuccess(result) {
    console.log(result);
    layer.msg("编辑成功",{icon: 1});
    setTimeout(function () {
        window.location = '/video/main.html'
    }, 1500)
    // layer.msg("权限不足")
    // layer.msg("请稍后重试")
}

$(function () {
    // 查询此医院下所有二级科室
    ajaxRequest("GET", getSecondBranchList, "", false, false, false, renderBranchSelect, null, null);
    // 获取视频信息
    let paramData = {id: window.location.href.split("?")[1]}
    ajaxRequest("GET", getVideoInfoUrl, paramData, true, "application/json", true, renderVideoInfo, null, null);

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
    let imgUrlBase64;

    $(".coverInput").change(function () {
        let file = this.files[0];
        let reader = new FileReader();
        reader.onload = function () {
            imgUrlBase64 = this.result.replace(/^data:image\/(jpeg|png|gif);base64,/,"")
            console.log(imgUrlBase64.length);
            $(".coverImg").attr("src", this.result);
        }
        reader.readAsDataURL(file);
        return false;
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
            let postData = new FormData();
            postData.append("id", videoInfo.id);//视频id
            postData.append("videoName", $(".titleInputObj").val());//课程标题
            postData.append("branchId", $(".deptObj").val());//录课科室
            postData.append("videoType", $(".classifyObj").val());//课程分类id
            postData.append("videoDescribe", $(".textAreaObj").html());//直播描述
            postData.append("videoFileId", videoInfo.videoFileId);//直播描述
            if (imgUrlBase64) {
                postData.append("coverData", imgUrlBase64);//视频路径
            }
            ajaxRequest("POST", updateVideoInfoUrl, postData, false, false, true, updateVideoInfoSuccess, null, null);
            return false;
        }
    })
    // 取消按钮
    $(".cancelBtn").click(function () {
        window.history.back();
    })
})