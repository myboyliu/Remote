// 会诊 已选项 索引 数组
let consultationOptionArr = [];
// 转诊 已选项 索引 数组
let referralOptionArr = [];
// 高级 已选项 索引 数组
let seniorOptionArr = [];

let myChart;
/**
 * 渲染统计选项
 */
let costOptionObj = [{key: "groupByApplyHospital", value: "发件医院"}, {
    key: "groupByApplyBranch",
    value: "发件科室"
}, {key: "groupByInviteHospital", value: "收件医院"}, {
    key: "groupByInviteBranch",
    value: "收件科室"
}, {key: "groupByApplyUser", value: "发件医师"}, {key: "groupByInviteUser", value: "收件医师"}]

let consultationOptionObj = [{key: "CON_SEND_HOSPITAL", value: "发件医院"}, {
    key: "CON_SEND_BRANCH",
    value: "发件科室"
}, {key: "CON_SEND_DOCTOR", value: "发件医师职称"},
    {key: "CON_RECEIVE_HOSPITAL", value: "收件医院"}, {
        key: "CON_RECEIVE_BRANCH",
        value: "收件科室"
    }, {key: "CON_RECEIVE_DOCTOR", value: "收件医师职称"}];
let referralOptionObj = [{key: "REF_SEND_HOSPITAL", value: "发件医院"}, {
    key: "REF_SEND_BRANCH",
    value: "发件科室"
}, {key: "REF_SEND_DOCTOR", value: "发件医师职称"},
    {key: "REF_RECEIVE_HOSPITAL", value: "收件医院"}, {
        key: "REF_RECEIVE_BRANCH",
        value: "收件科室"
    }, {key: "REF_RECEIVE_DOCTOR", value: "收件医师职称"}];
let expertOptionObj = [{key: "EXP_VIDEO_CON", value: "视频会诊"}, {
    key: "EXP_PICTURE_CON",
    value: "图文会诊"
}, {key: "EXP_SINGLE_CON", value: "单学科会诊"},
    {key: "EXP_MULTIPLE_CON", value: "多学科会诊"}];

function renderStatisticaltem() {
    //会诊病历统计数据列表 选项渲染
    let consultationOption_html = '';
    for (let item of consultationOptionObj) {
        consultationOption_html += '<a href="javascript:;" id="' + item.key + '">' + item.value + '</a>'
    }
    $('.consultationOptionBox').html(consultationOption_html);
    //转诊病历统计数据列表 选项渲染
    let referralOption_html = '';
    for (let item of consultationOptionObj) {
        referralOption_html += '<a href="javascript:;" id="' + item.key + '">' + item.value + '</a>'
    }
    $('.referralOptionBox').html(referralOption_html);
    // 会诊高级统计 选项渲染
    let seniorOption_html = '';
    for (let item of expertOptionObj) {
        seniorOption_html += '<a href="javascript:;" id="' + item.key + '">' + item.value + '</a>'
    }
    $('.seniorOptionBox').html(seniorOption_html);
    // 会诊费用统计 选项渲染
    let costOption_html = '';
    for (let item of costOptionObj) {
        costOption_html += '<a href="javascript:;" id="' + item.key + '">' + item.value + '</a>'
    }
    $('.costOptionBox').html(costOption_html);
}

