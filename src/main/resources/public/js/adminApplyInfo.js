let isInvite;
let isApply = false;
let applyFormId;
let inviteDoctorCount;
let applyTypeStr;
let caseContentList = [];//病历附件列表
let consultantUserList = [];
let consultantReport = [];
let applyStatus; //申请状态
let applyTimeList;
let applyNodeList;
let isMainDoctor = false;
const _$ = layui.jquery;

/** 根据 不同角色 渲染 基础页面 元素 */
function renderViewByRole(applyStatus) {
    /** 动态创建进度条 */
    const statusArr = ["已拒收", '待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    let str = '';
    for (let i = 1; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>';
        $('.progressBar').html(str);
    }
    if (isInvite && !isApply) {
        if (applyStatus === "CONSULTATION_APPLY_ACCEDE") {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
            $(".rejection").show();
            $(".modifier3").show();
            $(".modifier5").show();
            if (inviteDoctorCount > 2) {
                $("#MDTBtn").show();
            } else {
                $("#accept").show();
            }
        } else if (applyStatus === "CONSULTATION_SLAVE_ACCEDE" || applyStatus === "CONSULTATION_MASTER_ACCEDE") {
            //排期审核
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
            $(".rejection").show();
            $(".modifier3").show();
            $(".modifier5").show();
            if (inviteDoctorCount > 2) {
                $("#MDTBtn").show();
            } else {
                $(".examineBtn").show();
            }
        } else if (applyStatus === "CONSULTATION_SLAVE_REJECT") {
            //专家协调
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
            $(".rejection").show();
            $(".modifier3").show();
            $(".modifier5").show();
            if (inviteDoctorCount > 2) {
                $("#MDTBtn").show();
            } else {
                $(".accept").show();
            }
        } else if (applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".modifier2").show();
            $(".rejection").show();
        } else if (applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".modifier2").show();
            $(".rejection").show();
        } else if (applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $("#applyRecord").show();
            applyRecordNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            $("#applyRecord").show();
            applyRecordNavigationShow = true;
            consultantFeedbackNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_MASTER_REJECT") {
            //会诊医政已拒绝
            $(".modifier2").show();
            $("#refuseReasonBox").show();
            $('.progressBar').empty();
            $('.progressBar').html('<li>' + statusArr[0] + '</li>');
            $(".progressBar li:nth-child(1)").addClass("libg");
        }

    } else {
        if (applyStatus === "CONSULTATION_APPLY_CREATE_SUCCESS") {
            //创建成功
            $(".progressBar").hide();
            $(".sendBack").show();
            $(".audit").show();
            $(".modifier1").show();
            $(".modifier3").show();
            $(".modifier5").show();

            $(".modifier22").show();
        } else if (applyStatus === "CONSULTATION_MASTER_REJECT") {
            //会诊医政已拒绝
            $("#refuseReasonBox").show();
            $('.progressBar').empty();
            $('.progressBar').html('<li>' + statusArr[0] + '</li>');
            $(".progressBar li:nth-child(1)").addClass("libg");
        } else if (applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");

            $(".modifier2").show();
        } else if (applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
        } else if (applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $("#applyRecord").show();
            applyRecordNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            $("#applyRecord").show();
            applyRecordNavigationShow = true;
            consultantFeedbackNavigationShow = true;
        } else {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
        }
    }
}

/** 渲染会诊排期 */
function renderApplyTimeView(applyTimeList) {
    let _dateHtml = '';
    for (let i = 0, len = applyTimeList.length; i < len; i++) {
        _dateHtml += ' <p>\
             <span class="startDate">从&nbsp;&nbsp;' + applyTimeList[i].eventStartTime + '</span> 到&nbsp;&nbsp;\
             <span class="endDate">' + applyTimeList[i].eventEndTime + '</span>\
                        </p>'
    }
    $('.schedule_modules').html(_dateHtml);
}

