// let pageNo = 1;// 页码
// let pageSize = 10;// 每页多少条
let pageFlag = true;// 是否有下一页
let longTimeArr = [];// 长期医嘱
let temporaryDrugArr = [];// 临时药物
let temporaryTreatArr = [];// 临时诊疗
let surgeryArr = []; // 手术备品
let consultantReport = [];
let unitArr = ["g", "mg", "ug", "ml"];// 单位数组
let frequencyArr = ["q.1/2h", "q.h", "q.2h", "q.3h", "q.4h", "q.6h", "q.8h", "q.12h", "q.72h.",
    "q.d.",
    "b.i.d.",
    "t.i.d.",
    "q.i.d.",
    "Quingid",
    "q.n.",
    "q.o.d.",
    "q.3d",
    "q.w.",
    "Biw",
    "Tiw",
    "q.o.w.",
    "2W",
    "3W",
    "4W",
    "q.m.",
    "b.i.m.",
    'once',
    "St.",
    "p.r.n.",
    "s.o.s.",
    "DC",
    "12n",
    "12mn",
    "a.c.",
    "p.c.",
    "t.i.d. a.c.", "hs"];// 每日用次数组
let wayArr = ["gtt",
    "id",
    "ih",
    "im/m.",
    "iv",
    "ip",
    "ivgtt",
    "p.o.",
    "ad us.int.",
    "ad us.ext.",
    "lnhal",
    "ig"];// 给药方式数组
let applyFormId;
let reportEnjoin = [];
let oldDoctorEnjoin = {};
let _$ = layui.jquery;

// 模糊查询药品
function fuzzySearchMedical(obj, searchText, pageNoParam, pageSizeParam) {
    pageNo = pageNoParam;
    pageSize = pageSizeParam;

    let searchFormData = new FormData();
    searchFormData.append("param", searchText);
    ajaxRequest("POST", fuzzySearchMedicalApi, searchFormData, false, false, true, getMedicalListSuccess, null, null);

    function getMedicalListSuccess(data) {
        console.log(data);
        // 成功操作
        if (pageNo === 1 && data.medicalList.length === 0) {
            layer.msg("未搜到相关药品");
            obj.hide();
        } else {
            obj.siblings("input").focus();
            // 渲染数据列表
            let tempArr = data.medicalList;
            let _html = '';
            for (let i = 0; i < tempArr.length; i++) {
                _html += '<a name="' + tempArr[i].id + '" medicalNameChina="' + tempArr[i].medicalNameChina + '" href="javascript:;">' + tempArr[i].medicalNameChina + '<img src="../images/search_active.png" alt=""></a>'
            }
            obj.find(".searchResult").html(_html);
            // 渲染数据总条数
            obj.find(".searchNum").html(data.pageTotal);
            // 显示结果模块
            obj.slideDown();
            // 判断是否有下一页
            if (tempArr.length >= pageSize) {
                pageFlag = true;
                obj.find(".next").removeClass("noClick");
            } else {
                pageFlag = false;
                obj.find(".next").addClass("noClick");
            }
            // 判断是否有上一页
            if (pageNo > 1) {
                obj.find(".prev").removeClass("noClick");
            } else {
                obj.find(".prev").addClass("noClick");
            }
        }
    }
}

// 模糊搜索诊疗项
function fuzzySearchCheck(obj, searchText, pageNo, pageSize) {

    let searchFormData = new FormData();
    searchFormData.append("param", searchText);
    ajaxRequest("POST", fuzzySearchCheckApi, searchFormData, false, false, true, getCheckListSuccess, null, null);

    function getCheckListSuccess(data) {
        // 成功操作
        if (pageNo === 1 && data.twxrayCheckList.length === 0) {
            layer.msg("未搜到相关诊疗");
            obj.hide();
        } else {
            obj.siblings("input").focus();
            // 渲染数据列表
            let tempArr = data.twxrayCheckList;
            let _html = '';
            for (let i = 0; i < tempArr.length; i++) {
                _html += '<a name="' + tempArr[i].id + '" checkName="' + tempArr[i].checkName + '" href="javascript:;">' + tempArr[i].checkName + '<img src="../images/search_active.png" alt=""></a>'
            }
            obj.find(".searchResult").html(_html);
            // 渲染数据总条数
            obj.find(".searchNum").html(data.pageTotal);
            // 显示结果模块
            obj.slideDown();
            // 判断是否有下一页
            if (tempArr.length >= pageSize) {
                pageFlag = true;
                obj.find(".next").removeClass("noClick");
            } else {
                pageFlag = false;
                obj.find(".next").addClass("noClick");
            }
            // 判断是否有上一页
            if (pageNo > 1) {
                obj.find(".prev").removeClass("noClick");
            } else {
                obj.find(".prev").addClass("noClick");
            }
        }
    }
}

// 模糊搜索备品
function fuzzySearchConsumables(obj, searchText, pageNo, pageSize) {
    let searchFormData = new FormData();
    searchFormData.append("param", searchText);
    ajaxRequest("POST", fuzzySearchConsumablesApi, searchFormData, false, false, true, getConsumablesListSuccess, null, null);

    function getConsumablesListSuccess(data) {
        console.log(data);
        // 成功操作
        if (pageNo == 1 && data.consumablesList.length == 0) {
            layer.msg("未搜到相关器械");
            obj.hide();
        } else {
            // 渲染数据列表
            let tempArr = data.consumablesList;
            let _html = '';
            for (let i = 0; i < tempArr.length; i++) {
                _html += '<a name="' + tempArr[i].id + '" consumablesName="' + tempArr[i].consumablesName + '" href="javascript:;">' + tempArr[i].consumablesName + '<img src="../images/search_active.png" alt=""></a>'
            }
            obj.find(".searchResult").html(_html);
            // 渲染数据总条数
            obj.find(".searchNum").html(data.pageTotal);
            // 显示结果模块
            obj.slideDown();
            // 判断是否有下一页
            if (tempArr.length >= pageSize) {
                pageFlag = true;
                obj.find(".next").removeClass("noClick");
            } else {
                pageFlag = false;
                obj.find(".next").addClass("noClick");
            }
            // 判断是否有上一页
            if (pageNo > 1) {
                obj.find(".prev").removeClass("noClick");
            } else {
                obj.find(".prev").addClass("noClick");
            }
        }

    }
}

// 获取当前时间
function getNowTime() {
    let _data = new Date();
    let str = _data.toLocaleDateString() + ' ' + _data.getHours() + ":" + _data.getMinutes();
    return str;
}

// 渲染layer
function layerRender() {
    layui.use(['form', 'layedit', 'laydate'], function () {
        let laydate = layui.laydate;
        let form = layui.form;//高版本建议把括号去掉，有的低版本，需要加()
        form.render();
        // 选择时间工具
        $('.selectTimeTool').each(function () {
            laydate.render({
                elem: this,
                type: 'datetime',
                min: "0",
                format: 'yyyy/MM/dd HH:mm',
            });
        });
    })
}

