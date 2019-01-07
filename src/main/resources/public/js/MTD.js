let hospitalInfo = {};
let inviteDoctorArray = [];// 选择的医生信息数组
let isVideo = false;// 选择的医生信息数组
let applyInfo = {};// 选择的医生信息数组
let isInvite = false;
let userInfo;
let applyTimeList = [];
let isMainDoctor = false;
let newDateTimeList = [];
let deptId = "";
let applyFormId;

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

/**主会诊医生 修改 会诊排期*/
function updateApplyTime(dateList) {
    if (newDateTimeList.length > 0) {
        let _$ = layui.jquery;
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('.submitBox'),
        });
    } else {
        let _$ = layui.jquery;
        layer.open({
            type: 1,
            title: '',
            area: ['300px', '80px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            time: 1000,
            content: _$('.noDate'),
        });
        setTimeout(function () {
            $('.noDate').hide()
        }, 1000)
    }
    return false;
    if (isMainDoctor) {
        let data = new FormData();
        data.append("applyFormId", applyFormId);
        data.append("startEndTime", JSON.stringify(dateList));
        ajaxRequest("POST", allocationDoctorTime, data, false, false, true, sirUpdateDateSuccess, null, null)
    }

    function sirUpdateDateSuccess(result) {
        $("#alertText").html("接收成功");
        alertMessage();
        setTimeout(function () {
            window.location = '../page/morkbench.html'
        }, 2000);
        return false;
    }

}

