const pageNo = 1; // 页码
const pageSize = 10; // 每页条数
const count = 0; // 列表总条数
let draftsCount = 0; // 草稿箱总条数
let orderStateId = ''; // 订单id
// 日历表
let markJson = {}; // 日期标记
const myDate = new Date();
// dateStr 默认日期
let dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
// currentMonth 默认月份
let currentMonth = myDate.getMonth() + 1;

// 医生转诊订单列表
function getReferralList(orderStateId, pageNo, pageSize) {

    // ajaxRequest("POST", createPictureApplyUrl, data, false, false, true, createPictureApplySuccess, requestField, null);
    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'transferTreatment/doctorFindList',
    //     dataType: 'json',
    //     data: {
    //         "stateId": orderStateId,
    //         "pageNo": pageNo,
    //         "pageSize": pageSize,
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function (data) {
    //         console.log(data);
    //         if (data.code == 1) {
    //             const myDate = new Date();
    //             const year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    //             const month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    //             const day = double(myDate.getDate()); //获取当前日(1-31)
    //             let _html = '';
    //             const tempArr = data.data.orderList;
    //
    //             for (let i = 0; i < tempArr.length; i++) {
    //                 const timeStr = tempArr[i].time.split(' ')[0];
    //                 const time = tempArr[i].time.split(' ')[1];
    //                 const _year = timeStr.split('-')[0];
    //                 const _month = timeStr.split('-')[1];
    //                 const _day = timeStr.split('-')[2];
    //                 if (tempArr[i].inDoctorId && tempArr[i].inDoctorId == localStorage.getItem("userId")) {
    //                     // 会诊医生
    //                     if (tempArr[i].readFlag == 0) {
    //                         _html += '<tr class="unread" applyFlag="' + tempArr[i].readFlag + '" type="4" name="' + tempArr[i].id + '">'
    //                     } else {
    //                         _html += '<tr class="read" applyFlag="' + tempArr[i].readFlag + '" type="4" name="' + tempArr[i].id + '">'
    //                     }
    //                 } else {
    //                     // 首诊医生
    //                     if (tempArr[i].applyFlag == 0) {
    //                         _html += '<tr class="unread" applyFlag="' + tempArr[i].applyFlag + '" type="4" name="' + tempArr[i].id + '">'
    //                     } else {
    //                         _html += '<tr class="read" applyFlag="' + tempArr[i].applyFlag + '" type="4" name="' + tempArr[i].id + '">'
    //                     }
    //                 }
    //                 _html += '<td>\
    // 						<p class = "overHidden3" title="***/' + tempArr[i].sex + ' / ' + tempArr[i].age + ' / ' + tempArr[i].diagnosis + '"> ' + '***' + ' / ' + tempArr[i].sex + ' / ' + tempArr[i].age + ' / ' + tempArr[i].diagnosis + ' </p>\
    // 					</td>\
    //                     <td>\
    // 						<p class="overHidden1" title="' + (tempArr[i].inName ? tempArr[i].inName + ';' : '') + (tempArr[i].inTitle ? tempArr[i].inTitle + ';' : '') + (tempArr[i].inDeptName ? tempArr[i].inDeptName + ';' : '') + tempArr[i].inHospitalName + '">\
    // 							<' + (tempArr[i].inName ? tempArr[i].inName + ';' : '') + (tempArr[i].inTitle ? tempArr[i].inTitle + ';' : '') + (tempArr[i].inDeptName ? tempArr[i].inDeptName + ';' : '') + tempArr[i].inHospitalName + '>\
    // 						</p>\
    // 					</td>\
    // 					<td>\
    // 						<p class="overHidden2" style=" width:160px;" title="' + (tempArr[i].outName ? tempArr[i].outName + ';' : '') + (tempArr[i].outTitle ? tempArr[i].outTitle + ';' : '') + (tempArr[i].outDeptName ? tempArr[i].outDeptName + ';' : '') + tempArr[i].outHospitalName + '">\
    // 							<' + (tempArr[i].outName ? tempArr[i].outName + ';' : '') + (tempArr[i].outTitle ? tempArr[i].outTitle + ';' : '') + (tempArr[i].outDeptName ? tempArr[i].outDeptName + ';' : '') + tempArr[i].outHospitalName + '>\
    // 						</p>\
    // 					</td>'
    //                 if (year == _year && month == _month && day == _day) {
    //                     _html += '<td class="tl2em">今天' + time + '</td>'
    //                 } else {
    //                     _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
    //                 }
    //                 _html += '</tr>'
    //             }
    //
    //             $('#referralTableBody').html(_html);
    //         } else if (data.code == 250) {
    //             window.location = '/yilaiyiwang/login/login.html';
    //
    //         } else if (data.code == 205) {
    //             // 其他操作
    //             $('#referralTableBody').html('');
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     },
    // })
}