// 渲染医嘱数据
function render() {
    for (let i = 0; i < reportEnjoin.length; i++) {
        if (reportEnjoin[i].doctorId === currentUserInfo.id) {
            $(".verdictArea").val(reportEnjoin[i].report);
            if (reportEnjoin[i].doctorEnjoin) {
                oldDoctorEnjoin = JSON.parse(reportEnjoin[i].doctorEnjoin);
            }
        }
    }
    let doctorEnjoinJson = oldDoctorEnjoin;
    // 长期医嘱
    $(".dataUl").html('');
    if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0) {
        $(".longTimeBox").find(".dataUl").show();
        $(".longTimeBox").find(".remarkBox").show();
        $(".longTimeBox").find(".noData").hide();
        $(".longTimeAreaObj").html(doctorEnjoinJson.longTimeArea);
        $(".longTimeAreaNum").html(doctorEnjoinJson.longTimeArea.length);
        let _html = "";
        for (let i = 0; i < doctorEnjoinJson.longTimeArr.length; i++) {
            _html += '<li class="dataItem">\
                    <div class="headTopBox">\
                        <span>执行时间</span>\
                        <div class="selectTimeInput selectTimeInputBefore">\
                            <input type="text" readonly class="selectTimeTool mustValue startTimeObj" placeholder="点击选择" value="' + doctorEnjoinJson.longTimeArr[i].startTime + '"/>\
                        </div>\
                        <span>结束时间</span>\
                        <div class="selectTimeInput selectTimeInputBefore">\
                            <input type="text" readonly class="selectTimeTool mustValue endTimeObj" placeholder="点击选择" value="' + doctorEnjoinJson.longTimeArr[i].endTime + '" />\
                        </div>\
                    </div>\
                    <p class="divideLine"></p>\
                    <div class="listBottomBox">';
            let twoLevelArr = doctorEnjoinJson.longTimeArr[i].drugArr;
            for (let j = 0; j < twoLevelArr.length; j++) {
                if (j == 0) {
                    _html += '<div class="listItem">\
                            <span class="drugName nameObj">' + twoLevelArr[j].name + '</span>\
                            <div class="drugRule">\
                                <input type="text" class="mustValue singleNumObj" oninput="value=value.replace(/[^\\d]/g,\'\')" value="' + twoLevelArr[j].singleNum + '" placeholder="单次计量">&nbsp;&nbsp;/&nbsp;&nbsp;\
                                <div class="layui-input-inline" style="width: 80px;margin-right: 20px;">\
                                    <select class="mustValue unitObj" name="">';
                    for (let z = 0; z < unitArr.length; z++) {
                        if (unitArr[z] == twoLevelArr[j].unit) {
                            _html += '<option selected value="' + unitArr[z] + '">' + unitArr[z] + '</option>'
                        } else {
                            _html += '<option value="' + unitArr[z] + '">' + unitArr[z] + '</option>'
                        }
                    }
                    _html += '</select>\
                                </div>\
                                <div class="layui-input-inline" style="width:116px;margin-right: 20px;">\
                                    <select class="mustValue frequencyObj" lay-verify="" lay-search="">\
                                        <option value="">每日用次</option>';
                    for (let z = 0; z < frequencyArr.length; z++) {
                        if (frequencyArr[z] == twoLevelArr[j].frequency) {
                            _html += '<option selected value="' + frequencyArr[z] + '">' + frequencyArr[z] + '</option>'
                        } else {
                            _html += '<option value="' + frequencyArr[z] + '">' + frequencyArr[z] + '</option>'
                        }
                    }
                    _html += '</select>\
                                </div>\
                                <div class="layui-input-inline" style="width:116px;margin-right: 20px;">\
                                    <select name="" class="mustValue meansObj" lay-verify="" lay-search="">\
                                        <option value="">给药途径</option>';
                    for (let z = 0; z < wayArr.length; z++) {
                        if (wayArr[z] == twoLevelArr[j].means) {
                            _html += '<option selected value="' + wayArr[z] + '">' + wayArr[z] + '</option>'
                        } else {
                            _html += '<option value="' + wayArr[z] + '">' + wayArr[z] + '</option>'
                        }
                    }
                    _html += '</select>\
                                </div>\
                            </div>\
                        </div>'
                } else {
                    _html += '<p class="divideLine"></p><div class="listItem">\
                            <span class="drugName nameObj">' + twoLevelArr[j].name + '</span>\
                            <div class="drugRule">\
                                <input type="text" class="mustValue singleNumObj" oninput="value=value.replace(/[^\\d]/g,\'\')" value="' + twoLevelArr[j].singleNum + '" placeholder="单次计量">&nbsp;&nbsp;/&nbsp;&nbsp;\
                                <div class="layui-input-inline" style="width: 80px;margin-right: 20px;">\
                                    <select class="mustValue unitObj" name="">';
                    for (let z = 0; z < unitArr.length; z++) {
                        if (unitArr[z] == twoLevelArr[j].unit) {
                            _html += '<option selected value="' + unitArr[z] + '">' + unitArr[z] + '</option>'
                        } else {
                            _html += '<option value="' + unitArr[z] + '">' + unitArr[z] + '</option>'
                        }
                    }
                    _html += '</select>\
                                </div>\
                            </div>\
                        </div>'
                }
            }
            _html += '</div></li>';
        }
        $(".longTimeBox").find(".dataUl").html(_html);
    } else {
        $(".longTimeBox").find(".noData").show();
        $(".longTimeBox").find(".dataUl").hide();
        $(".longTimeBox").find(".remarkBox").hide();
    }
    // 临时医嘱 药物
    if (doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
        $(".temporaryDrugBox").find(".dataUl").show();
        $(".temporaryDrugBox").find(".noData").hide();
        let _html = "";
        for (let i = 0; i < doctorEnjoinJson.temporaryDrugArr.length; i++) {
            _html += '<li class="dataItem">\
                    <div class="headTopBox">\
                        <span>下达时间</span>\
                        <div class="selectTimeInput">\
                            <input type="text" value="' + getNowTime() + '" class="mustValue arriveTimeObj" readonly placeholder="点击选择" />\
                        </div>\
                    </div>\
                    <p class="divideLine"></p>\
                    <div class="listBottomBox">';
            let twoLevelArr = doctorEnjoinJson.temporaryDrugArr[i].drugArr;
            for (let j = 0; j < twoLevelArr.length; j++) {
                if (j == 0) {
                    _html += '<div class="listItem">\
                                <span class="drugName nameObj">' + twoLevelArr[j].name + '</span>\
                                <div class="drugRule">\
                                    <input type="text" class="mustValue singleNumObj" oninput="value=value.replace(/[^\\d]/g,\'\')" value="' + twoLevelArr[j].singleNum + '" placeholder="单次计量">&nbsp;&nbsp;/&nbsp;&nbsp;\
                                    <div class="layui-input-inline" style="width: 80px;margin-right: 20px;">\
                                        <select class="mustValue unitObj" name="">';
                    for (let z = 0; z < unitArr.length; z++) {
                        if (unitArr[z] == twoLevelArr[j].unit) {
                            _html += '<option selected value="' + unitArr[z] + '">' + unitArr[z] + '</option>'
                        } else {
                            _html += '<option value="' + unitArr[z] + '">' + unitArr[z] + '</option>'
                        }
                    }
                    _html += '</select>\
                                    </div>\
                                    <div class="layui-input-inline" style="width:116px;margin-right: 20px;">\
                                        <select name="" class="mustValue meansObj" lay-verify="" lay-search="">\
                                            <option value="">给药途径</option>';
                    for (let z = 0; z < wayArr.length; z++) {
                        if (wayArr[z] == twoLevelArr[j].means) {
                            _html += '<option selected value="' + wayArr[z] + '">' + wayArr[z] + '</option>'
                        } else {
                            _html += '<option value="' + wayArr[z] + '">' + wayArr[z] + '</option>'
                        }
                    }
                    _html += '</select>\
                                    </div>\
                                </div>\
                            </div>'
                } else {
                    _html += '<p class="divideLine"></p><div class="listItem">\
                                <span class="drugName nameObj">' + twoLevelArr[j].name + '</span>\
                                <div class="drugRule">\
                                    <input type="text" class="mustValue singleNumObj" oninput="value=value.replace(/[^\\d]/g,\'\')" value="' + twoLevelArr[j].singleNum + '" placeholder="单次计量">&nbsp;&nbsp;/&nbsp;&nbsp;\
                                    <div class="layui-input-inline" style="width: 80px;margin-right: 20px;">\
                                        <select class="mustValue unitObj" name="">';
                    for (let z = 0; z < unitArr.length; z++) {
                        if (unitArr[z] == twoLevelArr[j].unit) {
                            _html += '<option selected value="' + unitArr[z] + '">' + unitArr[z] + '</option>'
                        } else {
                            _html += '<option value="' + unitArr[z] + '">' + unitArr[z] + '</option>'
                        }
                    }
                    _html += '</select>\
                                    </div>\
                                </div>\
                            </div>'
                }
            }
            _html += '</div>\
                </li>';
        }
        $(".temporaryDrugBox").find(".dataUl").html(_html);
    } else {
        $(".temporaryDrugBox").find(".noData").show();
        $(".temporaryDrugBox").find(".dataUl").hide();
    }
    // 临时医嘱 诊疗
    if (doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
        $(".temporaryTreatBox").find(".dataUl").show();
        $(".temporaryTreatBox").find(".noData").hide();
        let _html = "";
        for (let i = 0; i < doctorEnjoinJson.temporaryTreatArr.length; i++) {
            _html += '<li class="dataItem">\
                        <div class="headTopBox">\
                            <span>下达时间</span>\
                            <div class="selectTimeInput">\
                                <input type="text" value="' + getNowTime() + '" class="mustValue arriveTimeObj" readonly placeholder="点击选择" />\
                            </div>\
                        </div>\
                        <p class="divideLine"></p>\
                        <div class="listBottomBox">\
                            <div class="listItem">\
                                <span class="drugName nameObj">' + doctorEnjoinJson.temporaryTreatArr[i].name + '</span>\
                            </div>\
                        </div>\
                    </li>'
        }
        $(".temporaryTreatBox .dataUl").html(_html);
    } else {
        $(".temporaryTreatBox").find(".noData").show();
        $(".temporaryTreatBox").find(".dataUl").hide();
    }
    if (doctorEnjoinJson.temporaryDrugArr || doctorEnjoinJson.temporaryTreatArr) {
        if (doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0 || doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
            $(".temporaryTreatBox").find(".remarkBox").show();
            $(".temporaryAreaObj").html(doctorEnjoinJson.temporaryArea);
            $(".temporaryAreaNum").html(doctorEnjoinJson.temporaryArea.length);
        } else {
            $(".temporaryTreatBox").find(".remarkBox").hide();
        }
    }
    if (doctorEnjoinJson.surgeryArr && doctorEnjoinJson.surgeryArr.length > 0) {
        $(".surgeryBox").find(".dataUl").show();
        $(".surgeryBox").find(".remarkBox").show();
        $(".surgeryBox").find(".noData").hide();
        $(".surgeryAreaObj").html(doctorEnjoinJson.surgeryArea);
        $(".surgeryAreaNum").html(doctorEnjoinJson.surgeryArea.length);
        let _html = '';
        // for (let x = 0; x < doctorEnjoinJson.surgeryArr.length; x++) {
        //     let tempObj = doctorEnjoinJson.surgeryArr[x];
        //     $.ajax({
        //         type: 'POST',
        //         url: IP + 'consumables/findSpecificationsById',
        //         dataType: 'json',
        //         data: {
        //             "id": doctorEnjoinJson.surgeryArr[x].surgeryId,
        //         },
        //         async: false,
        //         xhrFields: {
        //             withCredentials: true
        //         },
        //         crossDomain: true,
        //         success: function (data) {
        //             console.log(data)
        //             if (data.code == 1) {
        //                 if (data.data.length > 0) {
        //                     let _html = '<option value=""></option>';
        //                     for (let i = 0; i < data.data.length; i++) {
        //                         if (tempObj.surgerySize == data.data[i].specificationsName) {
        //                             _html += '<option selected value="' + data.data[i].specificationsName + '">' + data.data[i].specificationsName + '</option>'
        //                         } else {
        //                             _html += '<option value="' + data.data[i].specificationsName + '">' + data.data[i].specificationsName + '</option>'
        //                         }
        //                     }
        //                     let tempHtml = '<li class="dataItem">\
        //                                     <div class="listBottomBox">\
        //                                         <div class="listItem">\
        //                                             <span class="drugName surgeryNameObj" name="'+ tempObj.surgeryId + '">' + tempObj.surgeryName + '</span>\
        //                                             <div class="drugRule">\
        //                                                 <div class="layui-input-inline" style="width: 300px;">\
        //                                                     <select class="mustValue surgerySizeObj" name="">'+ _html + '</select>\
        //                                                 </div>\
        //                                                 <input type="text" class="mustValue surgeryNumObj" value="'+ tempObj.surgeryNum + '" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="数量" style="margin-right: 20px;">\
        //                                             </div>\
        //                                         </div>\
        //                                     </div>\
        //                                 </li>';
        //                 } else {
        //                     let tempHtml = '<li class="dataItem">\
        //                             <div class="listBottomBox">\
        //                                 <div class="listItem">\
        //                                     <span class="drugName surgeryNameObj" name="'+ tempObj.surgeryId + '">' + tempObj.surgeryName + '</span>\
        //                                     <div class="drugRule">\
        //                                         <div class="layui-input-inline" style="width: 300px;">\
        //                                             <select class="mustValue surgerySizeObj" name=""><option value="--">--</option></select>\
        //                                         </div>\
        //                                         <input type="text" class="mustValue surgeryNumObj" value="'+ tempObj.surgeryNum + '" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="数量" style="margin-right: 20px;">\
        //                                     </div>\
        //                                 </div>\
        //                             </div>\
        //                         </li>';
        //                 }
        //                 $(".surgeryBox").find(".dataUl").append(tempHtml);
        //                 $(".surgerySearchContent").hide();
        //                 layerRender();
        //             } else if (data.code == 250) {
        //                 // 未登录操作
        //                 window.location = '/yilaiyiwang/login/login.html';
        //             } else {
        //                 // 其他操作
        //             }
        //         },
        //         error: function (err) {
        //             console.log(err);
        //         },
        //     });
        // }
    } else {
        $(".surgeryBox").find(".noData").show();
        $(".surgeryBox").find(".dataUl").hide();
        $(".surgeryBox").find(".surgeryRemarkBox").hide();
    }
    layerRender();
}