/** 渲染电子病历附件 */
function renderCaseContentView(data) {
    $('.sum').html(caseContentList.length);
    $.each(data, function (index, value) {
        let childList = value.childList;
        let l = -1;
        for (let j = 0, len = childList.length; j < len; j++) {
            let k = -1;
            for (let i = 0; i < caseContentList.length; i++) {
                if (childList[j].id === caseContentList[i].contentTypeId) {
                    l = i;
                    if (k === j) {
                    } else {
                        var upfileHtml = '<li name="' + childList[j].caseTypeName + '" id="' + childList[j].id + '" class="upfileItem clearfix">\
                             <div class="upfileContent">\
                                 <div class="operateLeft">' + value.caseTypeName + '-' + childList[j].caseTypeName + '</div>\
                                 <ul class="fileContent clearfix">\
                                 </ul>\
                             </div>\
                         </li>';
                        $('.upfileUl').append(upfileHtml);
                        k = j;
                    }
                    let fileType = caseContentList[i].contentPath.substr(caseContentList[i].contentPath.lastIndexOf('.') + 1, caseContentList[i].contentPath.length);
                    let fileName = caseContentList[i].contentPath.substr(caseContentList[i].contentPath.lastIndexOf('/') + 1, caseContentList[i].contentPath.length);
                    fileAllArr.push(fileName);
                    if (fileType == 'png' || fileType == 'jpg') {
                        if (caseContentList[i].contentRemark == '') {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].sort + '" filePath="' + caseContentList[i].contentPath + '"  class="fileItem">\
                                           <div style = "background-image: url(&apos;' + baseUrl + "/" + caseContentList[i].contentPath + '&apos;)"></div>\
                                            <p type="img" desc="' + caseContentList[i].contentRemark + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                        } else {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].sort + '" filePath="' + caseContentList[i].contentPath + '" class="fileItem">\
                                           <div style = "background-image: url(&apos;' + baseUrl + "/" + caseContentList[i].contentPath + '&apos;)"></div>\
                                            <p type="img" desc="' + caseContentList[i].contentRemark + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                        }
                    } else if (fileType == 'pdf') {
                        if (caseContentList[i].contentRemark == '') {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].sort + '" filePath="' + caseContentList[i].contentPath + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + caseContentList[i].contentRemark + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                        } else {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].sort + '" filePath="' + caseContentList[i].contentPath + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + caseContentList[i].contentRemark + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                        }
                    } else if (fileType == 'dcm') {
                        if (caseContentList[i].contentRemark == '') {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].sort + '" filePath="' + caseContentList[i].contentPath + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + caseContentList[i].contentRemark + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                        } else {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].sort + '" filePath="' + caseContentList[i].contentPath + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + caseContentList[i].contentRemark + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                        }
                    }
                }
            }
            if (k === -1) {
                data[index].childList.splice(j, 1, 1);
            }
        }
        if (l === -1) {
            data.splice(index, 1, 1);
        }
    })
}

/**修改会诊排期*/
function updateApplyTime(dateList) {
    if (isInvite) {
        let data = new FormData();
        data.append("eventStartTime", dateList[0].startTime);
        data.append("eventEndTime", dateList[0].endTime);
        data.append("applyFormId", applyFormId);
        ajaxRequest("POST", sirUpdateDate, data, false, false, true, sirUpdateDateSuccess, null, null)
    } else {
        let data = new FormData();
        data.append("startEndTime", JSON.stringify(dateList));
        data.append("applyFormId", applyFormId);
        ajaxRequest("POST", sirSendUpdateDate, data, false, false, true, sirUpdateDateSuccess, null, null)
    }

    function sirUpdateDateSuccess(result) {
        console.log(result);
        let data = {"applyFormId": applyFormId};
        ajaxRequest("GET", getApplyInfoUrl, data, true, "application/json", true, getApplyInfoSuccess, null, null);

        function getApplyInfoSuccess(result) {
            sessionStorage.setItem('applyInfo', JSON.stringify(result));
            renderApplyTimeView(result.applyTimeList);
        }
    }

}

/** 查询订单详情 */
function getApplyInfo() {
    /** 获取缓存 订单ID*/
    applyFormId = sessionStorage.getItem('applyFormId');
    let formData = {"applyFormId": applyFormId};
    ajaxRequest("GET", getApplyInfoUrl, formData, true, "application/json", false, getApplyInfoSuccess, null, null);

    function getApplyInfoSuccess(result) {
        sessionStorage.setItem('applyInfo', JSON.stringify(result));
    }
}