// 日期标记
function MouthSection(month) {
    const _date = new Date();
    const startDate = _date.getFullYear() + '-' + double(month) + '-01 00:00:00';
    _date.setMonth(month)
    _date.setDate(0);
    const endDate = _date.getFullYear() + '-' + double(month) + '-' + _date.getDate() + ' 23:59:59';
    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'order/doctorSchedulingList',
    //     dataType: 'json',
    //     data: {
    //         "startDate": startDate,
    //         "endDate": endDate
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     async: false,
    //     crossDomain: true,
    //     success: function (data) {
    //         console.log(data)
    //         if (data.status == 200) {
    //             const tempArr = data.dateList;
    //             for (let i = 0; i < tempArr.length; i++) {
    //                 markJson[tempArr[i]] = '';
    //             }
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //             // 其他操作
    //             markJson = {};
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     },
    // })
}

/* 医生当天内容 */
function doctorScheduling(startDate, endDate) {
    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'order/doctorScheduling',
    //     dataType: 'json',
    //     data: {
    //         "startDate": startDate,
    //         "endDate": endDate,
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function (data) {
    //         console.log(data)
    //         if (data.status == 200) {
    //             const tempArr = data.orderFormList;
    //             let _html = '';
    //             for (let i = 0; i < tempArr.length; i++) {
    //                 const time = tempArr[i].time.split(' ')[1];
    //                 _html += '<li class="wordItem" name="' + tempArr[i].id + '" inHospitalName="' + tempArr[i].inHospitalName + '" outHospitalName="' + tempArr[i].outHospitalName + '">\
    // 					<p><span class="timeText">' + time + '</span>已排期/视频会诊</p>\
    // 					<div class="contentBox">\
    // 						<p title="***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '">***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
    // 						<p title="收件人：' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '">收件人：' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '</p><p title="发件人：' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '">发件人：' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '</p></div></li>';
    //             }
    //             $('.workUl').append(_html);
    //             /* 日历 */
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else if (data.status == 205) {
    //             $('.workUl').html('');
    //         } else {
    //             // 其他操作
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     },
    // })
}

/**日期插件数据刷新*/
function redrawDate() {
    $('#test-n1').html('');
    layui.use('laydate', function () {
        const laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#test-n1',
            position: 'static',
            showBottom: false,
            value: dateStr,
            mark: markJson,
            change: function (value, date) { //监听日期被切换
                $('.workUl').html('');
                doctorScheduling(value + ' 00:00:00', value + ' 23:59:00');
                if (currentMonth != date.month) {
                    dateStr = date.year + '-' + date.month + '-' + date.date;
                    currentMonth = date.month;
                    MouthSection(date.month);
                    redrawDate();
                }
            }
        });
    });
}


