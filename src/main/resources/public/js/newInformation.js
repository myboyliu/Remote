function getMyMessageCountSuccess(messageCount) {
    console.log(messageCount)
    if (messageCount === 0) {

    } else {
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox',
                count: messageCount,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    pageNo = obj.curr;
                    ajaxRequest("GET", findMyMessageUrl, "", false, false, true, renderMessageView, null, null);
                }
            })
        });
    }

}

/**
 * 渲染 消息列表
 * @param messageList
 */
function renderMessageView(messageList) {
    console.log(messageList);
    var _html = '';
    var tempArr = messageList;
    if (tempArr.length == 0) {
        _html += '<li class="noNews">暂无消息</li>';
    } else {

        let myDate = new Date();
        let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        let month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
        let day = double(myDate.getDate()); //获取当前日(1-31)
        for (let i = 0; i < tempArr.length; i++) {
            let timeStr = tempArr[i].createTime.split(' ')[0];
            let time = tempArr[i].createTime.split(' ')[1];
            let _year = timeStr.split('-')[0];
            let _month = timeStr.split('-')[1];
            let _day = timeStr.split('-')[2];
            if (tempArr[i].msgType == "NEW_DOCTOR_REGISTER_ALERT_MESSAGE") {
                _html += '<li msgType="' + tempArr[i].msgType + '"  aboutUserId="' + tempArr[i].aboutId + '" name="' + tempArr[i].id + '" readFlag="' + tempArr[i].readSign + '" class="clearfix">\
                           <p class="newNews">';
            } else {
                _html += '<li msgType="' + tempArr[i].msgType + '"  aboutUserId="' + tempArr[i].aboutId + '" name="' + tempArr[i].id + '" readFlag="' + tempArr[i].readSign + '" class="clearfix">\
                           <p class="newNews">';
            }

            if (tempArr[i].readSign == 0) {
                _html += '<span>新</span>';
            }
            _html += '</p>\
                           <p class="newsType">';
            // 0系统消息-审核已通过 1上课提醒 2新课预定
            if (tempArr[i].msgType === "NEW_DOCTOR_REGISTER_ALERT_MESSAGE") {
                _html += '系统消息</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            } else if (tempArr[i].msgType === "SYSTEM_ALERT_MESSAGE") {
                _html += '系统推送</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            } else if (tempArr[i].msgType === "SYSTEM_PUSH_MESSAGE") {
                _html += '系统推送</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            } else if (tempArr[i].msgType === "VIDEO_ALERT_MESSAGE") {
                _html += '上课提醒</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            } else if (tempArr[i].msgType === "VIDEO_PUSH_MESSAGE") {
                _html += '新课预定</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            } else if (tempArr[i].msgType === "LIVE_ALERT_MESSAGE") {
                _html += '直播提醒</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            } else if (tempArr[i].msgType === "LIVE_PUSH_MESSAGE") {
                _html += '直播推送</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            } else if (tempArr[i].msgType === "MEETING_ALERT_MESSAGE") {
                _html += '会诊提醒</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            } else if (tempArr[i].msgType === "MEETING_PUSH_MESSAGE") {
                _html += '会议推送</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            }
            if (year == _year && month == _month && day == _day) {
                _html += '<p class="time">今天' + time + '</p>'
            } else {
                _html += '<p class="time">' + tempArr[i].createTime + '</p>'
            }
            if (tempArr[i].msgType === "NEW_DOCTOR_REGISTER_ALERT_MESSAGE") {
                _html += '<div></div></li>'
            } else {
                _html += '<div></div></li>'
                // _html += '<div>' + tempArr[i].msgDetails + '</div></li>'
            }

        }
    }
    $('.ulList').html(_html);
}

$(function () {

    ajaxRequest("GET", getMyMessageCountUrl, "", false, false, true, getMyMessageCountSuccess, null, null);


    $('.ulList').delegate('li', 'click', function () {
        $(this).toggleClass('active');

        if ($(this).attr('msgType') == "LIVE_ALERT_MESSAGE" || $(this).attr('msgType') == "LIVE_PUSH_MESSAGE") {
            window.location = "../live/main.html";
        }
        if ($(this).attr('msgType') == "VIDEO_ALERT_MESSAGE" || $(this).attr('msgType') == "VIDEO_PUSH_MESSAGE") {
            window.location = "../video/main.html";
        }
        if ($(this).attr('msgType') == "MEETING_ALERT_MESSAGE" || $(this).attr('msgType') == "MEETING_PUSH_MESSAGE") {
            localStorage.setItem('applyFormId', $(this).attr('aboutUserId'));
            window.location = "../page/doctorApplyInfo.html";
        }
        if ($(this).attr('msgType') == "NEW_DOCTOR_REGISTER_ALERT_MESSAGE") {
            localStorage.setItem("lookDoctorId", $(this).attr('aboutUserId'));
            window.location = "../page/system.html";
        }
        if ($(this).attr('readFlag') == 0) {
            $(this).attr('remarks', '1');
            $(this).find('.newNews').html('');
            let lookData = {"id": $(this).attr('name')};
            ajaxRequest("GET", lookGroupMessageUrl, lookData, true, "application/json", true, function success(){}, null, null);
        }

    });

})
