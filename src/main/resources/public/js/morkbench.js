const count = 0; // 列表总条数
let countObject = {};
let pageCount = 10;

// 日历表
let markJson = {}; // 日期标记
const myDate = new Date();
// dateStr 默认日期
let dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
// currentMonth 默认月份
let currentMonth = myDate.getMonth() + 1;
const layPage = layui.laypage;

const InviteStatus = {
    INVITE_ACCEPT: "INVITE_ACCEPT",
    INVITE_REVIEW: "INVITE_REVIEW",
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

function renderApplyInquiryListView(data) {
    console.log(data);
    const myDate = new Date();
    const year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    const month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    const day = double(myDate.getDate()); //获取当前日(1-31)
    let _html = '';
    for (let i = 0; i < data.length; i++) {
        let timeStr = data[i].updateTime.split(' ')[0];
        let time = data[i].updateTime.split(' ')[1];
        let _year = timeStr.split('-')[0];
        let _month = timeStr.split('-')[1];
        let _day = timeStr.split('-')[2];
        if (0 == 0) {
            // 未读
            _html += '<tr class="read" applyFlag="' + data[i].applyUrgent + '" type="2" name="' + data[i].id + '">';
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
        if(data[i].applyStatus === "INQUIRY_END"){
            if (year == _year && month == _month && day == _day) {
                _html += '<td class="tl2em">今天' + '</td>'
            } else {
                _html += '<td class="tl2em">' + timeStr + '</td>'
            }
        }else{
            if (year == _year && month == _month && day == _day) {
                _html += '<td class="tl2em">今天' + time + '</td>'
            } else {
                _html += '<td class="tl2em">' + data[i].updateTime + '</td>'
            }
        }

        _html += '</tr>'
    }
    $('#referralTableBody').html(_html);
}

// 日期标记
function MouthSection(month) {
    const _date = new Date();
    const startDate = _date.getFullYear() + '-' + double(month) + '-01 00:00:00';
    _date.setMonth(month)
    _date.setDate(0);
    const endDate = _date.getFullYear() + '-' + double(month) + '-' + _date.getDate() + ' 23:59:59';

}

/* 医生当天内容 */
function doctorScheduling(startDate, endDate) {

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
            _html += '<tr class="read" applyFlag="' + data[i].applyUrgent + '" type="2" name="' + data[i].id + '">\
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
                </td>'
        if (data[i].inviteSummary) {
            _html += '<td><p class="overHidden1" title="' + data[i].inviteSummary + '">' + data[i].inviteSummary + '</p></td>'
        } else {
            _html += '<td><p class="overHidden1" title=""></p></td>'
        }
        _html += ' <td>\
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

function emptySelect() {
    $('#tabContent').html("");
}

/** 渲染 草稿列表 */
function renderDraftListView(data) {
    let _html = '';
    for (let i = 0; i < data.length; i++) {
        _html += '<tr name="' + data[i].id + '"><td><p class="w520" title="' + data[i].caseSummary + '">' + data[i].caseSummary + '</p></td></tr>';
    }
    $('.drafts_tbody').html(_html);
}

/** 医生受邀订单列表 */
function getInvitedList(inviteStatus, pageNoParam, pageSizeParam) {
    pageNo = pageNoParam;
    pageSize = pageSizeParam;
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

/** 医生发出订单列表 */
function getApplyList(inviteStatus, pageNoParam, pageSizeParam) {

    pageNo = pageNoParam;
    pageSize = pageSizeParam;
    switch (inviteStatus) {
        case ApplyStatus.APPLY_REVIEW:
            ajaxRequest("GET", getApplyReviewUrl, null, false, false, true, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_ACCEPT:
            ajaxRequest("GET", getApplyAcceptUrl, null, false, false, true, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_DATETIME:
            ajaxRequest("GET", getApplyDateTimeUrl, null, false, false, true, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_ONGOING:
            ajaxRequest("GET", getApplyOngoingUrl, null, false, false, true, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_FEEDBACK:
            ajaxRequest("GET", getApplyFeedbackUrl, null, false, false, true, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_REJECT:
            ajaxRequest("GET", getApplyRejectUrl, null, false, false, true, renderApplyListView, emptySelect, null);
            break;
        case ApplyStatus.APPLY_DONE:
            ajaxRequest("GET", getApplyDoneUrl, null, false, false, true, renderApplyListView, emptySelect, null);
            break;
        default:
            return false;
    }
}

/** 医生转诊订单列表 */
function getReferralList(inviteStatus, pageNoParam, pageSizeParam) {

    pageNo = pageNoParam;
    pageSize = pageSizeParam;

    switch (inviteStatus) {
        case ReferralStatus.WAITING_AUDIT:
            ajaxRequest("GET", inquiryCreateSuccess, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.WAITING_ACCEDE:
            ajaxRequest("GET", inquiryApplyAccede, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.DATETIME_AUDIT:
            ajaxRequest("GET", inquirySlaveMasterAccede, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.DATETIME_LOCKED:
            ajaxRequest("GET", inquiryDate, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.HAS_REJECT:
            ajaxRequest("GET", inquirySlaveMasterReject, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        case ReferralStatus.HAS_END:
            ajaxRequest("GET", inquiryEnd, null, false, false, false, renderApplyInquiryListView, emptySelect, null);
            break;
        default:
            return false;
    }
}

/** 医生草稿列表 */
function getDraftList(pageNoParam, pageSizeParam) {
    pageNo = pageNoParam;
    pageSize = pageSizeParam;
    ajaxRequest("GET", selectByUser, null, false, false, false, renderDraftListView, emptySelect, null);
}

/** 分页查询会诊列表数据 */
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

/** 分页查询 草稿数量 */
function showDraftPageList(feedBackFunction) {
    layui.use('laypage', function () {
        const laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'drafts',
            count: pageCount,
            limit: pageSize,
            theme: '#f6c567',
            jump: function (obj, first) {
                feedBackFunction(obj.curr, pageSize);
            }
        });
    });
}

/** 查询申请列表 总记录数*/
function getApplyCount() {
    ajaxRequest("GET", sendSelectAllCountDoctor, null, false, false, false, sendSelectAllCountDoctorSuccess, null, null);

    function sendSelectAllCountDoctorSuccess(result) {
        countObject = result;
        currentApplyCount();
    }
}

/** 渲染申请导航列表记录数*/
function currentApplyCount() {
    let applyAcceptCount = 0
    applyAcceptCount += Number(countObject.consultationApplyAccede);
    applyAcceptCount += Number(countObject.consultationDoctorLocked);
    applyAcceptCount += Number(countObject.consultationSlaveReject);
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
    ajaxRequest("GET", receiveSelectAllCountDoctor, null, false, false, false, receiveSelectAllCountDoctorSuccess, null, null);

    function receiveSelectAllCountDoctorSuccess(result) {
        countObject = result;
        currentInviteCount();
    }
}

/** 渲染受邀导航列表记录数*/
function currentInviteCount() {
    $("#INVITE_ACCEPT").html(Number(countObject.consultationApplyAccede))
    $("#INVITE_REVIEW").html(Number(countObject.consultationSlaveAccede))
    $("#INVITE_DATETIME").html(Number(countObject.consultationDatetimeLocked))
    $("#INVITE_ONGOING").html(Number(countObject.consultationBegin))
    $("#INVITE_FEEDBACK").html(Number(countObject.consultationReportSubmitted))
    $("#INVITE_REJECT").html(Number(countObject.consultationMasterReject) + Number(countObject.consultationSlaveReject))
    $("#INVITE_DONE").html(Number(countObject.consultationEn))
}

/** 查询转诊列表 总记录数*/
function getReferralCount() {
    ajaxRequest("GET", inquiryCsAllCountDr, null, false, false, false, inquiryAllCountDoctorSuccess, null, null);

    function inquiryAllCountDoctorSuccess(result) {
        countObject = result;
        currentReferralCount();
    }
}

/** 渲染转诊导航列表记录数*/
function currentReferralCount() {
    $("#WAITING_AUDIT").html(Number(countObject.inquiryApplyCreateSuccess))
    $("#WAITING_ACCEDE").html(Number(countObject.inquiryApplyAccede) + Number(countObject.inquirySlaveAccedeTwo))
    $("#DATETIME_AUDIT").html(Number(countObject.inquirySlaveAccede))
    $("#DATETIME_LOCKED").html(Number(countObject.inquiryDatetimeLocked))
    $("#HAS_REJECT").html(Number(countObject.inquiryMasterReject) + Number(countObject.inquirySlaveReject))
    $("#HAS_END").html(Number(countObject.inquiryEnd))
}

// 获取草稿箱数据
function getDraftsCount() {
    ajaxRequest("GET", draftCount, null, false, false, true, draftCountSuccess, null, null);

    function draftCountSuccess(result) {
        $("#DRAFT").html(Number(result))
    }
}

// 查看订单详情
function selectOrderById(orderId) {
    sessionStorage.setItem('applyFormId', orderId);
    window.location = '../page/doctorApplyInfo.html';
}

// 查看草稿详情
function selectDraftById(orderId) {
    sessionStorage.setItem('draftId', orderId);
    window.location = '../page/createCase.html';
}

$(function () {
    getDraftsCount();
    getInviteCount();
    pageCount = $("#INVITE_ACCEPT").html();

    showPageList("INVITE_ACCEPT", getInvitedList);
    // 列表的切换
    $('.leftNav').click(function () {
        let _index = $(this).index();
        $(this).addClass('active').siblings('div').removeClass('active');
        if (_index == 0) {
            getInviteCount();
            // 医生受邀列表
            $('.drafts_table').css("display", 'none');
            $('.referralTable').css("display", 'none');
            $('.tables').css('display', 'block');
            $('.recipients').css('width', '160px');
            $('.originator').css('width', '270px');
            $(".ulAct").removeClass("ulAct");
            $(this).find(".leftUL li").eq(0).addClass("ulAct");
            let inviteStatus = $(this).find(".leftUL li").eq(0).attr('name');
            pageCount = $("#INVITE_ACCEPT").html();
            showPageList("INVITE_ACCEPT", getInvitedList);
        } else if (_index == 1) {
            getApplyCount();
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
            // 医生转诊列表
            $('.drafts_table').css("display", 'none');
            $('.tables').css('display', 'none');
            $('.referralTable').css("display", 'block');
            $('.recipients').css('width', '270px');
            $('.originator').css('width', '160px');
            $(".ulAct").removeClass("ulAct");
            $(this).find(".leftUL li").eq(0).addClass("ulAct");
            let inviteStatus = $(this).find(".leftUL li").eq(0).attr('name');
            pageCount = $("#WAITING_AUDIT").html();
            showReferralPageList(inviteStatus, getReferralList);
        } else if (_index == 3) {
            $('.drafts_table').css("display", 'block');
            $('.tables').css('display', 'none');
            $('.referralTable').css("display", 'none');
            showDraftPageList(getDraftList);
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
        showReferralPageList(referralStatus, getReferralList);
        return false;
    });
    // 会诊列表详情
    $('#tabContent').delegate('tr', 'click', function () {
        selectOrderById($(this).attr('name'));
    });
    // 转诊列表详情
    $('#referralTableBody').delegate('tr', 'click', function () {
        selectOrderById($(this).attr('name'))
    });
    // 医生工作台详情
    $('.workUl').delegate('.wordItem', "click", function () {
        selectOrderById($(this).attr("name"));
    })

    // getInvitedList("INVITE_ACCEPT", 0, 10)

    pageCount = $("#INVITE_ACCEPT").html();
    layui.use('laypage', function () {
        const laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'listBox',
            count: pageCount,
            limit: pageSize,
            theme: '#f6c567',
            jump: function (obj, first) {
                getInvitedList("INVITE_ACCEPT", obj.curr, pageSize);
            }
        });
    });
    // 草稿箱详情
    $('.drafts_tbody').delegate('tr', 'click', function () {
        selectDraftById($(this).attr('name'))
    })

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
})
