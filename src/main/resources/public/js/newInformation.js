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
            if (tempArr[i].msgType == 002) {
                _html += '<li aboutUserId="' + tempArr[i].aboutUserId + '" name="' + tempArr[i].id + '" remarks="' + tempArr[i].msgDetails + '" class="clearfix">\
                           <p class="newNews">';
            } else {
                _html += '<li aboutUserId="" name="' + tempArr[i].id + '" remarks="' + tempArr[i].msgDetails + '" class="clearfix">\
                           <p class="newNews">';
            }

            if (tempArr[i].remarks == 0) {
                _html += '<span>新</span>';
            }
            _html += '</p>\
                           <p class="newsType">';
            // 0系统消息-审核已通过 1上课提醒 2新课预定
            if (tempArr[i].msgType === "SYSTEM_ALERT_MESSAGE") {
                _html += '系统消息</p><p class="newsTitle">' + tempArr[i].msgTitle + '</p>';
            } else if (tempArr[i].msgType === "SYSTEM_PUSH_MESSAGE") {
                _html += '系统推送</p><p class="newsTitle"><a href="javascript:;">“' + tempArr[i].msgTitle + '”</a>请求认证为您的医院医生，点击查看审核</p>';
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
            if (tempArr[i].msgType === "SYSTEM_ALERT_MESSAGE") {
                _html += '<div></div></li>'
            } else {
                _html += '<div>' + tempArr[i].msgDetails + '</div></li>'
            }

        }
    }
    $('.ulList').html(_html);
}

$(function () {

    ajaxRequest("GET", getMyMessageCountUrl, "", false, false, true, getMyMessageCountSuccess, null, null);


    // 分页查询
    function selectSelfList(pageNo, pageSize) {
        // console.log(pageNo, pageSize)
        $.ajax({
            type: 'POST',
            url: IP + 'news/selectSelfList',
            dataType: 'json',
            async: false,
            data: {
                "pageNo": pageNo, //页数
                "pageSize": pageSize, //每页个数
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    count = data.pageSize * pageSize;
                    var _html = '';
                    var tempArr = data.newsBeanList;
                    if (tempArr.length == 0) {
                        _html += '<li class="noNews">暂无消息</li>';
                    } else {

                        var myDate = new Date();
                        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                        var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
                        var day = double(myDate.getDate()); //获取当前日(1-31)
                        for (var i = 0; i < tempArr.length; i++) {
                            var timeStr = tempArr[i].createDate.split(' ')[0];
                            var time = tempArr[i].createDate.split(' ')[1];
                            var _year = timeStr.split('-')[0];
                            var _month = timeStr.split('-')[1];
                            var _day = timeStr.split('-')[2];
                            if (tempArr[i].types == 002) {
                                _html += '<li aboutUserId="' + tempArr[i].aboutUserId + '" name="' + tempArr[i].id + '" remarks="' + tempArr[i].remarks + '" class="clearfix">\
                           <p class="newNews">';
                            } else {
                                _html += '<li aboutUserId="" name="' + tempArr[i].id + '" remarks="' + tempArr[i].remarks + '" class="clearfix">\
                           <p class="newNews">';
                            }

                            if (tempArr[i].remarks == 0) {
                                _html += '<span>新</span>';
                            }
                            _html += '</p>\
                           <p class="newsType">';
                            // 0系统消息-审核已通过 1上课提醒 2新课预定
                            if (tempArr[i].types == 001) {
                                _html += '系统消息</p><p class="newsTitle">' + tempArr[i].title + '</p>';
                            } else if (tempArr[i].types == 002) {
                                _html += '系统消息</p><p class="newsTitle"><a href="javascript:;">“' + tempArr[i].title + '”</a>请求认证为您的医院医生，点击查看审核</p>';
                            } else if (tempArr[i].types == 101) {
                                _html += '上课提醒</p><p class="newsTitle">' + tempArr[i].title + '</p>';
                            } else if (tempArr[i].types == 201) {
                                _html += '新课预定</p><p class="newsTitle">' + tempArr[i].title + '</p>';
                            }
                            if (year == _year && month == _month && day == _day) {
                                _html += '<p class="time">今天' + time + '</p>'
                            } else {
                                _html += '<p class="time">' + tempArr[i].createDate + '</p>'
                            }
                            if (tempArr[i].types == 002) {
                                _html += '<div></div></li>'
                            } else {
                                _html += '<div>' + tempArr[i].details + '</div></li>'
                            }

                        }
                    }
                    $('.ulList').html(_html);
                }
            }
        })
    }


    $('.ulList').delegate('li', 'click', function () {
        $(this).toggleClass('active');
        if ($(this).attr('remarks') == 0) {
            var obj = $(this);
            $.ajax({
                type: 'POST',
                url: IP + 'news/updateRemarks',
                dataType: 'json',
                async: false,
                data: {
                    "id": $(this).attr('name'),
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    console.log(data);
                    console.log(obj)
                    obj.attr('remarks', '1');
                    obj.find('.newNews').html('');

                },
                error: function (err) {
                    console.log(err);
                },
            })
        }
        // 保存待审核医生id
        if ($(this).attr("aboutUserId") && $(this).attr("aboutUserId") != '') {
            localStorage.setItem("lookDoctorId", $(this).attr('aboutUserId'));
            window.location = "/yilaiyiwang/managementCenter/managementCenter.html";
        }

    });
// $('.ulList').find('li').each(function () {
//    if($(this).attr('remarks') == '1'){
//        $('news').removeClass('newNews')
//        console.log(1)
//    }
// })

})
