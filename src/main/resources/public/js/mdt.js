let hospitalInfo = {};
let inviteDoctorArray = [];// 选择的医生信息数组
let isVideo = false;// 选择的医生信息数组
let applyInfo = {};// 选择的医生信息数组
let isInvite = false;
let userInfo;
let applyTimeList = [];
let isMainDoctor = false;
let deptId = "";
let applyFormId;
let _$ = layui.jquery;

/** 渲染 医生页面 左侧导航 */
function renderDoctorNavigation(data) {
    let _html = '';

    for (let i = 0; i < data.length; i++) {
        if (data[i].id === userInfo.hospitalId) {
            _html += '<li hospitalId="' + data[i].id + '" imgPric="' + data[i].consultationPicturePrice + '" videoPric="' + data[i].consultationVideoPrice + '" hospitalTel="' + data[i].hospitalPhone + '" class="hospitalItem">\
                        <p class="hospitalName" title="' + data[i].hospitalName + '">' + data[i].hospitalName + '</p>\
                        <ul class="sectionUl">';
            let sectionArr = data[i].branchBeanList;
            for (let j = 0; j < sectionArr.length; j++) {
                _html += '<li class="sectionItem">\
                                <p class="sectionName" title="' + sectionArr[j].branchName + '">' + sectionArr[j].branchName + '</p>\
                                <ul class="deptUl">'
                let deptArr = sectionArr[j].customBranchList;
                for (let x = 0; x < deptArr.length; x++) {
                    _html += '<li name="' + deptArr[x].id + '" class="deptItem" title="' + deptArr[x].customName + '">' + deptArr[x].customName + '</li>'
                }
                _html += '</ul>\
                         </li>'
            }
            _html += '</ul>\
                    </li>'
            hospitalInfo["hospitalImgPrice"] = data[i].consultationPicturePrice;
            hospitalInfo["hospitalVideoPrice"] = data[i].consultationVideoPrice;
            hospitalInfo["hospitalName"] = data[i].hospitalName;
            hospitalInfo["id"] = data[i].id;
            hospitalInfo["hospitalPhone"] = data[i].hospitalPhone;
        }
    }

    $('.hospitalUl').html(_html);
    // 默认选项
    $('.hospitalItem').eq(0).addClass('active').find('.sectionUl').show().find('.sectionItem').eq(0).addClass('active').find('.deptUl').slideDown();
    $('.hospitalUl').find('.deptItem').eq(0).addClass('active');
    $('.hospitalUl').css({
        'width': '145px',
        'position': 'fixed',
    });
    $('.sectionUl').css({
        'height': $(window).height() - 230 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
    });
    // 医院价格 和 手机号 处理
    $('.hospitalTel').html(data[0].hospitalPhone);
    // favoriteHtml();
    hospitalInfo["branchId"] = $('.hospitalUl').find('.deptItem').eq(0).attr('name');
    hospitalInfo["branchName"] = $('.hospitalUl').find('.deptItem').eq(0).html();
    // 获取默认科室的医生
    getDoctorByBranchId($('.hospitalUl').find('.deptItem').eq(0).attr('name'));

}

