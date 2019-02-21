let consultationRule = {
    CON_SEND_HOSPITAL: {
        CON_SEND_BRANCH: ["groupByApplyHospital", "groupByApplyBranch"],
        CON_SEND_DOCTOR: ["groupByApplyHospital", "groupByApplyUserSpecialistType"],
        CON_RECEIVE_BRANCH: ["groupByApplyHospital", "groupByInviteBranch"],
        CON_RECEIVE_DOCTOR: ["groupByApplyHospital", "groupByInviteUserSpecialistType"]
    },
    CON_SEND_BRANCH: {CON_SEND_DOCTOR: ["groupByApplyBranch", "groupByApplyUserSpecialistType"]},
    CON_SEND_DOCTOR: {
        CON_RECEIVE_HOSPITAL: ["groupByApplyUserSpecialistType", "groupByInviteHospital"],
        CON_RECEIVE_BRANCH: ["groupByApplyUserSpecialistType", "groupByInviteBranch"],
        CON_RECEIVE_DOCTOR: ["groupByApplyUserSpecialistType", "groupByInviteUserSpecialistType"]
    },
    CON_RECEIVE_HOSPITAL: {
        CON_RECEIVE_BRANCH: ["groupByInviteHospital", "groupByInviteBranch"],
        CON_RECEIVE_DOCTOR: ["groupByInviteHospital", "groupByInviteUserSpecialistType"]
    },
    CON_RECEIVE_BRANCH: {CON_RECEIVE_DOCTOR: ["groupByInviteBranch", "groupByInviteUserSpecialistType"]}
};
let consultationSingleRule = {
    CON_SEND_HOSPITAL: "",
    CON_SEND_BRANCH: "groupByApplyBranch",
    CON_SEND_DOCTOR: "groupByApplyUserSpecialistType",
    CON_RECEIVE_HOSPITAL: "groupByInviteHospital",
    CON_RECEIVE_BRANCH: "groupByInviteBranch",
    CON_RECEIVE_DOCTOR: "groupByInviteUserSpecialistType"
};
let expertRule = {
    EXP_VIDEO_CON: {EXP_SINGLE_CON: "1", EXP_MULTIPLE_CON: "0"},
    EXP_PICTURE_CON: {EXP_SINGLE_CON: "1", EXP_MULTIPLE_CON: "0"}
};
let expertSingleRule = {
    EXP_VIDEO_CON: "isVideo",
    EXP_PICTURE_CON: "isPicture",
    EXP_SINGLE_CON: "groupBySingle",
    EXP_MULTIPLE_CON: "groupByMdt"

};
let priceStatisticsRule = {
    groupByApplyHospital:"sumByTotalPrice",
    groupByApplyBranch:"sumByTotalPrice",
    groupByApplyUser:"sumByTotalPrice",
    groupByInviteHospital:"sumByTotalPrice",
    groupByInviteBranch:"sumByUserPrice",
    groupByInviteUser:"sumByUserPrice",
};

