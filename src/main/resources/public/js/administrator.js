let applyFormId = ''; // 订单id
let countObject = {};
let pageCount = 10;

let markJson = {}; // 日期标记
const myDate = new Date();
let dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
let currentMonth = myDate.getMonth() + 1;
let isInvite = true;
const InviteStatus = {
    INVITE_ACCEPT: "INVITE_ACCEPT",
    INVITE_REVIEW: "INVITE_REVIEW",
    INVITE_SLAVE_REJECT: "INVITE_SLAVE_REJECT",
    INVITE_DATETIME: "INVITE_DATETIME",
    INVITE_ONGOING: "INVITE_ONGOING",
    INVITE_FEEDBACK: "INVITE_FEEDBACK",
    INVITE_REJECT: "INVITE_REJECT",
    INVITE_DONE: "INVITE_DONE"
};
const ApplyStatus = {
    APPLY_REVIEW: "APPLY_REVIEW",
    APPLY_ACCEPT: "APPLY_ACCEPT",
    APPLY_DATETIME: "APPLY_DATETIME",
    APPLY_ONGOING: "APPLY_ONGOING",
    APPLY_FEEDBACK: "APPLY_FEEDBACK",
    APPLY_REJECT: "APPLY_REJECT",
    APPLY_DONE: "APPLY_DONE"
};
const ReferralStatus = {
    WAITING_AUDIT: "WAITING_AUDIT",
    WAITING_ACCEDE: "WAITING_ACCEDE",
    DATETIME_AUDIT: "DATETIME_AUDIT",
    DATETIME_LOCKED: "DATETIME_LOCKED",
    HAS_REJECT: "HAS_REJECT",
    HAS_END: "HAS_END"
};

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
    console.log(data);
    const myDate = new Date();
    const year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    const month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    const day = double(myDate.getDate()); //获取当前日(1-31)
    let _html = '';
    for (let i = 0; i < data.length; i++) {
        const timeStr = data[i].updateTime.split(' ')[0];
        const time = data[i].updateTime.split(' ')[1];
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
            _html += '<td class="tl2em">' + data[i].updateTime + '</td>'
        }
        _html += '</tr>'
    }
    $('#tabContent').html(_html);
}

function renderApplyInquiryListView(data) {
    const myDate = new Date();
    const year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    const month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    const day = double(myDate.getDate()); //获取当前日(1-31)
    let _html = '';
    for (let i = 0; i < data.length; i++) {
        const timeStr = data[i].updateTime.split(' ')[0];
        const time = data[i].updateTime.split(' ')[1];
        const _year = timeStr.split('-')[0];
        const _month = timeStr.split('-')[1];
        const _day = timeStr.split('-')[2];
        if (0 == 0) {
            // 未读
            _html += '<tr class="unread" applyFlag="' + data[i].applyUrgent + '" type="2" name="' + data[i].id + '">';
        } else {
            // 已读
            _html += '<tr class="read" applyFlag="' + data[i].applyUrgent + '" type="2" name="' + data[i].id + '">';
        }
        _html += '<td>\
                    <p class="overHidden3" title="' + data[i].caseSummary + '">' + data[i].caseSummary + '</p>\
                </td>\
                <td>\
                    <p class="overHidden1" title="' + data[i].inviteSummary + '">' + data[i].inviteSummary + '</p>\
                </td>\
                <td>\
                    <p class="overHidden2" title="' + data[i].applySummary + '">' + data[i].applySummary + '</p>\
                </td>'
        if (year == _year && month == _month && day == _day) {
            _html += '<td class="tl2em">今天' + time + '</td>'
        } else {
            _html += '<td class="tl2em">' + data[i].updateTime + '</td>'
        }
        _html += '</tr>'
    }
    $('#referralTableBody').html(_html);
}

function emptySelect() {
    $('#tabContent').html("");
}

