/**
 * 渲染 科室联动一级下拉列表
 * @param branchList
 */
function renderFirstLevelBranchSelect(branchList){
    let tempArr = branchList;
    let _html = '<option value="">请选择</option>';
    for (let i = 0; i < tempArr.length; i++) {
        _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].branchName + '</option>';
        sessionStorage.setItem(tempArr[i].id,JSON.stringify(tempArr[i].customBranchList));
    }
    $('.oneDeptSelect').html(_html);
}

/**
 * 渲染 科室联动二级下拉列表
 * @param branchList
 */
function renderSecondLevelBranchSelect(branchList){
    let tempArr = branchList;
    let _html = '<option value="">请选择</option>';
    for (let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].customName){
            _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].customName + '</option>';
        }else{
            // _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].baseBranchName + '</option>';
        }
    }
    $('.twoDeptSelect').html(_html);
}

/**
 * 渲染日程内容列表
 */
function renderScheduledTable(scheduledList) {
    // 成功操作
    dateTempList = []; // 收集的时间段
    let tempArr = scheduledList;
    let _html = '';
    for (let i = 0; i < tempArr.length; i++) {
        let date = tempArr[i].consultantStartTime.split(' ')[0];
        // let date = tempArr[i].time.split(' ')[0];
        let startDate = tempArr[i].consultantStartTime.split(' ')[1];
        let hours = startDate.split(':')[0];
        let minute = startDate.split(':')[1];
        let startIndex = (hours * 60 + minute * 1) / 15;
        let endDate = tempArr[i].consultantEndTime.split(' ')[1];
        let endHour = endDate.split(':')[0];
        let endMinute = endDate.split(':')[1];
        let endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
        dateTempList.push({
            "date": date,
            "startIndex": startIndex,
            "endIndex": endIndex - 1,
        });
        _html += '<tr name="' + tempArr[i].id + '" inHospitalName="' + tempArr[i].inHospitalName + '" outHospitalName="' + tempArr[i].outHospitalName + '">\
                      <td style="padding-left:50px;">' + startDate + '</td>\
                      <td>'
        if (tempArr[i].applyUrgent == "0") {
            _html += '<img class="" src="../images/light.png" />'
        }
        _html += '</td>\
                      <td>'
        if (tempArr[i].applyType == "APPLY_CONSULTATION_VIDEO" ||tempArr[i].applyType == "APPLY_CONSULTATION_IMAGE_TEXT") {
            _html += '会诊'
        } else {
            _html += '转诊'
        }
        _html += '</td>\
                      <td title="' + tempArr[i].inviteSummary  + '">' + tempArr[i].inviteSummary + '</td><td title="' + tempArr[i].applySummary + '">' + tempArr[i].applySummary  + '</td><td>'
        if (tempArr[i].applyType == "APPLY_CONSULTATION_IMAGE_TEXT") {
            _html += '图文会诊';
        } else {
            _html += '视频会诊';
        }
        _html += '</td>\
                  </tr>'
    }
    $('.bodyContent').html(_html);
    $('#timeUl > li').removeClass('active');
    for (let i = 0; i < dateTempList.length; i++) {
        for (let j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
            $('#timeUl > li').eq(j).addClass('active');
        }
    }
}
/**
 * 渲染 时间 表 页面
 */
function renderTimeView(){
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




let markJson = {};
let myDate = new Date();
let dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
let currentMonth = myDate.getMonth() + 1;
let deptId = '';

function MouthSection(month) {
    let _date = new Date();
    // let startDate = _date.getFullYear() + '-' + double(month) + '-01 00:00:00';
    // _date.setMonth(month)
    // _date.setDate(0);
    // let endDate = _date.getFullYear() + '-' + double(month) + '-' + _date.getDate() + ' 23:59:59';
    // console.log(_date.getFullYear() + '-' + double(month));

    let formData = new FormData();
    formData.append("date",_date.getFullYear() + '-' + double(month));
    formData.append("branchId",$('.twoDeptSelect').val());
    function findSchedulingSuccess(data) {
        markJson = {};
        let tempArr = data;
        for (let i = 0; i < tempArr.length; i++) {
            markJson[tempArr[i]] = '';
        }
        redrawDate();
    }
    ajaxRequest("POST",findSchedulingUrl,formData,false,false,true,findSchedulingSuccess,null,null);

    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'order/deptSchedulingList',
    //     dataType: 'json',
    //     data: {
    //         "deptId": deptId,
    //         "startDate": startDate,
    //         "endDate": endDate
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     async: false,
    //     crossDomain: true,
    //     success: function(data) {
    //         console.log(data)
    //         markJson = {};
    //         if (data.status == 200) {
    //             var tempArr = data.dateList;
    //             for (var i = 0; i < tempArr.length; i++) {
    //                 markJson[tempArr[i]] = '';
    //             }
    //         }
    //     },
    //     error: function(err) {
    //         console.log(err);
    //     },
    // })
}

function redrawDate() {
    $('#timeBox').html('');
    layui.use('laydate', function() {
        let laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#timeBox',
            position: 'static',
            showBottom: false,
            value: dateStr,
            // min: '2019-5-1',
            // max: '2022-5-1',
            mark: markJson,
            change: function(value, date) { //监听日期被切换
                // deptScheduling(value + ' 00:00:00', value + ' 23:59:00');
                deptScheduling(value);
                if (currentMonth != date.month) {
                    currentMonth = date.month;
                    MouthSection(date.month);
                    dateStr = date.year + '-' + date.month + '-' + date.date;
                    redrawDate();
                }
            }
        });
    });

}