function sub() {
    console.log(inviteDoctorArray);
    let data = new FormData();
    data.append("id", applyInfo.id); // 费用
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
                });
                price += Number(inviteDoctorArray[i].doctorVideoPrice);
            } else {
                doctorList.push({
                    "doctorName": inviteDoctor,
                    "doctorId": inviteDoctorArray[i].doctorId,
                    "price": inviteDoctorArray[i].doctorPicturePrice,
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
        data.append("consultantPrice", price); // 费用
    } else {
        data.append('inviteHospitalId', hospitalInfo.id);
        data.append('inviteBranchId', hospitalInfo.branchId);
        data.append("inviteSummary", "<" + hospitalInfo.hospitalName + ">");

        if (isVideo) {
            price = Number(hospitalInfo.hospitalVideoPrice)
            data.append('hospitalPrice', hospitalInfo.hospitalVideoPrice); // 医院图文基本价格
        } else {
            price = Number(hospitalInfo.hospitalImgPrice)
            data.append('hospitalPrice', hospitalInfo.hospitalImgPrice); // 医院图文基本价格
        }
        data.append("consultantPrice", price); // 费用

    }

    return false;
    ajaxRequest("POST", allocationDoctorTime, data, false, false, true, sirUpdateDoctorSuccess, null, null);

    function sirUpdateDoctorSuccess(result) {
        console.log(result);
        // 成功操作
        layer.closeAll();
        $('.selectTimeContainer').hide();
        window.location = '../page/morkbench.html';
        // sessionStorage.setItem('applyFormId', result.id);
    }
}

$(function () {
    /* 动态创建进度条 */
    let statusArr = ['待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    let str = '';
    for (let i = 0; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>'
        $('.progressBar').html(str);
    }
    $('.progressBar li:first-child').addClass('libg');

    if (JSON.parse(sessionStorage.getItem('applyInfo'))) {
        applyFormId = sessionStorage.getItem('applyFormId');
        applyInfo = JSON.parse(sessionStorage.getItem('applyInfo'));
        userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (userInfo.hospitalId === applyInfo.inviteHospitalId && applyInfo.applyStatus !== "CONSULTATION_APPLY_CREATE_SUCCESS") {
            isInvite = true;
        }
        isMainDoctor = userInfo.id === applyInfo.inviteUserId ? true : false;
        applyTimeList = applyInfo.applyTimeList;
        /** 获取通讯录左侧导航数据 */
        ajaxRequest("GET", getHospitalBranchListUrl, null, false, false, false, renderDoctorNavigation, null, null);
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
                branchId: applyInfo.inviteBranchId, // 科室id
                doctorId: item.doctorId, // 医生id
                hospitalName: hospitalName, // 医院名字
                branchName: branchName, // 科室名字
                doctorName: doctorName, // 医生名字
                hospitalImgPrice: applyInfo.hospitalPrice, // 医院图文价格
                hospitalVideoPrice: applyInfo.hospitalPrice, // 医院视频价格
                doctorPicturePrice: item.price, // 图文价格
                doctorVideoPrice: item.price, // 视频价格
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
    // // 选择医生事件--添加
    // $('.doctorUl').delegate('.doctorChunk', 'click', function (event) {
    //     if ($(this).hasClass('noDocter')) {
    //         // 点的不选医生
    //         favoriteArr = [];
    //         favoriteHtml();
    //     } else if (favoriteArr.length > 0 && $(this).find('.hospital').attr('name') != favoriteArr[0].hospitalId) {
    //         let _$ = layui.jquery;
    //         layer.open({
    //             type: 1,
    //             title: '',
    //             area: ['300px', '80px'],
    //             closeBtn: false,
    //             shade: [0.1, '#000000'],
    //             shadeClose: false,
    //             time: 2000,
    //             content: _$('.promptText'),
    //         });
    //         setTimeout(function () {
    //             $('.promptText').hide();
    //         }, 2000)
    //     } else {
    //         // 点的某一个医生
    //         let flag = true;
    //         for (let i = 0; i < favoriteArr.length; i++) {
    //             if (favoriteArr[i].id == $(this).attr('name')) {
    //                 flag = false
    //             }
    //         }
    //         if (flag) {
    //             favoriteArr.push({
    //                 id: $(this).attr('name'), // 医生id
    //                 hospitalName: $(this).find('.hospital').html(), // 医院名字
    //                 hospitalId: $(this).find('.hospital').attr('name'), // 医院id
    //                 deptName: $(this).attr('deptName'), // 科室名字
    //                 deptId: $(this).attr('deptId'), // 科室id
    //                 name: $(this).find('.username').html(), // 医生名字
    //                 medicalFees: $(this).find('.pric').attr('medicalFees'), // 图文价格
    //                 medicalFeesVideo: $(this).find('.pric').attr('medicalFeesVideo'), // 视频价格
    //                 occupationName: $(this).find('.occupation').html(), // 职称名字
    //                 occupationId: $(this).find('.occupation').attr('name'), // 职称id
    //             });
    //         }
    //         favoriteHtml();
    //     }
    // });
    // // 选择医生事件--删除
    // $('.favoriteUl').delegate('.delDocBtn', 'click', function () {
    //     favoriteArr.splice($(this).parent('li').index(), 1);
    //     favoriteHtml();
    // })

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
        let _$ = layui.jquery;
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('.submitBoxPic'),
        });

    })
    // 确认接收取消按钮
    $('.submitBoxPic').find('.noBtn').click(function () {
        layer.closeAll();
        $('.selectTimeContainer').hide();
        $('.promptText,.submitBox').hide();
    })

    // 下一步修改排期按钮
    $('.mdt_Btn').click(function () {
        showDateView(applyTimeList);
        // 视频
        // let $ = layui.jquery;
        // layer.open({
        //     type: 1,
        //     title: '',
        //     area: ['1060px', '680px'],
        //     closeBtn: 0,
        //     skin: 'noBackground',
        //     content: $('.selectTimeContainer'),
        // })
        // let startMinute = 0; // 开始总分钟数
        // let endMinute = 0; // 结束总分钟数
        // let startHour = 0; // 开始小时数
        // let endHour = 0; // 结束小时数
        // let _html = '';
        // for (let i = 0; i < 96; i++) {
        //     startMinute = i * 15;
        //     endMinute = (i + 1) * 15;
        //     startHour = parseInt(startMinute / 60);
        //     endHour = parseInt(endMinute / 60);
        //     let startM = startMinute %= 60; // 计算后的开始分钟数
        //     let endM = endMinute %= 60; // 计算后的开始分钟数
        //     if (endHour == 24) {
        //         _html += '<li endDate="23:59" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
        //     } else {
        //         _html += '<li endDate="' + double(endHour) + ':' + double(endM) + '" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
        //     }
        // }
        // $('.rightContent').html(_html)
        // for (let i = 0; i < dateTempList.length; i++) {
        //     if (dateStr == dateTempList[i].date) {
        //         for (let j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
        //             $('#timeUl > li').eq(j).addClass('grey');
        //         }
        //     }
        // }
        // if (data.orderFormBean.orderBeginDate) {
        //     let date = data.orderFormBean.orderBeginDate.split(' ')[0];
        //     let startDate = data.orderFormBean.orderBeginDate.split(' ')[1];
        //     let hours = startDate.split(':')[0];
        //     let minute = startDate.split(':')[1];
        //     let startIndex = (hours * 60 + minute * 1) / 15;
        //     let endDate = data.orderFormBean.orderEndDate.split(' ')[1];
        //     let endHour = endDate.split(':')[0];
        //     let endMinute = endDate.split(':')[1];
        //     let endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
        //     newDateTempList.push({
        //         "date": date,
        //         "startIndex": startIndex,
        //         "endIndex": endIndex - 1,
        //     });
        //     for (let i = 0; i < newDateTempList.length; i++) {
        //         if (dateStr == newDateTempList[i].date) {
        //             for (let j = newDateTempList[i].startIndex; j <= newDateTempList[i].endIndex; j++) {
        //                 $('#timeUl > li').eq(j).addClass('active');
        //             }
        //         }
        //     }
        // }
    })
    // let newDateTempList = [];
    // let dateTempList = []; // 收集的时间段
    // for (let i = 0; i < data.orderDateList.length; i++) {
    //     let date = data.orderDateList[i].startDate.split(' ')[0];
    //     let startDate = data.orderDateList[i].startDate.split(' ')[1];
    //     let hours = startDate.split(':')[0];
    //     let minute = startDate.split(':')[1];
    //     let startIndex = (hours * 60 + minute * 1) / 15;
    //     let endDate = data.orderDateList[i].endDate.split(' ')[1];
    //     let endHour = endDate.split(':')[0];
    //     let endMinute = endDate.split(':')[1];
    //     let endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
    //     dateTempList.push({
    //         "date": date,
    //         "startIndex": startIndex,
    //         "endIndex": endIndex - 1,
    //     })
    // }
    // let markJson = {};
    // for (let i = 0; i < dateTempList.length; i++) {
    //     markJson[dateTempList[i].date] = '';
    // }
    // let myDate = new Date();
    // let flag = true;
    // let startIndex = 0;
    // let endIndex = 0;
    // let dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
    // if (data.orderFormBean.orderBeginDate) {
    //     dateStr = data.orderFormBean.orderBeginDate.split(' ')[0];
    // }
    // // 渲染日历控件
    // layui.use('laydate', function() {
    //     let laydate = layui.laydate;
    //     //执行一个laydate实例
    //     laydate.render({
    //         elem: '#timeBox',
    //         position: 'static',
    //         showBottom: false,
    //         value: dateStr,
    //         mark: markJson,
    //         min: 0,
    //         change: function(value, date) { //监听日期被切换
    //             $('#timeUl > li').removeClass('grey');
    //             $('#timeUl > li').removeClass('active');
    //             flag = true;
    //             dateStr = value;
    //             for (let i = 0; i < dateTempList.length; i++) {
    //                 if (dateStr == dateTempList[i].date) {
    //                     if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
    //                         for (let j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
    //                             $('#timeUl > li').eq(j).addClass('grey');
    //                         }
    //                     } else {
    //                         for (let j = dateTempList[i].endIndex; j <= dateTempList[i].startIndex; j++) {
    //                             $('#timeUl > li').eq(j).addClass('grey');
    //                         }
    //                     }
    //                 }
    //             }
    //             for (let i = 0; i < newDateTempList.length; i++) {
    //                 if (dateStr == newDateTempList[i].date) {
    //                     if (newDateTempList[i].startIndex <= newDateTempList[i].endIndex) {
    //                         for (let j = newDateTempList[i].startIndex; j <= newDateTempList[i].endIndex; j++) {
    //                             $('#timeUl > li').eq(j).addClass('active');
    //                         }
    //                     } else {
    //                         for (let j = newDateTempList[i].endIndex; j <= newDateTempList[i].startIndex; j++) {
    //                             $('#timeUl > li').eq(j).addClass('active');
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // });
    // // 分钟选择事件、
    // $('#timeUl').delegate('li', 'click', function() {
    //     if (flag) {
    //         $(this).addClass('active').siblings('li').removeClass('active');
    //         flag = false;
    //         startIndex = $(this).attr('index');
    //     } else {
    //         $(this).addClass('active');
    //         flag = true;
    //         endIndex = $(this).attr('index');
    //         if (startIndex <= endIndex) {
    //             for (let i = startIndex; i < endIndex; i++) {
    //                 $('#timeUl > li').eq(i).addClass('active');
    //             }
    //         } else {
    //             for (let i = endIndex; i < startIndex; i++) {
    //                 $('#timeUl > li').eq(i).addClass('active');
    //             }
    //         }
    //         newDateTempList = [];
    //         newDateTempList.push({
    //             "date": dateStr,
    //             "startIndex": startIndex,
    //             "endIndex": endIndex,
    //         });
    //     }
    // });
    // // 关闭事件
    // $('.closeBtnTime').click(function() {
    //     newDateTempList = [];
    //     layer.closeAll();
    //     $('.selectTimeContainer').hide();
    // })
    //
    // $('.selectTimeContainer').find('.yesBtn').click(function() {
    //     if (newDateTempList.length > 0) {
    //         let _$ = layui.jquery;
    //         layer.open({
    //             type: 1,
    //             title: '',
    //             area: ['500px', '200px'],
    //             closeBtn: false,
    //             shade: [0.1, '#000000'],
    //             shadeClose: false,
    //             content: _$('.submitBox'),
    //         });
    //     } else {
    //         let _$ = layui.jquery;
    //         layer.open({
    //             type: 1,
    //             title: '',
    //             area: ['300px', '80px'],
    //             closeBtn: false,
    //             shade: [0.1, '#000000'],
    //             shadeClose: false,
    //             time: 1000,
    //             content: _$('.noDate'),
    //         });
    //         setTimeout(function() {
    //             $('.noDate').hide()
    //         }, 1000)
    //     }
    // })
    // $('.submitBox').find('.noBtn').click(function() {
    //     layer.closeAll();
    //     $('.selectTimeContainer').hide();
    //     $('.promptText,.submitBox').hide();
    // })
    // $('.submitBox').find('.yesBtn').click(function() {
    //     let startTime = '';
    //     let endTime = '';
    //     if (newDateTempList[0].startIndex <= newDateTempList[0].endIndex) {
    //         startTime = newDateTempList[0].date + ' ' + $('#timeUl > li').eq(newDateTempList[0].startIndex).html() + ':00';
    //         endTime = newDateTempList[0].date + ' ' + $('#timeUl>li').eq(newDateTempList[0].endIndex).attr('enddate') + ':00'
    //     } else {
    //         startTime = newDateTempList[0].date + ' ' + $('#timeUl > li').eq(newDateTempList[0].endIndex).html() + ':00';
    //         endTime = newDateTempList[0].date + ' ' + $('#timeUl > li').eq(newDateTempList[0].startIndex).attr('enddate') + ':00';
    //     }
    //     let doctorList = [];
    //     let price = Number(data.orderFormBean.basePrice);
    //     for (let i = 0; i < favoriteArr.length; i++) {
    //
    //         if (data.orderFormBean.orderTypes == 0) {
    //             // 图文
    //             doctorList.push({
    //                 "doctorId": favoriteArr[i].id,
    //                 "money": favoriteArr[i].medicalFees,
    //             });
    //             price += Number(favoriteArr[i].medicalFees);
    //         } else {
    //             // 视频
    //             doctorList.push({
    //                 "doctorId": favoriteArr[i].id,
    //                 "money": favoriteArr[i].medicalFeesVideo,
    //             });
    //             price += Number(favoriteArr[i].medicalFeesVideo);
    //         }
    //     }
    //     let doctorId = favoriteArr[0].id;
    //     $.ajax({
    //         type: 'POST',
    //         url: IP + 'order/mdt',
    //         dataType: 'json',
    //         data: {
    //             "orderId": data.orderFormBean.id,
    //             "startDate": startTime,
    //             "endDate": endTime,
    //             "orderStateId": data.orderFormBean.statesId,
    //             "doctorList": JSON.stringify(doctorList),
    //             "doctorId": doctorId,
    //             "totalPrice": price,
    //         },
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         crossDomain: true,
    //         success: function(data) {
    //             console.log(data)
    //             if (data.status == 200) {
    //                 // 成功操作
    //                 layer.closeAll();
    //                 $('.selectTimeContainer').hide();
    //                 window.location = '/yilaiyiwang/morkbench/morkbench.html';
    //             } else if (data.status == 250) {
    //                 // 未登录操作
    //                 window.location = '/yilaiyiwang/login/login.html';
    //             } else if (data.status == 500) {
    //                 layer.closeAll();
    //                 let _$ = layui.jquery;
    //                 layer.open({
    //                     type: 1,
    //                     title: '',
    //                     area: ['300px', '80px'],
    //                     closeBtn: false,
    //                     shade: [0.1, '#000000'],
    //                     shadeClose: false,
    //                     time: 2000,
    //                     content: _$('.MDTText'),
    //                 });
    //                 setTimeout(function() {
    //                     $('.MDTText').hide();
    //                     $('.operateContent').hide();
    //                     layer.closeAll();
    //
    //                 }, 2000)
    //             } else {
    //                 // 其他操作
    //             }
    //         },
    //         error: function(err) {
    //             console.log(err);
    //         },
    //     })
    // })
    // //  确认接收确定按钮
    // $('.submitBoxPic').find('.yesBtn').click(function() {
    //
    //     let doctorList = [];
    //     let price = Number(data.orderFormBean.basePrice);
    //     for (let i = 0; i < favoriteArr.length; i++) {
    //         if (data.orderFormBean.orderTypes == 0) {
    //             // 图文
    //             doctorList.push({
    //                 "doctorId": favoriteArr[i].id,
    //                 "money": favoriteArr[i].medicalFees,
    //             });
    //             price += Number(favoriteArr[i].medicalFees);
    //         } else {
    //             // 视频
    //             doctorList.push({
    //                 "doctorId": favoriteArr[i].id,
    //                 "money": favoriteArr[i].medicalFeesVideo,
    //             });
    //             price += Number(favoriteArr[i].medicalFeesVideo);
    //         }
    //     }
    //     let doctorId = favoriteArr[0].id;
    //     $.ajax({
    //         type: 'POST',
    //         url: IP + 'order/mdtPic',
    //         dataType: 'json',
    //         data: {
    //             "orderId": data.orderFormBean.id,
    //             "orderStateId": data.orderFormBean.statesId,
    //             "doctorList": JSON.stringify(doctorList),
    //             "doctorId": doctorId,
    //             "totalPrice": price,
    //         },
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         crossDomain: true,
    //         success: function(data) {
    //             console.log(data)
    //             if (data.status == 200) {
    //                 // 成功操作
    //                 layer.closeAll();
    //                 $('.selectTimeContainer').hide();
    //                 window.location = '/yilaiyiwang/morkbench/morkbench.html';
    //             } else if (data.status == 250) {
    //                 // 未登录操作
    //                 window.location = '/yilaiyiwang/login/login.html';
    //             } else if (data.status == 500) {
    //                 let _$ = layui.jquery;
    //                 layer.open({
    //                     type: 1,
    //                     title: '',
    //                     area: ['300px', '80px'],
    //                     closeBtn: false,
    //                     shade: [0.1, '#000000'],
    //                     shadeClose: false,
    //                     time: 2000,
    //                     content: _$('.MDTText'),
    //                 });
    //                 setTimeout(function() {
    //                     $('.MDTText').hide();
    //                     layer.closeAll();
    //                     $('.operateContent').hide();
    //                 }, 2000)
    //             } else {
    //                 // 其他操作
    //             }
    //         },
    //         error: function(err) {
    //             console.log(err);
    //         },
    //     })
    // })
    $('.submitBox').find('.yesBtn').click(function () {

        sub();

    })
})
