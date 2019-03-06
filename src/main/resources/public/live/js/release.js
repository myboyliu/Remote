function renderBranchSelect(branchList) {
    console.log(branchList);
    let _html = '<option value="">请选择</option>';
    for (let i = 0; i < branchList.length; i++) {
        _html += '<option value="' + branchList[i].id + '">' + branchList[i].customName + '</option>'
    }
    $(".deptObj").html(_html);
}

$(function () {

    // 查询此医院下所有二级科室
    ajaxRequest("GET", getLocalHospitalBranchUrl, "", false, false, false, renderBranchSelect, null, null);

    function double(n) {
        return n < 10 ? '0' + n : n;
    }

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
            let startTimes = new Date($(".startTimeObj").val()).getTime() / 1000;
            let times = $(".durationTimeObj").val().split(":")[0] * 3600 + $(".durationTimeObj").val().split(":")[1] * 60 + $(".durationTimeObj").val().split(":")[2] * 1;
            let endDate = new Date((startTimes + times) * 1000);
            let endDateData = endDate.getFullYear() + '-' + double(endDate.getMonth() + 1) + '-' + double(endDate.getDate()) + ' ' + double(endDate.getHours()) + ':' + double(endDate.getMinutes()) + ':' + double(endDate.getSeconds());
            let postData = new FormData();
            postData.append("liveName", $(".titleInputObj").val());//直播标题
            postData.append("liveDescription", $(".textAreaObj").html());//直播描述
            postData.append("liveBranch", $(".deptObj").val());//科室id
            postData.append("liveStartTime", $(".startTimeObj").val() + ":00");//直播开始时间
            postData.append("liveEndTime", endDateData);//直播结束时间
            postData.append("livePeriod", times);//直播结束时间
            postData.append("liveType", $(".classifyObj").val());//直播分类
            postData.append("liveScope", $(".liveScopeObj").val());//发布范围
            postData.append("file", $(".coverInput")[0].files[0]);//封面图片
            postData.append("liveMute", $(".liveMute").val());//静音
            postData.append("liveRecord", $(".liveRecord").val());//自动录制
            postData.append("liveStart", $(".liveStart").val());//开启直播
            function addLiveSuccess(result) {
                console.log(result);
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

            ajaxRequest("POST", createLive, postData, false, false, true, addLiveSuccess, null, null);
            return false;
        }
    })
})