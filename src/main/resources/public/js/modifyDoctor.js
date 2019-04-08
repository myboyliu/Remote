let hospitalInfo = {};
let inviteDoctorArray = [];// 选择的医生信息数组
let isVideo = false;// 选择的医生信息数组
let applyInfo = {};// 选择的医生信息数组
let isInvite = false;
let userInfo;
let isReferral = false;
let isConsultation = false;
let applyFormId = "";

/** 渲染 医生页面 左侧导航 */
function renderDoctorNavigation(data) {
    let _html = '';

    for (let i = 0; i < data.length; i++) {
        if (isInvite) {
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

                hospitalInfo["id"] = data[i].id;
                hospitalInfo["hospitalName"] = data[i].hospitalName;
                hospitalInfo["hospitalPhone"] = data[i].hospitalPhone;
                hospitalInfo["hospitalImgPrice"] = data[i].consultationPicturePrice;
                hospitalInfo["hospitalVideoPrice"] = data[i].consultationVideoPrice;
            }
        } else {
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

    if (!isInvite) {
        hospitalInfo["id"] = data[0].id;
        hospitalInfo["hospitalName"] = data[0].hospitalName;
        hospitalInfo["hospitalPhone"] = data[0].hospitalPhone;
        hospitalInfo["hospitalImgPrice"] = data[0].consultationPicturePrice;
        hospitalInfo["hospitalVideoPrice"] = data[0].consultationVideoPrice;
    }
    hospitalInfo["branchId"] = $('.hospitalUl').find('.deptItem').eq(0).attr('name');
    hospitalInfo["branchName"] = $('.hospitalUl').find('.deptItem').eq(0).html();
    // 获取默认科室的医生
    getDoctorByBranchId($('.hospitalUl').find('.deptItem').eq(0).attr('name'));

}

let deptId = "";

/** 渲染 医生列表*/
function renderDoctorList(data) {
    let _html = "";
    if (!isInvite) {
        _html = '<li class="doctorChunk noDoctor">\
                        <div class="Firstdiamond"></div>\
                        <div class="message">\
                            <span class="mess_l">不选医生</span><span>远程中心</span>\
                            <p class="p1" hospitalVideoPic="' + hospitalInfo.hospitalVideoPrice + '" hospitalImgPic="' + hospitalInfo.hospitalImgPrice + '" deptId="' + hospitalInfo.branchId + '" name="' + hospitalInfo.id + '">' + hospitalInfo.hospitalName + '</p>\
                            <p class="p4">选择此项,申请将发送至对方医院远程中心,由医务人员为您调度医生资源,诊费会在选定医生后确定。<br />请将您的备注信息填至【会/转诊目的】 </p>\
                        </div>\
                    </li>';
    }
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
    let imgPric = Number($('.imgPric').attr('imgPric'));
    let videoPric = Number($('.videoPric').attr('videoPric'));
    $('.doctorCount').html(inviteDoctorArray.length);

    if (inviteDoctorArray.length == 0) {
        _html = '<li class="clearfix"><span>主会诊人:未选择</span></li>';
        $('.imgPric').html($('.imgPric').attr('imgPric'));
        $('.videoPric').html($('.videoPric').attr('videoPric'));
    } else {
        for (let i = 0; i < inviteDoctorArray.length; i++) {
            if (i == 0) {
                _html += '<li class="clearfix"><span>主会诊人:<' + inviteDoctorArray[i].doctorName + ';' + inviteDoctorArray[i].branchName + ';' + inviteDoctorArray[i].doctorTitleName + ';' + inviteDoctorArray[i].hospitalName + '>;</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
            } else {
                _html += '<li class="clearfix"><span><' + inviteDoctorArray[i].doctorName + ';' + inviteDoctorArray[i].branchName + ';' + inviteDoctorArray[i].doctorTitleName + ';' + inviteDoctorArray[i].hospitalName + '>;</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
            }
            // if (i == 0) {
            //     _html += '<li class="clearfix"><span>主会诊人:' + doctorList[i].doctorName + '</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
            // } else {
            //     _html += '<li class="clearfix"><span>' + doctorList[i].doctorName + '</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
            // }
            imgPric += Number(inviteDoctorArray[i].doctorPicturePrice);
            videoPric += Number(inviteDoctorArray[i].doctorVideoPrice);
        }
    }
    $('.favoriteUl').html(_html);
}

/** 根据二级科室id查询医生 */
function getDoctorByBranchId(deptId) {
    deptId = deptId;
    hospitalInfo["branchId"] = deptId;
    let data = {"branchId": deptId};
    ajaxRequest("GET", getDoctorListByBranchIdUrl, data, true, "application/json", false, renderDoctorList, null, null);
}

$(function () {

    var hospitalName = '';
    var hospitalId = '';
    // 选择的医生信息数组
    var price = 0;

    // let applyFormId = localStorage.getItem('applyFormId');
    // let formData = {"applyFormId": applyFormId};
    // ajaxRequest("GET", getApplyInfoUrl, formData, true, "application/json", false, getApplyInfoSuccess, null, null)
    //
    // function getApplyInfoSuccess(result) {
    //     localStorage.setItem('applyInfo', JSON.stringify(result));
    // }
    if (JSON.parse(localStorage.getItem('applyInfo'))) {
        applyInfo = JSON.parse(localStorage.getItem('applyInfo'));
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
        applyFormId = applyInfo.id;
        if (userInfo.hospitalId === applyInfo.inviteHospitalId && applyInfo.applyStatus !== "CONSULTATION_APPLY_CREATE_SUCCESS") {
            isInvite = true;
        }
        isReferral = applyInfo.applyType === "APPLY_REFERRAL" ? true : false;
        isConsultation = applyInfo.applyType === "APPLY_REFERRAL" ? false : true;

        /** 获取通讯录左侧导航数据 */
        ajaxRequest("GET", getMasterHospitalBranchList, null, false, false, true, renderDoctorNavigation, null, null);
        if ("APPLY_CONSULTATION_VIDEO" === applyInfo.applyType) {
            isVideo = true;
        }
        let consultantUserList = [];
        if (applyInfo.inviteUserId) {
            if (isConsultation) {
                consultantUserList = JSON.parse(applyInfo.consultantUserList)
                for (let item of consultantUserList) {
                    let inviteDoctorArr = item.doctorName.replace("<", "").replace(">", "").split("/");
                    let doctorName = inviteDoctorArr[0];
                    let doctorTitleName = inviteDoctorArr[1];
                    let branchName = inviteDoctorArr[2];
                    let hospitalName = inviteDoctorArr[3];
                    let doctorBranchId = item.branchId;
                    inviteDoctorArray.push({
                        hospitalId: applyInfo.inviteHospitalId, // 医院id
                        branchId: doctorBranchId, // 科室id
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
            } else if (isReferral) {
                let inviteDoctor = applyInfo.inviteSummary

                let inviteDoctorArr = inviteDoctor.replace("<", "").replace(">", "").split("/");
                let doctorName = inviteDoctorArr[0];
                let doctorTitleName = inviteDoctorArr[1];
                let branchName = inviteDoctorArr[2];
                let hospitalName = inviteDoctorArr[3];
                inviteDoctorArray.push({
                    hospitalId: applyInfo.inviteHospitalId, // 医院id
                    branchId: applyInfo.inviteBranchId, // 科室id
                    doctorId: applyInfo.inviteUserId, // 医生id
                    hospitalName: hospitalName, // 医院名字
                    branchName: branchName, // 科室名字
                    doctorName: doctorName, // 医生名字
                    hospitalImgPrice: 0, // 医院图文价格
                    hospitalVideoPrice: 0, // 医院视频价格
                    doctorPicturePrice: 0, // 图文价格
                    doctorVideoPrice: 0, // 视频价格
                    doctorTitleName: doctorTitleName, // 职称名字
                });
            }

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
                'height': $(window).height() - 300 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
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
        hospitalId = $(this).attr('hospitalid');
        hospitalName = $(this).find('.hospitalName').html();
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
        // deptIdGetDoctors($(this).attr('name'));

        hospitalInfo["id"] = $('.hospitalItem.active').attr("hospitalid");
        hospitalInfo["hospitalName"] = $('.hospitalItem.active').find('.hospitalName').html();
        hospitalInfo["hospitalPhone"] = $('.hospitalItem.active').attr("hospitaltel");
        hospitalInfo["hospitalImgPrice"] = $('.hospitalItem.active').attr("imgpric");
        hospitalInfo["hospitalVideoPrice"] = $('.hospitalItem.active').attr("videopric");
        hospitalInfo["branchId"] = $(this).attr('name');
        hospitalInfo["branchName"] = $(this).html();
        getDoctorByBranchId($(this).attr('name'))
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
        if (isReferral) {
            inviteDoctorArray = [];
        }
        if ($(this).hasClass('noDoctor')) {
            hospitalInfo["id"] = $(this).find('.p1').attr('name');
            hospitalInfo["branchId"] = $(this).find('.p1').attr('deptId');
            hospitalInfo["hospitalImgPrice"] = $(this).find('.p1').attr('hospitalImgPic');
            hospitalInfo["hospitalName"] = $(this).find('.p1').html();
            hospitalInfo["hospitalVideoPrice"] = $(this).find('.p1').attr('hospitalVideoPic');
            // 点的不选医生
            inviteDoctorArray = [];
            renderAlreadyExistDoctor(inviteDoctorArray);
        } else if (inviteDoctorArray.length > 0 && $(this).find('.hospital').attr('name') != inviteDoctorArray[0].hospitalId) {
            var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: _$('.promptText'),
            });
            setTimeout(function () {
                $('.promptText').hide();
            }, 2000)
        } else if ($(this).attr('name') == applyInfo.applyUserId) {
            layer.msg('所选医生不能为该病历的发件医生');
        } else {
            // 点的某一个医生
            let flag = true;
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
        $('html, body').animate({
            scrollTop: x - 100,
        }, 300);
    };

    // 病历信息一级按钮
    $('.oneLevelUl').delegate('.oneLevelItem', 'click', function () {
        $(this).addClass('active').siblings('.oneLevelItem').removeClass('active');
        $(this).find('.twoLevelUl').stop(true).slideToggle();
        $(this).siblings('.oneLevelItem').find('.twoLevelUl').stop(true).slideUp();
        scrollTo($('.hosp').not('.hosp:hidden').eq($(this).index()).offset().top);
    })
    // 病历信息二级按钮
    $('.oneLevelUl').delegate('.twoLevelItem', 'click', function () {
        if ($(this).find('.threeLevelUl').css('display') == 'none') {
            $(this).addClass('active').siblings('.twoLevelItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.twoLevelItem').removeClass('active');
        }
        $(this).find('.threeLevelUl').stop(true, true).slideToggle();
        $(this).siblings('.twoLevelItem').find('.threeLevelUl').stop(true, true).slideUp();
        return false;
    })
    // 病历信息三级按钮
    $('.oneLevelUl').delegate('.threeLevelUl', 'click', function () {
        return false;
    });
    $('.oneLevelUl').delegate('.threeLevelItem', 'click', function () {
        $('.oneLevelUl').find('.threeLevelItem').removeClass('active');
        $(this).addClass('active');
        scrollTo($('#' + $(this).attr('name')).offset().top);
        return false;
    });

    $('.cancel').click(function () {
        window.history.back(-1);
    })
    //    首诊医政修改病历基本信息 order/applyManagerUpdateOrder
    $('.save').click(function () {
        if(isInvite && isConsultation){
            if(inviteDoctorArray.length === 0){
                layer.msg("最少要选择一位医生!");
                return false;
            }
        }
        if (isReferral) {
            let referralModifyDoctor = {};
            if (inviteDoctorArray.length > 0) {
                let inviteSummary = "<" + inviteDoctorArray[0].doctorName + "/" + inviteDoctorArray[0].doctorTitleName + "/" + inviteDoctorArray[0].branchName + "/" + inviteDoctorArray[0].hospitalName + ">;";
                referralModifyDoctor = {
                    "inviteSummary": inviteSummary,
                    "hospitalId": inviteDoctorArray[0].hospitalId,
                    "branchId": inviteDoctorArray[0].branchId,
                    "doctorId": inviteDoctorArray[0].doctorId,
                }
            } else {
                referralModifyDoctor = {
                    "inviteSummary": "<" + hospitalInfo.hospitalName + ">",
                    "hospitalId": hospitalInfo.id,
                    "branchId": hospitalInfo.branchId,
                    "doctorId": "",
                }

            }
            let formData = new FormData();
            formData.append("applyFormId", applyFormId);
            formData.append("inviteSummary", referralModifyDoctor.inviteSummary);
            formData.append("inviteHospitalId", referralModifyDoctor.hospitalId);
            formData.append("inviteBranchId", referralModifyDoctor.branchId);
            formData.append("inviteUserId", referralModifyDoctor.doctorId);

            ajaxRequest("POST", sirTransferAmendDor, formData, false, false, true, sirTransferAmendDorSuccess, null, null);

            function sirTransferAmendDorSuccess(result) {
                // window.history.go(-1);
                window.location = '../page/adminApplyInfo.html';
            }

            return false
        }
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
            data.append("consultantPrice", price); // 费用
        } else {
            data.append('inviteHospitalId', hospitalInfo.id);
            data.append('inviteBranchId', hospitalInfo.branchId);
            data.append('inviteUserId', "");
            data.append("inviteSummary", "<" + hospitalInfo.hospitalName + ">");
            data.append("consultantReport", "");
            data.append('consultantUserList',"");
            if (isVideo) {
                price = Number(hospitalInfo.hospitalVideoPrice)
                data.append('hospitalPrice', hospitalInfo.hospitalVideoPrice); // 医院图文基本价格
            } else {
                price = Number(hospitalInfo.hospitalImgPrice)
                data.append('hospitalPrice', hospitalInfo.hospitalImgPrice); // 医院图文基本价格
            }
            data.append("consultantPrice", price); // 费用

        }

        ajaxRequest("POST", sirUpdateDoctor, data, false, false, true, sirUpdateDoctorSuccess, null, null);

        function sirUpdateDoctorSuccess(result) {
            localStorage.setItem('applyFormId', result.id);
            window.location = '../page/adminApplyInfo.html';
        }
    })
})
