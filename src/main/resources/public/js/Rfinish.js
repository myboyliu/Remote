let applyRecordNavigationShow = false;
let consultantFeedbackNavigationShow = false;
let applyRefuseNavigationShow = false;
let consultantReport = [];
let fileAllArr = []; //所有图片原始资源
let scaleNum = 10; // 图片缩放倍数
let inviteDoctorCount = 0;
let applyFormId;
let applyInfo = {};
let isMainDoctor;
let isInvite;
let isVideo = false;
const _$ = layui.jquery;
let applyTimeList = [];
let caseContentList = [];
/**渲染左侧导航栏*/
function renderLeftNavigation(data) {
    let _html = "";
    if (applyRefuseNavigationShow) {
        _html += '<li id="applyRefuseNavigation" class="oneLevelItem patientInfo active">\
                     <p class="oneLevelName">拒收原因</p>\
                 </li>'
    }
    if (applyRecordNavigationShow) {
        _html += '<li id="applyRecordNavigation" class="oneLevelItem patientInfo active">\
                     <p class="oneLevelName">会诊报告</p>\
                 </li>'
    }
    if (consultantFeedbackNavigationShow) {
        _html += '<li id="consultantFeedbackNavigation" class="oneLevelItem patientInfo">\
                     <p class="oneLevelName">临床反馈</p>\
                 </li>'
    }
    _html += ' <li class="oneLevelItem patientInfo">\
                     <p class="oneLevelName">患者基本信息</p>\
                 </li>\
                 <li class="oneLevelItem caseHistory">\
                     <p class="oneLevelName">电子病历附件</p>\
                     <ul class="twoLevelUl">';
    $.each(data, function (key, val) {
        if (val === 1) {
        } else {
            _html += '<li class="twoLevelItem">\
                                 <p class="twoLevelName">' + val.caseTypeName + '</p>\
                                 <ul class="threeLevelUl">';
            let array = val.childList;
            for (let i = 0, len = array.length; i < len; i++) {
                if (array[i] === 1) {
                } else {
                    _html += '<li class="threeLevelItem" name="' + array[i].id + '">' + array[i].caseTypeName + '</li>'

                }
            }
            _html += '</ul></li>'
        }

    })
    _html += '</ul>\
             </li>'
    if (isVideo) {
        _html += '<li class="oneLevelItem patientInfo">\
                        <p class="oneLevelName">会诊排期</p>\
                    </li>'
    }
    _html += '<li class="oneLevelItem patientInfo">\
                <p class="oneLevelName">订单信息</p>\
            </li>'
    $('.oneLevelUl').html(_html);
    $('.oneLevelItem').eq(0).addClass('active').find('.twoLevelUl').show().find('.twoLevelItem').eq(0).addClass('active').find('.tthreeLevelUl').slideDown();
    // $('.oneLevelUl').find('.threeLevelItem').eq(0).addClass('active');
    $('.oneLevelUl').css({
        'width': '145px',
        'position': 'fixed',
    });
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
                        let upfileHtml = '<li name="' + childList[j].caseTypeName + '" id="' + childList[j].id + '" class="upfileItem clearfix">\
                             <div class="upfileContent">\
                                 <div class="operateLeft">' + value.caseTypeName + '-' + childList[j].caseTypeName + '</div>\
                                 <ul class="fileContent clearfix">\
                                 </ul>\
                             </div>\
                         </li>'
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
    renderLeftNavigation(data);
}

/** 查询申请详情 */
function getApplyInfo() {
    applyFormId = sessionStorage.getItem('applyFormId');
    let formData = {"applyFormId": applyFormId};
    ajaxRequest("GET", getApplyInfoUrl, formData, true, "application/json", false, getApplyInfoSuccess, null, null)

    function getApplyInfoSuccess(result) {
        sessionStorage.setItem('applyInfo', JSON.stringify(result));
        applyInfo = JSON.parse(sessionStorage.getItem('applyInfo'));
    }
}