function renderApplyListView(data) {
    console.log(data)
    const myDate = new Date();
    const year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    const month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    const day = double(myDate.getDate()); //获取当前日(1-31)
    let _html = '';
    for (let i = 0; i < data.length; i++) {
        const timeStr = data[i].consultantApplyTime.split(' ')[0];
        const time = data[i].consultantApplyTime.split(' ')[1];
        const _year = timeStr.split('-')[0];
        const _month = timeStr.split('-')[1];
        const _day = timeStr.split('-')[2];
        if (data[i].applyUrgent == 0) {
            // 未读
            _html += '<tr class="unread" applyFlag="' + data[i].applyUrgent + '" type="2" name="' + data[i].id + '">\
                            <td>';
        } else {
            // 已读
            _html += '<tr class="read" applyFlag="' + data[i].applyUrgent + '" type="2" name="' + data[i].id + '">\
                            <td>';
        }
        if (data[i].applyUrgent == 1) {
            _html += '<img class="w14" src="../images/light.png" />'
        }
        _html += '</td>\
                <td>\
                    <p class="overHidden3" title="' + data[i].caseSummary + '">' + data[i].caseSummary + '</p>\
                </td>\
                <td>\
                    <p class="overHidden1" title="' + data[i].inviteSummary + '">' + data[i].inviteSummary + '</p>\
                </td>\
                <td>\
                    <p class="overHidden2" title="' + data[i].applySummary + '">' + data[i].applySummary + '</p>\
                </td>'
        if (data[i].applyType == "APPLY_CONSULTATION_VIDEO") {
            _html += '<td class="tc">视频</td>'
        } else {
            _html += '<td class="tc">图文</td>'
        }
        if (year == _year && month == _month && day == _day) {
            _html += '<td class="tl2em">今天' + time + '</td>'
        } else {
            _html += '<td class="tl2em">' + data[i].consultantApplyTime + '</td>'
        }
        _html += '</tr>'
    }
    $('#tabContent').html(_html);
}

function emptySelect() {
    $('#tabContent').html("");
}