/** 渲染 医生列表*/
function renderDoctorList(data) {
    let _html = '<li class="doctorChunk noDoctor">\
                        <div class="Firstdiamond"></div>\
                        <div class="message">\
                            <span class="mess_l">不选医生</span><span>远程中心</span>\
                            <p class="p1" hospitalVideoPic="' + hospitalInfo.hospitalVideoPrice + '" hospitalImgPic="' + hospitalInfo.hospitalImgPrice + '" deptId="' + deptId + '" name="' + hospitalInfo.id + '">' + hospitalInfo.hospitalName + '</p>\
                            <p class="p4">选择此项,申请将发送至对方医院远程中心,由医务人员为您调度医生资源,诊费会在选定医生后确定。<br />请将您的备注信息填至【会/转诊目的】 </p>\
                        </div>\
                    </li>';
    let currentUserId = localStorage.getItem('token');
    for (let i = 0; i < data.length; i++) {
        if (currentUserId === data[i].id) {
            continue;
        }
        _html += '<li deptName="' + hospitalInfo.branchName + '" deptId="' + hospitalInfo.branchId + '" name="' + data[i].id + '" class="doctorChunk">\
                            <div class="diamond"></div>\
                            <div class="message">\
                                <span class="mess_l username">' + data[i].userName + '</span>\
                                <span class="occupation" name="' + data[i].titleName + '">' + data[i].titleName + '</span>\
                                <p class="p1 hospital" hospitalImgPic="' + hospitalInfo.hospitalImgPrice + '" hospitalVideoPic="' + hospitalInfo.hospitalVideoPrice + '" name="' + hospitalInfo.id + '">' + hospitalInfo.hospitalName + '</p>\
                                <p class="p2">' + data[i].userStrong + '</p>\
                                <p medicalFeesVideo="' + data[i].consultationVideoPrice + '" medicalFees="' + data[i].consultationPicturePrice + '" class="p3 pric">图文&nbsp;' + data[i].consultationPicturePrice + '元/视频&nbsp;' + data[i].consultationVideoPrice + '元</p>\
                            </div>\
                            <div class="present">\
                                <h4>联系电话<span>' + data[i].telephone + '</span></h4>\
                                <h4>擅长</h4>\
                                <p>' + data[i].userStrong + '</p>\
                                <h4>病历要求</h4>\
                                <p>' + data[i].needCaseType + '</p>\
                            </div>\
                        </li>'
    }
    $('.doctorUl').html(_html);

}

/** 渲染 已选择的 医生 */
function renderAlreadyExistDoctor(inviteDoctorArray) {
    let _html = "";
    let imgPric = Number(hospitalInfo.hospitalImgPrice);
    let videoPric = Number(hospitalInfo.hospitalVideoPrice);
    $('.doctorCount').html(inviteDoctorArray.length);

    if (inviteDoctorArray.length == 0) {
        _html = '<li class="clearfix"><span>主会诊人:未选择</span></li>';
        $('.imgPric').html($('.imgPric').attr('imgPric'));
        $('.videoPric').html($('.videoPric').attr('videoPric'));
    } else {
        for (let i = 0; i < inviteDoctorArray.length; i++) {
            if (i == 0) {
                _html += '<li class="clearfix"><span>主会诊人:<' + inviteDoctorArray[i].hospitalName + ';' + inviteDoctorArray[i].branchName + ';' + inviteDoctorArray[i].doctorName + ';' + inviteDoctorArray[i].doctorTitleName + '>;</span>';
            } else {
                _html += '<li class="clearfix"><span><' + inviteDoctorArray[i].hospitalName + ';' + inviteDoctorArray[i].branchName + ';' + inviteDoctorArray[i].doctorName + ';' + inviteDoctorArray[i].doctorTitleName + '>;</span>';
            }
            // 判断是不是自己 不是自己加删除按钮
            if (inviteDoctorArray[i].doctorId !== userInfo.id) {
                _html += '<img class="delDocBtn" src="../images/delDoc.png" alt="">'
            }
            _html += '</li>';
            imgPric += Number(inviteDoctorArray[i].doctorPicturePrice);
            videoPric += Number(inviteDoctorArray[i].doctorVideoPrice);
        }

    }
    $('.favoriteUl').html(_html);
    if (isVideo) {
        $('.money').html(videoPric);
        return false;
    }
    $('.money').html(imgPric);

}

/** 根据二级科室id查询医生 */
function getDoctorByBranchId(deptId) {
    deptId = deptId;
    const data = {"branchId": deptId};
    ajaxRequest("GET", getDoctorListByBranchIdUrl, data, true, "application/json", false, renderDoctorList, null, null);
}