/** 组装 医嘱 */
function doctorEnjoinBuilder(feedBackFunction) {
    let dataJson = {};
    if ($(".longTimeBox .dataUl > li").length > 0) {
        let oneTempArr = [];
        let twoTempArr = [];
        let oneLevel = $(".longTimeBox .dataUl > li.dataItem");
        for (let i = 0; i < oneLevel.length; i++) {
            let twoLevel = oneLevel.eq(i).find(".listBottomBox > .listItem");
            for (let j = 0; j < twoLevel.length; j++) {
                twoTempArr.push({
                    "name": twoLevel.eq(j).find(".nameObj").html(),// 药物名字
                    "singleNum": twoLevel.eq(j).find(".singleNumObj").val(),// 单次计量
                    "unit": twoLevel.eq(j).find(".unitObj").val(),// 单位
                    "frequency": twoLevel.eq(j).find(".frequencyObj").val(),// 每日用次
                    "means": twoLevel.eq(j).find(".meansObj").val(),// 给药途径F
                })
            }
            oneTempArr.push({
                "timeNum": new Date(oneLevel.eq(i).find(".startTimeObj").val()),
                "startTime": oneLevel.eq(i).find(".startTimeObj").val(),
                "endTime": oneLevel.eq(i).find(".endTimeObj").val(),
                "drugArr": twoTempArr
            });
            twoTempArr = [];
        }
        oneTempArr.sort(function (a, b) {
            return a.timeNum < b.timeNum ? -1 : 1;
        });
        dataJson["longTimeArr"] = oneTempArr;
        if ($(".longTimeAreaObj").html().length < 200) {
            dataJson["longTimeArea"] = $(".longTimeAreaObj").html();// 长期医嘱备注
        } else {
            layer.msg("备注限200字以内");
            return false;
        }
    }
    if ($(".temporaryDrugBox .dataUl > li").length > 0) {
        let oneTempArr = [];
        let twoTempArr = [];
        let oneLevel = $(".temporaryDrugBox .dataUl > li");
        for (let i = 0; i < oneLevel.length; i++) {
            let twoLevel = oneLevel.eq(i).find(".listBottomBox .listItem");
            for (let j = 0; j < twoLevel.length; j++) {
                twoTempArr.push({
                    "name": twoLevel.eq(j).find(".nameObj").html(),// 药物名字
                    "singleNum": twoLevel.eq(j).find(".singleNumObj").val(),// 单次计量
                    "unit": twoLevel.eq(j).find(".unitObj").val(),// 单位
                    "means": twoLevel.eq(j).find(".meansObj").val(),// 给药途径F
                })
            }
            oneTempArr.push({
                "arriveTime": oneLevel.eq(i).find(".arriveTimeObj").val(),
                "drugArr": twoTempArr
            });
            twoTempArr = [];
        }
        dataJson["temporaryDrugArr"] = oneTempArr;
    }
    if ($(".temporaryTreatBox .dataUl > li").length > 0) {
        let oneTempArr = [];
        let oneLevel = $(".temporaryTreatBox .dataUl > li");
        for (let i = 0; i < oneLevel.length; i++) {
            oneTempArr.push({
                "arriveTime": oneLevel.eq(i).find(".arriveTimeObj").val(),
                "name": oneLevel.eq(i).find(".nameObj").html(),
            })
        }
        dataJson["temporaryTreatArr"] = oneTempArr;
    }
    if ($(".temporaryAreaObj").html().length < 200) {
        dataJson["temporaryArea"] = $(".temporaryAreaObj").html();// 临时医嘱备注
    } else {
        layer.msg("备注限200字以内");
        return false;
    }
    if ($(".surgeryBox .dataUl > li").length > 0) {
        let oneTempArr = [];
        let oneLevel = $(".surgeryBox .dataUl > li");
        for (let i = 0; i < oneLevel.length; i++) {
            oneTempArr.push({
                "surgeryName": oneLevel.eq(i).find(".surgeryNameObj").html(),// 器械名称
                // "surgerySize": oneLevel.eq(i).find(".surgerySizeObj").val(),// 器械规格
                "surgeryNum": oneLevel.eq(i).find(".surgeryNumObj").val(),// 器械数量
                "surgeryId": oneLevel.eq(i).find(".surgeryNameObj").attr("name"),// 器械id
            })
        }
        dataJson["surgeryArr"] = oneTempArr;
        if ($(".surgeryAreaObj").html().length < 200) {
            dataJson["surgeryArea"] = $(".surgeryAreaObj").html();// 器械备注
        } else {
            layer.msg("备注限200字以内");
            return false;
        }
    }

    dataJson["doctor"] = currentUserInfo.userName;

    feedBackFunction(JSON.stringify(dataJson));
    return false;
}