/** 查询医政受邀订单列表 */
function getInvitedList(inviteStatus, pageNoParam, pageSizeParam) {
    pageNo = pageNoParam;
    pageSize = pageSizeParam;
    switch (inviteStatus) {
        case InviteStatus.INVITE_ACCEPT:
            ajaxRequest("GET", sirReceiveApplyAccede, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_REVIEW:
            ajaxRequest("GET", sirReceiveSlaveDoctor, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_SLAVE_REJECT:
            ajaxRequest("GET", sirReceiveSlaveReject, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_DATETIME:
            ajaxRequest("GET", sirReceiveDateTimeLocked, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_ONGOING:
            ajaxRequest("GET", sirReceiveBegin, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_FEEDBACK:
            ajaxRequest("GET", sirReceiveReportSubmitted, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_REJECT:
            ajaxRequest("GET", sirReceiveSlaveMasterReject, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        case InviteStatus.INVITE_DONE:
            ajaxRequest("GET", sirReceiveEnd, null, false, false, false, renderApplyListView, emptySelect, null);
            break;
        default:
            return false;
    }
}

/** 查询医政发出订单列表 */
function getApplyList(inviteStatus, pageNoParam, pageSizeParam) {
    pageNo = pageNoParam;
    pageSize = pageSizeParam;
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

/**  查询医政转诊订单列表 */
function getReferralList(inviteStatus, pageNoParam, pageSizeParam) {
    pageNo = pageNoParam;
    pageSize = pageSizeParam;
    switch (inviteStatus) {
        case ReferralStatus.WAITING_AUDIT:
            ajaxRequest("GET", sirInquiryCheck, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.WAITING_ACCEDE:
            ajaxRequest("GET", sirInquiryAccept, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.DATETIME_AUDIT:
            ajaxRequest("GET", sirInquiryCheckDate, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.DATETIME_LOCKED:
            ajaxRequest("GET", sirInquiryDate, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.HAS_REJECT:
            ajaxRequest("GET", sirInquiryReject, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.HAS_END:
            ajaxRequest("GET", sirInquiryEnd, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        default:
            return false;
    }
    //
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
    //         }
    //
    // })
}

/** 分页查询列表数据 */
function showPageList(status, feedBackFunction) {
    layui.use('laypage', function () {
        const laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'listBox',
            count: pageCount,
            limit: pageSize,
            theme: '#f6c567',
            jump: function (obj, first) {
                feedBackFunction(status, obj.curr, pageSize);
            }
        });
    });
}

/** 查询申请列表 总记录数*/
function getApplyCount() {
    ajaxRequest("GET", sendSelectAllCountSir, null, false, false, false, sendSelectAllCountDoctorSuccess, null, null);

    function sendSelectAllCountDoctorSuccess(result) {
        countObject = result;
        console.log(countObject);
        currentApplyCount();
    }
}

/** 渲染发出导航列表记录数*/
function currentApplyCount() {
    let applyAcceptCount = 0
    applyAcceptCount += Number(countObject.consultationApplyAccede);
    applyAcceptCount += Number(countObject.consultationSlaveReject);
    applyAcceptCount += Number(countObject.consultationDoctorLocked);
    applyAcceptCount += Number(countObject.consultationSlaveAccede);
    $("#APPLY_REVIEW").html(Number(countObject.consultationApplyCreateSuccess))
    $("#APPLY_ACCEPT").html(applyAcceptCount)
    $("#APPLY_DATETIME").html(Number(countObject.consultationDatetimeLocked))
    $("#APPLY_ONGOING").html(Number(countObject.consultationBegin))
    $("#APPLY_FEEDBACK").html(Number(countObject.consultationReportSubmitted))
    $("#APPLY_REJECT").html(Number(countObject.consultationMasterReject))
    $("#APPLY_DONE").html(Number(countObject.consultationEn))
}

/** 查询受邀列表 总记录数*/
function getInviteCount() {
    ajaxRequest("GET", receiveSelectAllCountSir, null, false, false, false, receiveSelectAllCountDoctorSuccess, null, null);

    function receiveSelectAllCountDoctorSuccess(result) {
        countObject = result;
        console.log(countObject);
        currentInviteCount();
    }
}

/** 渲染受邀导航列表记录数*/
function currentInviteCount() {
    $("#INVITE_ACCEPT").html(Number(countObject.consultationApplyAccede))
    $("#INVITE_REVIEW").html(Number(countObject.consultationSlaveAccede))
    $("#INVITE_SLAVE_REJECT_COUNT").html(Number(countObject.consultationSlaveReject))
    $("#INVITE_DATETIME").html(Number(countObject.consultationDatetimeLocked))
    $("#INVITE_ONGOING").html(Number(countObject.consultationBegin))
    $("#INVITE_FEEDBACK").html(Number(countObject.consultationReportSubmitted))
    $("#INVITE_REJECT").html(Number(countObject.consultationMasterReject))
    $("#INVITE_DONE").html(Number(countObject.consultationEn))
}

/** 查询转诊列表 总记录数*/
function getReferralCount() {
    ajaxRequest("GET", inquiryCsAllCountSir, null, false, false, false, inquiryAllCountDoctorSuccess, null, null);

    function inquiryAllCountDoctorSuccess(result) {
        countObject = result;
        console.log(result);
        currentReferralCount();
    }
}

/** 渲染转诊导航列表记录数*/
function currentReferralCount() {
    console.log("医政转诊数量")
    console.log(countObject)
    $("#WAITING_AUDIT").html(Number(countObject.inquiryApplyCreateSuccess))
    $("#WAITING_ACCEDE").html(Number(countObject.inquiryApplyAccede) + Number(countObject.inquirySlaveAccedeTwo));
    $("#DATETIME_AUDIT").html(Number(countObject.inquirySlaveAccede))
    $("#DATETIME_LOCKED").html(Number(countObject.inquiryDatetimeLocked))
    $("#HAS_REJECT").html(Number(countObject.inquiryMasterReject) + Number(countObject.inquirySlaveReject))
    $("#HAS_END").html(Number(countObject.inquiryEnd))
}

/** 分页查询转诊列表数据 */
function showReferralPageList(status, feedBackFunction) {
    layui.use('laypage', function () {
        const laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'referralListBox',
            count: pageCount,
            limit: pageSize,
            theme: '#f6c567',
            jump: function (obj, first) {
                feedBackFunction(status, obj.curr, pageSize);
            }
        });
    });
}
// 获取草稿箱数据
function getDrafts(pageNo, pageSize) {

}

// 查看订单详情
function selectOrderById(orderId, type, readFlag) {
    sessionStorage.setItem('applyFormId', orderId);
    sessionStorage.setItem('isInvite', isInvite);
    window.location = '../page/adminApplyInfo.html';
}



$(function () {
    getInviteCount()
    pageCount = $("#INVITE_ACCEPT").html();

    showPageList("INVITE_ACCEPT", getInvitedList);
    // 列表的切换
    $('.leftNav').click(function () {
        let _index = $(this).index();
        $(this).addClass('active').siblings('div').removeClass('active');
        if (_index == 0) {
            isInvite = true;
            getInviteCount()
            // 受邀列表
            $('.drafts_table').css("display", 'none');
            $('.referralTable').css("display", 'none');
            $('.tables').css('display', 'block');
            $('.recipients').css('width', '160px');
            $('.originator').css('width', '270px');
            $(".ulAct").removeClass("ulAct");
            $(this).find(".leftUL li").eq(0).addClass("ulAct");
            let inviteStatus = $(this).find(".leftUL li").eq(0).attr('name');
            pageCount = $("#INVITE_ACCEPT").html();
            showPageList(inviteStatus, getInvitedList);

        } else if (_index == 1) {
            getApplyCount()
            isInvite = false;
            $('.drafts_table').css("display", 'none');
            $('.referralTable').css("display", 'none');
            $('.tables').css('display', 'block');
            $('.recipients').css('width', '270px');
            $('.originator').css('width', '160px');
            $(".ulAct").removeClass("ulAct");
            $(this).find('.leftUL li').eq(0).addClass("ulAct");

            let applyStatus = $(this).find('.leftUL li').eq(0).attr('name');
            pageCount = $("#APPLY_REVIEW").html();
            showPageList(applyStatus, getApplyList);

        } else if (_index == 2) {
            getReferralCount()
            // 转诊列表
            $('.drafts_table').css("display", 'none');
            $('.tables').css('display', 'none');
            $('.referralTable').css("display", 'block');
            $('.recipients').css('width', '270px');
            $('.originator').css('width', '160px');
            $(".ulAct").removeClass("ulAct");
            $(this).find(".leftUL li").eq(0).addClass("ulAct");

            let inviteStatus = $(this).find(".leftUL li").eq(0).attr('name');
            pageCount = $("#WAITING_AUDIT").html();
            showReferralPageList(inviteStatus,getReferralList);
        }
    });

    // 受邀ul切换 queryReceiveOrderList
    $("#inviteUl").delegate('li', 'click', function () {
        $('.recipients').css('width', '160px');
        $('.originator').css('width', '270px');
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        let inviteStatus = $(this).attr('name');
        pageCount = $(this).children("div:eq(0)").html();
        showPageList(inviteStatus, getInvitedList);
        return false;
    });

    // 发出ul切换
    $("#issueUl").delegate('li', 'click', function () {
        $('.recipients').css('width', '270px');
        $('.originator').css('width', '160px');
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        let applyStatus = $(this).attr('name');
        pageCount = $(this).children("div:eq(0)").html();
        showPageList(applyStatus, getApplyList);
        return false;
    });
    // 转诊ul切换 transferTreatment/doctorFindList
    $("#referralUl").delegate('li', 'click', function () {
        $('.recipients').css('width', '270px');
        $('.originator').css('width', '160px');
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        let referralStatus = $(this).attr('name');
        pageCount = $(this).children("div:eq(0)").html();
        showReferralPageList(referralStatus,getReferralList);
        return false;
    });

    // 会诊列表详情
    $('#tabContent').delegate('tr', 'click', function () {
        selectOrderById($(this).attr('name'), $(this).attr('type'), $(this).attr('applyFlag'));
    });
    // 转诊列表详情
    $('#referralTableBody').delegate('tr', 'click', function () {
        selectOrderById($(this).attr('name'), $(this).attr('applyFlag'))
    });

    // 医生工作台详情
    $('.workUl').delegate('.wordItem', "click", function () {
        selectOrderById($(this).attr("name"), 3, 1);
    })
    getInvitedList("INVITE_ACCEPT", 0, 10)

    // 草稿箱详情
    $('.drafts_tbody').delegate('tr', 'click', function () {
        sessionStorage.setItem('detailsId', $(this).attr('name'));
        window.location = '/yilaiyiwang/detailsDraft/detailsDraft.html';
    })

    MouthSection(currentMonth);

    doctorScheduling(dateStr + ' 00:00:00', dateStr + ' 23:59:00')
    // 渲染日历控件
    redrawDate();

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
})