// 科室排班查询接口、
function deptScheduling(date) {
    let queryParam = new FormData();
    queryParam.append("date",date);
    queryParam.append("branchId",$('.twoDeptSelect').val());
    ajaxRequest("POST",findScheduledUrl,queryParam,false,false,true,renderScheduledTable,null,null);

    //查询 排期内容
    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'order/deptScheduling',
    //     dataType: 'json',
    //     data: {
    //         "deptId": $('.twoDeptSelect').val(),
    //         "startDate": startDate,
    //         "endDate": endDate,
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function(data) {
    //         console.log(data)
    //         if (data.status == 200) {
    //             // 成功操作
    //             dateTempList = []; // 收集的时间段
    //             var tempArr = data.orderFormList;
    //             var _html = '';
    //             for (var i = 0; i < tempArr.length; i++) {
    //                 var date = tempArr[i].time.split(' ')[0];
    //                 var startDate = tempArr[i].time.split(' ')[1];
    //                 var hours = startDate.split(':')[0];
    //                 var minute = startDate.split(':')[1];
    //                 var startIndex = (hours * 60 + minute * 1) / 15;
    //                 var endDate = tempArr[i].endTime.split(' ')[1];
    //                 var endHour = endDate.split(':')[0];
    //                 var endMinute = endDate.split(':')[1];
    //                 var endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
    //                 dateTempList.push({
    //                     "date": date,
    //                     "startIndex": startIndex,
    //                     "endIndex": endIndex - 1,
    //                 });
    //                 _html += '<tr name="' + tempArr[i].id + '" inHospitalName="' + tempArr[i].inHospitalName + '" outHospitalName="' + tempArr[i].outHospitalName + '">\
    //                   <td style="padding-left:50px;">' + startDate + '</td>\
    //                   <td>'
    //                 if (tempArr[i].isurgent == 1) {
    //                     _html += '<img class="" src="/yilaiyiwang/images/light.png" />'
    //                 }
    //                 _html += '</td>\
    //                   <td>'
    //                 if (tempArr[i].orderType == 0) {
    //                     _html += '会诊'
    //                 } else {
    //                     _html += '转诊'
    //                 }
    //                 _html += '</td>\
    //                   <td title="' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '"><' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '></td><td title="' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '"><' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '></td><td>'
    //                 if (tempArr[i].manner == '0') {
    //                     _html += '图文会诊';
    //                 } else {
    //                     _html += '视频会诊';
    //                 }
    //                 _html += '</td>\
    //               </tr>'
    //             }
    //             $('.bodyContent').html(_html);
    //             $('#timeUl > li').removeClass('active');
    //             for (var i = 0; i < dateTempList.length; i++) {
    //                 for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
    //                     $('#timeUl > li').eq(j).addClass('active');
    //                 }
    //             }
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else if (data.status == 205) {
    //             $('.bodyContent').html('<p class="noData">无预约</p>');
    //             $('#timeUl > li').removeClass('active');
    //             // 其他操作
    //         } else if (data.status == 502) {
    //             layer.msg('请选择科室');
    //         }
    //     },
    //     error: function(err) {
    //         console.log(err);
    //
    //     },
    // });
}
$(function() {
    //1.加载两级联动科室数据
    ajaxRequest("GET",getTwoLevelLinkageBranchUrl,"",false,false,true,renderFirstLevelBranchSelect,null,null);

    $('.oneDeptSelect').change(function() {
        renderSecondLevelBranchSelect(JSON.parse(sessionStorage.getItem(($(this).val()))));
    });
    renderTimeView();



    let dateTempList = [];
    // 渲染日历控件
    redrawDate();



    $('.twoDeptSelect').change(function() {
        // deptScheduling(dateStr + ' 00:00:00', dateStr + ' 23:59:00');
        deptScheduling(dateStr);
        MouthSection(currentMonth);
        // 渲染日历控件
        redrawDate();
    });

    // 科室日历筛选出的订单列表操作
    $('.bodyContent').delegate('tr', 'click', function() {
        // 查看订单详情
        localStorage.setItem('applyFormId', $(this).attr("name"));
        window.location = '../page/adminApplyInfo.html';
        return false;
    })

});