/** 暂存 会诊报告 医嘱 */
function cacheReportEnjoin(doctorEnjoinJson) {
    let data = new FormData();
    for (const item of reportEnjoin) {
        if (item.doctorId === currentUserInfo.id) {
            data.append("doctorName",item.doctorName);
            data.append("doctorId",item.doctorId);
            data.append("report",$('.verdictArea').val());
            data.append("reportStatus","1");
            data.append("doctorEnjoin",doctorEnjoinJson);
        }
    }
    data.append("applyFormId", applyFormId);
    ajaxRequest("POST", doctorSendFeedbackReportMoment, data, false, false, true, cacheReportEnjoinSuccess, cacheReportEnjoinFailed, null);

    function cacheReportEnjoinSuccess() {
        $('.working').html('暂存成功');
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shadeClose: false,
            zIndex: layer.zIndex,
            content: _$('.working')
        });
        setTimeout(function () {
            location.reload();
        }, 2000);
    }

    function cacheReportEnjoinFailed() {
        $('.working').html('暂存失败')
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shadeClose: false,
            zIndex: layer.zIndex,
            time: 2000,
            content: _$('.working')
        });
    }
}

/** 提交 会诊报告 医嘱 */
function submitReportEnjoin(doctorEnjoinJson) {
    getCheckReportEnjoin();
    for (let i = 1, len = reportEnjoin.length; i < len; i++) {
        if (reportEnjoin[i].reportStatus === "1") {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shadeClose: false,
                zIndex: layer.zIndex,
                time: 3000,
                content: _$('.promptText')
            });
            setTimeout(function () {
                $('.promptText').hide();
            }, 3000)
            return false;
        }
    }
    let data = new FormData();

    for (const item of reportEnjoin) {
        if (item.doctorId === currentUserInfo.id) {
            data.append("doctorName",item.doctorName);
            data.append("doctorId",item.doctorId);
            data.append("report",$(".verdictArea").val());
            data.append("reportStatus","0");
            data.append("doctorEnjoin",doctorEnjoinJson);
        }
    }
    data.append("applyFormId", applyFormId);
    ajaxRequest("POST", doctorSendFeedbackReport, data, false, false, true, submitReportEnjoinSuccess, submitReportEnjoinFailed, null);

    function submitReportEnjoinSuccess() {
        $('.working').html('提交成功');
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shadeClose: false,
            zIndex: layer.zIndex,
            time: 2000,
            content: _$('.working')
        });
        setTimeout(function () {
            window.location = "../page/morkbench.html"
        }, 2000);
    }

    function submitReportEnjoinFailed() {
        $('.working').html('提交失败')
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shadeClose: false,
            zIndex: layer.zIndex,
            time: 2000,
            content: _$('.working')
        });
    }

    return false;
}

