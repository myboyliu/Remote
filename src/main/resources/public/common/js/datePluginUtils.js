const myDate = new Date();
let dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
// 渲染日历
var flag = true;
var dateTempList = []; // 收集的时间段
var startIndex = 0;
var endIndex = 0;
function renderDateRightContent() {
    var startMinute = 0; // 开始总分钟数
    var endMinute = 0; // 结束总分钟数
    var startHour = 0; // 开始小时数
    var endHour = 0; // 结束小时数
    var _html = '';
    for (var i = 0; i < 96; i++) {
        startMinute = i * 15;
        endMinute = (i + 1) * 15;
        startHour = parseInt(startMinute / 60);
        endHour = parseInt(endMinute / 60);
        var startM = startMinute %= 60; // 计算后的开始分钟数
        var endM = endMinute %= 60; // 计算后的开始分钟数
        if (endHour == 24) {
            _html += '<li endDate="23:59" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
        } else {
            _html += '<li endDate="' + double(endHour) + ':' + double(endM) + '" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
        }
    }
    $('.rightContent').html(_html);
}

function redrawDate(dateTempList) {
    var markJson = {};
    for (var i = 0; i < dateTempList.length; i++) {
        markJson[dateTempList[i].date] = ''
    }
    console.log(markJson)
    // 渲染日历控件
    $('#timeBox').html('');
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#timeBox',
            position: 'static',
            showBottom: false,
            value: dateStr,
            mark: markJson,
            min: 0,
            change: function (value, date) { //监听日期被切换
                $('#timeUl > li').removeClass('active');
                flag = true;
                dateStr = value;
                for (var i = 0; i < dateTempList.length; i++) {
                    if (dateStr == dateTempList[i].date) {
                        if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                            for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        } else {
                            for (var j = dateTempList[i].endIndex; j <= dateTempList[i].startIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        }
                    }
                }
                for (var i = 0; i < dateTempList.length; i++) {
                    if (value == dateTempList[i].date) {
                        for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                            $('#timeUl > li').eq(j).addClass('active');
                        }
                    }
                }
            }
        });
    });

    for (var i = 0; i < dateTempList.length; i++) {
        if (dateStr == dateTempList[i].date) {
            for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                $('#timeUl > li').eq(j).addClass('active');
            }
        }
    }
}

function showDateView(applyTimeList) {
    var _$ = layui.jquery;
    layer.open({
        type: 1,
        content: _$('.selectTimeContainer'),
        title: '',
        area: ['1060px', '630px'],
        closeBtn: 0,
        skin: 'noBackground',
    });
    dateTempList = [];
    for (var i = 0; i < applyTimeList.length; i++) {
        var date = applyTimeList[i].eventStartTime.split(' ')[0];
        var startDate = applyTimeList[i].eventStartTime.split(' ')[1];
        var hours = startDate.split(':')[0];
        var minute = startDate.split(':')[1];
        var startIndex = (hours * 60 + minute * 1) / 15;
        var endDate = applyTimeList[i].eventEndTime.split(' ')[1];
        var endHour = endDate.split(':')[0];
        var endMinute = endDate.split(':')[1];
        var endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
        dateTempList.push({
            "date": date,
            "startIndex": startIndex,
            "endIndex": endIndex - 1,
        })
    }
    renderDateRightContent();
    redrawDate(dateTempList);
}

$(function () {

// 分钟选择事件、
    $('#timeUl').delegate('li', 'click', function () {
        if (flag) {
            $(this).addClass('active').siblings('li').removeClass('active');
            flag = false;
            startIndex = $(this).attr('index');
        } else {
            $(this).addClass('active');
            flag = true;
            endIndex = $(this).attr('index');
            if (startIndex <= endIndex) {
                for (var i = startIndex; i < endIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            } else {
                for (var i = endIndex; i < startIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            }
            if (dateTempList.length == 0) {
                dateTempList.push({
                    "date": dateStr,
                    "startIndex": startIndex,
                    "endIndex": endIndex,
                });
            } else {
                for (var i = 0; i < dateTempList.length; i++) {
                    if (dateTempList[i].date == dateStr) {
                        dateTempList.splice(i, 1);
                    }
                }
                dateTempList.push({
                    "date": dateStr,
                    "startIndex": startIndex,
                    "endIndex": endIndex,
                });
            }
            redrawDate();
        }
    });
// 清空当页数据
    $('.selectTimeContent').find('.clearBtn').click(function () {
        for (var i = 0; i < dateTempList.length; i++) {
            if (dateTempList[i].date == dateStr) {
                dateTempList.splice(i, 1);
            }
        }
        $('#timeUl > li').removeClass('active');
        redrawDate();
    })
// 关闭事件
    $('.closeBtnTime').click(function () {
        dateTempList = [];
        $('#timeUl > li').removeClass('active');
        layer.closeAll();
        $('.selectTimeContainer').hide();
    })

    $('.yesBtn').click(function () {
        layer.closeAll();
        $('.selectTimeContainer').hide();
        var dateList = []; // 选择的时间数据
        for (var i = 0; i < dateTempList.length; i++) {
            if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                dateList.push({
                    'startDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).html() + ':00',
                    'endDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).attr('enddate') + ':00'
                });
            } else {
                dateList.push({
                    'startDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).html() + ':00',
                    'endDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).attr('enddate') + ':00'
                });
            }

        }
        updateApplyTime(dateList);
    })
})