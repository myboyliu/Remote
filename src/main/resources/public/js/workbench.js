var pageNo = 1;
var pageSize = 10;
var pageCount = 0;
var count = 0;
var draftsCount = 0;
var orderStateId = '';
const invitedDataPrefix = "INVITEDDATA";
const issueDataPrefix = "ISSUEDATA";
const referralDataPrefix = "REFERRALDATA";
var tempArr;
var _html = '';

function getLeftNavigationData(type) {
    var responseJson;
    $.ajax({
        type: 'POST',
        url: IP + 'doctorOrderStatus/findOrderStatus',
        dataType: 'json',
        data: {
            "type": type, //(0:医政受邀列表,1:医政发出列表,2:医生受邀，3医生发出
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        async: false,
        success: function (data) {
            if (data.status == 200) {
                responseJson = data;
            } else if (data.status == 250) {
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
    return responseJson;
}
/** 左边导航栏 医政受邀请列表数据获取 */
/** 左边导航栏 医政受邀请列表页面渲染 */
function renderInvitedNavigation(type) {
    var data = getLeftNavigationData(type);
    tempArr = data.doctorOrderStatusList;
    _html = "";
    for (var i = 0; i < tempArr.length; i++) {
        if (i == 0) {
            if (tempArr[i].unReadFlag == 0) {
                _html += '<li name="' + tempArr[i].states.id + '" class="ulAct">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class=""></div>\
					</li>'
            } else {
                _html += '<li name="' + tempArr[i].states.id + '" class="ulAct">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class = "unRead" > ' + tempArr[i].orderSize + ' </div>\
					</li>'
            }
        } else {
            a(tempArr, i);
        }
    }
    $('#inviteUl').html(_html);

    orderStateId = tempArr[0].states.id;
    var invitedListData = getInvitedList(tempArr[0].states.id, pageNo, pageSize);
    renderInvitedList(invitedListData);
    pageCount = invitedListData.pageSize * pageSize;
    renderPagePlugin(invitedListData, pageCount);
    localStorage.setItem('orderType', 0);

}
/**医政受邀列表查询*/
function getInvitedList(orderStateId, pageNo, pageSize) {
    var ajaxData;
    $.ajax({
        type: 'POST',
        url: IP + 'order/receiveMedicalAdminList', //医政查看受邀列表
        dataType: 'json',
        data: {
            "orderStateId": orderStateId,
            "pageNo": pageNo,
            "pageSize": pageSize,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        async: false,
        success: function (data) {
            console.log(data)
            if (data.status == 200) {
                localStorage.setItem(invitedDataPrefix + orderStateId + pageNo, JSON.stringify(data));
                ajaxData = data;
            } else if (data.status == 250) {
                // 未登录操作
            } else if (data.status == 205) {
                // 其他操作
                $('#tabContent').html('');
            }
        },
        error: function (err) {
            console.log(err);
        },
    })
    return ajaxData;
}
/**医政受邀列表渲染*/
function renderInvitedList(data) {
    count = data.pageSize * pageSize;
    var myDate = new Date();
    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    var day = double(myDate.getDate()); //获取当前日(1-31)
    var _html = '';
    var tempArr = data.orderBeanList;
    for (var i = 0; i < tempArr.length; i++) {
        var timeStr = tempArr[i].time.split(' ')[0];
        var time = tempArr[i].time.split(' ')[1];
        var _year = timeStr.split('-')[0];
        var _month = timeStr.split('-')[1];
        var _day = timeStr.split('-')[2];
        if (tempArr[i].inFlag == 0) {
            _html += '<tr class="unread" applyFlag="' + tempArr[i].inFlag + '" type="0" name="' + tempArr[i].id + '">\
                            <td>';
        } else {
            _html += '<tr class="read" applyFlag="' + tempArr[i].inFlag + '" type="0" name="' + tempArr[i].id + '">\
                    <td>'
        }

        if (tempArr[i].isurgent == 1) {
            _html += '<img class="w14" src="/yilaiyiwang/images/light.png" />'
        }
        _html += '</td>'
        if (tempArr[i].orderType == 0) {
            _html += '<td class="tc">会诊</td>'
        } else {
            _html += '<td class="tc">转诊</td>'
        }
        _html += ' <td>\
                    <p class="overHidden3" title="***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '">***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
                </td>\
                <td>\
                    <p class="overHidden1" title="' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '">\
                        <' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '>\
                    </p>\
                </td>\
                <td>\
                    <p class="overHidden2" title="' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '">\
                        <' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '>\
                    </p>\
                </td>'
        if (tempArr[i].manner == 0) {
            _html += '<td class="tc">图文</td>'
        } else {
            _html += '<td class="tc">视频</td>'
        }
        if (year == _year && month == _month && day == _day) {
            _html += '<td class="tl2em">今天' + time + '</td>'
        } else {
            _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
        }
        _html += '</tr>'
    }
    $('#tabContent').html(_html);

}
/**医政受邀列表分页插件渲染*/
function renderPagePlugin(invitedListData, countNum, dataPrefix, orderId) {
    layui.use('laypage', function () {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'listBox',
            count: countNum,
            limit: pageSize,
            theme: '#f6c567',
            jump: function (obj, first) {
                console.log(obj.curr);
                storageData = JSON.parse(localStorage.getItem(dataPrefix + orderId + obj.curr));
                console.log(storageData);
                if (storageData === null) {
                    switch (dataPrefix) {
                        case invitedDataPrefix:
                            storageData = getInvitedList(orderStateId, obj.curr, pageSize);
                            break;
                        case issueDataPrefix:
                            storageData = getIssueList(orderStateId, obj.curr, pageSize);
                            break;
                        case referralDataPrefix:
                            storageData = getReferralList(orderStateId, obj.curr, pageSize);
                            break;
                    }
                }
                switch (dataPrefix) {
                    case invitedDataPrefix:
                        renderInvitedList(storageData);
                        break;
                    case issueDataPrefix:
                        renderIssueList(storageData);
                        break;
                    case referralDataPrefix:
                        renderReferralList(storageData);
                        break;

                }
            }
        });
    });
}
/** 左边导航栏 医政发出列表 */
function a(tempArr, i) {

    if (tempArr[i].unReadFlag == 0) {
        _html += '<li name="' + tempArr[i].states.id + '" class="">\<span>' + tempArr[i].statesName + '</span>\<div class=""></div>\</li>'
    } else {
        _html += '<li name="' + tempArr[i].states.id + '" class="">\<span> ' + tempArr[i].statesName + ' </span>\<div class="unRead">' + tempArr[i].orderSize + '</div>\</li>'
    }

}
function renderIssueNavigation(type) {
    var data = getLeftNavigationData(type)
    tempArr = data.doctorOrderStatusList;
    _html = "";
    for (var i = 0; i < tempArr.length; i++) {
        a(tempArr, i);
    }
    $('#issueUl').html(_html);
}
function renderReferralNavigation(type) {
    $.ajax({
        type: 'POST',
        url: IP + 'doctorOrderStatus/findReferralStates',
        dataType: 'json',
        data: {
            "type": '5', //4:首诊方转诊状态,5:会诊方转诊状态
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        success: function (data) {
            console.log(data)
            if (data.code == 1) {
                var tempArr = data.data;
                var _html = '';
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].unReadFlag == 0) {
                        _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span>' + tempArr[i].statesName + '</span>\
						<div class=""></div>\
					</li>'
                    } else {
                        _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span> ' + tempArr[i].statesName + ' </span>\
							<div class="unRead">' + tempArr[i].orderSize + '</div>\
					</li>'
                    }
                }
                $('#referralUl').html(_html);
            } else if (data.code == 250) {
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
/** 医政查看发出列表查询*/
function getIssueList(orderStateId, pageNo, pageSize) {
    var ajaxData;
    $.ajax({
        type: 'POST',
        url: IP + 'order/applyMedicalAdminList', //医政查看发出列表接口
        dataType: 'json',
        data: {
            "orderStateId": orderStateId,
            "pageNo": pageNo,
            "pageSize": pageSize,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        async: false,
        success: function (data) {
            console.log(data)
            if (data.status == 200) {
                localStorage.setItem(issueDataPrefix + orderStateId + pageNo, JSON.stringify(data));
                ajaxData = data;
            } else if (data.status == 250) {
                // 未登录操作
            } else if (data.status == 205) {
                // 其他操作
                $('#tabContent').html('');
            }
        },
        error: function (err) {
            console.log(err);
        },
    })
    return ajaxData;
}
/** 医政查看发出列表渲染*/
function renderIssueList(data) {
    count = data.pageSize * pageSize;
    var myDate = new Date();
    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    var day = double(myDate.getDate()); //获取当前日(1-31)
    var _html = '';
    var tempArr = data.orderBeanList;
    for (var i = 0; i < tempArr.length; i++) {
        var timeStr = tempArr[i].time.split(' ')[0];
        var time = tempArr[i].time.split(' ')[1];
        var _year = timeStr.split('-')[0];
        var _month = timeStr.split('-')[1];
        var _day = timeStr.split('-')[2];
        if (tempArr[i].outFlag == 0) {
            _html += '<tr class="unread" applyFlag="' + tempArr[i].outFlag + '" type="1" name="' + tempArr[i].id + '">\
                    <td>'
        } else {
            _html += '<tr class="read" applyFlag="' + tempArr[i].outFlag + '" type="1" name="' + tempArr[i].id + '">\
            <td>'
        }

        if (tempArr[i].isurgent == 1) {
            _html += '<img class="w14" src="/yilaiyiwang/images/light.png" />'
        }
        _html += '</td>'
        if (tempArr[i].orderType == 0) {
            _html += '<td class="tc">会诊</td>'
        } else {
            _html += '<td class="tc">转诊</td>'
        }
        _html += '<td>\
                    <p class="overHidden3" title="***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '">***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
                </td>\
                <td>\
                    <p class="overHidden1" title="' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '">\
                        <' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '>\
                    </p>\
                </td>\
                <td>\
                    <p class="overHidden2" title="' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '">\
                        <' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '>\
                    </p>\
                </td>'
        if (tempArr[i].manner == 0) {
            _html += '<td class="tc">图文</td>'
        } else {
            _html += '<td class="tc">视频</td>'
        }
        if (year == _year && month == _month && day == _day) {
            _html += '<td class="tl2em">今天' + time + '</td>'
        } else {
            _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
        }
        _html += '</tr>'
    }
    $('#tabContent').html(_html);

}
// 医政查看转诊列表接口
function getReferralList(stateId, pageNo, pageSize) {
    var responseData;
    $.ajax({
        type: 'POST',
        url: IP + 'transferTreatment/managerFindList',
        dataType: 'json',
        data: {
            "stateId": stateId,
            "pageNo": pageNo,
            "pageSize": pageSize,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        async: false,
        success: function (data) {
            console.log(data)
            if (data.code == 1) {
                localStorage.setItem(referralDataPrefix + stateId + pageNo, JSON.stringify(data));
                responseData = data;
            } else if (data.code == 250) {
                // 未登录操作
            } else if (data.code == 205) {
                // 其他操作
                $('#referralTableBody').html('');
            }
        },
        error: function (err) {
            console.log(err);
        },
    })
    return responseData;
}

function renderReferralList(data) {
    count = data.pageSize * pageSize;
    var myDate = new Date();
    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    var day = double(myDate.getDate()); //获取当前日(1-31)
    var _html = '';
    var tempArr = data.data.orderList;
    for (var i = 0; i < tempArr.length; i++) {
        var timeStr = tempArr[i].time.split(' ')[0];
        var time = tempArr[i].time.split(' ')[1];
        var _year = timeStr.split('-')[0];
        var _month = timeStr.split('-')[1];
        var _day = timeStr.split('-')[2];
        if (localStorage.getItem("hospitalId") == tempArr[i].inHospitalId) {
            // 会诊医政
            if (tempArr[i].inFlag == 0) {
                _html += '<tr class="unread" applyFlag="' + tempArr[i].inFlag + '"     type="1" name="' + tempArr[i].id + '">'
            } else {
                _html += '<tr class="read" applyFlag="' + tempArr[i].inFlag + '"       type="1" name="' + tempArr[i].id + '">'
            }
        } else {
            // 首诊医政
            if (tempArr[i].outFlag == 0) {
                _html += '<tr class="unread" applyFlag="' + tempArr[i].outFlag + '"     type="1" name="' + tempArr[i].id + '">'
            } else {
                _html += '<tr class="read" applyFlag="' + tempArr[i].outFlag + '"       type="1" name="' + tempArr[i].id + '">'
            }
        }
        _html += '<td>\
                    <p class="overHidden3" title="***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '">***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
                </td>\
                <td>\
                    <p class="overHidden1" style=" width:280px;" title="' + (tempArr[i].inName ? tempArr[i].inName + ';' : '') + (tempArr[i].inTitle ? tempArr[i].inTitle + ';' : '') + (tempArr[i].inDeptName ? tempArr[i].inDeptName + ';' : '') + tempArr[i].inHospitalName + '">\
                        <' + (tempArr[i].inName ? tempArr[i].inName + ';' : '') + (tempArr[i].inTitle ? tempArr[i].inTitle + ';' : '') + (tempArr[i].inDeptName ? tempArr[i].inDeptName + ';' : '') + tempArr[i].inHospitalName + '>\
                    </p>\
                </td>\
                <td>\
                    <p class="overHidden2" style=" width:160px;" title="' + (tempArr[i].outName ? tempArr[i].outName + ';' : '') + (tempArr[i].outTitle ? tempArr[i].outTitle + ';' : '') + (tempArr[i].outDeptName ? tempArr[i].outDeptName + ';' : '') + tempArr[i].outHospitalName + '">\
                        <' + (tempArr[i].outName ? tempArr[i].outName + ';' : '') + (tempArr[i].outTitle ? tempArr[i].outTitle + ';' : '') + (tempArr[i].outDeptName ? tempArr[i].outDeptName + ';' : '') + tempArr[i].outHospitalName + '>\
                    </p>\
                </td>'
        if (year == _year && month == _month && day == _day) {
            _html += '<td class="tl2em">今天' + time + '</td>'
        } else {
            _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
        }
        _html += '</tr>'
    }
    $('#referralTableBody').html(_html);
}

$(function () {
    /*日历点击显示隐藏 */
    $("#calender").animate({
        left: 300
    }, "slow");
    $(".small_button").click(function () {
        var div = $(".wrap");
        if (div.hasClass("dest")) {
            div.removeClass("dest").animate({
                right: -400
            }, "slow");
            $(".small_button span").html("工作日历表");
            $(this).css("height", "160px");

        } else {
            div.addClass("dest").animate({
                right: 0
            }, "slow");
            // $(".small_button").css(" height","200px", );
            $(".small_button span").html("收起");
            $(this).css({
                "height": "100px",
                "border-radius": "0 0 0 10px;"
            });
        }
    });
    // layui.use('laydate', function () {
    //     var laydate = layui.laydate;
    //     laydate.render({
    //         elem: '#test-n1',
    //         position: 'static'
    //     });
    // });
    renderInvitedNavigation(0)
    // 查询草稿数量
    $.ajax({
        type: 'GET',
        url: IP + 'order/draftSize',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        crossDomain: true,
        global: false,
        success: function (data) {
            if (data.status == 200) {
                $('.unReadNum').html(data.size);
                draftsCount = data.size;
            } else if (data.status == 250) {
                window.location = '/yilaiyiwang/login/login.html';
            } else {
                // 其他操作
            }
        },
        error: function (err) {
            console.log(err);
        },
    })
    // 列表的切换
    $('.leftNav').click(function () {
        var _index = $(this).index();
        $(this).addClass('active').siblings('div').removeClass('active');
        orderStateId = $(this).find(".leftUL li").eq(0).attr('name');
        if (_index == 0) {
            // 医政受邀列表
            renderInvitedNavigation(_index);
            localStorage.setItem('orderType', '0');
            $('.referralTable').css("display", 'none');
            $('.tables').css('display', 'block');
            $(".ulAct").removeClass("ulAct");
            $(this).find(".leftUL li").eq(0).addClass("ulAct");
            $('.originator').css('width', '270px');
            $('.recipients').css('width', '160px');
            var invitedListData = getInvitedList(orderStateId, pageNo, pageSize);

            pageCount = invitedListData.pageSize * pageSize; // 当前li Tab 下的总条数
            renderPagePlugin(invitedListData, pageCount, invitedDataPrefix,orderStateId);
        } else if (_index == 1) {
            // 1:医政发出列表
            renderIssueNavigation(_index);
            localStorage.setItem('orderType', '1');
            $('.referralTable').css("display", 'none');
            $('.tables').css('display', 'block');
            $(".ulAct").removeClass("ulAct");
            $(this).find(".leftUL li").eq(0).addClass("ulAct");
            $('.originator').css('width', '160px');
            $('.recipients').css('width', '270px');
            var issueListData = getIssueList(orderStateId, pageNo, pageSize);
            pageCount = issueListData.pageSize * pageSize; // 当前li Tab 下的总条数
            renderPagePlugin(issueListData, pageCount, issueDataPrefix,orderStateId);
        } else if (_index == 2) {
            // 医政转诊列表
            renderReferralNavigation(null);
            localStorage.setItem('orderType', '5');
            $('.referralTable').css("display", 'block');
            $('.tables').css('display', 'none');
            $(".ulAct").removeClass("ulAct");
            $(this).find(".leftUL li").eq(0).addClass("ulAct");
            $('.recipients').css('width', '270px');
            $('.originator').css('width', '160px');
            var referralListData = getReferralList(orderStateId, pageNo, pageSize);
            pageCount = referralListData.data.pageSize * pageSize; // 当前li Tab 下的总条数
            renderPagePlugin(referralListData, pageCount, referralDataPrefix,orderStateId);
        }
    })

    // 受邀ul切换
    $("#inviteUl").delegate('li', 'click', function () {
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        $('.recipients').css('width', '160px');
        $('.originator').css('width', '270px');
        orderStateId = $(this).attr('name');
        var invitedListData = getInvitedList(orderStateId, pageNo, pageSize);

        pageCount = invitedListData.pageSize * pageSize; // 当前li Tab 下的总条数

        renderPagePlugin(invitedListData, pageCount, invitedDataPrefix,orderStateId);

        return false;
    });
    // 发出ul切换
    $("#issueUl").delegate('li', 'click', function () {
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        $('.recipients').css('width', '270px');
        $('.originator').css('width', '160px');

        orderStateId = $(this).attr('name');
        var issueListData = getIssueList(orderStateId, pageNo, pageSize);

        pageCount = issueListData.pageSize * pageSize; // 当前li Tab 下的总条数

        renderPagePlugin(issueListData, pageCount, issueDataPrefix,orderStateId);
        return false;
    });
    // 转诊ul切换
    $("#referralUl").delegate('li', 'click', function () {
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        $('.recipients').css('width', '270px');
        $('.originator').css('width', '160px');

        orderStateId = $(this).attr('name');
        var referralListData = getReferralList(orderStateId, pageNo, pageSize);

        pageCount = referralListData.data.pageSize * pageSize; // 当前li Tab 下的总条数

        renderPagePlugin(referralListData, pageCount, referralDataPrefix,orderStateId);
        return false;
    });

    // 发出列表详情
    $('#tabContent').delegate('tr', 'click', function () {
        selectOrderById($(this).attr('name'), $(this).attr('type'), $(this).attr('applyFlag'));
    })
    // 转诊列表详情
    $('#referralTableBody').delegate('tr', 'click', function () {
        referralOrderById($(this).attr('name'), $(this).attr('applyFlag'));
    })
    // 查看订单详情
    function selectOrderById(orderId, type, readFlag) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/selectOrderById',
            dataType: 'json',
            data: {
                "orderId": orderId,
                "type": type, //是那个列表的类型(0:医政受邀列表,1:医政发出列表,2:医生受邀列表,3:医生发出列表)
                "readFlag": readFlag,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    localStorage.setItem('data', JSON.stringify(data));
                    if (type == 0) {
                        // 会诊医政 受邀列表
                        if (data.orderFormBean.statesName == "首诊待审核") {

                        } else if (data.orderFormBean.statesName == "待收诊") {
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/invitee/meetManageAudit.html';
                        } else if (data.orderFormBean.statesName == "专家协调") {
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/invitee/expertCoordinate.html';
                        } else if (data.orderFormBean.statesName == "排期审核") {
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/invitee/collectingClinical.html';
                        } else if (data.orderFormBean.statesName == "已排期") {
                            // 已排期
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/invitee/schedule.html';
                        } else if (data.orderFormBean.statesName == "会诊中") {
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/invitee/gConsultation.html';
                        } else if (data.orderFormBean.statesName == "待反馈") {
                            localStorage.setItem('orderId', orderId)
                            // window.location = '/yilaiyiwang/invitee/feedback.html';//不可修改价格
                            window.location = '/yilaiyiwang/workbench/meetfeedback.html';
                        } else if (data.orderFormBean.statesName == "已结束") {
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/invitee/adminApplyInfo.html';
                        } else if (data.orderFormBean.statesName == "会诊已拒收") {
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/invitee/meetRejection.html'
                        }
                    } else if (type == 1) {
                        // --------------发出的-----
                        if (data.orderFormBean.statesName == "首诊待审核") {
                            localStorage.setItem('orderId', orderId);
                            window.location = '/yilaiyiwang/workbench/manageAudit.html';
                        } else if (data.orderFormBean.statesName == "待收诊" || data.orderFormBean.statesName == "排期审核" || data.orderFormBean.statesName == "专家协调") {
                            // 待收诊
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/workbench/collecting_doc.html';
                        } else if (data.orderFormBean.statesName == "已排期") {
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/workbench/schedule.html';
                        } else if (data.orderFormBean.statesName == "会诊中") {
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/workbench/consultation.html';
                        } else if (data.orderFormBean.statesName == "待反馈") {
                            // 待反馈
                            localStorage.setItem('orderId', orderId);
                            // window.location = '/yilaiyiwang/workbench/meetfeedback.html';//可以修改价格
                            window.location = '/yilaiyiwang/invitee/feedback.html';
                        } else if (data.orderFormBean.statesName == "已结束") {
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/workbench/over.html';
                        } else if (data.orderFormBean.statesName == "会诊已拒收") {
                            // 已拒收
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/workbench/rejection.html'
                        }
                    }
                    // 成功操作
                } else if (data.status == 250) {
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
    // 查看转诊订单详情
    function referralOrderById(transferTreatmentId, readFlag) {
        $.ajax({
            type: 'POST',
            url: IP + 'transferTreatment/findTransferTreatmentInfo',
            dataType: 'json',
            data: {
                "transferTreatmentId": transferTreatmentId,//转诊订单id
                "group": 1, //0:医生,1:医政
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
                    localStorage.setItem('transferTreatmentId', transferTreatmentId)
                    window.location = '/yilaiyiwang/referralOrder/referralDoctorManageOrder.html';
                    // 成功操作
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

})
