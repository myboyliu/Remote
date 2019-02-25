let referralRule = {
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
let referralSingleRule = {
    CON_SEND_HOSPITAL: "groupByApplyHospital",
    CON_SEND_BRANCH: "groupByApplyBranch",
    CON_SEND_DOCTOR: "groupByApplyUserSpecialistType",
    CON_RECEIVE_HOSPITAL: "groupByInviteHospital",
    CON_RECEIVE_BRANCH: "groupByInviteBranch",
    CON_RECEIVE_DOCTOR: "groupByInviteUserSpecialistType"
};
/*
let referralRule = {
    REF_SEND_HOSPITAL: {
        REF_SEND_BRANCH: "REF_SEND_BRANCH",
        REF_SEND_DOCTOR: "REF_SEND_DOCTOR",
        REF_RECEIVE_BRANCH: "REF_RECEIVE_BRANCH",
        REF_RECEIVE_DOCTOR: "REF_RECEIVE_DOCTOR"
    },
    REF_SEND_BRANCH: {REF_SEND_DOCTOR: "REF_SEND_DOCTOR"},
    REF_SEND_DOCTOR: {
        REF_RECEIVE_HOSPITAL: "REF_RECEIVE_HOSPITAL",
        REF_RECEIVE_BRANCH: "REF_RECEIVE_BRANCH",
        REF_RECEIVE_DOCTOR: "REF_RECEIVE_DOCTOR"
    },
    REF_RECEIVE_HOSPITAL: {REF_RECEIVE_BRANCH: "REF_RECEIVE_BRANCH", REF_RECEIVE_DOCTOR: "REF_RECEIVE_DOCTOR"},
    REF_RECEIVE_BRANCH: {REF_RECEIVE_DOCTOR: "REF_RECEIVE_DOCTOR"}
};
*/
function renderReferralDoubleList(dataJson) {
    let myChart = echarts.init(document.getElementById('ReferralChartBox'));
    let firstItem = $('.consultationOptionBox > a').eq(referralOptionArr[0]).attr('id');
    let secondItem = $('.consultationOptionBox > a').eq(referralOptionArr[1]).attr('id');
    if (dataJson.length === 0) {
        layer.msg('统计结果无数据');
        return false;
    }
    console.log(dataJson)
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
                        if (item.inviteUserSpecialistTypeName === null) {
                            if (legendData.indexOf("未选择医生") === -1) {
                                legendData.push("未选择医生");
                                optionSeries.push({
                                    name: "未选择医生",
                                    type: 'bar',
                                    barGap: 0,
                                    label: labelOption,
                                    data: []
                                });
                            }
                            continue;
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
                                    if (dataJsonItem.inviteUserSpecialistTypeName === null && optionSeriesItem.name === "未选择医生") {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                        continue;
                                    }
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
                        if (item.inviteUserSpecialistTypeName === null) {
                            if (legendData.indexOf("未选择医生") === -1) {
                                legendData.push("未选择医生");
                                optionSeries.push({
                                    name: "未选择医生",
                                    type: 'bar',
                                    barGap: 0,
                                    label: labelOption,
                                    data: []
                                });
                            }
                            continue;
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
                                    if (dataJsonItem.inviteUserSpecialistTypeName === null && optionSeriesItem.name === "未选择医生") {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                        continue;
                                    }
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
                        if (item.inviteUserSpecialistTypeName === null) {
                            if (legendData.indexOf("未选择医生") === -1) {
                                legendData.push("未选择医生");
                                optionSeries.push({
                                    name: "未选择医生",
                                    type: 'bar',
                                    barGap: 0,
                                    label: labelOption,
                                    data: []
                                });
                            }
                            continue;
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
                                    if (dataJsonItem.inviteUserSpecialistTypeName === null && optionSeriesItem.name === "未选择医生") {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                        continue;
                                    }
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
                        if (item.inviteUserSpecialistTypeName === null) {
                            if (legendData.indexOf("未选择医生") === -1) {
                                legendData.push("未选择医生");
                                optionSeries.push({
                                    name: "未选择医生",
                                    type: 'bar',
                                    barGap: 0,
                                    label: labelOption,
                                    data: []
                                });
                            }
                            continue;
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
                                    if (dataJsonItem.inviteUserSpecialistTypeName === null && optionSeriesItem.name === "未选择医生") {
                                        optionSeriesItem.data[xData.indexOf(xItem)] = dataJsonItem.groupCount;
                                        continue;
                                    }
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
        series: optionSeries
    };
    myChart.setOption(option);
}

function renderReferralSingleList(dataJson) {

    if (dataJson.length == 0) {
        layer.msg('统计结果无数据')
        return false;
    }
    let optionName = $('.referralOptionBox > a').eq(referralOptionArr[0]).attr('id');
    let xName;
    let xData = [];
    let yName = "数量";
    let chartType = 'bar';
    let yData = [];
    switch (optionName) {
        case "CON_SEND_HOSPITAL":
            xName = "发件医院"
            if ($('.referralSelect').val() === "2"){
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
            if ($('.consultationSelect').val() === "1"){
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
    let myChart = echarts.init(document.getElementById('ReferralChartBox'));
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