function renderConsultationDoubleList(dataJson) {
    let myChart = echarts.init(document.getElementById('SSSS'));
    let firstItem = $('.consultationOptionBox > a').eq(consultationOptionArr[0]).attr('id');
    let secondItem = $('.consultationOptionBox > a').eq(consultationOptionArr[1]).attr('id');
    if (dataJson.length === 0) {
        layer.msg('统计结果无数据');
        return false;
    }
    myChart.clear();
    let labelOption = {
        normal: {
            show: false,
            position: 'insideBottom',
            distance: 15,
            align: 'left',
            verticalAlign: 'middle',
            rotate: 90,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
                name: {
                    textBorderColor: '#fff'
                }
            }
        }
    };
    let optionColor = ['#003366', '#006699', '#4cabce', '#e5323e'];
    let xData = [];
    let legendData = [];
    let optionSeries = [];
    let xName = "";
    // 发起医院 + 发起科室
    switch (firstItem) {
        case "CON_SEND_HOSPITAL":
            xName = "发件医院";
            switch (secondItem) {
                case "CON_SEND_BRANCH":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.applyHospitalName) === -1) {
                            xData.push(item.applyHospitalName);
                        }
                        if (legendData.indexOf(item.applyCustomBranchName) === -1) {
                            legendData.push(item.applyCustomBranchName);
                            optionSeries.push({
                                name: item.applyCustomBranchName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.applyHospitalName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.applyCustomBranchName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case "CON_SEND_DOCTOR":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.applyHospitalName) === -1) {
                            xData.push(item.applyHospitalName);
                        }
                        if (legendData.indexOf(item.applyUserSpecialistTypeName) === -1) {
                            legendData.push(item.applyUserSpecialistTypeName);
                            optionSeries.push({
                                name: item.applyUserSpecialistTypeName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.applyHospitalName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.applyUserSpecialistTypeName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case "CON_RECEIVE_BRANCH":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.applyHospitalName) === -1) {
                            xData.push(item.applyHospitalName);
                        }
                        if (legendData.indexOf(item.inviteCustomBranchName) === -1) {
                            legendData.push(item.inviteCustomBranchName);
                            optionSeries.push({
                                name: item.inviteCustomBranchName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.applyHospitalName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.inviteCustomBranchName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case "CON_RECEIVE_DOCTOR":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.applyHospitalName) === -1) {
                            xData.push(item.applyHospitalName);
                        }
                        if (legendData.indexOf(item.inviteUserSpecialistTypeName) === -1) {
                            legendData.push(item.inviteUserSpecialistTypeName);
                            optionSeries.push({
                                name: item.inviteUserSpecialistTypeName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.applyHospitalName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.inviteUserSpecialistTypeName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                default:
                    break;
            }
            break;
        case "CON_SEND_BRANCH":
            xName = "发件科室";
            switch (secondItem) {
                case "CON_SEND_DOCTOR":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.applyCustomBranchName) === -1) {
                            xData.push(item.applyCustomBranchName);
                        }
                        if (legendData.indexOf(item.applyUserSpecialistTypeName) === -1) {
                            legendData.push(item.applyUserSpecialistTypeName);
                            optionSeries.push({
                                name: item.applyUserSpecialistTypeName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.applyCustomBranchName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.applyUserSpecialistTypeName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            break;
        case "CON_SEND_DOCTOR":
            xName = "发件医生职称";
            switch (secondItem) {
                case "CON_RECEIVE_HOSPITAL":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.applyUserSpecialistTypeName) === -1) {
                            xData.push(item.applyUserSpecialistTypeName);
                        }
                        if (legendData.indexOf(item.inviteHospitalName) === -1) {
                            legendData.push(item.inviteHospitalName);
                            optionSeries.push({
                                name: item.inviteHospitalName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.applyUserSpecialistTypeName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.inviteHospitalName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case "CON_RECEIVE_BRANCH":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.applyUserSpecialistTypeName) === -1) {
                            xData.push(item.applyUserSpecialistTypeName);
                        }
                        if (legendData.indexOf(item.inviteCustomBranchName) === -1) {
                            legendData.push(item.inviteCustomBranchName);
                            optionSeries.push({
                                name: item.inviteCustomBranchName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.applyUserSpecialistTypeName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.inviteCustomBranchName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case "CON_RECEIVE_DOCTOR":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.applyUserSpecialistTypeName) === -1) {
                            xData.push(item.applyUserSpecialistTypeName);
                        }
                        if (legendData.indexOf(item.inviteUserSpecialistTypeName) === -1) {
                            legendData.push(item.inviteUserSpecialistTypeName);
                            optionSeries.push({
                                name: item.inviteUserSpecialistTypeName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.applyUserSpecialistTypeName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.inviteUserSpecialistTypeName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            break;
        case "CON_RECEIVE_HOSPITAL":
            xName = "收件医院";
            switch (secondItem) {
                case "CON_RECEIVE_BRANCH":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.inviteHospitalName) === -1) {
                            xData.push(item.inviteHospitalName);
                        }
                        if (legendData.indexOf(item.inviteCustomBranchName) === -1) {
                            legendData.push(item.inviteCustomBranchName);
                            optionSeries.push({
                                name: item.inviteCustomBranchName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.inviteHospitalName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.inviteCustomBranchName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case "CON_RECEIVE_DOCTOR":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.inviteHospitalName) === -1) {
                            xData.push(item.inviteHospitalName);
                        }
                        if (legendData.indexOf(item.inviteUserSpecialistTypeName) === -1) {
                            legendData.push(item.inviteUserSpecialistTypeName);
                            optionSeries.push({
                                name: item.inviteUserSpecialistTypeName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.inviteHospitalName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.inviteUserSpecialistTypeName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            break;
        case "CON_RECEIVE_BRANCH":
            xName = "收件科室";
            switch (secondItem) {
                case "CON_RECEIVE_DOCTOR":
                    for (let item of dataJson) {
                        if (xData.indexOf(item.inviteCustomBranchName) === -1) {
                            xData.push(item.inviteCustomBranchName);
                        }
                        if (legendData.indexOf(item.inviteUserSpecialistTypeName) === -1) {
                            legendData.push(item.inviteUserSpecialistTypeName);
                            optionSeries.push({
                                name: item.inviteUserSpecialistTypeName,
                                type: 'bar',
                                barGap: 0,
                                label: labelOption,
                                data: []
                            });
                        }
                    }
                    for (let xItem of xData) {
                        for (let dataJsonItem of dataJson) {
                            if (xItem === dataJsonItem.inviteCustomBranchName) {
                                for (let optionSeriesItem of optionSeries) {
                                    if (optionSeriesItem.name === dataJsonItem.inviteUserSpecialistTypeName) {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            break;
    }
    let option = {
        color: optionColor,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: legendData
        },
        toolbox: {
            show: false,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                name: xName,
                type: 'category',
                axisTick: {show: false},
                data: xData
            }
        ],
        yAxis: [
            {
                name: "数量",
                type: 'value'
            }
        ],
        dataZoom: [{
            start: 0,
            end: 100,
        }],
        series: optionSeries
    };
    myChart.setOption(option);
}

function renderConsultationSingleList(dataJson) {

    if (dataJson.length == 0) {
        layer.msg('统计结果无数据')
        return false;
    }
    let optionName = $('.consultationOptionBox > a').eq(consultationOptionArr[0]).attr('id');
    let xName;
    let xData = [];
    let yName = "数量";
    let chartType = 'bar';
    let yData = [];
    switch (optionName) {
        case "CON_SEND_HOSPITAL":
            xName = "发件医院"
            if ($('.consultationSelect').val() === "2") {
                chartType = "line";
                for (let dataJsonElement of dataJson) {
                    xData.push(dataJsonElement.groupDay);
                    yData.push(dataJsonElement.groupCount);
                }
                break;
            }
            for (let dataJsonElement of dataJson) {
                xData.push(dataJsonElement.applyHospitalName);
                yData.push(dataJsonElement.groupCount);
            }
            break;
        case "CON_SEND_BRANCH":
            xName = "发件科室"
            for (let dataJsonElement of dataJson) {
                xData.push(dataJsonElement.applyCustomBranchName);
                yData.push(dataJsonElement.groupCount);
            }
            break;
        case "CON_SEND_DOCTOR":
            xName = "发件医师职称"
            for (let dataJsonElement of dataJson) {
                xData.push(dataJsonElement.applyUserSpecialistTypeName);
                yData.push(dataJsonElement.groupCount);
            }
            break;
        case "CON_RECEIVE_HOSPITAL":
            xName = "收件医院"
            if ($('.consultationSelect').val() === "1") {
                chartType = "line";
                for (let dataJsonElement of dataJson) {
                    xData.push(dataJsonElement.groupDay);
                    yData.push(dataJsonElement.groupCount);
                }
                break;
            }
            for (let dataJsonElement of dataJson) {
                xData.push(dataJsonElement.inviteHospitalName);
                yData.push(dataJsonElement.groupCount);
            }
            break;
        case "CON_RECEIVE_BRANCH":
            xName = "收件科室"
            for (let dataJsonElement of dataJson) {
                xData.push(dataJsonElement.inviteCustomBranchName);
                yData.push(dataJsonElement.groupCount);
            }
            break;
        case "CON_RECEIVE_DOCTOR":
            xName = "收件医师职称"
            for (let dataJsonElement of dataJson) {
                xData.push(dataJsonElement.inviteUserSpecialistTypeName);
                yData.push(dataJsonElement.groupCount);
            }
            break;
    }

    // chartType  // Chart类型   bar柱形 line折线
    let myChart = echarts.init(document.getElementById('SSSS'));
    myChart.clear();
    let option = {
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
    myChart.setOption(option);
}

function renderExpertDoubleList(dataJson) {

    if (dataJson.length == 0) {
        layer.msg('统计结果无数据')
        return false;
    }
    let firstItem = $('.seniorOptionBox > a').eq(seniorOptionArr[0]).attr('id');
    let secondItem = $('.seniorOptionBox > a').eq(seniorOptionArr[1]).attr('id');
    let xName;
    let xData = [];
    let yName = "数量";
    let yData = [];
    chartType = "line";
    // xName = "发件医院"
    for (let dataJsonElement of dataJson) {
        xData.push(dataJsonElement.groupDay);
        yData.push(dataJsonElement.groupCount);
    }
    let myChart = echarts.init(document.getElementById('ExpertChartBox'));
    myChart.clear();
    let option = {
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
    myChart.setOption(option);
}

function renderPriceStatisticsList(tempArr) {
    let optionName = $('.costOptionBox > a.active').attr('id');

    if (tempArr.length == 0) {
        layer.msg('统计内容无数据');
        $('#datatable_four').hide();
    } else {
        var _bodyHtml = '';
        console.log(optionName);
        if (optionName == "groupByInviteHospital") {
            $('.headBox').html('<tr>\
                                <th>收件医院</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
            for (var i = 0; i < tempArr.length; i++) {
                _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].inviteHospitalName + '</td>\
                                    <td>' + tempArr[i].sumPrice + '</td>\
                                </tr> ';
            }
        } else if (optionName == 'groupByInviteBranch') {
            $('.headBox').html('<tr>\
                                <th>收件科室</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
            for (var i = 0; i < tempArr.length; i++) {
                _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].inviteCustomBranchName + '</td>\
                                    <td>' + tempArr[i].sumPrice + '</td>\
                                </tr> ';
            }
        } else if (optionName == 'groupByInviteUser') {
            $('.headBox').html('<tr>\
                                <th>收件医师</th>\
                                <th>所在医院</th>\
                                <th>所在科室</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
            for (var i = 0; i < tempArr.length; i++) {
                _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].inviteUserName + '</td>\
                                    <td>' + tempArr[i].inviteHospitalName + '</td>\
                                    <td>' + tempArr[i].inviteCustomBranchName + '</td>\
                                    <td>' + tempArr[i].sumPrice + '</td>\
                                </tr> ';
            }
        } else if (optionName == 'groupByApplyHospital') {
            $('.headBox').html('<tr>\
                                <th>发件医院</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
            for (var i = 0; i < tempArr.length; i++) {
                _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].applyHospitalName + '</td>\
                                    <td>' + tempArr[i].sumPrice + '</td>\
                                </tr> ';
            }
        } else if (optionName == 'groupByApplyBranch') {
            $('.headBox').html('<tr>\
                                <th>发件科室</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
            for (var i = 0; i < tempArr.length; i++) {
                _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].applyCustomBranchName + '</td>\
                                    <td>' + tempArr[i].sumPrice + '</td>\
                                </tr> ';
            }
        } else if (optionName == 'groupByApplyUser') {
            $('.headBox').html('<tr>\
                                <th>发件医师</th>\
                                <th>所在医院</th>\
                                <th>所在科室</th>\
                                <th>诊费统计/元</th>\
                            </tr>');
            for (var i = 0; i < tempArr.length; i++) {
                _bodyHtml += '<tr>\
                                    <td>' + tempArr[i].applyUserName + '</td>\
                                    <td>' + tempArr[i].applyHospitalName + '</td>\
                                    <td>' + tempArr[i].applyCustomBranchName + '</td>\
                                    <td>' + tempArr[i].sumPrice + '</td>\
                                </tr> ';
            }
        }
        $('.bodyBox').html(_bodyHtml);
        $('.tableBtn_four').addClass('active');
        $('#datatable_four').show();
    }

}