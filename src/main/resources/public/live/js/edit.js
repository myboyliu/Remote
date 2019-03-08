function renderBranchSelect(branchList) {
    console.log(branchList);
    let _html = '<option value="">请选择</option>';
    for (let i = 0; i < branchList.length; i++) {
        _html += '<option value="' + branchList[i].id + '">' + branchList[i].customName + '</option>'
    }
    $(".deptObj").html(_html);
}
function updateLiveSuccess(){
    layer.closeAll();
    $('.optionContent').hide();
    layer.open({
        type: 1,
        title: '',
        area: ['340px', '200px'],
        closeBtn: false,
        shadeClose: false,
        time: 2000,
        content: $('.hintContent'),
    });
    setTimeout(function () {
        layer.closeAll();
        $(".hintContent").hide();
        window.location = '../live/main.html';
    }, 2000)
}

$(function () {
    // 查询此医院下所有二级科室
    ajaxRequest("GET", getLocalHospitalBranchUrl, "", false, false, false, renderBranchSelect, null, null);

    function double(n) {
        return n < 10 ? '0' + n : n;
    }

    // 查询直播信息
    let liveInfo = JSON.parse(sessionStorage.getItem(window.location.href.split("?")[1]));
    $(".titleInputObj").val(liveInfo.liveName);// 标题
    $(".textInputNum").html(liveInfo.liveName.length)
    $(".startTimeObj").val(liveInfo.liveStartTime);// 开始时间
    $(".textAreaObj").html(liveInfo.liveDescription);// 描述
    $(".textAreaNum").html(liveInfo.liveDescription.length);
    $(".coverImgObj").attr('src', baseUrl + "/" + liveInfo.liveCoverUrl)
    $(".classifyObj option[value='" + liveInfo.liveType + "']").attr("selected", "selected");
    $(".deptObj option[value='" + liveInfo.liveBranchId + "']").attr("selected", "selected");
    $(".liveScopeObj option[value='" + liveInfo.liveScope + "']").attr("selected", "selected");
    $(".liveMute").attr("checked", liveInfo.liveMute);// 标题
    $(".liveRecord").attr("checked", liveInfo.liveRecord);// 标题
    $(".liveStart").attr("checked", liveInfo.liveStart);// 标题
    var times = (new Date(liveInfo.liveEndTime).getTime() - new Date(liveInfo.liveStartTime).getTime()) / 1000;
    var h = parseInt(times / 3600);
    times %= 3600;
    var m = parseInt(times / 60)
    var s = times %= 60;
    $(".durationTimeObj").val(double(h) + ':' + double(m) + ':' + double(s));


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
    // 渲染页面 layer 控件
    layui.use(['form', 'layedit', 'laydate'], function () {
        var laydate = layui.laydate;
        var form = layui.form;//高版本建议把括号去掉，有的低版本，需要加()
        form.render();
        // 选择时间工具
        $('.startTime').each(function () {
            laydate.render({
                elem: this,
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
            });
        });
        $('.durationTime').each(function () {
            laydate.render({
                elem: this,
                type: 'time',
                format: 'HH:mm:ss',
                btns: ['clear', 'confirm'],
            });
        });
    })
    // 选择图片封面
    $(".coverInput").change(function () {
        var reader = new FileReader();
        reader.readAsDataURL($(this)[0].files[0]);
        reader.onload = function (e) {
            if (e.target.result) {
                $(".coverImgObj").attr("src", e.target.result);
            }
        }
    })
    $(".defaultCoverBtn").click(function () {
        $(".coverImgObj").attr("src", '');
        $(".coverInput").val('');
        var postData = new FormData();
        postData.append("id", liveInfo.id);//直播预告id
        postData.append("path", liveInfo.liveCoverUrl);//原封面图片路径
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'live/defaultCover',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     data: postData,
        //     crossDomain: true,
        //     cache: false,
        //     contentType: false,
        //     processData: false,
        //     dataType: "json",
        //     success: function (data) {
        //         console.log(data)
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
    })
    // 发布按钮
    $(".submitBtn").click(function () {
        if ($(".titleInputObj").val() == '') {
            layer.msg("请填写直播标题");
        } else if ($(".titleInputObj").val().length > 20) {
            layer.msg("直播标题过长");
        } else if ($(".deptObj").val() == '') {
            layer.msg("请选择科室");
        } else if ($(".startTimeObj").val() == '') {
            layer.msg("请选择直播时间");
        } else if ($(".durationTimeObj").val() == '') {
            layer.msg("请选择直播时长");
        } else if ($(".classifyObj").val() == '') {
            layer.msg("请选择直播类型");
        } else {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shadeClose: false,
                content: $('.optionContent'),
            })

        }
    })
    $('.optionContent').find(".yesBtn").click(function () {
        let startTimes = new Date($(".startTimeObj").val()).getTime() / 1000;
        let times = $(".durationTimeObj").val().split(":")[0] * 3600 + $(".durationTimeObj").val().split(":")[1] * 60 + $(".durationTimeObj").val().split(":")[2] * 1;
        let endDate = new Date((startTimes + times) * 1000);
        let endDateData = endDate.getFullYear() + '-' + double(endDate.getMonth() + 1) + '-' + double(endDate.getDate()) + ' ' + double(endDate.getHours()) + ':' + double(endDate.getMinutes()) + ':' + double(endDate.getSeconds());
        let postData = new FormData();
        postData.append("id", window.location.href.split("?")[1]);//直播预告id
        postData.append("liveName", $(".titleInputObj").val());//直播标题
        postData.append("liveDescription", $(".textAreaObj").html());//直播描述
        postData.append("liveBranch", $(".deptObj").val());//科室id
        postData.append("liveStartTime", $(".startTimeObj").val() + ":00");//直播开始时间
        postData.append("liveEndTime", endDateData);//直播结束时间
        postData.append("livePeriod", times);//直播结束时间
        postData.append("liveType", $(".classifyObj").val());//直播分类
        postData.append("liveScope", $(".liveScopeObj").val());//发布范围
        postData.append("liveMute", $(".liveMute").val());//静音
        postData.append("liveRecord", $(".liveRecord").val());//自动录制
        postData.append("liveStart", $(".liveStart").val());//开启直播
        postData.append("liveId", liveInfo.liveId);//开启直播
        $(".coverInput")[0].files[0] ? postData.append("file", $(".coverInput")[0].files[0]) : null;//封面图片

        ajaxRequest("POST", updateLiveUrl, postData, false, false, true, updateLiveSuccess, null, null);
    })
    $('.optionContent').find(".noBtn").click(function () {
        layer.closeAll();
        $(".optionContent").hide();
    })
})