function sub() {
    let price;
    let data = new FormData();
    data.append("applyFormId", applyInfo.id);
    if (inviteDoctorArray.length > 0) {
        let doctorList = [];
        let consultantReport = [];
        data.append('inviteHospitalId', inviteDoctorArray[0].hospitalId); // 会诊医院id
        data.append('inviteBranchId', inviteDoctorArray[0].branchId); // 主会诊科室id
        data.append('inviteUserId', inviteDoctorArray[0].doctorId);
        if (isVideo) {
            price = Number(inviteDoctorArray[0].hospitalVideoPrice)
            data.append('hospitalPrice', inviteDoctorArray[0].hospitalVideoPrice); // 医院图文基本价格
        } else {
            price = Number(inviteDoctorArray[0].hospitalImgPrice)
            data.append('hospitalPrice', inviteDoctorArray[0].hospitalImgPrice); // 医院图文基本价格
        }
        let inviteSummary = "";
        for (let i = 0; i < inviteDoctorArray.length; i++) {
            let inviteDoctor = "<" + inviteDoctorArray[i].doctorName + "/" + inviteDoctorArray[i].doctorTitleName + "/" + inviteDoctorArray[i].branchName + "/" + inviteDoctorArray[i].hospitalName + ">";
            if (isVideo) {
                doctorList.push({
                    "doctorName": inviteDoctor,
                    "doctorId": inviteDoctorArray[i].doctorId,
                    "price": inviteDoctorArray[i].doctorVideoPrice,
                    "branchId": inviteDoctorArray[i].branchId,
                    "doctorPicturePrice": inviteDoctorArray[i].doctorPicturePrice,
                    "doctorVideoPrice": inviteDoctorArray[i].doctorVideoPrice,
                    "hospitalImgPrice": inviteDoctorArray[i].hospitalImgPrice,
                    "hospitalVideoPrice": inviteDoctorArray[i].hospitalVideoPrice,
                });
                price += Number(inviteDoctorArray[i].doctorVideoPrice);
            } else {
                doctorList.push({
                    "doctorName": inviteDoctor,
                    "doctorId": inviteDoctorArray[i].doctorId,
                    "price": inviteDoctorArray[i].doctorPicturePrice,
                    "branchId": inviteDoctorArray[i].branchId,
                    "doctorPicturePrice": inviteDoctorArray[i].doctorPicturePrice,
                    "doctorVideoPrice": inviteDoctorArray[i].doctorVideoPrice,
                    "hospitalImgPrice": inviteDoctorArray[i].hospitalImgPrice,
                    "hospitalVideoPrice": inviteDoctorArray[i].hospitalVideoPrice,
                });
                price += Number(inviteDoctorArray[i].doctorPicturePrice);
            }
            consultantReport.push({
                "doctorName": inviteDoctorArray[i].doctorName,
                "doctorId": inviteDoctorArray[i].doctorId,
                "report": "",
                "reportStatus": "1"
            })
            inviteSummary += inviteDoctor + ";";
        }
        data.append("inviteSummary", inviteSummary);
        data.append("consultantReport", JSON.stringify(consultantReport));
        data.append('consultantUserList', JSON.stringify(doctorList));
        data.append("consultantPrice", price);
    } else {
        data.append('inviteHospitalId', hospitalInfo.id);
        data.append('inviteBranchId', hospitalInfo.branchId);
        data.append("inviteSummary", "<" + hospitalInfo.hospitalName + ">");

        if (isVideo) {
            price = Number(hospitalInfo.hospitalVideoPrice)
            data.append('hospitalPrice', hospitalInfo.hospitalVideoPrice);
        } else {
            price = Number(hospitalInfo.hospitalImgPrice)
            data.append('hospitalPrice', hospitalInfo.hospitalImgPrice);
        }
        data.append("consultantPrice", price);
    }
    if (isVideo) {
        data.append("startEndTime", JSON.stringify(dateList));
        ajaxRequest("POST", allocationDoctorTime, data, false, false, true, allocationDoctorTimeSuccess, null, null);
    } else {
        ajaxRequest("POST", allocationDoctorTimePicture, data, false, false, true, allocationDoctorTimeSuccess, null, null);
    }

    function allocationDoctorTimeSuccess(result) {
        console.log(result);
        // 成功操作
        layer.closeAll();
        // $('.selectTimeContainer').hide();
        window.location = '../page/morkbench.html';
        // localStorage.setItem('applyFormId', result.id);
    }
}

