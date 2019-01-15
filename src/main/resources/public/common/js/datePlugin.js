

$(function () {
    // 修改排期
    $(".schedulingBtn").click(function () {
        // 打开转诊选时间面板
        layer.open({
            type: 1,
            content: $('.referralTimeSelect'),
            title: false,
            area: ['600px', '580px'],
            closeBtn: 0,
            skin: 'noBackground'
        })
    });
    // 转诊选择时间清空按钮
    $(".referralTimeSelect").find(".clearBtn").click(function () {
        markReferralJson = {};
        referraSelectRender();
    })
    $(".referralTimeSelect").find(".yesBtn").click(function () {
        var tempHtml = '';
        for (var key in markReferralJson) {
            tempHtml += '<p>' + key + '</p>'
        }
        $(".schedule_modules").html(tempHtml);
        layer.closeAll();
        $(".referralTimeSelect").hide();
    })
    $(".referralTimeSelect").find(".closeBtnTime").click(function () {
        layer.closeAll();
        $(".referralTimeSelect").hide();
    })
    // 选一个时间
    var initOneDate = new Date();
    var initOneValue = '';
    var initOneYear = initOneDate.getFullYear();
    var initOneMonth = initOneDate.getMonth() + 1;
    var initOneDay = initOneDate.getDate();
    function referraSelectOneRender() {
        $("#referralTimeOneScope").html('');
        layui.use('laydate', function () {
            var laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#referralTimeOneScope',
                position: 'static',
                showBottom: false,
                min: 0,
                value: initOneValue,
                mark: markReferralOneJson,
                change: function (value, date) { //监听日期被切换
                    console.log(value, date);
                    if (date.date == initOneDay && date.month != initOneMonth || date.year != initOneYear) {

                    } else {
                        markReferralOneJson = {};
                        markReferralOneJson[value] = '';
                    }
                    initOneValue = value;
                    initOneYear = date.year;
                    initOneMonth = date.month;
                    initOneDay = date.date;
                    referraSelectOneRender();
                }
            });
        });
    };
    referraSelectOneRender();
    // 转诊选择时间清空按钮
    $(".referralTimeOneSelect").find(".clearBtn").click(function () {
        markReferralOneJson = {};
        referraSelectOneRender();
    })
    $(".referralTimeOneSelect").find(".yesBtn").click(function () {
        dateList = [];
        var tempHtml = '';
        for (var key in markReferralOneJson) {
            tempHtml += '<p>' + key + '</p>';
            dateList.push(key);
        }
        $(".schedule_modules").html(tempHtml);
        if (dateList.length == 1) {
            layer.closeAll();
            $(".referralTimeOneSelect").hide();
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                content: $('.receiveBox'),
            });
        } else {
            layer.msg("当前时间不符合要求，您只能选择一天转诊")
        }

    })
    $(".referralTimeOneSelect").find(".closeBtnTime").click(function () {
        layer.closeAll();
        $(".referralTimeOneSelect").hide();
    })
})