function rederViewByRole() {
    if (isMainDoctor) {
        if (applyInfo.applyStatus === "CONSULTATION_APPLY_ACCEDE") {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".rejection").show();
            if (inviteDoctorCount > 1) {
                $(".MDTBtn").show();
            } else {
                $(".receive").show();
            }
        } else if (applyInfo.applyStatus === "CONSULTATION_SLAVE_ACCEDE") {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
        } else if (applyInfo.applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
        } else if (applyInfo.applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".compileReport").show();
            $(".entrance").show();
        } else if (applyInfo.applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            applyRecordNavigationShow = true;
        } else if (applyInfo.applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            $("#consultantFeedback").show();
            $("#consultantFeedbackContext").show();
            applyRecordNavigationShow = true;
            consultantFeedbackNavigationShow = true;
        } else if (applyInfo.applyStatus === "CONSULTATION_MASTER_REJECT" || applyInfo.applyStatus === "CONSULTATION_SLAVE_REJECT") {
            //会诊医政已拒绝
            applyRefuseNavigationShow = true;
            $('#refuseReasonBox').show();
            $('.progressBar').empty();
            $('.progressBar').html('<li>' + statusArr[0] + '</li>');
            $(".progressBar li:nth-child(1)").addClass("libg");
        }
    } else if (isInvite) {
        if (applyInfo.applyStatus === "CONSULTATION_APPLY_ACCEDE") {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
            if (inviteDoctorCount <= 1) {
                $(".receive").show();
            }
        } else if (applyInfo.applyStatus === "CONSULTATION_SLAVE_ACCEDE") {
            //排期审核
            $(".progressBar li:nth-child(1)").addClass("libg");
        } else if (applyInfo.applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
        } else if (applyInfo.applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".compileReport").show();
            $(".entrance").show();
        } else if (applyInfo.applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            applyRecordNavigationShow = true;
        } else if (applyInfo.applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            $("#consultantFeedback").show();
            $("#consultantFeedbackContext").show();
            applyRecordNavigationShow = true;
            consultantFeedbackNavigationShow = true;
        } else if (applyInfo.applyStatus === "CONSULTATION_MASTER_REJECT" || applyInfo.applyStatus === "CONSULTATION_SLAVE_REJECT") {
            //会诊医政已拒绝
            applyRefuseNavigationShow = true;
            $('#refuseReasonBox').show();
            $('.progressBar').empty();
            $('.progressBar').html('<li>' + statusArr[0] + '</li>');
            $(".progressBar li:nth-child(1)").addClass("libg");
        }
    } else {
        if (applyInfo.applyStatus === "CONSULTATION_APPLY_CREATE_SUCCESS") {
            //创建成功
            $(".progressBar").hide()
        } else if (applyInfo.applyStatus === "CONSULTATION_MASTER_REJECT") {
            //会诊医政已拒绝
            applyRefuseNavigationShow = true;
            $('#refuseReasonBox').show();
            $('.progressBar').empty();
            $('.progressBar').html('<li>' + statusArr[0] + '</li>');
            $(".progressBar li:nth-child(1)").addClass("libg");
        } else if (applyInfo.applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
        } else if (applyInfo.applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
        } else if (applyInfo.applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".editClinicalFeedback").show();
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            applyRecordNavigationShow = true;
        } else if (applyInfo.applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            $("#consultantFeedback").show();
            $("#consultantFeedbackContext").show();
            applyRecordNavigationShow = true;
            consultantFeedbackNavigationShow = true;
        } else {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
        }
    }
}