/** 查询会诊报告 + 医嘱 */
function getReportEnjoin() {
    applyFormId = localStorage.getItem('applyFormId');
    let formData = {"applyFormId": applyFormId};
    ajaxRequest("GET", selectReport, formData, true, "application/json", false, selectReportSuccess, null, null);

    function selectReportSuccess(data) {
        reportEnjoin = JSON.parse(data);
        render();
    }
}
/** 查询会诊报告 + 医嘱 */
function getCheckReportEnjoin() {
    applyFormId = localStorage.getItem('applyFormId');
    let formData = {"applyFormId": applyFormId};
    ajaxRequest("GET", selectReport, formData, true, "application/json", false, selectReportSuccess, null, null);

    function selectReportSuccess(data) {
        reportEnjoin = JSON.parse(data);
    }
}
$(function () {
    getReportEnjoin()
    // 长期医嘱 药物搜索按钮
    $(".longDrugBtn").click(function () {
        pageNo = 1;
        fuzzySearchMedical($(".longDrugSearchContent"), $(".longDrugInput").val(), pageNo, pageSize);
    });
    // 长期医嘱 下一页
    $(".longDrugSearchContent").find(".next").click(function () {
        if (pageFlag) {
            pageNo += 1;
            fuzzySearchMedical($(".longDrugSearchContent"), $(".longDrugInput").val(), pageNo, pageSize);
        }
    });
    // 长期医嘱 上一页
    $(".longDrugSearchContent").find(".prev").click(function () {
        if (pageNo > 1) {
            pageNo -= 1;
            fuzzySearchMedical($(".longDrugSearchContent"), $(".longDrugInput").val(), pageNo, pageSize);
        }
    });
    // 长期医嘱 添加事件
    $(".longDrugSearchContent .searchResult").delegate("a", "click", function () {
        $(".longTimeBox").find(".dataUl").show();
        $(".longTimeBox").find(".remarkBox").show();
        $(".longTimeBox").find(".noData").hide();
        $(".longTimeBox .dataUl").append('<li class="dataItem">\
                <div class="headTopBox">\
                    <span>执行时间</span>\
                    <div class="selectTimeInput selectTimeInputBefore">\
                        <input type="text" readonly class="selectTimeTool mustValue startTimeObj" placeholder="点击选择" />\
                    </div>\
                    <span>结束时间</span>\
                    <div class="selectTimeInput selectTimeInputBefore">\
                        <input type="text" readonly class="selectTimeTool mustValue endTimeObj" placeholder="点击选择" />\
                    </div>\
                </div>\
                <p class="divideLine"></p>\
                <div class="listBottomBox">\
                    <div class="listItem">\
                        <span class="drugName nameObj">' + $(this).attr("medicalnamechina") + '</span>\
                        <div class="drugRule">\
                            <input type="text" class="mustValue singleNumObj" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="单次计量">&nbsp;&nbsp;/&nbsp;&nbsp;\
                            <div class="layui-input-inline" style="width: 80px;margin-right: 20px;">\
                                <select class="mustValue unitObj" name="">\
                                    <option value="g">g</option>\
                                    <option value="mg">mg</option>\
                                    <option value="ug">ug</option>\
                                    <option value="ml">ml</option>\
                                </select>\
                            </div>\
                            <div class="layui-input-inline" style="width:116px;margin-right: 20px;">\
                                <select class="mustValue frequencyObj" lay-verify="" lay-search="">\
                                    <option value="">每日用次</option>\
                                    <option value="q.1/2h">q.1/2h</option>\
                                    <option value="q.h">q.h</option>\
                                    <option value="q.2h">q.2h</option>\
                                    <option value="q.3h">q.3h</option>\
                                    <option value="q.4h">q.4h</option>\
                                    <option value="q.6h">q.6h</option>\
                                    <option value="q.8h">q.8h</option>\
                                    <option value="q.12h">q.12h</option>\
                                    <option value="q.72h.">q.72h.</option>\
                                    <option value="q.d.">q.d.</option>\
                                    <option value="b.i.d.">b.i.d.</option>\
                                    <option value="t.i.d.">t.i.d.</option>\
                                    <option value="q.i.d.">q.i.d.</option>\
                                    <option value="Quingid">Quingid</option>\
                                    <option value="q.n.">q.n.</option>\
                                    <option value="q.o.d.">q.o.d.</option>\
                                    <option value="q.3d">q.3d</option>\
                                    <option value="q.w.">q.w.</option>\
                                    <option value="Biw">Biw</option>\
                                    <option value="Tiw">Tiw</option>\
                                    <option value="q.o.w.">q.o.w.</option>\
                                    <option value="2W">2W</option>\
                                    <option value="3W">3W</option>\
                                    <option value="4W">4W</option>\
                                    <option value="q.m.">q.m.</option>\
                                    <option value="b.i.m.">b.i.m.</option>\
                                    <option value="once">once</option>\
                                    <option value="St.">St.</option>\
                                    <option value="p.r.n.">p.r.n.</option>\
                                    <option value="s.o.s.">s.o.s.</option>\
                                    <option value="DC">DC</option>\
                                    <option value="12n">12n</option>\
                                    <option value="12mn">12mn</option>\
                                    <option value="a.c.">a.c.</option>\
                                    <option value="p.c.">p.c.</option>\
                                    <option value="t.i.d. a.c.">t.i.d. a.c.</option>\
                                    <option value="hs">hs</option>\
                                </select>\
                            </div>\
                            <div class="layui-input-inline" style="width:116px;margin-right: 20px;">\
                                <select name="" class="mustValue meansObj" lay-verify="" lay-search="">\
                                    <option value="">给药途径</option>\
                                    <option value="gtt">gtt</option>\
                                    <option value="id">id</option>\
                                    <option value="ih">ih</option>\
                                    <option value="im/m.">im/m.</option>\
                                    <option value="iv">iv</option>\
                                    <option value="ip">ip</option>\
                                    <option value="ivgtt">ivgtt</option>\
                                    <option value="p.o.">p.o.</option>\
                                    <option value="ad us.int.">ad us.int.</option>\
                                    <option value="ad us.ext.">ad us.ext.</option>\
                                    <option value="lnhal">lnhal</option>\
                                    <option value="ig">ig</option>\
                                </select>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </li>');
        $(".longDrugSearchContent").hide();
        layerRender();
    });

    // 临时医嘱 药物搜索
    $(".temporaryDrugBtn").click(function () {
        pageNo = 1;
        fuzzySearchMedical($(".temporaryDrugSearchContent"), $(".temporaryDrugInput").val(), pageNo, pageSize);
    });
    // 临时医嘱 下一页
    $(".temporaryDrugSearchContent").find(".next").click(function () {
        if (pageFlag) {
            pageNo += 1;
            fuzzySearchMedical($(".temporaryDrugSearchContent"), $(".temporaryDrugInput").val(), pageNo, pageSize);
        }
    });
    // 临时医嘱 上一页
    $(".temporaryDrugSearchContent").find(".prev").click(function () {
        if (pageNo > 1) {
            pageNo -= 1;
            fuzzySearchMedical($(".temporaryDrugSearchContent"), $(".temporaryDrugInput").val(), pageNo, pageSize);
        }
    });
    // 临时医嘱 药物添加事件
    $(".temporaryDrugSearchContent .searchResult").delegate("a", "click", function () {
        $(".temporaryDrugBox").find(".dataUl").show();
        $(".temporaryTreatBox").find(".remarkBox").show();
        $(".temporaryDrugBox").find(".noData").hide();
        $(".temporaryDrugBox .dataUl").append('<li class="dataItem">\
                        <div class="headTopBox">\
                            <span>下达时间</span>\
                            <div class="selectTimeInput">\
                                <input type="text" class="mustValue arriveTimeObj" readonly value="' + getNowTime() + '" placeholder="点击选择" />\
                            </div>\
                        </div>\
                        <p class="divideLine"></p>\
                        <div class="listBottomBox">\
                            <div class="listItem">\
                                <span class="drugName nameObj">' + $(this).attr("medicalnamechina") + '</span>\
                                <div class="drugRule">\
                                    <input type="text" class="mustValue singleNumObj" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="单次计量">&nbsp;&nbsp;/&nbsp;&nbsp;\
                                    <div class="layui-input-inline" style="width: 80px;margin-right: 20px;">\
                                        <select class="mustValue unitObj" name="">\
                                            <option value="g">g</option>\
                                            <option value="mg">mg</option>\
                                            <option value="ug">ug</option>\
                                            <option value="ml">ml</option>\
                                        </select>\
                                    </div>\
                                    <div class="layui-input-inline" style="width:116px;margin-right: 20px;">\
                                        <select name="" class="mustValue meansObj" lay-verify="" lay-search="">\
                                            <option value="">给药途径</option>\
                                            <option value="gtt">gtt</option>\
                                            <option value="id">id</option>\
                                            <option value="ih">ih</option>\
                                            <option value="im/m.">im/m.</option>\
                                            <option value="iv">iv</option>\
                                            <option value="ip">ip</option>\
                                            <option value="ivgtt">ivgtt</option>\
                                            <option value="p.o.">p.o.</option>\
                                            <option value="ad us.int.">ad us.int.</option>\
                                            <option value="ad us.ext.">ad us.ext.</option>\
                                            <option value="lnhal">lnhal</option>\
                                            <option value="ig">ig</option>\
                                        </select>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </li>');
        $(".temporaryDrugSearchContent").hide();
        layerRender();
    });

    // 临时医嘱 诊疗搜索
    $(".temporaryTreatBtn").click(function () {
        pageNo = 1;
        fuzzySearchCheck($(".temporaryTreatSearchContent"), $(".temporaryTreatInput").val(), pageNo, pageSize);
    });
    // 临时医嘱 下一页
    $(".temporaryTreatSearchContent").find(".next").click(function () {
        if (pageFlag) {
            pageNo += 1;
            fuzzySearchCheck($(".temporaryTreatSearchContent"), $(".temporaryTreatInput").val(), pageNo, pageSize);
        }
    });
    // 临时医嘱 上一页
    $(".temporaryTreatSearchContent").find(".prev").click(function () {
        if (pageNo > 1) {
            pageNo -= 1;
            fuzzySearchCheck($(".temporaryTreatSearchContent"), $(".temporaryTreatInput").val(), pageNo, pageSize);
        }
    });
    // 临时医嘱 诊疗添加事件
    $(".temporaryTreatSearchContent .searchResult").delegate("a", "click", function () {
        $(".temporaryTreatBox").find(".dataUl").show();
        $(".temporaryTreatBox").find(".remarkBox").show();
        $(".temporaryTreatBox").find(".noData").hide();
        $(".temporaryTreatBox").find(".dataUl").append('<li class="dataItem">\
            <div class="headTopBox">\
                <span>下达时间</span>\
                <div class="selectTimeInput">\
                    <input type="text" class="mustValue arriveTimeObj" readonly value="' + getNowTime() + '" placeholder="点击选择" />\
                </div>\
            </div>\
            <p class="divideLine"></p>\
            <div class="listBottomBox">\
                <div class="listItem">\
                    <span class="drugName nameObj">' + $(this).attr("checkname") + '</span>\
                </div>\
            </div>\
        </li>');
        $(".temporaryTreatSearchContent").hide();
        layerRender();
    });

    // 手术备品 器械搜索
    $(".surgeryBtn").click(function () {
        pageNo = 1;
        fuzzySearchConsumables($(".surgerySearchContent"), $(".surgeryInput").val(), pageNo, pageSize);
    });
    // 手术备品 下一页
    $(".surgerySearchContent").find(".next").click(function () {
        if (pageFlag) {
            pageNo += 1;
            fuzzySearchConsumables($(".surgerySearchContent"), $(".surgeryInput").val(), pageNo, pageSize);
        }
    });
    // 手术备品 上一页
    $(".surgerySearchContent").find(".prev").click(function () {
        if (pageNo > 1) {
            pageNo -= 1;
            fuzzySearchConsumables($(".surgerySearchContent"), $(".surgeryInput").val(), pageNo, pageSize);
        }
    });
    // 手术备品 添加
    $(".surgerySearchContent .searchResult").delegate("a", "click", function () {
        $(".surgeryBox").find(".dataUl").show();
        $(".surgeryBox").find(".remarkBox").show();
        $(".surgeryBox").find(".noData").hide();
        let _obj = $(this);

        let tempHtml = '<li class="dataItem">\
                        <div class="listBottomBox">\
                            <div class="listItem">\
                                <span class="drugName surgeryNameObj" name="' + _obj.attr("name") + '">' + _obj.attr("consumablesname") + '</span>\
                                <div class="drugRule">\
                                    <input type="text" class="mustValue surgeryNumObj" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="数量" style="margin-right: 20px;">\
                                </div>\
                            </div>\
                        </div>\
                    </li>';
        $(".surgeryBox").find(".dataUl").append(tempHtml);
        $(".surgerySearchContent").hide();
        layerRender();
    });

    // 医生签名
    $(".navDoctorInfo").html("医生签名：" + currentUserInfo.userName);

    // 导航切换 - start
    $(".deleteBtn,.cancelBtn,.setBtn,.submitBtn").hide();
    $(".navBox > a").click(function () {
        navSwitc($(this).index());
    });

    function navSwitc(_index) {
        $(".navBox > a").eq(_index).addClass("active").siblings("a").removeClass("active");
        $(".bodyContent > div").removeClass("active").eq(_index).addClass("active");
        if (_index == 0) {
            $(".goBackBtn,.saveBtn,.nextBtn").show();
            $(".deleteBtn,.cancelBtn,.setBtn,.submitBtn").hide();
        } else if (_index == 1) {
            $(".deleteBtn,.cancelBtn,.setBtn,.submitBtn").show();
            $(".nextBtn").hide();
        }
    }

    // 后退
    $(".goBackBtn").click(function () {
        window.history.back();
    });
    $(".nextBtn").click(function () {
        navSwitc(1);
    });
    // 导航切换 - end

    // 器械备注 输入高度自适应 - start
    $(".longTimeAreaObj")[0].oninput = function () {
        if ($(this).html().length > 200) {
            $(this).parents(".remarkBox").addClass("noLength");
        } else {
            $(this).parents(".remarkBox").removeClass("noLength");
        }
        $(".longTimeAreaNum").html($(this).html().length);
    };
    $(".temporaryAreaObj")[0].oninput = function () {
        if ($(this).html().length > 200) {
            $(this).parents(".remarkBox").addClass("noLength");
        } else {
            $(this).parents(".remarkBox").removeClass("noLength");
        }
        $(".temporaryAreaNum").html($(this).html().length);
    };
    $(".surgeryAreaObj")[0].oninput = function () {
        if ($(this).html().length > 200) {
            $(this).parents(".remarkBox").addClass("noLength");
        } else {
            $(this).parents(".remarkBox").removeClass("noLength");
        }
        $(".surgeryAreaNum").html($(this).html().length);
    };
    // 器械备注 输入高度自适应 - end

    // 搜索选项交互
    $(".searchContent").mouseleave(function () {
        $(this).stop(true).slideUp();
        $(".searchBox > input").blur();
    }).mouseenter(function () {
        $(this).stop(true).slideDown();
    });

    // 整行选择
    $(".dataUl").delegate("li", "click", function () {
        $(".listItem.active").removeClass("active");
        $(".setBtn,.cancelBtn").addClass("noClick");
        if ($(".dataUl > li.active").length > 0) {
            if ($(this).hasClass("active")) {
                $(".dataUl > li").removeClass("active");
                $(".deleteBtn").addClass("noClick");
            } else {
                $(".dataUl > li").removeClass("active");
                $(this).addClass("active");
                $(".deleteBtn").removeClass("noClick");
            }
        } else {
            $(this).toggleClass("active");
            $(".deleteBtn").removeClass("noClick");
        }
    });

    // 删除按钮
    $(".deleteBtn").click(function () {
        $(".dataUl > li.active").remove();
        $(this).addClass("noClick");
        if ($(".longTimeBox .dataUl > li").length > 0) {
            $(".longTimeBox").find(".dataUl").show();
            $(".longTimeBox").find(".noData").hide();
        } else {
            $(".longTimeBox").find(".dataUl").hide();
            $(".longTimeBox").find(".remarkBox").hide();
            $(".longTimeBox").find(".noData").show();
        }
        if ($(".temporaryDrugBox .dataUl > li").length > 0) {
            $(".temporaryDrugBox").find(".dataUl").show();
            $(".temporaryDrugBox").find(".noData").hide();
        } else {
            $(".temporaryDrugBox").find(".noData").show();
            $(".temporaryDrugBox").find(".dataUl").hide();
        }
        if ($(".temporaryTreatBox .dataUl > li").length > 0) {
            $(".temporaryTreatBox").find(".dataUl").show();
            $(".temporaryTreatBox").find(".noData").hide();
        } else {
            $(".temporaryTreatBox").find(".dataUl").hide();
            $(".temporaryTreatBox").find(".noData").show();
        }
        if ($(".temporaryDrugBox .dataUl > li").length <= 0 && $(".temporaryTreatBox .dataUl > li").length <= 0) {
            $(".temporaryTreatBox").find(".remarkBox").hide();
        }
        if ($(".surgeryBox .dataUl > li").length > 0) {
            $(".surgeryBox").find(".dataUl").show();
            $(".surgeryBox").find(".remarkBox").show();
            $(".surgeryBox").find(".noData").hide();
        } else {
            $(".surgeryBox").find(".noData").show();
            $(".surgeryBox").find(".dataUl").hide();
            $(".surgeryBox").find(".remarkBox").hide();
        }
    });

    // 子医嘱 - start
    // 小行选择
    $(".temporaryDrugBox .dataUl,.longTimeBox .dataUl").delegate("li .listBottomBox .listItem", "click", function () {
        $(".dataUl > li").removeClass("active");
        $(".deleteBtn").addClass("noClick");
        if ($(".listItem.active").length > 0) {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            } else {
                $(".listItem.active").removeClass("active");
                $(this).addClass("active");
            }
        } else {
            $(this).addClass("active");
        }
        // 设置按钮
        if ($(this).hasClass("active") && $(this).parents(".dataItem").prev("li").attr("class")) {
            $(".setBtn").removeClass("noClick");
        } else {
            $(".setBtn").addClass("noClick");
        }
        // 取消按钮
        if ($(this).hasClass("active") && $(this).index() > 0) {
            $(".cancelBtn").removeClass("noClick");
        } else {
            $(".cancelBtn").addClass("noClick");
        }
        return false;
    });
    // 设置子医嘱 事件
    $(".setBtn").click(function () {
        if (!$(this).hasClass("noClick")) {
            let objHtml = '<p class="divideLine"></p><div class="listItem">\
                <span class="drugName nameObj">' + $(".listItem.active .drugName").html() + '</span>\
                <div class="drugRule">\
                    <input type="text" class="mustValue singleNumObj" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="单次计量">&nbsp;&nbsp;/&nbsp;&nbsp;\
                    <div class="layui-input-inline" style="width: 80px;margin-right: 20px;">\
                        <select class="mustValue unitObj" name="">\
                            <option value="g">g</option>\
                            <option value="mg">mg</option>\
                            <option value="ug">ug</option>\
                            <option value="ml">ml</option>\
                        </select>\
                    </div>\
                </div>\
            </div>';
            $(".listItem.active").parents(".dataItem").prev("li.dataItem").find(".listBottomBox").append(objHtml);
            if ($(".listItem.active").parents(".listBottomBox").children().length > 2) {
                $(".listItem.active").remove();
            } else {
                $(".listItem.active").parents(".dataItem").remove();
            }
            layerRender();
            $(".setBtn").addClass("noClick");
        }
    });
    // 取消子医嘱 事件
    $(".cancelBtn").click(function () {
        if ($(".listItem.active").parents(".itemBox").index() == 0) {
            // 长期医嘱 取消子医嘱
            $(".listItem.active").parents(".dataUl").append('<li class="dataItem">\
                    <div class="headTopBox">\
                        <span>执行时间</span>\
                        <div class="selectTimeInput selectTimeInputBefore">\
                            <input type="text" readonly class="selectTimeTool mustValue startTimeObj" placeholder="点击选择" />\
                        </div>\
                        <span>结束时间</span>\
                        <div class="selectTimeInput selectTimeInputBefore">\
                            <input type="text" readonly class="selectTimeTool mustValue endTimeObj" placeholder="点击选择" />\
                        </div>\
                    </div>\
                    <div class="divideLine">\
                    </div>\
                    <div class="listBottomBox">\
                        <div class="listItem">\
                            <span class="drugName nameObj">' + $(".listItem.active .drugName").html() + '</span>\
                            <div class="drugRule">\
                                <input type="text" class="mustValue singleNumObj" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="单次计量">&nbsp;&nbsp;/&nbsp;&nbsp;\
                                <div class="layui-input-inline" style="width: 80px;margin-right: 20px;">\
                                    <select class="mustValue unitObj" name="">\
                                        <option value="g">g</option>\
                                        <option value="mg">mg</option>\
                                        <option value="ug">ug</option>\
                                        <option value="ml">ml</option>\
                                    </select>\
                                </div>\
                                <div class="layui-input-inline" style="width:116px;margin-right: 20px;">\
                                    <select name="" class="mustValue frequencyObj" lay-verify="" lay-search="">\
                                        <option value="">每日用次</option>\
                                        <option value="q.1/2h">q.1/2h</option>\
                                        <option value="q.h">q.h</option>\
                                        <option value="q.2h">q.2h</option>\
                                        <option value="q.3h">q.3h</option>\
                                        <option value="q.4h">q.4h</option>\
                                        <option value="q.6h">q.6h</option>\
                                        <option value="q.8h">q.8h</option>\
                                        <option value="q.12h">q.12h</option>\
                                        <option value="q.72h.">q.72h.</option>\
                                        <option value="q.d.">q.d.</option>\
                                        <option value="b.i.d.">b.i.d.</option>\
                                        <option value="t.i.d.">t.i.d.</option>\
                                        <option value="q.i.d.">q.i.d.</option>\
                                        <option value="Quingid">Quingid</option>\
                                        <option value="q.n.">q.n.</option>\
                                        <option value="q.o.d.">q.o.d.</option>\
                                        <option value="q.3d">q.3d</option>\
                                        <option value="q.w.">q.w.</option>\
                                        <option value="Biw">Biw</option>\
                                        <option value="Tiw">Tiw</option>\
                                        <option value="q.o.w.">q.o.w.</option>\
                                        <option value="2W">2W</option>\
                                        <option value="3W">3W</option>\
                                        <option value="4W">4W</option>\
                                        <option value="q.m.">q.m.</option>\
                                        <option value="b.i.m.">b.i.m.</option>\
                                        <option value="once">once</option>\
                                        <option value="St.">St.</option>\
                                        <option value="p.r.n.">p.r.n.</option>\
                                        <option value="s.o.s.">s.o.s.</option>\
                                        <option value="DC">DC</option>\
                                        <option value="12n">12n</option>\
                                        <option value="12mn">12mn</option>\
                                        <option value="a.c.">a.c.</option>\
                                        <option value="p.c.">p.c.</option>\
                                        <option value="t.i.d. a.c.">t.i.d. a.c.</option>\
                                        <option value="hs">hs</option>\
                                    </select>\
                                </div>\
                                <div class="layui-input-inline" style="width:116px;margin-right: 20px;">\
                                    <select name="" class="mustValue meansObj" lay-verify="" lay-search="">\
                                        <option value="">给药途径</option>\
                                        <option value="gtt">gtt</option>\
                                        <option value="id">id</option>\
                                        <option value="ih">ih</option>\
                                        <option value="im/m.">im/m.</option>\
                                        <option value="iv">iv</option>\
                                        <option value="ip">ip</option>\
                                        <option value="ivgtt">ivgtt</option>\
                                        <option value="p.o.">p.o.</option>\
                                        <option value="ad us.int.">ad us.int.</option>\
                                        <option value="ad us.ext.">ad us.ext.</option>\
                                        <option value="lnhal">lnhal</option>\
                                        <option value="ig">ig</option>\
                                    </select>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </li>');
            $(".listItem.active").prev(".divideLine").remove();
            $(".listItem.active").remove();
            layerRender();
            $(".cancelBtn").addClass("noClick");
        } else if ($(".listItem.active").parents(".itemBox").index() == 1) {
            // 短期医嘱 取消子医嘱
            $(".listItem.active").parents(".dataUl").append('<li class="dataItem">\
                <div class="headTopBox">\
                    <span>下达时间</span>\
                    <div class="selectTimeInput">\
                        <input type="text" class="mustValue arriveTimeObj" value="' + getNowTime() + '" readonly placeholder="点击选择" />\
                    </div>\
                </div>\
                <div class="divideLine">\
                </div>\
                <div class="listBottomBox">\
                    <div class="listItem">\
                        <span class="drugName nameObj">' + $(".listItem.active .drugName").html() + '</span>\
                        <div class="drugRule">\
                            <input type="text" class="mustValue singleNum" oninput="value=value.replace(/[^\\d]/g,\'\')" placeholder="单次计量">&nbsp;&nbsp;/&nbsp;&nbsp;\
                            <div class="layui-input-inline" style="width: 80px;margin-right: 20px;">\
                                <select class="mustValue unitObj" name="">\
                                    <option value="g">g</option>\
                                    <option value="mg">mg</option>\
                                    <option value="ug">ug</option>\
                                    <option value="ml">ml</option>\
                                </select>\
                            </div>\
                            <div class="layui-input-inline" style="width:116px;margin-right: 20px;">\
                                <select name="" class="mustValue meansObj" lay-verify="" lay-search="">\
                                    <option value="">给药途径</option>\
                                    <option value="gtt">gtt</option>\
                                    <option value="id">id</option>\
                                    <option value="ih">ih</option>\
                                    <option value="im/m.">im/m.</option>\
                                    <option value="iv">iv</option>\
                                    <option value="ip">ip</option>\
                                    <option value="ivgtt">ivgtt</option>\
                                    <option value="p.o.">p.o.</option>\
                                    <option value="ad us.int.">ad us.int.</option>\
                                    <option value="ad us.ext.">ad us.ext.</option>\
                                    <option value="lnhal">lnhal</option>\
                                    <option value="ig">ig</option>\
                                </select>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </li>');
            $(".listItem.active").prev(".divideLine").remove();
            $(".listItem.active").remove();
            layerRender();
            $(".cancelBtn").addClass("noClick");
        }
    });
    // 子医嘱 - end

    // 暂存 按钮
    $(".saveBtn").click(function () {
        if ($(".verdictArea").val() == '') {
            layer.msg("请填写会诊报告");
        } else {
            doctorEnjoinBuilder(cacheReportEnjoin);
        }
    });
    // 提交按钮
    $(".submitBtn").click(function () {
        if ($(".verdictArea").val() == '') {
            layer.msg("请填写会诊报告");
            return false;
        }
        for (let i = 0; i < $(".mustValue").length; i++) {
            if ($(".mustValue").eq(i).val() == '') {
                layer.msg("信息不完整");
                return false;
            }
        }
        doctorEnjoinBuilder(submitReportEnjoin);
    })
});