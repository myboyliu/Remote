const myDate = new Date();
let dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
// 渲染日历
let flag = true;
let dateTempList = []; // 收集的时间段
let startIndex = 0;
let endIndex = 0;
let dateList = []; // 选择的时间数据
let newDateTimeList = [];
//渲染日历插件右侧时间内容
function renderDateRightContent() {
    let startMinute = 0; // 开始总分钟数
    let endMinute = 0; // 结束总分钟数
    let startHour = 0; // 开始小时数
    let endHour = 0; // 结束小时数
    let _html = '';
    for (let i = 0; i < 96; i++) {
        startMinute = i * 15;
        endMinute = (i + 1) * 15;
        startHour = parseInt(startMinute / 60);
        endHour = parseInt(endMinute / 60);
        let startM = startMinute %= 60; // 计算后的开始分钟数
        let endM = endMinute %= 60; // 计算后的开始分钟数
        if (endHour == 24) {
            _html += '<li endDate="23:59" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
        } else {
            _html += '<li endDate="' + double(endHour) + ':' + double(endM) + '" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
        }
    }
    $('.rightContent').html(_html);
}

//重新渲染日历
function redrawDate(dateTempList) {
    let markJson = {};
    for (let i = 0; i < dateTempList.length; i++) {
        markJson[dateTempList[i].date] = ''
    }
    // 渲染日历控件
    $('#timeBox').html('');
    layui.use('laydate', function () {
        let laydate = layui.laydate;
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
                for (let i = 0; i < dateTempList.length; i++) {
                    if (dateStr == dateTempList[i].date) {
                        if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                            for (let j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        } else {
                            for (let j = dateTempList[i].endIndex; j <= dateTempList[i].startIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        }
                    }
                }
                for (let i = 0; i < dateTempList.length; i++) {
                    if (value == dateTempList[i].date) {
                        for (let j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                            $('#timeUl > li').eq(j).addClass('active');
                        }
                    }
                }
            }
        });
    });

    for (let i = 0; i < dateTempList.length; i++) {
        if (dateStr == dateTempList[i].date) {
            for (let j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                $('#timeUl > li').eq(j).addClass('active');
            }
        }
    }
}

//展示日历插件
function showTimeView(applyTimeList) {
    let _$ = layui.jquery;
    layer.open({
        type: 1,
        content: _$('.selectTimeContainer'),
        title: '',
        area: ['1060px', '630px'],
        closeBtn: 1,
        skin: 'noBackground',
    });
    dateTempList = [];
    for (let i = 0; i < applyTimeList.length; i++) {
        let date = applyTimeList[i].eventStartTime.split(' ')[0];
        let startDate = applyTimeList[i].eventStartTime.split(' ')[1];
        let hours = startDate.split(':')[0];
        let minute = startDate.split(':')[1];
        let startIndex = (hours * 60 + minute * 1) / 15;
        let endDate = applyTimeList[i].eventEndTime.split(' ')[1];
        let endHour = endDate.split(':')[0];
        let endMinute = endDate.split(':')[1];
        let endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
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
                for (let i = startIndex; i < endIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            } else {
                for (let i = endIndex; i < startIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            }
            if (isOnly) {
                dateTempList = [];
                newDateTimeList = [];
                dateTempList.push({
                    "date": dateStr,
                    "startIndex": startIndex,
                    "endIndex": endIndex,
                });

                newDateTimeList.push({
                    "date": dateStr,
                    "startIndex": startIndex,
                    "endIndex": endIndex,
                });
            } else {
                if (dateTempList.length == 0) {
                    dateTempList.push({
                        "date": dateStr,
                        "startIndex": startIndex,
                        "endIndex": endIndex,
                    });
                } else {
                    for (let i = 0; i < dateTempList.length; i++) {
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
            }
            redrawDate(dateTempList);
        }
    });
    // 清空当页数据
    $('.selectTimeContent').find('.clearBtn').click(function () {
        for (let i = 0; i < dateTempList.length; i++) {
            if (dateTempList[i].date == dateStr) {
                dateTempList.splice(i, 1);
            }
        }
        $('#timeUl > li').removeClass('active');
        redrawDate(dateTempList);
    })
    // 关闭事件
    $('.closeBtnTime').click(function () {
        dateTempList = [];
        $('#timeUl > li').removeClass('active');
        layer.closeAll();
        $('.selectTimeContainer').hide();
    })

    $('#selectTimeContainerBoxYesBtn').click(function () {
        layer.closeAll();
        $('.selectTimeContainer').hide();
        dateList = [];
        for (let i = 0; i < dateTempList.length; i++) {
            if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                dateList.push({
                    'startTime': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).html() + ':00',
                    'endTime': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).attr('enddate') + ':00'
                });
            } else {
                dateList.push({
                    'startTime': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).html() + ':00',
                    'endTime': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).attr('enddate') + ':00'
                });
            }

        }
        updateApplyTime(dateList);
    })
})