$(function () {
    function chart(xData, xName, yData, yName, chartType, domObj) {
        // var myChart = echarts.init(domObj[0]);
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
        } else if (consultationOptionArr.length === 2) {
            let firstItem = $('.consultationOptionBox > a').eq(consultationOptionArr[0]).attr('id');
            let secondItem = $('.consultationOptionBox > a').eq(consultationOptionArr[1]).attr('id');
            if (consultationRule[firstItem]) {
                if (consultationRule[firstItem][secondItem]) {
                    let formData = {
                        "startTime": consultationStartDate,
                        "endTime": consultationEndDate
                    };
                    $('.consultationSelect').val() === "1" ? formData["isInvite"] = "1" : formData["isApply"] = "1";
                    formData[consultationRule[firstItem][secondItem][0]] = "1";
                    formData[consultationRule[firstItem][secondItem][1]] = "1";
                    ajaxRequest("GET", getConsultationStatisticsCount, formData, true, "application/json", true, renderConsultationDoubleList, null, null);
                    return false;
                } else {
                    layer.msg('统计组合不存在');
                }
            } else {
                layer.msg('统计组合不存在');
            }
        } else {
            // 只有一个选项 的 情况
            let optionName = $('.consultationOptionBox > a').eq(consultationOptionArr[0]).attr('id');
            if (consultationSingleRule[optionName]) {
                let formData = {
                    "startTime": consultationStartDate,
                    "endTime": consultationEndDate
                };
                $('.consultationSelect').val() === "1" ? formData["isInvite"] = "1" : formData["isApply"] = "1";
                if (optionName === "CON_SEND_HOSPITAL" && $('.consultationSelect').val() === "2") {
                    formData["groupByDay"] = "1";
                }
                if (optionName === "CON_RECEIVE_HOSPITAL" && $('.consultationSelect').val() === "1") {
                    formData["groupByDay"] = "1";
                }
                formData[consultationSingleRule[optionName]] = "1";
                ajaxRequest("GET", getConsultationStatisticsCount, formData, true, "application/json", true, renderConsultationSingleList, null, null);
            }
        }
    })

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
            let firstItem = $('.referralOptionBox > a').eq(referralOptionArr[0]).attr('id');
            let secondItem = $('.referralOptionBox > a').eq(referralOptionArr[1]).attr('id');
            if (consultationRule[firstItem]) {
                if (consultationRule[firstItem][secondItem]) {
                    let formData = {
                        "startTime": referralStartDate,
                        "endTime": referralEndDate
                    };
                    $('.referralSelect').val() === "1" ? formData["isInvite"] = "1" : formData["isApply"] = "1";
                    formData[consultationRule[firstItem][secondItem][0]] = "1";
                    formData[consultationRule[firstItem][secondItem][1]] = "1";
                    ajaxRequest("GET", getReferralStatisticsCount, formData, true, "application/json", true, renderReferralDoubleList, null, null);
                    return false;
                } else {
                    layer.msg('统计组合不存在')
                }
            } else {
                layer.msg('统计组合不存在')
            }

        } else {
            // 只有一个选项 的 情况
            let optionName = $('.referralOptionBox > a').eq(referralOptionArr[0]).attr('id');
            if (referralSingleRule[optionName]) {
                let formData = {
                    "startTime": referralStartDate,
                    "endTime": referralEndDate
                };
                $('.referralSelect').val() === "1" ? formData["isInvite"] = "1" : formData["isApply"] = "1";
                if (optionName === "CON_SEND_HOSPITAL" && $('.referralSelect').val() === "2") {
                    formData["groupByDay"] = "1";
                }
                if (optionName === "CON_RECEIVE_HOSPITAL" && $('.referralSelect').val() === "1") {
                    formData["groupByDay"] = "1";
                }
                formData[referralSingleRule[optionName]] = "1";
                ajaxRequest("GET", getReferralStatisticsCount, formData, true, "application/json", true, renderReferralSingleList, null, null);
            }
        }
    })

    // 已选项 索引 数组
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
            let firstItem = $('.seniorOptionBox > a').eq(seniorOptionArr[0]).attr('id');
            let secondItem = $('.seniorOptionBox > a').eq(seniorOptionArr[1]).attr('id');
            if (expertRule[firstItem]) {
                if (expertRule[firstItem][secondItem]) {
                    let formData = {
                        "startTime": seniorStartDate,
                        "endTime": seniorEndDate
                    };
                    $('.seniorSelect').val() === "1" ? formData["isInvite"] = "1" : formData["isApply"] = "1";
                    formData[$('.seniorMode').val()] = "1";
                    formData["isMdt"] = expertRule[firstItem][secondItem];
                    firstItem === "EXP_VIDEO_CON" ? formData["isVideo"] = "1" : formData["isPicture"] = "1";
                    ajaxRequest("GET", getConsultationStatisticsCount, formData, true, "application/json", true, renderExpertDoubleList, null, null);
                    return false;
                } else {
                    layer.msg('统计组合不存在')
                }
            } else {
                layer.msg('统计组合不存在')
            }
        } else {
            // 只有一个选项 的 情况
            let optionName = $('.seniorOptionBox > a').eq(seniorOptionArr[0]).attr('id');
            if (expertSingleRule[optionName]) {
                let formData = {
                    "startTime": seniorStartDate,
                    "endTime": seniorEndDate
                };
                $('.seniorSelect').val() === "1" ? formData["isInvite"] = "1" : formData["isApply"] = "1";
                formData[$('.seniorMode').val()] = "1";
                if (optionName === "EXP_VIDEO_CON" || optionName === "EXP_PICTURE_CON") {
                    optionName === "EXP_VIDEO_CON" ? formData["isVideo"] = "1" : formData["isPicture"] = "1";
                } else {
                    formData["isMdt"] = optionName === "EXP_SINGLE_CON" ? "1" : "0";
                }
                ajaxRequest("GET", getConsultationStatisticsCount, formData, true, "application/json", true, renderExpertDoubleList, null, null);
                return false;
            }
        }
    })

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

            let optionName = $('.costOptionBox > a.active').attr('id');

            let formData = {
                "startTime": costStartDate,
                "endTime": costSndDate
            };
            $('.costSelect').val() === "1" ? formData["isInvite"] = "1" : formData["isApply"] = "1";
            formData[optionName] = "1";
            formData[priceStatisticsRule[optionName]] = "1";

            ajaxRequest("GET", getConsultationPriceStatistics, formData, true, "application/json", true, renderPriceStatisticsList, null, null);
            return false;
            // 只有一个选项 的 情况
            // var optionName = $('.costOptionBox > a.active').attr('id');
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
                    }
                }
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