$(function () {
    getApplyInfo();

    /** 当前登陆人 信息*/
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    /** 当前申请 详细信息 */
    let applyInfo = JSON.parse(sessionStorage.getItem('applyInfo'));

    isInvite = userInfo.hospitalId === applyInfo.inviteHospitalId ? true : false;
    applyNodeList = applyInfo.applyNodeList;
    applyFormId = applyInfo.id;
    applyTypeStr = applyInfo.applyType;
    caseContentList = applyInfo.caseContentList;
    applyStatus = applyInfo.applyStatus;
    inviteDoctorCount = applyInfo.inviteSummary.split(";").length;
    applyTimeList = applyInfo.applyTimeList;
    if (userInfo.hospitalId === applyInfo.applyHospitalId && applyStatus === "CONSULTATION_APPLY_CREATE_SUCCESS") {
        isApply = true;
    }
    if (applyInfo.inviteUserId) {
        consultantUserList = JSON.parse(applyInfo.consultantUserList);
    }
    /**网页标题*/
    $('head > title').html(applyInfo.patientSex + '/' + applyInfo.patientAge + '/' + applyInfo.caseDiagnosis + '-远程会诊平台');
    /** 拒收原因 */
    $("#refuseReason").html(applyInfo.refuseRemark);
    /**患者基本信息*/
    $('.patientName').html('***');
    $('.high').html(applyInfo.patientHeight);
    $('.sex').html(applyInfo.patientSex);
    $('.weight').html(applyInfo.patientWeight / 1000);
    $('.age').html(applyInfo.patientAge);
    $('.address').html(applyInfo.detailAddress);
    /**是否加急*/
    if (applyInfo.applyUrgent === 1) {
        $('.bThree_p').show();
    }
    $('.tentative').html("初步诊断：" + applyInfo.caseDiagnosis);
    $('.telemedicineTarget').html("会/转诊目的：" + applyInfo.applyRemark);
    /**电子病历附件类别查询*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, true, renderCaseContentView, null, null);
    $('.money').html(applyInfo.consultantPrice);
    //订单编号
    if (applyStatus === "CONSULTATION_APPLY_CREATE_SUCCESS") {
        $('#applyNumber').hide();
        $('.layui-timeline').hide();
    }
    //订单编号
    $('.numbers').html(applyInfo.applyNumber);
    //申请时间
    $('.applyDate').html(applyInfo.consultantApplyTime + ":00");
    // 发件人信息
    $('.recipientsInfo').html(applyInfo.applySummary);
    // 收件人信息
    $('.addresserInfo').html(applyInfo.inviteSummary);

    renderApplyTimeView(applyTimeList);
    /**会诊报告*/
    if(applyInfo.consultantReport){
        consultantReport = JSON.parse(applyInfo.consultantReport);
    }
    let recordHtml = '';
    for (let item of consultantReport) {
        recordHtml += '<pre class="report">' + item.doctorName + ':<br />' + item.report + '</pre>'
    }
    $('.lecturer_modules').append(recordHtml);
    //    临床反馈
    $('.applyFeedBack').html(applyInfo.consultantFeedback);
    //如果是图文会诊
    if (applyInfo.applyType === "APPLY_CONSULTATION_IMAGE_TEXT") {
        $('.schedule').hide();
        $('.schedule_modules ').hide();
        $('.entrance').hide();
    } else {
        $('.schedule').show();
        $('.schedule_modules ').show();
        $('.entrance').show();
    }

    /** 诊费 */
    let consultantPrice = applyInfo.consultantPrice;
    let hospitalPrice = applyInfo.hospitalPrice;
    let _fees = '';
    for (let i = 0; i < consultantUserList.length; i++) {
        _fees += '<tr><td>' + consultantUserList[i].doctorName + '</td>';
        _fees += '<td class = "yuan" >' + consultantUserList[i].price + '.00</td>';
        _fees += '<td>';
        _fees += '<input type="text" value="' + consultantUserList[i].price + '.00" class="fees_input gai" readonly="readonly">';
        _fees += '</td></tr>'
    }
    $('.basePic').html(hospitalPrice + ".00");
    $('.basePicInput').val(hospitalPrice + ".00");
    $('.tbody_doc').html(_fees);
    $('.aggregate').html(consultantPrice + ".00");
    $('.dynamicAggregate').html(consultantPrice + ".00");

    /** 渲染时间轴 */
    let _html = '';
    for (let i = 0; i < applyNodeList.length; i++) {
        _html += '<li class="layui-timeline-item">\
                                        <i class="layui-icon layui-timeline-axis">&#xe63f;</i>\
                                        <div class="layui-timeline-content layui-text">\
                                            <h3 class="layui-timeline-title">\
                                                <span class="fw">' + applyNodeList[i].nodeTime + '</span>\
                                                <span class = "fw pl30" > ' + applyNodeList[i].nodeName + ' </span>\
                                            </h3>';
        if (applyNodeList[i].nodeName == '已结束') {
            _html += ''
        } else {
            _html += '<p>操作人：' + applyNodeList[i].nodeOperator + '</p>\
                                        </div>\
                                    </li>'
        }
    }
    $('.layui-timeline').html(_html);

    // 患者基本信息
    $('#cut').click(function () {
        $(this).toggleClass("foundBtn");
        $('.essentialInformation_modules').toggle(500);
    });
    //电子病历
    $('.modifier2').click(function () {

        $('.upfileUl').toggle(500);
        if ($('#cutEle').attr("class") == "chooseBtn") {
            $('#cutEle').addClass('foundBtn');
            $('#cutEle').removeClass('chooseBtn');
        } else {
            $('#cutEle').addClass('chooseBtn');
            $('#cutEle').removeClass(' foundBtn');
        }
    });
    //  修改收件医生
    $('#cutDoc').click(function () {
        $(this).toggleClass("foundBtn");
        $('.ReceiptDoctor_modules').toggle(500);
    });
    //  修改会诊排期
    $('#cutSch').click(function () {
        $(this).toggleClass("foundBtn");
        $('.schedule_modules').toggle(500);
    });
    // 修改修改排期
    $('.schedulingBtn').click(function () {
        showDateView(applyTimeList);
    });

    /**  退回按钮弹出层 */
    $('.sendBack').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('.inviteObj')
        });
    });
    // 弹出层取消按钮
    $(".inviteObj").find('.agin').click(function () {
        layer.closeAll();
        $('.inviteObj').hide();
    });
    // 弹出层是的按钮
    $(".inviteObj").find('.yes').click(function () {
        let data = new FormData();
        data.append("id", applyFormId);
        ajaxRequest("POST", sirSendCheckReject, data, false, false, true, sirSendCheckRejectSuccess, null, null);

        function sirSendCheckRejectSuccess(result) {
            layer.closeAll();
            $(".inviteObj").hide();
            $("#alertText").html("退回成功");
            alertMessage();
            setTimeout(function () {
                $('.returned').hide();
                window.location = '../page/administrator.html';
            }, 2500)
        }
    });

    /** 返回按钮 */
    $('.getBack').click(function () {
        window.location = '../page/administrator.html'
    });
    /** 审核发布按钮接口 */
    $('.audit').click(function () {
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('.auditObj')
        });

    });

    $(".auditObj").find(".agin").click(function () {
        layer.closeAll();
        $('.auditObj').hide();
    });
    $(".auditObj").find(".yes").click(function () {
        let data = new FormData();
        data.append("id", applyFormId);
        ajaxRequest("POST", sirSendCheckAccede, data, false, false, true, sirSendCheckAccedeSuccess, null, null);

        function sirSendCheckAccedeSuccess(result) {
            $("#alertText").html("发布成功");
            alertMessage();
            $('.succeed').hide();
            window.location = "../page/administrator.html";
        }
    });
    /**MDT协调按钮*/
    $('.MDTBtn').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('.MDTBox'),
        });
    });
    /** 会诊医政接收按钮*/
    $('.accept').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('.Receive'),
        });
    });

    $('.submitBox .noBtn').click(function () {
        layer.closeAll();
        $('.submitBox').hide();
    });

    $('.submitBox .acceptBtn').click(function () {
        if (!applyInfo.inviteUserId) {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请先分配主会诊医生");
            alertMessage();
        } else if ($('.schedule_modules >p').length !== 1 && applyInfo.applyType !== "APPLY_CONSULTATION_IMAGE_TEXT") {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请选定会诊时间");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("id", applyFormId);
            ajaxRequest("POST", sirReceiveMasterAccede, data, false, false, true, sirReceiveMasterAccedeSuccess, null, null)

            //接收 成功回调
            function sirReceiveMasterAccedeSuccess() {
                $('.submitBox').hide();
                $("#alertText").html("接收成功");
                alertMessage();
                setTimeout(function () {
                    window.location = '../page/administrator.html'
                }, 2000)
            }

            return false;
        }
    });
    /** 拒收按钮事件 */
    $('.rejection').click(function () {
        $('.background').css('display', 'block');
        $('.re_layer').css('display', 'block');
        /* 开启弹层禁止屏幕滚动 */
        document.documentElement.style.overflow = "hidden";
    });
    $('textarea').focus(function () {
        //  $('.font').css('display','none');
        $('.font').hide();
    }).blur(function () {
        if ($(this).val() == "") {
            $('.font').show();
        } else {
            $('.font').hide();
        }
    });
    $('.font').click(function () {
        $(this).hide();
        $('textarea').focus();
    });
    let viewText;
    /* 建议多学科会诊按钮点击事件  */
    $('.suggest').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        });
        $('.otherCause').removeAttr('style');
        viewText = '建议多学科会诊:';
    });
    /* 其他原因按钮点击事件  */
    $('.otherCause').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        });
        $('.suggest').removeAttr('style');
        viewText = '其他原因:';
    });
    /* 拒收确定按钮 */
    $('.confirm').click(function () {
        if ($('.refuseReason').val() == '') {
            $("#alertText").html("请填写拒收原因");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("id", applyFormId);
            data.append("report", viewText + $('.refuseReason').val());
            console.log(viewText + $('.refuseReason').val());
            ajaxRequest("POST", sirReceiveMasterReject, data, false, false, true, sirReceiveMasterRejectSuccess, null, null);

            function sirReceiveMasterRejectSuccess(result) {
                $("#alertText").html("拒收成功");
                alertMessage();
                setTimeout(function () {
                    window.location = '../page/administrator.html';
                }, 2000);
            }
        }
    });
    /** 弹层关闭按钮 */
    $('.refuseBtn').click(function () {
        $('.background').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    });

    function alertMessage() {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            time: 2000,
            zIndex: layer.zIndex,
            content: _$('#alertBox')
        });
    }

    renderViewByRole(applyStatus);
});
