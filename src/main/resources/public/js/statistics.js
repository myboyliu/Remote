/**
 * 渲染统计选项
 */
let consultationOption = ["发件医院", "发件科室", "发件医师职称", "收件医院", "收件科室", "收件医师职称"]
let referralOption = ["发件医院", "发件科室", "发件医师职称", "收件医院", "收件科室", "收件医师职称"]
let seniorOption = ["视频会诊", "图文会诊", "单学科会诊", "多学科会诊"]
let costOption = ["发件医院", "发件科室", "收件医院", "收件科室", "发件医师", "收件医师"]

let consultationOptionObj = [{key: "CON_SEND_HOSPITAL", value: "发件医院"}, {key: "CON_SEND_BRANCH", value: "发件科室"}, {key: "CON_SEND_DOCTOR", value: "发件医师职称"},
    {key: "CON_RECEIVE_HOSPITAL",value: "收件医院"}, {key: "CON_RECEIVE_BRANCH", value: "收件科室"}, {key: "CON_RECEIVE_DOCTOR", value: "收件医师职称"}]
let consultationRule = {
    CON_SEND_HOSPITAL: {CON_SEND_BRANCH:"CON_SEND_BRANCH",CON_SEND_DOCTOR:"CON_SEND_DOCTOR",CON_RECEIVE_BRANCH:"CON_RECEIVE_BRANCH",CON_RECEIVE_DOCTOR:"CON_RECEIVE_DOCTOR"},
    CON_SEND_BRANCH: {CON_SEND_DOCTOR:"CON_SEND_DOCTOR"},
    CON_SEND_DOCTOR: {CON_RECEIVE_HOSPITAL:"CON_RECEIVE_HOSPITAL",CON_RECEIVE_BRANCH:"CON_RECEIVE_BRANCH",CON_RECEIVE_DOCTOR:"CON_RECEIVE_DOCTOR"},
    CON_RECEIVE_HOSPITAL: {CON_RECEIVE_BRANCH:"CON_RECEIVE_BRANCH",CON_RECEIVE_DOCTOR:"CON_RECEIVE_DOCTOR"},
    CON_RECEIVE_BRANCH: {CON_RECEIVE_DOCTOR:"CON_RECEIVE_DOCTOR"}
}

function renderStatisticaltem() {
    //会诊病历统计数据列表 选项渲染
    let consultationOption_html = '';
    for (let item of consultationOptionObj) {
        consultationOption_html += '<a href="javascript:;" id="' + item.key + '">' + item.value + '</a>'
    }
    // for (let i = 0; i < consultationOptionObj.length; i++) {
    //     console.log(consultationOptionObj[i])
    //     consultationOption_html += '<a href="javascript:;" rulesField="' + consultationOptionObj[i].value + '" rulesNumber="' + consultationOptionObj[i].value + '">' + consultationOption[i].value + '</a>'
    // }
    $('.consultationOptionBox').html(consultationOption_html);

    //转诊病历统计数据列表 选项渲染
    let referralOption_html = '';
    for (let i = 0; i < referralOption.length; i++) {
        referralOption_html += '<a href="javascript:;" rulesField="' + referralOption[i].rulesField + '" rulesNumber="' + referralOption[i].rulesNumber + '">' + referralOption[i] + '</a>'
    }
    $('.referralOptionBox').html(referralOption_html);

    // 会诊高级统计 选项渲染
    let seniorOption_html = '';
    for (let i = 0; i < seniorOption.length; i++) {
        seniorOption_html += '<a href="javascript:;" rulesField="' + seniorOption[i].rulesField + '" rulesNumber="' + seniorOption[i].rulesNumber + '">' + seniorOption[i] + '</a>'
    }
    $('.seniorOptionBox').html(seniorOption_html);

    // 会诊费用统计 选项渲染
    let costOption_html = '';
    for (let i = 0; i < costOption.length; i++) {
        costOption_html += '<a href="javascript:;" rulesField="' + costOption[i].rulesField + '" rulesNumber="' + costOption[i].rulesNumber + '">' + costOption[i] + '</a>'
    }
    $('.costOptionBox').html(costOption_html);
}

