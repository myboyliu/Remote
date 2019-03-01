$(function () {
    function double(n) {
        return n < 10 ? '0' + n : n;
    }
    // 查询直播信息
    var liveInfo = {};
    $.ajax({
        type: 'POST',
        url: IP + 'live/findLiveDetail',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        data: {
            "liveId": window.location.href.split("?")[1],
        },
        async: false,
        crossDomain: true,
        success: function (data) {
            console.log(data)
            if (data.code == 1) {
                liveInfo = data.data;
            } else {
                layer.msg("获取直播信息失败");
            }
        },
        error: function (err) {
            console.log(err);
        },
    });
    $(".titleInputObj").val(liveInfo.liveName);// 标题
    $(".textInputNum").html(liveInfo.liveName.length)
    $(".startTimeObj").val(liveInfo.liveStartTime);// 开始时间
    $(".textAreaObj").html(liveInfo.liveDescribe);// 描述
    $(".textAreaNum").html(liveInfo.liveDescribe.length);
    $(".coverImgObj").attr('src', imgIp + liveInfo.liveCoverUrl)
    var times = (new Date(liveInfo.liveEndTime).getTime() - new Date(liveInfo.liveStartTime).getTime()) / 1000;
    var h = parseInt(times / 3600);
    times %= 3600;
    var m = parseInt(times / 60)
    var s = times %= 60;
    $(".durationTimeObj").val(double(h) + ':' + double(m) + ':' + double(s));
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
                    if (liveInfo.dept.id == tempArr[i].hospitalDeptId) {
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
        url: IP + 'liveClass/findList',
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
                    if (liveInfo.liveClass.id == tempArr[i].id) {
                        _html += '<option selected="selected" value="' + tempArr[i].id + '">' + tempArr[i].liveClassName + '</option>'
                    } else {
                        _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].liveClassName + '</option>'
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
        $.ajax({
            type: 'POST',
            url: IP + 'live/defaultCover',
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
            },
            error: function (err) {
                console.log(err);
            },
        });
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
        var startTimes = new Date($(".startTimeObj").val()).getTime() / 1000;
        var times = $(".durationTimeObj").val().split(":")[0] * 3600 + $(".durationTimeObj").val().split(":")[1] * 60 + $(".durationTimeObj").val().split(":")[2] * 1;
        var endDate = new Date((startTimes + times) * 1000);
        var endDateData = endDate.getFullYear() + '-' + double(endDate.getMonth() + 1) + '-' + double(endDate.getDate()) + ' ' + double(endDate.getHours()) + ':' + double(endDate.getMinutes()) + ':' + double(endDate.getSeconds());
        var postData = new FormData();
        postData.append("id", window.location.href.split("?")[1]);//直播预告id
        postData.append("title", $(".titleInputObj").val());//直播标题
        postData.append("liveRoomId", liveInfo.liveRoomId);//直播室id	
        postData.append("livePwd", liveInfo.adminPwd);//直播密码		
        postData.append("deptId", $(".deptObj").val());//科室id
        postData.append("startDate", $(".startTimeObj").val() + ":00");//直播开始时间
        postData.append("endDate", endDateData);//直播结束时间
        postData.append("liveClassId", $(".classifyObj").val());//直播分类id
        $(".coverInput")[0].files[0] ? postData.append("file", $(".coverInput")[0].files[0]) : null;//封面图片
        postData.append("liveDescribe", $(".textAreaObj").html());//直播描述
        // 预告修改
        $.ajax({
            type: 'POST',
            url: IP + 'live/updateAnnouncement',
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
                        window.location = '/yilaiyiwang/liveMain/main.html';
                    }, 2000)
                } else if (data.code == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                    layer.msg("请稍后重试")
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    })
    $('.optionContent').find(".noBtn").click(function () {
        layer.closeAll();
        $(".optionContent").hide();
    })
})