$(function () {

    getApplyInfo();

    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    if (applyInfo.inviteUserId) {
        inviteDoctorCount = JSON.parse(applyInfo.consultantUserList).length;
    }
    let applyNodeList = applyInfo.applyNodeList;

    isMainDoctor = userInfo.id === applyInfo.inviteUserId ? true : false;

    isInvite = applyInfo.consultantUserList.indexOf(userInfo.id) ? true : false;

    isVideo = applyInfo.applyType === "APPLY_CONSULTATION_VIDEO" ? true : false;
    applyTimeList = applyInfo.applyTimeList;
    caseContentList = applyInfo.caseContentList;
    /** 动态创建进度条 */
    const statusArr = ["已拒收", '待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    let str = '';
    for (var i = 1; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>'
        $('.progressBar').html(str);

    }
    /**网页标题*/
    $('head > title').html(applyInfo.patientSex + '/' + applyInfo.patientAge + '/' + applyInfo.caseDiagnosis + '-远程会诊平台');
    /** 拒收原因 */
    $("#refuseReason").html(applyInfo.refuseRemark);
    /**会诊报告*/
    consultantReport = JSON.parse(applyInfo.consultantReport);
    let goalHtml = '';
    for (let item of consultantReport) {
        goalHtml += '<pre class="report">' + item.doctorName + ':<br />' + item.report + '</pre>'
    }
    $('.goalObj').html(goalHtml);
    /**临床反馈*/
    $('.applyFeedBack').html(applyInfo.consultantFeedback);
    /**患者基本信息*/
    $('.patientName').html('***');
    $('.high').html(applyInfo.patientHeight);
    $('.sex').html(applyInfo.patientSex);
    $('.weight').html(applyInfo.patientWeight / 1000);
    $('.age').html(applyInfo.patientAge);
    $('.address').html(applyInfo.detailAddress);
    if (applyInfo.applyUrgent == 1) {
        $('.bThree_p').show();
    }
    $('.tentative').html('初步诊断：' + applyInfo.caseDiagnosis);
    $('.telemedicineTarget').html('会/转诊目的：' + applyInfo.applyRemark);
    /** 查询电子病历附件*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, true, renderCaseContentView, null, null);
    $('.money').html(applyInfo.consultantPrice);

    //订单编号
    $('.numbers').html(applyInfo.applyNumber);
    //申请时间
    $('.applyDate').html(applyInfo.consultantApplyTime + ":00");
    // 发件人信息
    $('.recipientsInfo').html(applyInfo.applySummary);
    // 收件人信息
    if (applyInfo.inviteSummary) {
        $('.addresserInfo').html(applyInfo.inviteSummary);
    }
    /** 会诊排期 */
    let _dateHtml = '';
    for (let i = 0, len = applyTimeList.length; i < len; i++) {
        _dateHtml += ' <p>\
             <span class="startDate">从&nbsp;&nbsp;' + applyTimeList[i].eventStartTime + '</span> 到&nbsp;&nbsp;\
             <span class="endDate">' + applyTimeList[i].eventEndTime + '</span>\
                        </p>'
    }
    $('.schedule_modules').html(_dateHtml);
    /** 循环时间轴 */
    let _html = '';
    for (let i = 0; i < applyNodeList.length; i++) {
        _html += '<li class="layui-timeline-item">\
                                        <i class="layui-icon layui-timeline-axis">&#xe63f;</i>\
                                        <div class="layui-timeline-content layui-text">\
                                            <h3 class="layui-timeline-title">\
                                                <span class="fw">' + applyNodeList[i].nodeTime + '</span>\
                                                <span class = "fw pl30" > ' + applyNodeList[i].nodeName + ' </span>\
                                            </h3>'
        if (applyNodeList[i].nodeName == '已结束') {
            _html += ''
        } else {
            _html += '<p>操作人：' + applyNodeList[i].nodeOperator + '</p>\
                                        </div>\
                                    </li>'
        }
    }
    $('.layui-timeline').html(_html);

    if (applyInfo.applyStatus === "CONSULTATION_APPLY_CREATE_SUCCESS") {
        $('#applyNumber').hide();
        $('.layui-timeline').hide();
    }
    //如果是图文会诊
    if (applyInfo.applyType === "APPLY_CONSULTATION_IMAGE_TEXT") {
        $('#applyTime').hide();
        $('.schedule_modules ').hide();
    } else {
        $('#applyTime').show();
        $('.schedule_modules ').show();
    }

    /**------------------------------------------*/

    /* 左侧导航栏锚点定位 */
    $(window).scroll(function () {
        $('.oneLevelUl').css({
            'width': '145px',
            'position': 'fixed',
        })
    });

    function scrollTo(x) {
        $('html, body').animate({
            scrollTop: x - 160,
        }, 300);
    }

    // 病历信息一级按钮
    $('.oneLevelUl').delegate('.oneLevelItem', 'click', function () {
        $(this).addClass('active').siblings('.oneLevelItem').removeClass('active');
        $(this).find('.twoLevelUl').stop(true).slideToggle();
        $(this).siblings('.oneLevelItem').find('.twoLevelUl').stop(true).slideUp();
        scrollTo($('.hosp').not('.hosp:hidden').eq($(this).index()).offset().top);
    });

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
    });

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

    // 图片点击查看大图
    let objParent = null; // 当前点击块的父级
    let fileArr = []; // 当前点击块的文件数据
    let indexFile = 0; // 当前点击的索引
    let ObjArr = []; //  当前点击块的文件对象
    $('.upfileUl').delegate('.fileItem', 'click', function () {
        var $ = layui.jquery;
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['1167px', '700px'], skin: "noBackground",
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            scrollbar: false,
            content: $('.bigImgContainer'),
        });
        // 整理一组图片展示数据

        objParent = $(this).parent('.fileContent');
        indexFile = $(this).index();
        ObjArr = $(this).parent('.fileContent').find('.fileItem');
        for (var i = 0; i < ObjArr.length; i++) {
            fileArr.push({
                'id': ObjArr.eq(i).attr('id'),
                'name': ObjArr.eq(i).find('p').html(),
                'type': ObjArr.eq(i).find('p').attr('type'),
                'src': ObjArr.eq(i).find('div').css('backgroundImage'),
                'desc': ObjArr.eq(i).find('p').attr('desc'),
                'filePath': ObjArr.eq(i).attr('filepath'),
            });
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        if (fileArr[indexFile].type != 'img') {
            // pdf dcm
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                PDFObject.embed(baseUrl + "/" + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
                $('.downlodeFile').hide();

            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', baseUrl + "/" + fileArr[indexFile].filePath);
                $('.bigImgContainer').find('.bigImg').addClass('bgSize').html('');
            }
        } else {
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');

        }
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);

    });

    // 上一个
    $('.switchBox .prev').click(function () {
        if (indexFile <= 0) {
            indexFile = 0;
        } else {
            indexFile--;
        }
        if (fileArr[indexFile].type != 'img') {
            // pdf dcm
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                // pdf 相关操作
                // 1、往 .bigImg 渲染pdf
                PDFObject.embed(baseUrl + "/" + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
                $('.downlodeFile').hide();

            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', baseUrl + "/" + fileArr[indexFile].filePath);
                $('.bigImgContainer').find('.bigImg').addClass('bgSize').html('');
            }
        } else {
            // 图片的相关操作
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
            ;
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        scaleNum = 10;
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);
    })
    // 下一个
    $('.switchBox .next').click(function () {
        if (indexFile >= fileArr.length - 1) {
            indexFile = fileArr.length - 1;
        } else {
            indexFile++;
        }
        if (fileArr[indexFile].type != 'img') {
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                PDFObject.embed(baseUrl + "/" + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
                $('.downlodeFile').hide();

            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', baseUrl + "/" + fileArr[indexFile].filePath);
                $('.bigImgContainer').find('.bigImg').addClass('bgSize').html('');
            }
        } else {
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        scaleNum = 10;
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);

    });
    // 关闭
    $('.closeBtnImg').click(function () {
        layer.closeAll();
        $('.bigImgContainer').hide();
        let _html = '';
        for (let i = 0; i < fileArr.length; i++) {
            _html += `<li class="fileItem fileNewItem" id="${fileArr[i].id}" filePath="${fileArr[i].filePath}">`;
            if (fileArr[i].type != 'img') {
                _html += `<div class="bgSize" style='background-image:${fileArr[i].src};'></div>`
            } else {
                _html += `<div style='background-image:${fileArr[i].src};'></div>`
            }
            if (fileArr[i].desc == '') {
                _html += '<p type="' + fileArr[i].type + '" desc="" class="fileName">' + fileArr[i].name + '</p>';
            } else {
                _html += '<p type="' + fileArr[i].type + '" desc="' + fileArr[i].desc + '" class="fileName active">' + fileArr[i].name + '</p>';
            }
            _html += '</li>'
        }
        objParent.html(_html);
        selectFileArr = [];
        objParent = null; // 当前点击块的父级
        fileArr = []; // 当前点击块的文件数据
        indexFile = 0; // 当前点击的索引
        ObjArr = []; //  当前点击块的文件对象
    });

    // 图片缩放 拖拽
    $('.bigImgBox').on("mousewheel DOMMouseScroll", function (e) {
        if (!$('.bigImgBox .bigImg').hasClass('bgSize')) {
            let delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
            if (delta > 0) {
                // 向上滚
                if (scaleNum <= 50) {
                    scaleNum += 2
                }
            } else if (delta < 0) {
                // 向下滚
                if (scaleNum > 4) {
                    scaleNum -= 2
                }
            }
            $('.bigImg').css('transform', 'scale(' + scaleNum / 10 + ')')
        }
    });
    $('.bigImgBox').on('mousedown', function (e) {
        if (!$('.bigImgBox .bigImg').hasClass('bgSize')) {
            var x = e.clientX - parseInt($('.bigImg').css('left'));
            var y = e.clientY - parseInt($('.bigImg').css('top'));
            $('.bigImgBox').on('mousemove', function (e) {
                var newX = e.clientX;
                var newY = e.clientY;
                console.log(newY - y)
                $('.bigImg').css({
                    'top': newY - y + 'px',
                    'left': newX - x + 'px',
                });
            })
        }
    })
    $('.bigImgBox').on('mouseup', function (e) {
        $('.bigImgBox').unbind('mousemove');
    })
    $('.bigImgBox').on('mouseleave', function () {
        $('.bigImgBox').unbind('mousemove');
    })


    /** 编辑会诊报告 */
    $('.compileReport').click(function () {
        // 判断自己是否为该订单的主会诊人
        // 是 去到带医嘱的报告页面
        // 否 本页编辑会诊报告
        // for(var i = 0;i < applyInfo.orderDoctorsList.length;i++){
        // if(applyInfo.orderDoctorsList[i].firstDoctor == 1 && applyInfo.orderDoctorsList[i].id == localStorage.getItem("userId")){
        //     window.location = "/yilaiyiwang/doctorEnjoin/doctorEnjoin.html";
        // } else {
        for (const item of consultantReport) {
            if (item.doctorId === userInfo.id) {
                $('.hold').addClass('disabled');
                $('.refer').addClass('disabled');
                $('#textarea').val(item.report);
                // $('#textarea').attr('disabled', 'disabled');
            }
        }
        /* 点击编辑会诊报告 如果有暂存内容 显示在textare标签里 */
        $('#consultantReportIframe').css('display', 'block');
        $('#consultantReportView').css('display', 'block');
        /* 开启弹层禁止屏幕滚动 */
        document.documentElement.style.overflow = "hidden";
        // }
        // }
    })
    /* 弹层关闭按钮 */
    $('#consultantReportIframe').find('.closeBtn').click(function () {
        $('#consultantReportIframe').css('display', 'none');
        $('#consultantReportView').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    });
    /* 编辑会诊报告提交按钮 */
    $('.refer').click(function () {
        for (let i = 1, len = consultantReport.length; i < len; i++) {
            if (isMainDoctor && consultantReport[i].reportStatus === "1") {
                // $('#consultantReportIframe').css('display', 'none');
                layer.open({
                    type: 1,
                    title: '',
                    area: ['500px', '200px'],
                    closeBtn: false,
                    //shade: [0.7, '#000000'],
                    shadeClose: false,
                    zIndex: layer.zIndex,
                    time: 1000,
                    content: $('.promptText')
                });
                setTimeout(function () {
                    $('.promptText').hide();
                }, 1000)
                return false;
            }
        }
        for (const item of consultantReport) {
            if (item.doctorId === userInfo.id) {
                item["report"] = $('#textarea').val();
                item["reportStatus"] = "0";
            }
        }
        let data = new FormData();
        data.append("report", JSON.stringify(consultantReport));
        data.append("id", applyFormId);
        if (!isMainDoctor) {
            ajaxRequest("POST", doctorSendFeedbackReportMoment, data, false, false, true, success, failed, null);
        } else {
            ajaxRequest("POST", doctorSendFeedbackReport, data, false, false, true, success, failed, null);
        }

        function success() {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                //   shade: [0.7, '#000000'],
                shadeClose: false,
                zIndex: layer.zIndex,
                time: 2000,
                content: $('.working')
            });
            $('.working').html('提交成功')
            setTimeout(function () {
                window.location = "../page/morkbench.html"
            }, 2000);
        }

        function failed() {
            // 其他操作
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                //   shade: [0.7, '#000000'],
                shadeClose: false,
                zIndex: layer.zIndex,
                time: 2000,
                content: $('.working')
            });
            $('.working').html('提交失败')
        }
    })
    /* 编辑会诊报告暂存按钮 */
    $('.hold').click(function () {
        for (const item of consultantReport) {
            if (item.doctorId === userInfo.id) {
                item["report"] = $('#textarea').val();
            }
        }
        let data = new FormData();
        data.append("report", JSON.stringify(consultantReport));
        data.append("id", applyFormId);
        ajaxRequest("POST", doctorSendFeedbackReportMoment, data, false, false, true, success, failed, null);
        console.log(consultantReport);

        function success() {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                //   shade: [0.7, '#000000'],
                shadeClose: false,
                zIndex: layer.zIndex,
                // time: 2000,
                content: $('.working')
            });
            $('.working').html('暂存成功')
            setTimeout(function () {
                layer.closeAll();
                $('.working').hide();
                $('.background').hide();
                $('.rejectionLayer').hide();

            }, 2000);
            document.documentElement.style.overflow = "scroll";
        }

        function failed() {
            // 其他操作
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                //   shade: [0.7, '#000000'],
                shadeClose: false,
                zIndex: layer.zIndex,
                time: 2000,
                content: $('.working')
            });
            $('.working').html('暂存失败')
        }

    })

    /** 编辑临床反馈 */
    $('.editClinicalFeedback').click(function () {
        $('#consultantFeedbackIframe').css('display', 'block');
        $('#consultantFeedbackView').css('display', 'block');
        document.documentElement.style.overflow = "hidden";
        $('#consultantFeedbackValue').val(applyInfo.consultantFeedback);
    })
    /* 弹层关闭按钮 */
    $('#consultantFeedbackIframe').find('.closeBtn').click(function () {
        $('#consultantFeedbackIframe').css('display', 'none');
        $('#consultantFeedbackView').css('display', 'none');
        $('.accept_layer').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    });

    /** 编辑临床反馈提交按钮 /order/feedBack 首诊反馈 */
    $('.feed_SM').click(function () {
        let newConsultantFeedback = $('.feedback_Val').val();
        let data = new FormData();
        data.append("consultantFeedback", newConsultantFeedback);
        data.append("id", applyFormId);
        ajaxRequest("POST", doctorSendFeedbackReport, data, false, false, true, doctorSendFeedbackReportSuccess, doctorSendFeedbackReportFailed, null);

    })
    /** 编辑临床反馈暂存按钮 */
    $('.feed_TS').click(function () {
        let newConsultantFeedback = $('.feedback_Val').val();
        let data = new FormData();
        data.append("id", applyFormId);
        data.append("consultantFeedback", newConsultantFeedback);
        ajaxRequest("POST", doctorSendFeedbackReportMoment, data, false, false, true, doctorSendFeedbackReportMomentSuccess, doctorSendFeedbackReportMomentFailed, null);
    })
    function doctorSendFeedbackReportSuccess(result) {
        $('#alertText').html('提交成功');
        alertMessage();
        setTimeout(function () {
            window.location = '../page/morkbench.html'
        }, 2000);
        getApplyInfo();
    }
    function doctorSendFeedbackReportFailed(result) {
        $('#alertText').html('提交失败');
        alertMessage();
    }
    function doctorSendFeedbackReportMomentSuccess(result) {
        $('#alertText').html('保存成功');
        alertMessage();
        setTimeout(function () {
            $('.background').css('display', 'none');
            $('.rejectionLayer').css('display', 'none');
            $('.alertBox').hide();
        }, 2000);
        document.documentElement.style.overflow = "scroll";
        getApplyInfo();
    }
    function doctorSendFeedbackReportMomentFailed(result) {
        $('#alertText').html('保存失败');
        alertMessage();
    }

    /** 拒收 申请 操作 事件 */
    $('.rejection').click(function () {
        if (isInvite) {
            $('#rejectIframe').css('display', 'block');
            $('#rejectView').css('display', 'block');
            document.documentElement.style.overflow = "hidden";
        } else {
            layer.msg('只有主会诊医生才能进行此操作');
        }
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
    })
    let viewText;
    /* 建议多学科会诊按钮点击事件  */
    $('.suggest').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        })
        $('.otherCause').removeAttr('style');
        viewText = '建议多学科会诊:';
    })
    /* 其他原因按钮点击事件  */
    $('.otherCause').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        })
        $('.suggest').removeAttr('style');
        viewText = '其他原因:';
    })
    /* 弹层关闭按钮 */
    $('.refuseBtn').click(function () {
        $('.background').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    })
    // 拒绝确定按钮
    $('.confirm').click(function () {
        if ($('.refuseReason').val() == '') {
            $("#alertText").html("请填写拒收原因");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("id", applyFormId);
            data.append("report", viewText + $('.refuseReason').val());
            ajaxRequest("POST", doctorReceiveReject, data, false, false, true, doctorReceiveRejectSuccess, null, null)
            function doctorReceiveRejectSuccess(result) {
                $("#alertText").html("拒收成功");
                alertMessage();
                setTimeout(function () {
                    window.location = '../page/morkbench.html'
                }, 1000);
            }
        }
    })

    // MDT协调按钮     MDTBtn
    $('.MDTBtn').click(function () {
        window.location = '../page/MTD.html';
    })

    //  接收按钮事件 receive
    $('.receive').click(function () {
        if (!isVideo) {
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
            showDateView(applyTimeList)
        }
    });

    function alertMessage() {
        layer.open({
            type: 1,
            title: '',
            area: ['300px', '75px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            time: 2000,
            zIndex: layer.zIndex,
            content: _$('#alertBox')
        });
    }

    rederViewByRole();

    /** 返回按钮 */
    $('.getBack').click(function () {
        window.location = '../page/morkbench.html'
    })

    function renderDateRightContent() {
        let startMinute = 0; // 开始总分钟数
        let endMinute = 0; // 结束总分钟数
        let startHour = 0; // 开始小时数
        let endHour = 0; // 结束小时数
        let _html = '';
        for (let i = 0; i < 96; i++) {
            startMinute = i * 15;
            endMinute = (i + 1) * 15;
            startHour = parseInt(startMinute / 60);
            endHour = parseInt(endMinute / 60);
            let startM = startMinute %= 60; // 计算后的开始分钟数
            let endM = endMinute %= 60; // 计算后的开始分钟数
            if (endHour == 24) {
                _html += '<li endDate="23:59" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
            } else {
                _html += '<li endDate="' + double(endHour) + ':' + double(endM) + '" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
            }
        }
        $('.rightContent').html(_html);
    }
})