$(function () {
    /** 动态创建进度条 */
    let statusArr = ['待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    let str = '';
    for (let i = 0; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>'
        $('.progressBar').html(str);
    }
    $('.progressBar li:first-child').addClass('libg');

    if (JSON.parse(localStorage.getItem('applyInfo'))) {
        applyFormId = localStorage.getItem('applyFormId');
        applyInfo = JSON.parse(localStorage.getItem('applyInfo'));
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo.hospitalId === applyInfo.inviteHospitalId && applyInfo.applyStatus !== "CONSULTATION_APPLY_CREATE_SUCCESS") {
            isInvite = true;
        }
        isMainDoctor = userInfo.id === applyInfo.inviteUserId ? true : false;
        applyTimeList = applyInfo.applyTimeList;
        /** 获取通讯录左侧导航数据 */
        ajaxRequest("GET", getMasterHospitalBranchList, null, false, false, false, renderDoctorNavigation, null, null);
        if ("APPLY_CONSULTATION_VIDEO" === applyInfo.applyType) {
            isVideo = true;
        }
        let consultantUserList = JSON.parse(applyInfo.consultantUserList)
        for (let item of consultantUserList) {
            let inviteDoctorArr = item.doctorName.replace("<", "").replace(">", "").split("/");
            let doctorName = inviteDoctorArr[0];
            let doctorTitleName = inviteDoctorArr[1];
            let branchName = inviteDoctorArr[2];
            let hospitalName = inviteDoctorArr[3];
            inviteDoctorArray.push({
                hospitalId: applyInfo.inviteHospitalId, // 医院id
                branchId: item.branchId, // 科室id
                doctorId: item.doctorId, // 医生id
                hospitalName: hospitalName, // 医院名字
                branchName: branchName, // 科室名字
                doctorName: doctorName, // 医生名字
                hospitalImgPrice: item.hospitalImgPrice, // 医院图文价格
                hospitalVideoPrice: item.hospitalVideoPrice, // 医院视频价格
                doctorPicturePrice: item.doctorPicturePrice, // 图文价格
                doctorVideoPrice: item.doctorVideoPrice, // 视频价格
                doctorTitleName: doctorTitleName, // 职称名字
            });
        }
        renderAlreadyExistDoctor(inviteDoctorArray);
    }

    $(window).scroll(function () {
        $('.hospitalUl').css({
            'width': '145px',
            'position': 'fixed',
        })
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
            $('.sectionUl').css({
                'height': $(window).height() - 280 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            })
        } else {
            $('.sectionUl').css({
                'height': $(window).height() - 230 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            })
        }
    });

    // 医院切换
    $('.hospitalUl').delegate('.hospitalItem', 'click', function () {
        $(this).addClass('active').siblings('.hospitalItem').removeClass('active');
        $(this).find('.sectionUl').stop(true).slideToggle();
        $(this).siblings('.hospitalItem').find('.sectionUl').stop(true).slideUp();
        $('.hospitalTel').html($(this).attr('phone'));
        $('.imgPric').attr('imgPric', $(this).attr('imgPric')).html($(this).attr('imgPric'));
        $('.videoPric').attr('videoPric', $(this).attr('videoPric')).html($(this).attr('videoPric'));
    })
    // 一级科室切换
    $('.hospitalUl').delegate('.sectionItem', 'click', function () {
        if ($(this).find('.deptUl').css('display') == 'none') {
            $(this).addClass('active').siblings('.sectionItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.sectionItem').removeClass('active');
        }
        $(this).find('.deptUl').stop(true, true).slideToggle();
        $(this).siblings('.sectionItem').find('.deptUl').stop(true, true).slideUp();
        return false;
    })
    // 二级科室切换
    $('.hospitalUl').delegate('.deptUl', 'click', function () {
        return false;
    });
    $('.hospitalUl').delegate('.deptItem', 'click', function () {
        $('.hospitalUl').find('.deptItem').removeClass('active');
        $(this).addClass('active');
        getDoctorByBranchId($(this).attr('name'));
        return false;
    });

    // 选医生鼠标移入
    $('.doctorUl').delegate('.doctorChunk', 'mouseover', function (event) {
        event.stopPropagation();
        $(".doctorChunk").css("border", "1px solid #efefef");
        $(this).css("border", "1px solid #F6C567");
        if (($(this).index() + 1) % 3 == 0) {
            $(this).children(".present").css({
                "top": "0",
                "left": "-462px"
            }).show();
        } else {
            $(this).children(".present").css({
                "top": "0",
                "right": "0"
            }).show();
        }
    })

    // 选医生鼠标移出、
    $('.doctorUl').delegate('.doctorChunk', 'mouseleave', function (event) {
        $(this).find('.present').hide();
        $(this).css("border", "1px solid #efefef");
    });
    // 选择医生事件--添加
    $('.doctorUl').delegate('.doctorChunk', 'click', function (event) {
        if ($(this).hasClass('noDoctor')) {
            hospitalInfo["id"] = $(this).find('.p1').attr('name');
            hospitalInfo["branchId"] = $(this).find('.p1').attr('deptid');
            hospitalInfo["hospitalImgPrice"] = $(this).find('.p1').attr('hospitalImgPic');
            hospitalInfo["hospitalName"] = $(this).find('.p1').html();
            hospitalInfo["hospitalVideoPrice"] = $(this).find('.p1').attr('hospitalVideoPic');
            // 点的不选医生
            inviteDoctorArray = [];
            renderAlreadyExistDoctor(inviteDoctorArray);
        } else {
            // 点的某一个医生
            var flag = true;
            for (var i = 0; i < inviteDoctorArray.length; i++) {
                if (inviteDoctorArray[i].doctorId == $(this).attr('name')) {
                    flag = false
                }
            }
            if (flag) {
                inviteDoctorArray.push({
                    hospitalId: $(this).find('.hospital').attr('name'), // 医院id
                    branchId: $(this).attr('deptId'), // 科室id
                    doctorId: $(this).attr('name'), // 医生id
                    hospitalName: $(this).find('.hospital').html(), // 医院名字
                    branchName: $(this).attr('deptName'), // 科室名字
                    doctorName: $(this).find('.username').html(), // 医生名字
                    hospitalImgPrice: $(this).find('.hospital').attr('hospitalimgpic'), // 医院图文价格
                    hospitalVideoPrice: $(this).find('.hospital').attr('hospitalvideopic'), // 医院视频价格
                    doctorPicturePrice: $(this).find('.pric').attr('medicalFees'), // 图文价格
                    doctorVideoPrice: $(this).find('.pric').attr('medicalFeesVideo'), // 视频价格
                    doctorTitleName: $(this).find('.occupation').html(), // 职称名字
                });

            }
            renderAlreadyExistDoctor(inviteDoctorArray);
        }
    });
    // 选择医生事件--删除
    $('.favoriteUl').delegate('.delDocBtn', 'click', function () {
        inviteDoctorArray.splice($(this).parent('li').index(), 1);
        renderAlreadyExistDoctor(inviteDoctorArray);
    })

    $(window).scroll(function () {
        $('.oneLevelUl').css({
            'width': '145px',
            'position': 'fixed',
        })
    });

    function scrollTo(x) {
        console.log(x)
        $('html, body').animate({
            scrollTop: x - 100,
        }, 300);
    };

    $('.getBack').click(function () {
        window.history.back(-1);
    })

    // 控制确认接收按钮和排期按钮
    if (!isVideo) {
        $('.mdt_BtnPic').show();
        $('.mdt_Btn').hide();
    } else {
        $('.mdt_BtnPic').hide();
        $('.mdt_Btn').show();
    }
    $('.mdt_BtnPic').click(function () {

        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: 0,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('.submitBoxPic'),
        });

    })
    // 下一步修改排期按钮
    $('#choiceConsultationTimeBtn').click(function () {
        isOnly = true;
        showTimeView(applyTimeList);
    })

    $("#consultationTimeBoxYesBtn").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['400px', '200px'],
            closeBtn: 0,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('#choiceMeetingAttributeBox'),
        });
        return false;
    })
    $("#choiceMeetingAttributeBoxYesBtn").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: 0,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('#videoApplyAuditBox'),
        });
        let data = new FormData();
        dateList = [];
        for (let i = 0; i < newDateTimeList.length; i++) {
            if (newDateTimeList[i].startIndex <= newDateTimeList[i].endIndex) {
                dateList.push({
                    'startTime': newDateTimeList[i].date + ' ' + $('#timeUl > li').eq(newDateTimeList[i].startIndex).html() + ':00',
                    'endTime': newDateTimeList[i].date + ' ' + $('#timeUl > li').eq(newDateTimeList[i].endIndex).attr('enddate') + ':00'
                });
            } else {
                dateList.push({
                    'startTime': newDateTimeList[i].date + ' ' + $('#timeUl > li').eq(newDateTimeList[i].endIndex).html() + ':00',
                    'endTime': newDateTimeList[i].date + ' ' + $('#timeUl > li').eq(newDateTimeList[i].startIndex).attr('enddate') + ':00'
                });
            }

        }
        if (dateList.length === 0) {
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: 0,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 1000,
                content: _$('.noDate'),
            });
            setTimeout(function () {
                $('.noDate').hide()
            }, 1000)
        } else {
            let doctorList = [];
            let consultantReport = [];
            price = Number(inviteDoctorArray[0].hospitalVideoPrice)

            let inviteSummary = "";
            for (let i = 0; i < inviteDoctorArray.length; i++) {
                let inviteDoctor = "<" + inviteDoctorArray[i].doctorName + "/" + inviteDoctorArray[i].doctorTitleName + "/" + inviteDoctorArray[i].branchName + "/" + inviteDoctorArray[i].hospitalName + ">";
                if (isVideo) {
                    doctorList.push({
                        "doctorName": inviteDoctor,
                        "doctorId": inviteDoctorArray[i].doctorId,
                        "price": inviteDoctorArray[i].doctorVideoPrice,
                        "branchId": inviteDoctorArray[i].branchId,
                        "doctorPicturePrice": inviteDoctorArray[i].doctorPicturePrice,
                        "doctorVideoPrice": inviteDoctorArray[i].doctorVideoPrice,
                        "hospitalImgPrice": inviteDoctorArray[i].hospitalImgPrice,
                        "hospitalVideoPrice": inviteDoctorArray[i].hospitalVideoPrice,
                    });
                    price += Number(inviteDoctorArray[i].doctorVideoPrice);
                } else {
                    doctorList.push({
                        "doctorName": inviteDoctor,
                        "doctorId": inviteDoctorArray[i].doctorId,
                        "price": inviteDoctorArray[i].doctorPicturePrice,
                        "branchId": inviteDoctorArray[i].branchId,
                        "doctorPicturePrice": inviteDoctorArray[i].doctorPicturePrice,
                        "doctorVideoPrice": inviteDoctorArray[i].doctorVideoPrice,
                        "hospitalImgPrice": inviteDoctorArray[i].hospitalImgPrice,
                        "hospitalVideoPrice": inviteDoctorArray[i].hospitalVideoPrice,
                    });
                    price += Number(inviteDoctorArray[i].doctorPicturePrice);
                }
                consultantReport.push({
                    "doctorName": inviteDoctorArray[i].doctorName,
                    "doctorId": inviteDoctorArray[i].doctorId,
                    "report": "",
                    "reportStatus": "1"
                })
                inviteSummary += inviteDoctor + ";";
            }
            data.append("startEndTime", JSON.stringify(dateList));
            data.append("inviteSummary", inviteSummary);
            data.append("consultantReport", JSON.stringify(consultantReport));
            data.append('consultantUserList', JSON.stringify(doctorList));
            data.append("consultantPrice", price); // 费用
            data.append("applyFormId", applyFormId);
            data.append("meetMute", $("#meetMute").is(':checked'));
            data.append("meetRecord", $("#meetRecord").is(':checked'));
            data.append("meetStart", $("#meetStart").is(':checked'));

        }
        $("#videoApplyAuditBox .yesBtn").click(function () {
            ajaxRequest("POST", allocationDoctorTimeAuditUrl, data, false, false, true, sirUpdateDateSuccess, null, null)

        })
        $("#videoApplyAuditBox .noBtn").click(function () {
            ajaxRequest("POST", allocationDoctorTime, data, false, false, true, sirUpdateDateSuccess, null, null)

        })
        function sirUpdateDateSuccess(result) {
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: 0,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 1000,
                content: _$('.receiveSuccess'),
            });
            setTimeout(function () {
                window.location = '../page/morkbench.html'
            }, 1000);
        }

        return false;
    })

    // 确认接收取消按钮
    $('.submitBoxPic').find('.noBtn').click(function () {
        layer.closeAll();
        // $('.selectTimeContainer').hide();
        $('.promptText,.submitBox').hide();
    })
    // 图文确认接收确定按钮
    $('.submitBoxPic').find('.yesBtn').click(function () {
        sub();
    })
    $('.submitBox').find('.yesBtn').click(function () {
        sub();
    })
})