$(function () {
    function chart(xData, xName, yData, yName, chartType, domObj) {
        var myChart = echarts.init(domObj[0]);
        // xData  // x轴 数据
        // xName // x轴 名字
        // yData  // y轴 数据
        // yName  // y轴 名字
        // chartType  // Chart类型   bar柱形 line折线
        var option = {
            color: ["#516dcf"],
            grid: {
                left: '10%',
                right: '15%',
                bottom: '10%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                axisLabel: {
                    rotate: 10,
                    interval: parseInt(xData.length / 10),
                    color: '#333333',
                    fontSize: '14',
                },
                nameTextStyle: {
                    color: '#101010',
                    fontWeight: '600',
                    fontSize: '14',
                },
                name: xName,
                data: xData,
            },
            yAxis: {
                name: yName,
                axisLabel: {
                    color: '#333333',
                    fontSize: '16',
                },
                nameTextStyle: {
                    color: '#101010',
                    fontWeight: '600',
                    fontSize: '14',
                },
            },
            dataZoom: [{
                start: 0,
                end: 100,
            }],
            series: [{
                name: '数量',
                type: chartType,
                data: yData,
                areaStyle: {},
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    var consultationStartDate = '';
    var consultationEndDate = '';
    var referralStartDate = '';
    var referralEndDate = '';
    var seniorStartDate = '';
    var seniorEndDate = '';
    var costStartDate = '';
    var costSndDate = '';
    // tab切换
    $('.tabContent > a').click(function () {
        var _index = $(this).index();
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.container > div').eq(_index).addClass('active').siblings('div').removeClass('active');
    });

    // 时间范围选择
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '.consultationDateTimeBtn',
            type: 'date',
            range: true,
            max: -1, // 不允许选今天
            done: function (value, date) {
                consultationStartDate = value.split(' - ')[0] + ' 00:00:00';
                consultationEndDate = value.split(' - ')[1] + ' 23:59:59';
            }
        });
    })
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '.referralDateTimeBtn',
            type: 'date',
            range: true,
            max: -1, // 不允许选今天
            done: function (value, date) {
                referralStartDate = value.split(' - ')[0] + ' 00:00:00';
                referralEndDate = value.split(' - ')[1] + ' 23:59:59';
            }
        });
    })
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '.seniorDateTimeBtn',
            type: 'date',
            range: true,
            max: -1, // 不允许选今天
            done: function (value, date) {
                seniorStartDate = value.split(' - ')[0] + ' 00:00:00';
                seniorEndDate = value.split(' - ')[1] + ' 23:59:59';
            }
        });
    })
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '.costDateTimeBtn',
            type: 'date',
            range: true,
            max: -1, // 不允许选今天
            done: function (value, date) {
                costStartDate = value.split(' - ')[0] + ' 00:00:00';
                costSndDate = value.split(' - ')[1] + ' 23:59:59';
            }
        });
    })

    // 会诊病历统计数据列表 选项渲染
    // $.ajax({
    //     type: 'GET',
    //     url: baseUrl + 'statisticalRules/statisticalConsultationList',
    //     dataType: 'json',
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function(data) {
    //         console.log(data);
    //         if (data.status == 200) {
    //             var _html = '';
    //             var tempArr = data.statisticalRulesList;
    //             for (var i = 0; i < tempArr.length; i++) {
    //                 _html += '<a href="javascrbaseUrlt:;" rulesField="' + tempArr[i].rulesField + '" rulesNumber="' + tempArr[i].rulesNumber + '">' + tempArr[i].rulesName + '</a>'
    //             }
    //             $('.consultationOptionBox').html(_html);
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //             // 其他操作
    //         }
    //     },
    //     error: function(err) {
    //         console.log(err);
    //     },
    // });
    // 发送病历次数统计--选项选择
    // 已选项 索引 数组
    var consultationOptionArr = [];
    // 选项点击事件
    $('.consultationOptionBox').delegate('a', 'click', function () {
        // 判断当前是否已经选中
        if (consultationOptionArr.indexOf($(this).index()) != -1) {
            // 已选中就在数组中把 当前选项的索引从数组中删除
            consultationOptionArr.splice(consultationOptionArr.indexOf($(this).index()), 1);
        } else {
            // 判断数组长度
            if (consultationOptionArr.length < 2) {
                // 长度小于2 就把当前的选项的索引从后面加入到数组中
                consultationOptionArr.push($(this).index());
            } else {
                // 长度大于2 就从最前面删除一个并把当前选项索引从后面加入到数组中
                consultationOptionArr.shift();
                consultationOptionArr.push($(this).index());
            }
        }
        // 根据索引数组 渲染焦点
        $('.consultationOptionBox > a').removeClass('active');
        for (var i = 0; i < consultationOptionArr.length; i++) {
            $('.consultationOptionBox > a').eq(consultationOptionArr[i]).addClass("active");
        }
    })
    // 会诊病历次数 统计 按钮
    $('.consultationBtn').click(function () {

        consultationOptionArr.sort(function (a, b) {
            return a - b;
        })
        // 时间选择
        if (consultationStartDate == '' || consultationEndDate == '') {
            layer.msg('数据不完整');
        } else if (consultationOptionArr.length == 0) {
            layer.msg('数据不完整');
        } else if (consultationOptionArr.length >= 2) {
            let firstItem = $('.consultationOptionBox > a').eq(consultationOptionArr[0]).attr('id');
            let secondItem = $('.consultationOptionBox > a').eq(consultationOptionArr[1]).attr('id');
            if (consultationRule[firstItem][secondItem]){
                $.ajax({
                    type: 'POST',
                    url: baseUrl + 'statistics/consultationStatistics',
                    dataType: 'json',
                    data: {
                        "startDate": consultationStartDate,
                        "endDate": consultationEndDate,
                        "type": $('.consultationSelect').val() == '1' ? '1' : '0',
                        "condition1": condition1,
                        "condition2": condition2,
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: function (data) {
                        console.log(data)
                            var tempArr = data.statisticsBean; // 数据数组
                            if (tempArr.length == 0) {
                                layer.msg('统计结果无数据');
                                $('.consultationTable').hide();
                            } else {
                                var headArr = []; // 横轴选项数组
                                var bodyArr = []; // 纵轴选项数组
                                for (var i = 0; i < tempArr.length; i++) {
                                    if (headArr.indexOf(tempArr[i].y) == -1) {
                                        headArr.push(tempArr[i].y);
                                    }
                                    if (bodyArr.indexOf(tempArr[i].x) == -1) {
                                        bodyArr.push(tempArr[i].x);
                                    }
                                }
                                var headHtml = '<tr><th></th>';
                                var bodyHtml = '';
                                // 第一行
                                for (var i = 0; i < headArr.length; i++) {
                                    headHtml += '<th>' + headArr[i] + '</th>';
                                }
                                // 其它行
                                for (var y = 0; y < bodyArr.length; y++) {
                                    var itemArr = [];
                                    var itemTextArr = [];
                                    for (var x = 0; x < tempArr.length; x++) {
                                        if (tempArr[x].x == bodyArr[y]) {
                                            itemArr.push(tempArr[x]);
                                            itemTextArr.push(tempArr[x].y);
                                        }
                                    }
                                    bodyHtml += '<tr>\
                                                <td>' + bodyArr[y] + '</td>';
                                    for (var z = 0; z < headArr.length; z++) {
                                        console.log(itemArr)
                                        if (itemTextArr.indexOf(headArr[z]) != -1) {
                                            bodyHtml += '<td>' + itemArr[itemTextArr.indexOf(headArr[z])].size + '</td>';
                                        } else {
                                            bodyHtml += '<td>0</td>';
                                        }
                                    }
                                    bodyHtml += '</tr>';
                                }
                                headHtml += '</tr>';
                                $('.tableBtn_one').addClass('active');
                                $('.consultationTable').show();
                                $('.consultationChartBox').hide();
                                $('.consultationHeadBox').html(headHtml);
                                $('.consultationBodyBox').html(bodyHtml);
                            }
                    },
                })
            } else {
                layer.msg('统计组合不存在');
            }
        } else {
            var dataArr = [];
            // 只有一个选项 的 情况
            var optionName = $('.consultationOptionBox > a').eq(consultationOptionArr[0]).html();
            $.ajax({
                type: 'POST',
                url: baseUrl + 'dateUtil/findDay',
                dataType: 'json',
                data: {
                    "startDate": consultationStartDate,
                    "endDate": consultationEndDate,
                },
                async: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    dataArr = data;
                },
                error: function (err) {
                    console.log(err);
                },
            })
            $.ajax({
                type: 'POST',
                url: baseUrl + 'statistics/consultationStatisticsSingle',
                dataType: 'json',
                data: {
                    "startDate": consultationStartDate,
                    "endDate": consultationEndDate,
                    "type": $('.consultationSelect').val() == '1' ? '1' : '0',
                    "condition": $('.consultationOptionBox > a').eq(consultationOptionArr[0]).attr('rulesfield'),
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    console.log(data)
                    if (data.status == 200) {
                        var tempArr = data.statisticsBean;
                        if (tempArr.length == 0) {
                            layer.msg('统计结果无数据')
                        } else {
                            var xData = []; // x轴 数据
                            var yData = []; // y轴 数据
                            if (optionName == '发件医院' && $('.consultationSelect').val() == '2') {
                                var tempDataArr = [];
                                for (var i = 0; i < tempArr.length; i++) {
                                    tempDataArr.push(tempArr[i].x);
                                }
                                for (var i = 0; i < dataArr.length; i++) {
                                    if (tempDataArr.indexOf(dataArr[i]) != -1) {
                                        yData.push(tempArr[tempDataArr.indexOf(dataArr[i])].size);
                                    } else {
                                        yData.push(0);
                                    }
                                }
                                xData = dataArr;
                                chart(xData, optionName, yData, '数量', 'line', $('.consultationChartBox'));
                                //xData, xName, yData, yName, chartType
                            } else if (optionName == '收件医院' && $('.consultationSelect').val() == '1') {

                                var tempDataArr = [];
                                for (var i = 0; i < tempArr.length; i++) {
                                    tempDataArr.push(tempArr[i].x);
                                }
                                for (var i = 0; i < dataArr.length; i++) {
                                    if (tempDataArr.indexOf(dataArr[i]) != -1) {
                                        yData.push(tempArr[tempDataArr.indexOf(dataArr[i])].size);
                                    } else {
                                        yData.push(0);
                                    }
                                }
                                xData = dataArr;
                                chart(xData, optionName, yData, '数量', 'line', $('.consultationChartBox'));
                                //xData, xName, yData, yName, chartType
                            } else {
                                for (var i = 0; i < tempArr.length; i++) {
                                    xData.push(tempArr[i].x);
                                    yData.push(tempArr[i].size);
                                }
                                chart(xData, optionName, yData, '数量', 'bar', $('.consultationChartBox')); //xData, xName, yData, yName, chartType
                            }
                        }
                        var headHtml = '<tr><th></th><th>数量</th></tr>';
                        var bodyHtml = '';
                        for (var i = 0; i < xData.length; i++) {
                            bodyHtml += '<tr><td>' + xData[i] + '</td><td>' + yData[i] + '</td></tr>';
                        }
                        $('.consultationHeadBox1').html(headHtml);
                        $('.consultationBodyBox1').html(bodyHtml);
                        $('.tableBtn_one').addClass('active');
                        $('.consultationTable').hide();
                        $('.consultationTable1').hide();
                        $('.consultationChartBox').show();

                    } else if (data.status == 250) {
                        // 未登录操作
                        window.location = '/yilaiyiwang/login/login.html';
                    } else {
                        // 其他操作
                    }
                },
                error: function (err) {
                    console.log(err);

                },
            })
        }
    })

    // 转诊病历统计数据列表 选项渲染
    // $.ajax({
    //     type: 'GET',
    //     url: baseUrl + 'statisticalRules/statisticalConsultationList',
    //     dataType: 'json',
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function(data) {
    //         console.log(data);
    //         if (data.status == 200) {
    //             var _html = '';
    //             var tempArr = data.statisticalRulesList;
    //             for (var i = 0; i < tempArr.length; i++) {
    //                 _html += '<a href="javascrbaseUrlt:;" rulesField="' + tempArr[i].rulesField + '" rulesNumber="' + tempArr[i].rulesNumber + '">' + tempArr[i].rulesName + '</a>'
    //             }
    //             $('.referralOptionBox').html(_html);
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //             // 其他操作
    //         }
    //     },
    //     error: function(err) {
    //         console.log(err);
    //     },
    // });
    // 发送病历次数统计--选项选择
    // 已选项 索引 数组
    var referralOptionArr = [];
    // 选项点击事件
    $('.referralOptionBox').delegate('a', 'click', function () {
        // 判断当前是否已经选中
        if (referralOptionArr.indexOf($(this).index()) != -1) {
            // 已选中就在数组中把 当前选项的索引从数组中删除
            referralOptionArr.splice(referralOptionArr.indexOf($(this).index()), 1);
        } else {
            // 判断数组长度
            if (referralOptionArr.length < 2) {
                // 长度小于2 就把当前的选项的索引从后面加入到数组中
                referralOptionArr.push($(this).index());
            } else {
                // 长度大于2 就从最前面删除一个并把当前选项索引从后面加入到数组中
                referralOptionArr.shift();
                referralOptionArr.push($(this).index());
            }
        }
        // 根据索引数组 渲染焦点
        $('.referralOptionBox > a').removeClass('active');
        for (var i = 0; i < referralOptionArr.length; i++) {
            $('.referralOptionBox > a').eq(referralOptionArr[i]).addClass("active");
        }
    });

    // 转诊病历次数 统计 按钮
    $('.referralBtn').click(function () {
        referralOptionArr.sort(function (a, b) {
            return a - b;
        })
        // 时间选择
        if (referralStartDate == '' || referralEndDate == '') {
            layer.msg('数据不完整')
        } else if (referralOptionArr.length == 0) {
            layer.msg('数据不完整')
        } else if (referralOptionArr.length >= 2) {
            var numberStr = '';
            var condition1 = $('.referralOptionBox > a').eq(referralOptionArr[0]).attr('rulesfield');
            var condition2 = $('.referralOptionBox > a').eq(referralOptionArr[1]).attr('rulesfield');
            for (var i = 0; i < referralOptionArr.length; i++) {
                numberStr += $('.referralOptionBox > a').eq(referralOptionArr[i]).attr('rulesNumber');
            }
            $.ajax({
                type: 'POST',
                url: baseUrl + 'statisticalRules/validateRules',
                dataType: 'json',
                data: {
                    "number": numberStr,
                    "mode": $('.referralSelect').val(),
                    "startDate": referralStartDate,
                    "endDate": referralEndDate,
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    console.log(data)
                    if (data.status == 200) {
                        // 两个选项的
                        $.ajax({
                            type: 'POST',
                            url: baseUrl + 'statistics/referralStatistics',
                            dataType: 'json',
                            data: {
                                "startDate": referralStartDate,
                                "endDate": referralEndDate,
                                "type": $('.referralSelect').val() == '1' ? '1' : '0',
                                "condition1": condition1,
                                "condition2": condition2,
                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            success: function (data) {
                                console.log(data)
                                if (data.status == 200) {
                                    var tempArr = data.statisticsBean;
                                    if (tempArr.length == 0) {
                                        layer.msg('统计内容无数据');
                                        $('.referralTable').hide();
                                    } else {
                                        var headArr = [];
                                        var bodyArr = [];
                                        for (var i = 0; i < tempArr.length; i++) {
                                            if (headArr.indexOf(tempArr[i].y) == -1) {
                                                headArr.push(tempArr[i].y);
                                            }
                                            if (bodyArr.indexOf(tempArr[i].x) == -1) {
                                                bodyArr.push(tempArr[i].x);
                                            }
                                        }
                                        var headHtml = '<tr><th></th>';
                                        var bodyHtml = '';
                                        for (var i = 0; i < headArr.length; i++) {
                                            headHtml += '<th>' + headArr[i] + '</th>';
                                        }
                                        for (var y = 0; y < bodyArr.length; y++) {
                                            var itemArr = [];
                                            var itemTextArr = [];
                                            for (var x = 0; x < tempArr.length; x++) {
                                                if (tempArr[x].x == bodyArr[y]) {
                                                    itemArr.push(tempArr[x]);
                                                    itemTextArr.push(tempArr[x].y);
                                                }
                                            }
                                            bodyHtml += '<tr>\
                                                <td>' + bodyArr[y] + '</td>';
                                            for (var z = 0; z < headArr.length; z++) {
                                                console.log(itemArr)
                                                if (itemTextArr.indexOf(headArr[z]) != -1) {
                                                    bodyHtml += '<td>' + itemArr[itemTextArr.indexOf(headArr[z])].size + '</td>';
                                                } else {
                                                    bodyHtml += '<td>0</td>';
                                                }
                                            }
                                            bodyHtml += '</tr>';
                                        }
                                        headHtml += '</tr>';
                                        $('.tableBtn_two').addClass('active');
                                        $('.consultationTable').show();
                                        $('.referralChartBox').hide();
                                        $('.referralHeadBox').html(headHtml);
                                        $('.referralBodyBox').html(bodyHtml);
                                    }
                                } else if (data.status == 250) {
                                    // 未登录操作
                                    window.location = '/yilaiyiwang/login/login.html';
                                } else {
                                    // 其他操作
                                }
                            },
                            error: function (err) {
                                console.log(err);

                            },
                        })

                    } else if (data.status == 250) {
                        // 未登录操作
                        window.location = '/yilaiyiwang/login/login.html';
                    } else if (data.status == 400) {
                        layer.msg('统计组合不存在')
                    } else {
                        // 其他操作
                    }
                },
                error: function (err) {
                    console.log(err);

                },
            })
        } else {

            // 只有一个选项 的 情况
            var optionName = $('.referralOptionBox > a').eq(referralOptionArr[0]).html();
            $.ajax({
                type: 'POST',
                url: baseUrl + 'statistics/referralStatisticsSingle',
                dataType: 'json',
                data: {
                    "startDate": referralStartDate,
                    "endDate": referralEndDate,
                    "type": $('.referralSelect').val() == '1' ? '1' : '0',
                    "condition": $('.referralOptionBox > a').eq(referralOptionArr[0]).attr('rulesfield'),
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    console.log(data)
                    if (data.status == 200) {
                        $('.referralTable').hide();
                        $('.referralChartBox').show();
                        var tempArr = data.statisticsBean;
                        if (tempArr.length == 0) {
                            layer.msg('统计内容无数据');
                        } else {
                            var xData = []; // x轴 数据
                            var yData = []; // y轴 数据
                            if (optionName == '发件医院' && $('.referralSelect').val() == '2') {
                                for (var i = 0; i < tempArr.length; i++) {
                                    xData.push(tempArr[i].x);
                                    yData.push(tempArr[i].size);
                                }
                                chart(xData, optionName, yData, '数量', 'line', $('.referralChartBox')); //xData, xName, yData, yName, chartType
                            } else if (optionName == '收件医院' && $('.referralSelect').val() == '1') {
                                for (var i = 0; i < tempArr.length; i++) {
                                    xData.push(tempArr[i].x);
                                    yData.push(tempArr[i].size);
                                }
                                chart(xData, optionName, yData, '数量', 'line', $('.referralChartBox')); //xData, xName, yData, yName, chartType
                            } else {
                                for (var i = 0; i < tempArr.length; i++) {
                                    xData.push(tempArr[i].x);
                                    yData.push(tempArr[i].size);
                                }
                                chart(xData, optionName, yData, '数量', 'bar', $('.referralChartBox')); //xData, xName, yData, yName, chartType
                            }
                            var tempArr = data.statisticsBean;
                            var headArr = [];
                            var bodyArr = [];
                            for (var i = 0; i < tempArr.length; i++) {
                                if (headArr.indexOf(tempArr[i].y) == -1) {
                                    headArr.push(tempArr[i].y);
                                }
                                if (bodyArr.indexOf(tempArr[i].x) == -1) {
                                    bodyArr.push(tempArr[i].x);
                                }
                            }
                            var headHtml = '<tr><th></th>';
                            var bodyHtml = '';
                            for (var i = 0; i < headArr.length; i++) {
                                headHtml += '<th>数量</th>';
                            }
                            for (var y = 0; y < bodyArr.length; y++) {
                                var itemArr = [];
                                for (var x = 0; x < tempArr.length; x++) {
                                    if (tempArr[x].x == bodyArr[y]) {
                                        itemArr.push(tempArr[x])
                                    }
                                }
                                bodyHtml += '<tr>\
                                                            <td>' + bodyArr[y] + '</td>';
                                for (var z = 0; z < headArr.length; z++) {
                                    if (z < itemArr.length) {
                                        bodyHtml += '<td>' + itemArr[z].size + '</td>';

                                    } else {
                                        bodyHtml += '<td>0</td>';
                                    }
                                }
                                bodyHtml += '</tr>';
                            }
                            headHtml += '</tr>';
                            $('.referralHeadBox2').html(headHtml);
                            $('.referralBodyBox2').html(bodyHtml);
                            $('.tableBtn_two').addClass('active');
                            $('.consultationTable').hide();
                            $('.consultationTable2').hide();
                            $('.consultationChartBox').show();
                        }
                    } else if (data.status == 250) {
                        // 未登录操作
                        window.location = '/yilaiyiwang/login/login.html';
                    } else {
                        // 其他操作
                    }
                },
                error: function (err) {
                    console.log(err);

                },
            })
        }
    })

    // 会诊高级统计 选项渲染
    // $.ajax({
    //     type: 'GET',
    //     url: baseUrl + 'statisticalRules/seniorStatisticalList',
    //     dataType: 'json',
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function(data) {
    //         console.log(data);
    //         if (data.status == 200) {
    //             var _html = '';
    //             var tempArr = data.statisticalRulesList;
    //             for (var i = 0; i < tempArr.length; i++) {
    //                 _html += '<a href="javascrbaseUrlt:;" rulesField="' + tempArr[i].rulesField + '" rulesNumber="' + tempArr[i].rulesNumber + '">' + tempArr[i].rulesName + '</a>'
    //             }
    //             $('.seniorOptionBox').html(_html);
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //             // 其他操作
    //         }
    //     },
    //     error: function(err) {
    //         console.log(err);
    //     },
    // });
    // 发送病历次数统计--选项选择
    // 已选项 索引 数组
    var seniorOptionArr = [];
    // 选项点击事件
    $('.seniorOptionBox').delegate('a', 'click', function () {
        // 判断当前是否已经选中
        if (seniorOptionArr.indexOf($(this).index()) != -1) {
            // 已选中就在数组中把 当前选项的索引从数组中删除
            seniorOptionArr.splice(seniorOptionArr.indexOf($(this).index()), 1);
        } else {
            // 判断数组长度
            if (seniorOptionArr.length < 2) {
                // 长度小于2 就把当前的选项的索引从后面加入到数组中
                seniorOptionArr.push($(this).index());
            } else {
                // 长度大于2 就从最前面删除一个并把当前选项索引从后面加入到数组中
                seniorOptionArr.shift();
                seniorOptionArr.push($(this).index());
            }
        }
        // 根据索引数组 渲染焦点
        $('.seniorOptionBox > a').removeClass('active');
        for (var i = 0; i < seniorOptionArr.length; i++) {
            $('.seniorOptionBox > a').eq(seniorOptionArr[i]).addClass("active");
        }
    })
    // 会诊高级次数 统计 按钮
    $('.seniorBtn').click(function () {
        seniorOptionArr.sort(function (a, b) {
            return a - b;
        })
        // 时间选择
        if (seniorStartDate == '' || seniorEndDate == '') {
            layer.msg('数据不完整')
        } else if (seniorOptionArr.length == 0) {
            layer.msg('数据不完整')
        } else if (seniorOptionArr.length >= 2) {
            var numberStr = '';
            var condition1 = $('.seniorOptionBox > a').eq(seniorOptionArr[0]).attr('rulesfield');
            var conditionName1 = $('.seniorOptionBox > a').eq(seniorOptionArr[0]).html();
            var condition2 = $('.seniorOptionBox > a').eq(seniorOptionArr[1]).attr('rulesfield');
            var conditionName2 = $('.seniorOptionBox > a').eq(seniorOptionArr[1]).html();
            for (var i = 0; i < seniorOptionArr.length; i++) {
                numberStr += $('.seniorOptionBox > a').eq(seniorOptionArr[i]).attr('rulesNumber');
            }
            $.ajax({
                type: 'POST',
                url: baseUrl + 'statisticalRules/seniorValidateRules',
                dataType: 'json',
                data: {
                    "number": numberStr,
                    "mode": $('.referralSelect').val(),
                    "startDate": seniorStartDate,
                    "endDate": seniorEndDate,
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    console.log(data)
                    if (data.status == 200) {
                        if ($('.seniorMode').val() == "%Y") {
                            // 年
                            var url = "dateUtil/findYear";
                        } else if ($('.seniorMode').val() == "%Y-%m") {
                            // 月
                            var url = "dateUtil/findMonth";
                        } else if ($('.seniorMode').val() == "%Y-%m-%d") {
                            // 日
                            var url = "dateUtil/findDay";
                        }
                        $.ajax({
                            type: 'POST',
                            url: baseUrl + url,
                            dataType: 'json',
                            data: {
                                "startDate": seniorStartDate,
                                "endDate": seniorEndDate,
                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            success: function (data) {
                                var dateArr = data;
                                // 两个选项的
                                $.ajax({
                                    type: 'POST',
                                    url: baseUrl + 'statistics/seniorStatistics',
                                    dataType: 'json',
                                    data: {
                                        "startDate": seniorStartDate,
                                        "endDate": seniorEndDate,
                                        "type": $('.seniorSelect').val() == '1' ? '1' : '0',
                                        "condition1": condition1,
                                        "condition2": condition2,
                                        "mode": $('.seniorMode').val(),
                                    },
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    crossDomain: true,
                                    success: function (data) {
                                        console.log(data)
                                        if (data.status == 200) {
                                            var tempArr = data.statisticsBean;
                                            var xData = []; // x轴 数据
                                            var yData = []; // y轴 数据
                                            var tempDataArr = [];
                                            for (var i = 0; i < tempArr.length; i++) {
                                                tempDataArr.push(tempArr[i].x);
                                            }
                                            for (var i = 0; i < dateArr.length; i++) {
                                                if (tempDataArr.indexOf(dateArr[i]) != -1) {
                                                    yData.push(tempArr[tempDataArr.indexOf(dateArr[i])].size)
                                                } else {
                                                    yData.push(0);
                                                }
                                            }
                                            xData = dateArr;
                                            chart(xData, conditionName1 + '/' + conditionName2, yData, '数量', 'line', $('.seniorChartBox'));
                                            var headHtml = '<tr><th></th><th>数量</th></tr>';
                                            var bodyHtml = '';
                                            for (var i = 0; i < xData.length; i++) {
                                                bodyHtml += '<tr><td>' + xData[i] + '</td><td>' + yData[i] + '</td></tr>'
                                            }
                                            $('.referralHeadBox3').html(headHtml);
                                            $('.referralBodyBox3').html(bodyHtml);
                                            $('.consultationTable3').hide();
                                            $('.tableBtn_three').addClass('active');
                                        } else if (data.status == 250) {
                                            // 未登录操作
                                            window.location = '/yilaiyiwang/login/login.html';
                                        } else {
                                            // 其他操作
                                        }
                                    },
                                    error: function (err) {
                                        console.log(err);

                                    },
                                })
                            },
                            error: function (err) {
                                console.log(err);
                            },
                        })

                    } else if (data.status == 250) {
                        // 未登录操作
                        window.location = '/yilaiyiwang/login/login.html';
                    } else if (data.status == 400) {
                        layer.msg('统计组合不存在')
                    } else {
                        // 其他操作
                    }
                },
                error: function (err) {
                    console.log(err);

                },
            })
        } else {
            // 只有一个选项 的 情况
            var optionName = $('.seniorOptionBox > a').eq(seniorOptionArr[0]).html();
            if ($('.seniorMode').val() == "%Y") {
                // 年
                var url = "dateUtil/findYear";
            } else if ($('.seniorMode').val() == "%Y-%m") {
                // 月
                var url = "dateUtil/findMonth";
            } else if ($('.seniorMode').val() == "%Y-%m-%d") {
                // 日
                var url = "dateUtil/findDay";
            }
            $.ajax({
                type: 'POST',
                url: baseUrl + url,
                dataType: 'json',
                data: {
                    "startDate": seniorStartDate,
                    "endDate": seniorEndDate,
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    var dateArr = data;
                    $.ajax({
                        type: 'POST',
                        url: baseUrl + 'statistics/seniorStatisticsSingle',
                        dataType: 'json',
                        data: {
                            "startDate": seniorStartDate,
                            "endDate": seniorEndDate,
                            "mode": $('.seniorMode').val(),
                            "type": $('.seniorSelect').val() == '1' ? '1' : '0',
                            "condition": $('.seniorOptionBox > a').eq(seniorOptionArr[0]).attr('rulesfield'),
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success: function (data) {
                            console.log(data)
                            if (data.status == 200) {
                                var tempArr = data.statisticsBean;

                                var xData = []; // x轴 数据
                                var yData = []; // y轴 数据
                                var tempDataArr = [];
                                for (var i = 0; i < tempArr.length; i++) {
                                    tempDataArr.push(tempArr[i].x);
                                }
                                for (var i = 0; i < dateArr.length; i++) {
                                    if (tempDataArr.indexOf(dateArr[i]) != -1) {
                                        yData.push(tempArr[tempDataArr.indexOf(dateArr[i])].size);
                                    } else {
                                        yData.push(0);
                                    }
                                }
                                xData = dateArr;
                                chart(xData, optionName, yData, '数量', 'line', $('.seniorChartBox')); //xData, xName, yData, yName, chartType
                                var headHtml = '<tr><th></th><th>数量</th></tr>';
                                var bodyHtml = '';
                                for (var i = 0; i < xData.length; i++) {
                                    bodyHtml += '<tr><td>' + xData[i] + '</td><td>' + yData[i] + '</td></tr>'
                                }
                                $('.referralHeadBox3').html(headHtml);
                                $('.referralBodyBox3').html(bodyHtml);
                                $('.consultationTable3').hide();
                                $('.tableBtn_three').addClass('active');
                            } else if (data.status == 250) {
                                // 未登录操作
                                window.location = '/yilaiyiwang/login/login.html';
                            } else {
                                // 其他操作
                            }
                        },
                        error: function (err) {
                            console.log(err);

                        },
                    })
                },
                error: function (err) {
                    console.log(err);
                },
            })

        }
    })

    // 会诊费用统计 选项渲染
    // $.ajax({
    //     type: 'GET',
    //     url: baseUrl + 'statisticalRules/statisticalPriceList',
    //     dataType: 'json',
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function(data) {
    //         console.log(data);
    //         if (data.status == 200) {
    //             var _html = '';
    //             var tempArr = data.statisticalRulesList;
    //             for (var i = 0; i < tempArr.length; i++) {
    //                 _html += '<a href="javascrbaseUrlt:;" rulesField="' + tempArr[i].rulesField + '" rulesNumber="' + tempArr[i].rulesNumber + '">' + tempArr[i].rulesName + '</a>'
    //             }
    //             $('.costOptionBox').html(_html);
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //             // 其他操作
    //         }
    //     },
    //     error: function(err) {
    //         console.log(err);
    //     },
    // });
    // 发送病历次数统计--选项选择
    // 选项点击事件
    $('.costOptionBox').delegate('a', 'click', function () {
        $(this).addClass('active').siblings('a').removeClass('active');
    })

    // 会诊费用 统计 按钮
    $('.costBtn').click(function () {
        // 时间选择
        if (costStartDate == '' || costSndDate == '') {
            layer.msg('数据不完整')
        } else if ($('.costOptionBox > a.active').length == 0) {
            layer.msg('数据不完整')
        } else {
            // 只有一个选项 的 情况
            var optionName = $('.costOptionBox > a.active').html();
            $.ajax({
                type: 'POST',
                url: baseUrl + 'statistics/costStatistics',
                dataType: 'json',
                data: {
                    "startDate": costStartDate,
                    "endDate": costSndDate,
                    "type": $('.costSelect').val() == '1' ? '1' : '0',
                    "condition": $('.costOptionBox > a.active').attr('rulesfield'),
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    console.log(data)
                    if (data.status == 200) {
                        var tempArr = data.statisticsBean;
                        if (tempArr.length == 0) {
                            layer.msg('统计内容无数据');
                            $('#datatable_four').hide();
                        } else {
                            var _bodyHtml = '';
                            if (optionName == '收件医院') {
                                $('.headBox').html('<tr>\
                                <th>' + optionName + '</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
                                for (var i = 0; i < tempArr.length; i++) {
                                    _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].x + '</td>\
                                    <td>' + tempArr[i].money + '</td>\
                                </tr> ';
                                }
                            } else if (optionName == '收件科室') {
                                $('.headBox').html('<tr>\
                                <th>' + optionName + '</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
                                for (var i = 0; i < tempArr.length; i++) {
                                    _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].x + '</td>\
                                    <td>' + tempArr[i].money + '</td>\
                                </tr> ';
                                }
                            } else if (optionName == '收件医师') {
                                $('.headBox').html('<tr>\
                                <th>' + optionName + '</th>\
                                <th>所在医院</th>\
                                <th>所在科室</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
                                for (var i = 0; i < tempArr.length; i++) {
                                    _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].x + '</td>\
                                    <td>' + tempArr[i].hospitalName + '</td>\
                                    <td>' + tempArr[i].deptName + '</td>\
                                    <td>' + tempArr[i].money + '</td>\
                                </tr> ';
                                }
                            } else if (optionName == '发件医院') {
                                $('.headBox').html('<tr>\
                                <th>' + optionName + '</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
                                for (var i = 0; i < tempArr.length; i++) {
                                    _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].x + '</td>\
                                    <td>' + tempArr[i].money + '</td>\
                                </tr> ';
                                }
                            } else if (optionName == '发件科室') {
                                $('.headBox').html('<tr>\
                                <th>' + optionName + '</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
                                for (var i = 0; i < tempArr.length; i++) {
                                    _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].x + '</td>\
                                    <td>' + tempArr[i].money + '</td>\
                                </tr> ';
                                }
                            } else if (optionName == '发件医师') {
                                $('.headBox').html('<tr>\
                                <th>' + optionName + '</th>\
                                <th>所在医院</th>\
                                <th>所在科室</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
                                for (var i = 0; i < tempArr.length; i++) {
                                    _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].x + '</td>\
                                    <td>' + tempArr[i].hospitalName + '</td>\
                                    <td>' + tempArr[i].deptName + '</td>\
                                    <td>' + tempArr[i].money + '</td>\
                                </tr> ';
                                }
                            }
                            $('.bodyBox').html(_bodyHtml);
                            $('.tableBtn_four').addClass('active');
                            $('#datatable_four').show();
                        }
                    } else if (data.status == 250) {
                        // 未登录操作
                        window.location = '/yilaiyiwang/login/login.html';
                    } else {
                        // 其他操作
                    }
                },
                error: function (err) {
                    console.log(err);

                },
            })
        }
    })

    // 下载表格
    $('.tableBtn_one').click(function () {
        if ($(this).hasClass('active')) {
            if ($(this).parents('.itemContent').find('.consultationOptionBox > a.active').length == 1) {
                $("#datatable_one2").table2excel({
                    exclude: ".noExl",
                    // 导出的Excel文档的名称，（没看到作用）
                    name: "Excel Document Name",
                    // Excel文件的名称
                    filename: "myFileName" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
                    // fileext: ".xls",
                    filename: "myExcelTable.xls"
                });
            } else {
                if ($("#datatable_one").height() == '0') {
                    // layer.msg('表格为空');
                    return false;
                } else {
                    $("#datatable_one").table2excel({
                        exclude: ".noExl",
                        // 导出的Excel文档的名称，（没看到作用）
                        name: "Excel Document Name",
                        // Excel文件的名称
                        filename: "myFileName" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
                        // fileext: ".xls",
                        filename: "myExcelTable.xls"
                    });
                }
            }
        }
    })
    // 转诊病例次数统计 下载按钮
    $('.tableBtn_two').click(function () {
        if ($(this).hasClass('active')) {
            if ($(this).parents('.itemContent').find('.referralOptionBox > a.active').length == 1) {
                $("#datatable_two2").table2excel({
                    exclude: ".noExl",
                    // 导出的Excel文档的名称，（没看到作用）
                    name: "Excel Document Name",
                    // Excel文件的名称
                    filename: "myFileName" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
                    // fileext: ".xls",
                    filename: "myExcelTable.xls"
                });
            } else {
                if ($("#datatable_two").height() == '0') {
                    // layer.msg('表格为空');
                    return false;
                } else {
                    $("#datatable_two").table2excel({
                        exclude: ".noExl",
                        // 导出的Excel文档的名称，（没看到作用）
                        name: "Excel Document Name",
                        // Excel文件的名称
                        filename: "myFileName" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
                        // fileext: ".xls",
                        filename: "myExcelTable.xls"
                    });
                }
            }
        }
    })
    /* 会诊高级统计下载表格按钮 */
    $('.tableBtn_three').click(function () {
        if ($(this).hasClass('active')) {
            if ($("#datatable_three2").height() == '0') {
                // layer.msg('表格为空');
                return false;
            } else {
                $("#datatable_three2").table2excel({
                    exclude: ".noExl",
                    // 导出的Excel文档的名称，（没看到作用）
                    name: "Excel Document Name",
                    // Excel文件的名称
                    filename: "myFileName" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
                    // fileext: ".xls",
                    filename: "myExcelTable.xls"
                });
            }
        }
    })
    // 会诊费用统计下载表格按钮
    $('.tableBtn_four').click(function () {
        if ($(this).hasClass('active')) {
            if ($("#datatable_four").height() == '0') {
                // layer.msg('表格为空');
                return false;
            } else {
                // console.log(1)
                $("#datatable_four").table2excel({
                    exclude: ".noExl",
                    // 导出的Excel文档的名称，（没看到作用）
                    name: "Excel Document Name",
                    // Excel文件的名称
                    filename: "myFileName" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
                    // fileext: ".xls",
                    filename: "myExcelTable.xls"
                });
            }
        }
    })
    renderStatisticaltem();

})