// 医生受邀订单列表
function getInvitedList(inviteStatus, pageNo, pageSize) {
    const data = {"inviteStatus": orderStateId, "pageNo": pageNo, "pageSize": pageSize};
    console.log(inviteStatus)
    let InviteStatus = {
        INVITE_ACCEPT: "INVITE_ACCEPT",
        INVITE_REVIEW: "INVITE_REVIEW",
        INVITE_DATETIME: "INVITE_DATETIME",
        INVITE_ONGOING: "INVITE_ONGOING",
        INVITE_FEEDBACK: "INVITE_FEEDBACK",
        INVITE_REJECT: "INVITE_REJECT",
        INVITE_DONE: "INVITE_DONE"
    };
    switch (inviteStatus) {
        case InviteStatus.INVITE_ACCEPT:
            ajaxRequest("GET", getInviteAcceptUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_REVIEW:
            ajaxRequest("GET", getInviteReviewUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_DATETIME:
            ajaxRequest("GET", getInviteDateTimeUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_ONGOING:
            ajaxRequest("GET", getInviteOngoingUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_FEEDBACK:
            ajaxRequest("GET", getInviteFeedbackUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_REJECT:
            ajaxRequest("GET", getInviteRejectUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_DONE:
            ajaxRequest("GET", getInviteDoneUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        default:
            return false;
    }
}

// 医生发出订单列表
function getApplyList(inviteStatus, pageNo, pageSize) {
    console.log(inviteStatus)
    let ApplyStatus = {
        APPLY_REVIEW: "APPLY_REVIEW",
        APPLY_ACCEPT: "APPLY_ACCEPT",
        APPLY_DATETIME: "APPLY_DATETIME",
        APPLY_ONGOING: "APPLY_ONGOING",
        APPLY_FEEDBACK: "APPLY_FEEDBACK",
        APPLY_REJECT: "APPLY_REJECT",
        APPLY_DONE: "APPLY_DONE"
    };
    switch (inviteStatus) {
        case ApplyStatus.APPLY_REVIEW:
            ajaxRequest("GET", getApplyReviewByAdminUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_ACCEPT:
            ajaxRequest("GET", getApplyAcceptByAdminUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_DATETIME:
            ajaxRequest("GET", getApplyDateTimeByAdminUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_ONGOING:
            ajaxRequest("GET", getApplyOngoingByAdminUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_FEEDBACK:
            ajaxRequest("GET", getApplyFeedbackByAdminUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_REJECT:
            ajaxRequest("GET", getApplyRejectByAdminUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_DONE:
            ajaxRequest("GET", getApplyDoneByAdminUrl, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        default:
            return false;
    }
}

// 获取草稿箱数据
function getDrafts(pageNo, pageSize) {
    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'order/queryDraft',
    //     dataType: 'json',
    //     data: {
    //         "pageNo": pageNo,
    //         "pageSize": pageSize,
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function (data) {
    //         console.log(data)
    //         if (data.status == 200) {
    //             const myDate = new Date();
    //             const year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    //             const month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    //             const day = double(myDate.getDate()); //获取当前日(1-31)
    //             const tempArr = data.draftOrderList;
    //             let _html = '';
    //             for (let i = 0; i < tempArr.length; i++) {
    //                 const timeStr = tempArr[i].time.split(' ')[0];
    //                 const time = tempArr[i].time.split(' ')[1];
    //                 const _year = timeStr.split('-')[0];
    //                 const _month = timeStr.split('-')[1];
    //                 const _day = timeStr.split('-')[2];
    //                 _html += '<tr name="' + tempArr[i].id + '">\
    // 					<td>\
    // 						<p class="w520" title="' + tempArr[i].name + '/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '">' + tempArr[i].name + '/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p></td>';
    //                 if (year == _year && month == _month && day == _day) {
    //                     _html += '<td class="tl2em">今天' + time + '</td>';
    //                 } else {
    //                     _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
    //                 }
    //                 _html += '</tr>'
    //             }
    //             $('.drafts_tbody').html(_html);
    //         } else if (data.status == 250) {
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //             // 其他操作
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     },
    // })
}

// 查看订单详情
function selectOrderById(orderId, type, readFlag) {
    // let data = {
    //     "orderId": orderId,
    //     "type": type, //是那个列表的类型(0:医政受邀列表,1:医政发出列表,2:医生受邀列表,3:医生发出列表)
    //     "readFlag": readFlag
    // }
    // ajaxRequest("POST", "", data, false, false, false, null, null, null);
    let data = {"applyFormId": orderId};
    ajaxRequest("GET", getApplyInfoUrl, data, true, "application/json", true, getApplyInfoSuccess, null, null)

    function getApplyInfoSuccess(result) {
        console.log(result);
        sessionStorage.setItem('applyInfo', JSON.stringify(result));
        window.location = '../page/adminApplyInfo.html';
    }
    console.log(data)
    sessionStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('orderId', orderId);
    function success() {

        if (type == 2) {
            // -------受邀的----------
            if (data.orderFormBean.statesName == "首诊待审核") {
                // 待审核
            } else if (data.orderFormBean.statesName == "待收诊" || data.orderFormBean.statesName == "专家协调") {
                window.location = '../page/RcollectingClinical.html';
            } else if (data.orderFormBean.statesName == "排期审核") {
                window.location = '/yilaiyiwang/receive/schedulingExamine.html';
            } else if (data.orderFormBean.statesName == "已排期") {
                window.location = '/yilaiyiwang/receive/scheduling.html';
            } else if (data.orderFormBean.statesName == "会诊中") {
                window.location = '/yilaiyiwang/receive/Rconsultation.html'
            } else if (data.orderFormBean.statesName == "待反馈") {
                window.location = '/yilaiyiwang/receive/Rfeedback.html'
            } else if (data.orderFormBean.statesName == "已结束") {
                window.location = '/yilaiyiwang/receive/Rfinish.html'
            } else if (data.orderFormBean.statesName == "会诊已拒收") {
                window.location = '/yilaiyiwang/receive/Rrejection.html'
            }
        } else if (type == 3) {
            // --------------发出的-----
            if (data.orderFormBean.statesName == "首诊待审核") {
                window.location = '/yilaiyiwang/particulars/toAudit.html';
            } else if (data.orderFormBean.statesName == "待收诊" || data.orderFormBean.statesName == "排期审核" || data.orderFormBean.statesName == "专家协调") {
                window.location = '/yilaiyiwang/particulars/collectingClinical.html';
            } else if (data.orderFormBean.statesName == "已排期") {
                window.location = '/yilaiyiwang/particulars/scheduling.html';
            } else if (data.orderFormBean.statesName == "会诊中") {
                window.location = '/yilaiyiwang/particulars/consultation.html'
            } else if (data.orderFormBean.statesName == "待反馈") {
                window.location = '/yilaiyiwang/particulars/feedback.html'
            } else if (data.orderFormBean.statesName == "已结束") {
                window.location = '/yilaiyiwang/particulars/finish.html'
            } else if (data.orderFormBean.statesName == "会诊已拒收") {
                window.location = '/yilaiyiwang/particulars/rejection.html'
            }
        }
    }
}

// 查看转诊订单详情
// transferTreatmentId 订单id readFlag 未读标记(0:未读,1:已读)
function findTransferTreatmentInfo(transferTreatmentId, readFlag) {
    $.ajax({
        type: 'POST',
        url: IP + 'transferTreatment/findTransferTreatmentInfo',
        dataType: 'json',
        data: {
            "transferTreatmentId": transferTreatmentId,
            "group": 0, //(0:医生,1:医政)
            "readFlag": readFlag,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        success: function (data) {
            console.log(data)
            if (data.code == 1) {
                localStorage.setItem('transferTreatmentId', transferTreatmentId);
                window.location = '/yilaiyiwang/referralOrder/referralDoctorOrder.html';
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
    })
}

// 草稿箱分页
// layui.use('laypage', function () {
//     var laypage = layui.laypage;
//     //执行一个laypage实例
//     laypage.render({
//         elem: 'drafts',
//         count: draftsCount,
//         limit: pageSize,
//         theme: '#f6c567',
//         jump: function (obj, first) {
//             getDrafts(obj.curr, pageSize);
//         }
//     });
// });

$(function () {

    /*日历点击显示隐藏 */
    $("#calender").animate({
        left: 300
    }, "slow");
    $(".small_button").click(function () {
        const div = $(".wrap");
        if (div.hasClass("dest")) {
            div.removeClass("dest").animate({
                right: -400
            }, "slow");
            $(".small_button span").html("工 作 日 历 表");
            $(this).css("height", "160px");

        } else {
            div.addClass("dest").animate({
                right: 0
            }, "slow");
            $(".small_button").css(" height", "200px");
            $(".small_button span").html("收 起");
            $(this).css({
                "height": "100px",
                "border-radius": "0 0 0 10px;"
            });
        }
    });

    MouthSection(currentMonth);

    doctorScheduling(dateStr + ' 00:00:00', dateStr + ' 23:59:00')
    // 渲染日历控件
    redrawDate();

    // 查询草稿数量
    // $.ajax({
    //     type: 'GET',
    //     url: IP + 'order/draftSize',
    //     dataType: 'json',
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     async: false,
    //     crossDomain: true,
    //     global: false,
    //     success: function (data) {
    //         if (data.status == 200) {
    //             // 成功操作
    //             $('.unReadNum').html(data.size);
    //             draftsCount = data.size;
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     },
    // });

    /* 左边导航栏 医生受邀请列表 */
    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'doctorOrderStatus/findOrderStatus',
    //     dataType: 'json',
    //     data: {
    //         "type": '2', //(0:医政受邀列表,1:医政发出列表,2:医生受邀，3医生发出
    //     },
    //     async: false,
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     success: function (data) {
    //         console.log(data)
    //         if (data.status == 200) {
    //             const tempArr = data.doctorOrderStatusList;
    //             let _html = '';
    //             for (let i = 0; i < tempArr.length; i++) {
    //                 if (i == 0) {
    //                     if (tempArr[i].unReadFlag == 0) {
    //                         _html += '<li name="' + tempArr[i].states.id + '" class="ulAct">\
    // 					<span> ' + tempArr[i].statesName + ' </span>\
    // 					<div class=""></div>\
    // 				</li>'
    //                     } else {
    //                         _html += '<li name="' + tempArr[i].states.id + '" class="ulAct">\
    // 					<span> ' + tempArr[i].statesName + ' </span>\
    // 					<div class = "unRead" > ' + tempArr[i].orderSize + ' </div>\
    // 				</li>'
    //                     }
    //                 } else {
    //                     if (tempArr[i].unReadFlag == 0) {
    //                         _html += '<li name="' + tempArr[i].states.id + '" class="">\
    // 					<span> ' + tempArr[i].statesName + ' </span>\
    // 					<div class=""></div>\
    // 				</li>'
    //                     } else {
    //                         _html += '<li name="' + tempArr[i].states.id + '" class="">\
    // 					<span> ' + tempArr[i].statesName + ' </span>\
    // 					<div class = "unRead" > ' + tempArr[i].orderSize + ' </div>\
    // 				</li>'
    //                     }
    //                 }
    //             }
    //             $('#inviteUl').html(_html);
    //             getInvitedList(tempArr[0].states.id, pageNo, pageSize);
    //             orderStateId = tempArr[0].states.id;
    //             localStorage.setItem("orderType", 2);
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //             // 其他操作
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     },
    // });

    // 列表的切换
    $('.leftNav').click(function () {
        let _index = $(this).index();
        $(this).addClass('active').siblings('div').removeClass('active');
        console.log(_index)
        if (_index == 0) {
            // 医生受邀列表
            localStorage.setItem('orderType', '2');
            $('.drafts_table').css("display", 'none');
            $('.referralTable').css("display", 'none');
            $('.tables').css('display', 'block');
            $('.recipients').css('width', '160px');
            $('.originator').css('width', '270px');
            $(".ulAct").removeClass("ulAct");
            $(this).find(".leftUL li").eq(0).addClass("ulAct");
            let inviteStatus = $(this).find(".leftUL li").eq(0).attr('name');
            let countNum = 0;
            // $.ajax({
            //     type: 'POST',
            //     url: IP + 'order/queryReceiveOrderList',
            //     dataType: 'json',
            //     data: {
            //         "orderStateId": orderStateId,
            //         "pageNo": pageNo,
            //         "pageSize": pageSize,
            //     },
            //     async: false,
            //     xhrFields: {
            //         withCredentials: true
            //     },
            //     crossDomain: true,
            //     global: false,
            //     success: function (data) {
            //         console.log(data)
            //         if (data.status == 200) {
            //             countNum = data.pageSize * pageSize; // 当前li Tab 下的总条数
            //         } else if (data.status == 250) {
            //             // 未登录操作
            //         } else if (data.status == 205) {
            //             // 其他操作
            //             $('#tabContent').html('');
            //         }
            //     },
            //     error: function (err) {
            //         console.log(err);
            //     },
            // })
            layui.use('laypage', function () {
                const laypage = layui.laypage;
                //执行一个laypage实例
                laypage.render({
                    elem: 'listBox',
                    count: countNum,
                    limit: pageSize,
                    theme: '#f6c567',
                    jump: function (obj, first) {
                        getInvitedList(inviteStatus, obj.curr, pageSize);
                    }
                });
            });
        } else if (_index == 1) {
            // 1:医生发出列表
            /* 左边导航栏 医生发出列表 */
            // $.ajax({
            //     type: 'POST',
            //     url: IP + 'doctorOrderStatus/findOrderStatus',
            //     dataType: 'json',
            //     data: {
            //         "type": '3', //(0:医政受邀列表,1:医政发出列表,2:医生受邀，3医生发出
            //     },
            //     xhrFields: {
            //         withCredentials: true
            //     },
            //     async: false,
            //     crossDomain: true,
            //     global: false,
            //     success: function (data) {
            //         console.log(data)
            //         if (data.status == 200) {
            //             const tempArr = data.doctorOrderStatusList;
            //             let _html = '';
            //             for (let i = 0; i < tempArr.length; i++) {
            //                 if (tempArr[i].unReadFlag == 0) {
            //                     _html += '<li name="' + tempArr[i].states.id + '" class="">\
            // 			<span>' + tempArr[i].statesName + '</span>\
            // 			<div class=""></div>\
            // 		</li>'
            //                 } else {
            //                     _html += '<li name="' + tempArr[i].states.id + '" class="">\
            // 			<span> ' + tempArr[i].statesName + ' </span>\
            // 			<div class="unRead">' + tempArr[i].orderSize + '</div>\
            // 		</li>'
            //                 }
            //             }
            //             $('#issueUl').html(_html);
            //             // 成功操作
            //         } else if (data.status == 250) {
            //             // 未登录操作
            //             window.location = '/yilaiyiwang/login/login.html';
            //         } else {
            //             // 其他操作
            //         }
            //     },
            //     error: function (err) {
            //         console.log(err);
            //     },
            // });
            localStorage.setItem('orderType', '3');
            $('.drafts_table').css("display", 'none');
            $('.referralTable').css("display", 'none');
            $('.tables').css('display', 'block');
            $('.recipients').css('width', '270px');
            $('.originator').css('width', '160px');
            $(".ulAct").removeClass("ulAct");
            $(this).find('.leftUL li').eq(0).addClass("ulAct");
            // $(this).children("div").removeClass("unRead");
            // if ($("#leftUL").children().find(".unRead").length == 0) {
            //     $("#leftTitle").next("div").removeClass("unRead");
            // }
            let applyStatus = $(this).find('.leftUL li').eq(0).attr('name');
            let countNum = 0;
            // $.ajax({
            //     type: 'POST',
            //     url: IP + 'order/queryApplyOrderList',
            //     dataType: 'json',
            //     data: {
            //         "orderStateId": orderStateId,
            //         "pageNo": pageNo,
            //         "pageSize": pageSize,
            //     },
            //     async: false,
            //     xhrFields: {
            //         withCredentials: true
            //     },
            //     crossDomain: true,
            //     global: false,
            //     success: function (data) {
            //         console.log(data)
            //         if (data.status == 200) {
            //             countNum = data.pageSize * pageSize;
            //         } else if (data.status == 250) {
            //             window.location = '/yilaiyiwang/login/login.html';
            //
            //         } else if (data.status == 205) {
            //             // 其他操作
            //             $('#tabContent').html('');
            //         }
            //     },
            //     error: function (err) {
            //         console.log(err);
            //     },
            // })
            layui.use('laypage', function () {
                const laypage = layui.laypage;
                //执行一个laypage实例
                laypage.render({
                    elem: 'listBox',
                    count: countNum,
                    limit: pageSize,
                    theme: '#f6c567',
                    jump: function (obj, first) {
                        getApplyList(applyStatus, obj.curr, pageSize);
                    }
                });
            });
        } else if (_index == 2) {
            // 医生转诊列表
            localStorage.setItem('orderType', '4');
            $('.drafts_table').css("display", 'none');
            $('.tables').css('display', 'none');
            $('.referralTable').css("display", 'block');
            $('.recipients').css('width', '270px');
            $('.originator').css('width', '160px');
            $(".ulAct").removeClass("ulAct");
            $(this).find(".leftUL li").eq(0).addClass("ulAct");
            // $(this).children("div").removeClass("unRead");
            // if ($("#leftUL").children().find(".unRead").length == 0) {
            //     $("#leftTitle").next("div").removeClass("unRead");
            // }
            let inviteStatus = $(this).find(".leftUL li").eq(0).attr('name');
            let countNum = 0;
            // $.ajax({
            //     type: 'POST',
            //     url: IP + 'transferTreatment/doctorFindList',
            //     dataType: 'json',
            //     data: {
            //         "stateId": orderStateId,
            //         "pageNo": pageNo,
            //         "pageSize": pageSize,
            //     },
            //     async: false,
            //     xhrFields: {
            //         withCredentials: true
            //     },
            //     crossDomain: true,
            //     global: false,
            //     success: function (data) {
            //         console.log(data)
            //         if (data.code == 1) {
            //             countNum = data.data.pageSize * pageSize;
            //         } else if (data.code == 250) {
            //             window.location = '/yilaiyiwang/login/login.html';
            //
            //         } else if (data.code == 205) {
            //             // 其他操作
            //             $('#referralTableBody').html('');
            //         }
            //     },
            //     error: function (err) {
            //         console.log(err);
            //     },
            // })
            layui.use('laypage', function () {
                const laypage = layui.laypage;
                //执行一个laypage实例
                laypage.render({
                    elem: 'referralListBox',
                    count: countNum,
                    limit: pageSize,
                    theme: '#f6c567',
                    jump: function (obj, first) {
                        getReferralList(inviteStatus, obj.curr, pageSize);
                    }
                });
            });
        } else if (_index == 3) {
            $('.drafts_table').css("display", 'block');
            $('.tables').css('display', 'none');
            $('.referralTable').css("display", 'none');
            getDrafts(pageNo, pageSize);
        }
    });

    // 受邀ul切换 queryReceiveOrderList
    $("#inviteUl").delegate('li', 'click', function () {
        $('.recipients').css('width', '160px');
        $('.originator').css('width', '270px');
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        let inviteStatus = $(this).attr('name');
        let countNum = 0;
        layui.use('laypage', function () {
            const laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: countNum,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    getInvitedList(inviteStatus, obj.curr, pageSize);
                }
            });
        });
        return false;
    });

    // 发出ul切换
    $("#issueUl").delegate('li', 'click', function () {
        $('.recipients').css('width', '270px');
        $('.originator').css('width', '160px');
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        // $(this).children("div").removeClass("unRead");
        // if ($("#leftUL").children().find(".unRead").length == 0) {
        //     $("#leftTitle").next("div").removeClass("unRead");
        // }
        let applyStatus = $(this).attr('name');
        let countNum = 0;
        layui.use('laypage', function () {
            const laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: countNum,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    getApplyList(applyStatus, obj.curr, pageSize);
                }
            });
        });
        return false;
    });
    // 转诊ul切换 transferTreatment/doctorFindList
    $("#referralUl").delegate('li', 'click', function () {
        $('.recipients').css('width', '270px');
        $('.originator').css('width', '160px');
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        // $(this).children("div").removeClass("unRead");
        // if ($("#leftUL").children().find(".unRead").length == 0) {
        //     $("#leftTitle").next("div").removeClass("unRead");
        // }
        orderStateId = $(this).attr('name');
        let countNum = 0;
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'transferTreatment/doctorFindList',
        //     dataType: 'json',
        //     data: {
        //         "stateId": orderStateId,
        //         "pageNo": pageNo,
        //         "pageSize": pageSize,
        //     },
        //     async: false,
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     crossDomain: true,
        //     global: false,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.code == 1) {
        //             countNum = data.data.pageSize * pageSize;
        //         } else if (data.code == 250) {
        //             window.location = '/yilaiyiwang/login/login.html';
        //
        //         } else if (data.code == 205) {
        //             // 其他操作
        //             $('#referralTableBody').html('');
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // })
        layui.use('laypage', function () {
            const laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'referralListBox',
                count: countNum,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    getReferralList(orderStateId, obj.curr, pageSize);
                }
            });
        });
        return false;
    });


    // 会诊列表详情
    $('#tabContent').delegate('tr', 'click', function () {
        selectOrderById($(this).attr('name'), $(this).attr('type'), $(this).attr('applyFlag'));
    });
    // 转诊列表详情
    $('#referralTableBody').delegate('tr', 'click', function () {
        findTransferTreatmentInfo($(this).attr('name'), $(this).attr('applyFlag'))
    });

    // 医生工作台详情
    $('.workUl').delegate('.wordItem', "click", function () {
        if ($(this).attr("inhospitalname") == localStorage.getItem("hospitalName")) {
            selectOrderById($(this).attr("name"), 2, 1);
        } else if ($(this).attr("outhospitalname") == localStorage.getItem("hospitalName")) {
            selectOrderById($(this).attr("name"), 3, 1);
        }
    })


    // 草稿箱详情
    $('.drafts_tbody').delegate('tr', 'click', function () {
        localStorage.setItem('detailsId', $(this).attr('name'));
        window.location = '/yilaiyiwang/detailsDraft/detailsDraft.html';
    })

})
