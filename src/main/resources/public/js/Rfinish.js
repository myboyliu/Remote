let applyRecordNavigationShow = false;
let consultantFeedbackNavigationShow = false;
let applyTimeNavigationShow = false;

/**渲染左侧导航栏*/
function renderLeftNavigation(data) {
    let _html = "";
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
                    _html += '</ul>\
                             </li>'
                }

            }
        }

    })
    _html += '</ul>\
             </li>'
    if (applyTimeNavigationShow) {
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

$(function () {


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
    };
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

    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let data = JSON.parse(sessionStorage.getItem('applyInfo'));
    if (data.applyType === "APPLY_CONSULTATION_VIDEO") {
        applyTimeNavigationShow = true;
    }
    console.log(data)
    let isInvite = userInfo.id === data.inviteUserId ? true : false;
    /* 动态创建进度条 */
    const statusArr = ["已拒收", '待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    let str = '';
    for (var i = 1; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>'
        $('.progressBar').html(str);
    }
    if (isInvite) {
        if (data.applyStatus === "CONSULTATION_APPLY_ACCEDE") {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".rejection").show();
            $(".receive").show();
            $(".MDTBtn").show();
        } else if (data.applyStatus === "CONSULTATION_SLAVE_ACCEDE") {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
        } else if (data.applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
        } else if (data.applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".compileReport").show();
            $(".entrance").show();
        } else if (data.applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            applyRecordNavigationShow = true;
        } else if (data.applyStatus === "CONSULTATION_END") {
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
        } else if (data.applyStatus === "CONSULTATION_MASTER_REJECT") {
            //会诊医政已拒绝
            $('.progressBar').empty();
            $('.progressBar').html('<li>' + statusArr[0] + '</li>');
            $(".progressBar li:nth-child(1)").addClass("libg");
        }
    } else {
        if (data.applyStatus === "CONSULTATION_APPLY_CREATE_SUCCESS") {
            //创建成功
            $(".progressBar").hide()
        } else if (data.applyStatus === "CONSULTATION_MASTER_REJECT") {
            //会诊医政已拒绝
            $('.progressBar').empty();
            $('.progressBar').html('<li>' + statusArr[0] + '</li>');
            $(".progressBar li:nth-child(1)").addClass("libg");
        } else if (data.applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
        } else if (data.applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
        } else if (data.applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".editClinicalFeedback").show();
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            applyRecordNavigationShow = true;
        } else if (data.applyStatus === "CONSULTATION_END") {
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
    // $(".progressBar li:nth-child(1)").addClass("libg");
    // $(".progressBar li:nth-child(2)").addClass("libg");
    // $(".progressBar li:nth-child(3)").addClass("libg");
    // $(".progressBar li:nth-child(4)").addClass("libg");
    // $(".progressBar li:nth-child(5)").addClass("libg");
    // $(".rejection").show();
    // $(".receive").show();
    // $(".MDTBtn").show();
    // $(".compileReport").show();
    // $(".entrance").show();
    // $(".editClinicalFeedback").show();

    /**网页标题*/
    $('head > title').html(data.patientSex + '/' + data.patientAge + '/' + data.caseDiagnosis + '-远程会诊平台');
    /**会诊报告*/
    let goalHtml = '<pre class="report">' + data.consultantReport +  '</pre>'
    $('.goalObj').html(goalHtml);

    /**临床反馈*/
    $('.applyFeedBack').html(data.consultantFeedback);
    /**患者基本信息*/
    $('.patientName').html('***');
    $('.high').html(data.patientHeight);
    $('.sex').html(data.patientSex);
    $('.weight').html(data.patientWeight);
    $('.age').html(data.patientAge);
    $('.address').html(data.detailAddress);
    if (data.applyUrgent == 1) {
        $('.bThree_p').show();
    } else {
        $('.bThree_p').hide();
    }
    $('.tentative').html('初步诊断：' + data.caseDiagnosis);
    $('.telemedicineTarget').html('会/转诊目的：' + data.applyRemark);

    /**电子病历附件*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, true, renderCaseContentView, null, null);
    let tempArr = data.caseContentList;

    function renderCaseContentView(data) {
        $('.sum').html(tempArr.length);
        /* 电子病历附件 */
        $.each(data, function (index, value) {
            let childList = value.childList;
            let l = -1;
            for (let j = 0, len = childList.length; j < len; j++) {
                let k = -1;
                for (var i = 0; i < tempArr.length; i++) {
                    if (childList[j].id === tempArr[i].contentTypeId) {
                        l = i;
                        if (k === j) {
                        } else {
                            var upfileHtml = '<li name="' + childList[j].caseTypeName + '" id="' + childList[j].id + '" class="upfileItem clearfix">\
                             <div class="upfileContent">\
                                 <div class="operateLeft">' + value.caseTypeName + '-' + childList[j].caseTypeName + '</div>\
                                 <ul class="fileContent clearfix">\
                                 </ul>\
                             </div>\
                         </li>'
                            $('.upfileUl').append(upfileHtml);
                            k = j;
                        }
                        var fileType = tempArr[i].contentPath.substr(tempArr[i].contentPath.lastIndexOf('.') + 1, tempArr[i].contentPath.length);
                        var fileName = tempArr[i].contentPath.substr(tempArr[i].contentPath.lastIndexOf('/') + 1, tempArr[i].contentPath.length);
                        fileAllArr.push(fileName);
                        if (fileType == 'png' || fileType == 'jpg') {
                            if (tempArr[i].remarks == '') {
                                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].contentPath + '"  class="fileItem">\
                                           <div style = "background-image: url(&apos;' + baseUrl + "/" + tempArr[i].contentPath + '&apos;)"></div>\
                                            <p type="img" desc="' + tempArr[i].contentRemark + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                            } else {
                                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].contentPath + '" class="fileItem">\
                                           <div style = "background-image: url(&apos;' + baseUrl + "/" + tempArr[i].contentPath + '&apos;)"></div>\
                                            <p type="img" desc="' + tempArr[i].contentRemark + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                            }
                        } else if (fileType == 'pdf') {
                            if (tempArr[i].remarks == '') {
                                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].contentPath + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + tempArr[i].contentRemark + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                            } else {
                                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].contentPath + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + tempArr[i].contentRemark + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                            }
                        } else if (fileType == 'dcm') {
                            if (tempArr[i].remarks == '') {
                                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].contentPath + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + tempArr[i].contentRemark + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                            } else {
                                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].contentPath + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + tempArr[i].contentRemark + '" class="fileName active">' + fileName + '</p>\
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

    $('.money').html(data.consultantPrice);
    //订单编号
    $('.numbers').html(data.applyNumber);

    //申请时间
    $('.applyDate').html(data.consultantApplyTime);
    // 发件人信息
    $('.recipientsInfo').html(data.applySummary);
    // 收件人信息
    $('.addresserInfo').html(data.inviteSummary);

    //
    //会诊排期
    /* 会诊排期 */
    let _dateHtml = '';
    let applyTimeList = data.applyTimeList;
    for (let i = 0, len = applyTimeList.length; i < len; i++) {
        _dateHtml += ' <p>\
             <span class="startDate">从&nbsp;&nbsp;' + applyTimeList[i].eventStartTime + '</span> 到&nbsp;&nbsp;\
             <span class="endDate">' + applyTimeList[i].eventEndTime + '</span>\
                        </p>'
    }
    $('.schedule_modules').html(_dateHtml);


    //如果是图文会诊
    if (data.applyType === "APPLY_CONSULTATION_IMAGE_TEXT") {
        $('.schedule').hide();
        $('.schedule_modules ').hide();
    } else {
        $('.schedule').show();
        $('.schedule_modules ').show();
    }
    /**------------------------------------------*/
    var fileAllArr = []; //所有图片原始资源
    //   var fileArr = [];
    var scaleNum = 10; // 图片缩放倍数


    // 医嘱
    if (data.orderFormBean) {
        doctorEnjoin();
    } else {
        $(".doctorEnjoinBox").hide();
    }

    function doctorEnjoin() {
        var doctorEnjoinJson = JSON.parse(data.orderFormBean.orders);
        if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0) {
            var _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">长期医嘱</p><a class="printBtn no-print" href="' + IP + "download/standingOrders?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>\
                <div class="oneList">'
            for (var i = 0; i < doctorEnjoinJson.longTimeArr.length; i++) {
                var twoLevel = doctorEnjoinJson.longTimeArr[i].drugArr;
                _html += '<div class="oneListItem">\
                        <p class="headTop">' + ((i + 1) < 10 ? "0" + (i + 1) : (i + 1)) + '-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;执行时间：' + doctorEnjoinJson.longTimeArr[i].startTime + '&nbsp;&nbsp;&nbsp;&nbsp;结束时间：' + doctorEnjoinJson.longTimeArr[i].endTime + '</p>\
                        <div class="twoList">'
                for (var j = 0; j < twoLevel.length; j++) {
                    if (j == 0) {
                        _html += '<p class="twoListItem"><b>' + twoLevel[j].name + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次' + twoLevel[j].singleNum + twoLevel[j].unit + '；' + twoLevel[j].frequency + '；' + twoLevel[j].means + '</p>'
                    } else {
                        _html += '<p class="twoListItem"><b>' + twoLevel[j].name + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次' + twoLevel[j].singleNum + twoLevel[j].unit + '；</p>'
                    }
                }
                _html += '</div>\
                    </div>\
                    <p class="boundary"></p>';
            }
            _html += '<p class="remarkBox">备注：' + doctorEnjoinJson.longTimeArea + '</p></div></div>';
            $(".doctorEnjoinBody").append(_html);
        }
        if (doctorEnjoinJson.temporaryDrugArr || doctorEnjoinJson.temporaryTreatArr) {
            if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0) {
                var _html = '<div class="chunkContent"><h2><span>02</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="' + IP + "download/statOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2><div class="oneList">'
            } else {
                var _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="' + IP + "download/statOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2><div class="oneList">'
            }
            if (doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
                for (var i = 0; i < doctorEnjoinJson.temporaryDrugArr.length; i++) {
                    var twoLevel = doctorEnjoinJson.temporaryDrugArr[i].drugArr;
                    _html += '<div class="oneListItem">\
                        <p class="headTop">' + ((i + 1) < 10 ? "0" + (i + 1) : (i + 1)) + '-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下达时间：' + doctorEnjoinJson.temporaryDrugArr[i].arriveTime + '</p>\
                        <div class="twoList">'
                    for (var j = 0; j < twoLevel.length; j++) {
                        if (j == 0) {
                            _html += '<p class="twoListItem"><b>' + twoLevel[j].name + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次' + twoLevel[j].singleNum + twoLevel[j].unit + '；' + twoLevel[j].means + '</p>'
                        } else {
                            _html += '<p class="twoListItem"><b>' + twoLevel[j].name + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次' + twoLevel[j].singleNum + twoLevel[j].unit + '；</p>'
                        }
                    }
                    _html += '</div>\
                    </div>\
                    <p class="boundary"></p>';
                }
            }
            if (doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
                if (doctorEnjoinJson.temporaryDrugArr) {
                    var tempNum = doctorEnjoinJson.temporaryDrugArr.length;
                } else {
                    var tempNum = 0;
                }
                for (var i = 0; i < doctorEnjoinJson.temporaryTreatArr.length; i++) {
                    _html += '<div class="oneListItem">\
                    <p class="headTop">' + ((tempNum + i + 1) > 10 ? (tempNum + i + 1) : '0' + (tempNum + i + 1)) + '-诊疗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下达时间：' + doctorEnjoinJson.temporaryTreatArr[i].arriveTime + '</p>\
                    <div class="twoList">\
                        <p class="twoListItem"><b>' + doctorEnjoinJson.temporaryTreatArr[i].name + '</b></p>\
                    </div>\
                </div><p class="boundary"></p>'
                }
            }
            _html += '<p class="remarkBox">备注：' + doctorEnjoinJson.temporaryArea + '</p></div></div>';
            $(".doctorEnjoinBody").append(_html);
        }
        if (doctorEnjoinJson.surgeryArr && doctorEnjoinJson.surgeryArr.length > 0) {
            if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
                var _html = '<div class="chunkContent">\
                <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
            }
            if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
                var _html = '<div class="chunkContent">\
                    <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
            }
            if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
                var _html = '<div class="chunkContent">\
                <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
            }
            if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
                var _html = '<div class="chunkContent">\
                    <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
            }
            if (!doctorEnjoinJson.longTimeArr && !doctorEnjoinJson.temporaryTreatArr && !doctorEnjoinJson.temporaryDrugArr) {
                var _html = '<div class="chunkContent">\
                    <h2><span>01</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
            }
            _html += '<div class="oneList">\
                        <div class="oneListItem">\
                            <div class="twoList">'
            for (var i = 0; i < doctorEnjoinJson.surgeryArr.length; i++) {
                _html += '<p class="twoListItem"><b>' + ((i + 1) > 10 ? (i + 1) : '0' + (i + 1)) + "&nbsp;&nbsp;&nbsp;&nbsp;" + doctorEnjoinJson.surgeryArr[i].surgeryName + '&nbsp;&nbsp;&nbsp;&nbsp;' + doctorEnjoinJson.surgeryArr[i].surgerySize + "&nbsp;&nbsp;&nbsp;&nbsp;" + doctorEnjoinJson.surgeryArr[i].surgeryNum + '</b></p>';
            }
            _html += '</div>\
                        </div>\
                        <p class="boundary"></p>\
                        <p class="remarkBox">备注：' + doctorEnjoinJson.surgeryArea + '</p>\
                    </div>\
                </div>';
            $(".doctorEnjoinBody").append(_html);
        }
    }


    // 图片点击查看大图
    var objParent = null; // 当前点击块的父级
    var fileArr = []; // 当前点击块的文件数据
    var indexFile = 0; // 当前点击的索引
    var ObjArr = []; //  当前点击块的文件对象
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
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
                $('.downlodeFile').hide();

            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
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
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
                $('.downlodeFile').hide();

            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
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
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
                $('.downlodeFile').hide();

            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
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
        var _html = '';
        for (var i = 0; i < fileArr.length; i++) {
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
            var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
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
    // 图片缩放 拖拽 结束


    /* 循环时间轴 orderStatesList*/
    // var orderStatesList = data.orderStatesList;
    // var _html = '';
    // for (var i = 0; i < orderStatesList.length; i++) {
    //     _html += '<li class="layui-timeline-item">\
    //                                 <i class="layui-icon layui-timeline-axis">&#xe63f;</i>\
    //                                 <div class="layui-timeline-content layui-text">\
    //                                     <h3 class="layui-timeline-title">\
    //                                         <span class="fw">' + orderStatesList[i].time + '</span>\
    //                                         <span class = "fw pl30" > ' + orderStatesList[i].statesName + ' </span>\
    //                                     </h3>'
    //     if (orderStatesList[i].statesName == '已结束') {
    //         _html += ''
    //     } else {
    //         _html += '<p>操作人：' + orderStatesList[i].remarks + '</p>\
    //                                 </div>\
    //                             </li>'
    //     }
    // }
    // $('.layui-timeline').html(_html);

    /* 返回按钮 */
    $('.getBack').click(function () {
        //   返回医生工作台
        window.location = '../page/morkbench.html'
    })

})
