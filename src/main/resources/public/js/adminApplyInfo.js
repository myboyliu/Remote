let isInvite;
let applyFormId;
let inviteDoctorCount;
let applyTypeStr;
let newApplyTime = [];

function renderViewByRole(applyStatus) {
    /* 动态创建进度条 */
    const statusArr = ["已拒收", '待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    let str = '';
    for (let i = 1; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>'
        $('.progressBar').html(str);
    }

    // $('.progressBar li:nth-child(1)').addClass('libg');
    // $('.progressBar li:nth-child(2)').addClass('libg');
    // $('.progressBar li:nth-child(3)').addClass('libg');
    // $('.progressBar li:nth-child(4)').addClass('libg');
    // $('.progressBar li:nth-child(5)').addClass('libg');
    console.log(isInvite);
    console.log(applyStatus);
    console.log(inviteDoctorCount);
    if (isInvite) {
        if (applyStatus === "CONSULTATION_APPLY_ACCEDE") {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
            $(".modifier3").show();
            $(".modifier5").show();
            $(".rejection").show();
            if (inviteDoctorCount > 2) {
                $(".MDTBtn").show();
            } else {
                $(".accept").show();
            }
        } else if (applyStatus === "CONSULTATION_SLAVE_ACCEDE" || applyStatus === "CONSULTATION_MASTER_ACCEDE") {
            //排期审核
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
            $(".rejection").show();
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
            applyRecordNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
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
            $(".progressBar").hide()
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
            applyRecordNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            applyRecordNavigationShow = true;
            consultantFeedbackNavigationShow = true;
        } else {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
        }
    }
    // $(".rejection").show();
    // $(".receive").show();
    // $(".MDTBtn").show();
    // $(".compileReport").show();
    // $(".entrance").show();
    // $(".editClinicalFeedback").show();

    // $("#applyRecord").show();
    // $("#consultantFeedback").show();
    // $("#doctorEnjoin").show();
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

/**修改会诊排期*/
function updateApplyTime(dateList) {
    if (isInvite) {
        let data = new FormData();
        data.append("eventStartTime", dateList[0].startDate);
        data.append("eventEndTime", dateList[0].endDate);
        data.append("applyFormId", applyFormId);
        ajaxRequest("POST", sirUpdateDate, data, false, false, true, sirUpdateDateSuccess, null, null)
    } else {
        let data = new FormData();
        data.append("startEndTime", JSON.stringify(dateList));
        data.append("applyFormId", applyFormId);
        ajaxRequest("POST", sirSendUpdateDate, data, false, false, true, sirUpdateDateSuccess, null, null)
    }

    function sirUpdateDateSuccess() {
        let data = {"applyFormId": applyFormId};
        ajaxRequest("GET", getApplyInfoUrl, data, true, "application/json", true, getApplyInfoSuccess, null, null)

        function getApplyInfoSuccess(result) {
            sessionStorage.setItem('applyInfo', JSON.stringify(result));
            renderApplyTimeView(result.applyTimeList);
        }
    }

}

$(function () {

    var scaleNum = 10; // 图片缩放倍数

    var fileAllArr = []; //所有图片原始资源
    //   var fileArr = [];
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let applyInfo = JSON.parse(sessionStorage.getItem('applyInfo'));
    isInvite = userInfo.hospitalId === applyInfo.inviteHospitalId ? true : false;
    applyFormId = applyInfo.id;
    applyTypeStr = applyInfo.applyType;
    let applyStatus = applyInfo.applyStatus;
    let consultantUserList = JSON.parse(applyInfo.consultantUserList);
    console.log(userInfo);
    console.log(applyInfo);
    /**网页标题*/
    $('head > title').html(applyInfo.patientSex + '/' + applyInfo.patientAge + '/' + applyInfo.caseDiagnosis + '-远程会诊平台');
    /** 拒收原因 */
    $("#refuseReason").html(applyInfo.consultantReport);
    /**患者基本信息*/
    $('.patientName').html('***');
    $('.high').html(applyInfo.patientHeight);
    $('.sex').html(applyInfo.patientSex);
    $('.weight').html(applyInfo.patientWeight/1000);
    $('.age').html(applyInfo.patientAge);
    $('.address').html(applyInfo.detailAddress);
    if (applyInfo.applyUrgent == 1) {
        $('.bThree_p').show();
    } else {
        $('.bThree_p').hide();
    }
    $('.tentative').html('初步诊断：' + applyInfo.caseDiagnosis);
    $('.telemedicineTarget').html('会/转诊目的：' + applyInfo.applyRemark);
    /**电子病历附件*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, true, renderCaseContentView, null, null);
    let tempArr = applyInfo.caseContentList;

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
                            if (tempArr[i].contentRemark == '') {
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
                            if (tempArr[i].contentRemark == '') {
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
                            if (tempArr[i].contentRemark == '') {
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
    }

    $('.money').html(applyInfo.consultantPrice);
    //订单编号
    if(applyInfo.applyStatus === "CONSULTATION_APPLY_CREATE_SUCCESS"){
        $('#applyNumber').hide();
    }
    //订单编号
    $('.numbers').html(applyInfo.applyNumber);

    //申请时间
    $('.applyDate').html(applyInfo.consultantApplyTime);
    // 发件人信息
    $('.recipientsInfo').html(applyInfo.applySummary);
    // 收件人信息
    $('.addresserInfo').html(applyInfo.inviteSummary);
    inviteDoctorCount = applyInfo.inviteSummary.split(";").length;
    let applyTimeList = applyInfo.applyTimeList;
    renderApplyTimeView(applyTimeList);


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


    /* 点击修改按钮收起显示 */
    // 患者基本信息essential_btn
    $('#cut').click(function () {
        $(this).toggleClass("foundBtn");
        $('.essentialInformation_modules').toggle(500);
    });
    //电子病历
    $('.modifier2').click(function () {

        $('.upfileUl').toggle(500);
        // console.log($('#cutEle').attr("class"))
        if ($('#cutEle').attr("class") == "chooseBtn") {
            $('#cutEle').addClass('foundBtn');
            $('#cutEle').removeClass('chooseBtn');
        } else {
            $('#cutEle').addClass('chooseBtn');
            $('#cutEle').removeClass(' foundBtn');
        }

    });
    //电子病历
    $('.modifier22').click(function () {

        $('.upfileUl').toggle(500);
        // console.log($('#cutEle').attr("class"))
        if ($('#cutEle').attr("class") == "chooseBtn") {
            $('#cutEle').addClass('foundBtn');
            $('#cutEle').removeClass('chooseBtn');
        } else {
            $('#cutEle').addClass('chooseBtn');
            $('#cutEle').removeClass(' foundBtn');
        }

    });
    //  收件医生
    $('#cutDoc').click(function () {
        $(this).toggleClass("foundBtn");
        $('.ReceiptDoctor_modules').toggle(500);
    });
    //  会诊排期
    $('#cutSch').click(function () {
        $(this).toggleClass("foundBtn");
        $('.schedule_modules').toggle(500);
    });
    //  会诊报告
    $('#cutLec').click(function () {
        $(this).toggleClass("foundBtn");
        $('.lecturer_modules').toggle(500);
    });
    //  临床反馈
    $('#cutTic').click(function () {
        $(this).toggleClass("foundBtn");
        $('.tickling_modules').toggle(500);
    });

    // 医嘱
    // if (data.orderFormBean.orders) {
    //     doctorEnjoin();
    // } else {
    //     $(".doctorEnjoinBox").hide();
    // }
    // function doctorEnjoin() {
    //     var doctorEnjoinJson = JSON.parse(data.orderFormBean.orders);
    //     console.log(doctorEnjoinJson)
    //     if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0) {
    //         var _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">长期医嘱</p><a class="printBtn no-print" href="' + IP + "download/standingOrders?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>\
    //         <div class="oneList">'
    //         for (var i = 0; i < doctorEnjoinJson.longTimeArr.length; i++) {
    //             var twoLevel = doctorEnjoinJson.longTimeArr[i].drugArr;
    //             _html += '<div class="oneListItem">\
    //                 <p class="headTop">' + ((i + 1) < 10 ? "0" + (i + 1) : (i + 1)) + '-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;执行时间：' + doctorEnjoinJson.longTimeArr[i].startTime + '&nbsp;&nbsp;&nbsp;&nbsp;结束时间：' + doctorEnjoinJson.longTimeArr[i].endTime + '</p>\
    //                 <div class="twoList">'
    //             for (var j = 0; j < twoLevel.length; j++) {
    //                 if (j == 0) {
    //                     _html += '<p class="twoListItem"><b>' + twoLevel[j].name + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次' + twoLevel[j].singleNum + twoLevel[j].unit + '；' + twoLevel[j].frequency + '；' + twoLevel[j].means + '</p>'
    //                 } else {
    //                     _html += '<p class="twoListItem"><b>' + twoLevel[j].name + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次' + twoLevel[j].singleNum + twoLevel[j].unit + '；</p>'
    //                 }
    //             }
    //             _html += '</div>\
    //             </div>\
    //             <p class="boundary"></p>';
    //         }
    //         _html += '<p class="remarkBox">备注：' + doctorEnjoinJson.longTimeArea + '</p></div></div>';
    //         $(".doctorEnjoinBody").append(_html);
    //     }
    //     if (doctorEnjoinJson.temporaryDrugArr || doctorEnjoinJson.temporaryTreatArr) {
    //         if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0) {
    //             var _html = '<div class="chunkContent"><h2><span>02</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="' + IP + "download/statOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2><div class="oneList">'
    //         } else {
    //             var _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="' + IP + "download/statOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2><div class="oneList">'
    //         }
    //         if (doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
    //             for (var i = 0; i < doctorEnjoinJson.temporaryDrugArr.length; i++) {
    //                 var twoLevel = doctorEnjoinJson.temporaryDrugArr[i].drugArr;
    //                 _html += '<div class="oneListItem">\
    //                 <p class="headTop">' + ((i + 1) < 10 ? "0" + (i + 1) : (i + 1)) + '-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下达时间：' + doctorEnjoinJson.temporaryDrugArr[i].arriveTime + '</p>\
    //                 <div class="twoList">'
    //                 for (var j = 0; j < twoLevel.length; j++) {
    //                     if (j == 0) {
    //                         _html += '<p class="twoListItem"><b>' + twoLevel[j].name + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次' + twoLevel[j].singleNum + twoLevel[j].unit + '；' + twoLevel[j].means + '</p>'
    //                     } else {
    //                         _html += '<p class="twoListItem"><b>' + twoLevel[j].name + '</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次' + twoLevel[j].singleNum + twoLevel[j].unit + '；</p>'
    //                     }
    //                 }
    //                 _html += '</div>\
    //             </div>\
    //             <p class="boundary"></p>';
    //             }
    //         }
    //         if (doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
    //             if (doctorEnjoinJson.temporaryDrugArr) {
    //                 var tempNum = doctorEnjoinJson.temporaryDrugArr.length;
    //             } else {
    //                 var tempNum = 0;
    //             }
    //             for (var i = 0; i < doctorEnjoinJson.temporaryTreatArr.length; i++) {
    //                 _html += '<div class="oneListItem">\
    //             <p class="headTop">' + ((tempNum + i + 1) > 10 ? (tempNum + i + 1) : '0' + (tempNum + i + 1)) + '-诊疗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下达时间：' + doctorEnjoinJson.temporaryTreatArr[i].arriveTime + '</p>\
    //             <div class="twoList">\
    //                 <p class="twoListItem"><b>' + doctorEnjoinJson.temporaryTreatArr[i].name + '</b></p>\
    //             </div>\
    //         </div><p class="boundary"></p>'
    //             }
    //         }
    //         _html += '<p class="remarkBox">备注：' + doctorEnjoinJson.temporaryArea + '</p></div></div>';
    //         $(".doctorEnjoinBody").append(_html);
    //     }
    //     if (doctorEnjoinJson.surgeryArr && doctorEnjoinJson.surgeryArr.length > 0) {
    //         if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
    //             var _html = '<div class="chunkContent">\
    //         <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
    //         }
    //         if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
    //             var _html = '<div class="chunkContent">\
    //             <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
    //         }
    //         if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
    //             var _html = '<div class="chunkContent">\
    //         <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
    //         }
    //         if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
    //             var _html = '<div class="chunkContent">\
    //             <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
    //         }
    //         if (!doctorEnjoinJson.longTimeArr && !doctorEnjoinJson.temporaryTreatArr && !doctorEnjoinJson.temporaryDrugArr) {
    //             var _html = '<div class="chunkContent">\
    //             <h2><span>01</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="' + IP + "download/specificationsOrder?orderId=" + localStorage.getItem("orderId") + '">下载</a></h2>'
    //         }
    //         _html += '<div class="oneList">\
    //                 <div class="oneListItem">\
    //                     <div class="twoList">'
    //         for (var i = 0; i < doctorEnjoinJson.surgeryArr.length; i++) {
    //             _html += '<p class="twoListItem"><b>' + ((i + 1) > 10 ? (i + 1) : '0' + (i + 1)) + "&nbsp;&nbsp;&nbsp;&nbsp;" + doctorEnjoinJson.surgeryArr[i].surgeryName + '&nbsp;&nbsp;&nbsp;&nbsp;' + doctorEnjoinJson.surgeryArr[i].surgerySize + "&nbsp;&nbsp;&nbsp;&nbsp;" + doctorEnjoinJson.surgeryArr[i].surgeryNum + '</b></p>';
    //         }
    //         _html += '</div>\
    //                 </div>\
    //                 <p class="boundary"></p>\
    //                 <p class="remarkBox">备注：' + doctorEnjoinJson.surgeryArea + '</p>\
    //             </div>\
    //         </div>';
    //         $(".doctorEnjoinBody").append(_html);
    //     }
    // }


    // 修改排期
    $('.schedulingBtn').click(function () {
        showDateView(applyTimeList);
    })
    // //   收件人信息
    // var recipientsArr = data.orderDoctorsList;
    // var _html = '';
    // var _feedBack = '';
    // if (recipientsArr.length == 0) {
    //     $('.addresserInfo').html("<" + data.orderFormBean.invitedHospitalName + ">")
    // } else {
    //     for (var i = 0; i < recipientsArr.length; i++) {
    //         _html += '<' + recipientsArr[i].name + '/' + recipientsArr[i].occupation + '/' + recipientsArr[i].deptName + '/' + recipientsArr[i].hospitalName + '>;'
    //         _feedBack += '<pre>' + recipientsArr[i].name + ':<br />' + recipientsArr[i].feedBack + '</pre>'
    //     }
    //     $('.addresserInfo').html(_html);
    //     // 会诊报告
    //     $('.lecturer_modules').append(_feedBack);
    // }


    /* 诊费 */
    let consultantPrice = applyInfo.consultantPrice;
    let hospitalPrice = applyInfo.hospitalPrice;
    console.log(consultantUserList);
    console.log(consultantPrice);
    console.log(hospitalPrice);
    let _fees = '';
    for (let i = 0; i < consultantUserList.length; i++) {
        _fees += '<tr><td>' + consultantUserList[i].doctorName + '</td>'
        _fees += '<td class = "yuan" >' + consultantUserList[i].price + '.00</td>'
        _fees += '<td>'
        _fees += '<input type="text" value="' + consultantUserList[i].price + '.00" class="fees_input gai" readonly="readonly">'
        _fees += '</td></tr>'
    }
    $('.basePic').html(hospitalPrice+".00");
    $('.basePicInput').val(hospitalPrice+".00");
    $('.tbody_doc').html(_fees);
    $('.aggregate').html(consultantPrice+".00");
    $('.dynamicAggregate').html(consultantPrice+".00");


    var deptNumber = '';
    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'user/selectDeptNumberWithUserId',
    //     dataType: 'json',
    //     data: {
    //         "userId": data.orderFormBean.doctorId,
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     success: function (data) {
    //         console.log(data)
    //         if (data.status == 200) {
    //             deptNumber = data.deptNumber;
    //             // 成功操作
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //             // 其他操作
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //
    //     },
    // });
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

    /**  退回按钮弹出层 */
    $('.sendBack').click(function () {
        var $ = layui.jquery;
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('.inviteObj') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
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
        ajaxRequest("POST", sirSendCheckReject, data, false, false, true, sirSendCheckRejectSuccess, null, null)

        function sirSendCheckRejectSuccess(result) {
            console.log(result);
        }
    });

    /** 返回按钮 */
    $('.getBack').click(function () {
        window.location = '../page/administrator.html'
    });
    /** 审核发布按钮接口 */
    $('.audit').click(function () {
        var $ = layui.jquery;
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('.auditObj') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        });

    })
    $(".auditObj").find(".agin").click(function () {
        layer.closeAll();
        $('.auditObj').hide();
    });
    $(".auditObj").find(".yes").click(function () {
        let data = new FormData();
        data.append("id", applyFormId);
        ajaxRequest("POST", sirSendCheckAccede, data, false, false, true, sirSendCheckAccedeSuccess, null, null)

        function sirSendCheckAccedeSuccess(result) {
            $('.succeed').hide();
            window.location = "../page/administrator.html";
        }
    });
    /**MDT协调按钮*/
    $('.MDTBtn').click(function () {
        let _$ = layui.jquery;
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
        let _$ = layui.jquery;
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
        console.log(inviteDoctorCount)
        console.log($('.schedule_modules >p').length)
        if (inviteDoctorCount <= 0) {
            layer.closeAll();
            $('.submitBox').hide();
            let _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.7, '#000000'],
                shadeClose: false,
                time: 1000,
                zIndex: layer.zIndex,
                content: _$('.inviteDoctorFiled')
            });
        } else if ($('.schedule_modules >p').length !== 1) {
            layer.closeAll();
            $('.submitBox').hide();
            let _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.7, '#000000'],
                shadeClose: false,
                time: 1000,
                zIndex: layer.zIndex,
                content: _$('.applyTimeFiled')
            });
            // showDateView(applyTimeList);
        } else {
            if (applyTypeStr === "APPLY_CONSULTATION_IMAGE_TEXT") {
                let data = new FormData();
                data.append("id", applyFormId);
                ajaxRequest("POST", sirReceiveMasterAccede, data, false, false, true, sirReceiveMasterAccedeSuccess, null, null)
            } else {
                // 视频会诊
                var startTime = '';
                var endTime = '';
                if (dateTempList[0].startIndex <= dateTempList[0].endIndex) {
                    startTime = dateTempList[0].date + ' ' + $('#timeUl > li').eq(dateTempList[0].startIndex).html() + ':00';
                    endTime = dateTempList[0].date + ' ' + $('#timeUl>li').eq(dateTempList[0].endIndex).attr('enddate') + ':00';
                } else {
                    startTime = dateTempList[0].date + ' ' + $('#timeUl > li').eq(dateTempList[0].endIndex).html() + ':00';
                    endTime = dateTempList[0].date + ' ' + $('#timeUl > li').eq(dateTempList[0].startIndex).attr('enddate') + ':00';
                }
                let data = new FormData();
                data.append("id", applyFormId);
                ajaxRequest("POST", sirReceiveMasterAccede, data, false, false, true, sirReceiveMasterAccedeSuccess, null, null)
            }

            //接收 成功回调
            function sirReceiveMasterAccedeSuccess() {
                $('.submitBox').hide();
                var _$ = layui.jquery;
                layer.open({
                    type: 1,
                    title: '',
                    area: ['500px', '200px'],
                    closeBtn: false,
                    shade: [0.7, '#000000'],
                    shadeClose: false,
                    content: _$('.acceptSuccess'),
                    time: 2000,
                });
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
    })
    var viewText = '建议多学科会诊:';
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
            var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.7, '#000000'],
                shadeClose: false,
                time: 2000,
                //    zIndex: layer.zIndex,
                content: _$('.pleaseWirte')
            });
        } else {
            let data = new FormData();
            data.append("id", applyFormId);
            data.append("report", viewText + $('.refuseReason').val());
            console.log(viewText + $('.refuseReason').val());
            ajaxRequest("POST", sirReceiveMasterReject, data, false, false, true, sirReceiveMasterRejectSuccess, null, null)

            function sirReceiveMasterRejectSuccess(result) {
                var _$ = layui.jquery;
                layer.open({
                    type: 1,
                    title: '',
                    area: ['500px', '200px'],
                    closeBtn: false,
                    shade: [0.7, '#000000'],
                    shadeClose: false,
                    time: 2000,
                    zIndex: layer.zIndex,
                    content: _$('.rejectSuccess')
                });
                setTimeout(function () {
                    window.location = '../page/administrator.html';
                }, 2000);
            }
        }
    });
    /* 弹层关闭按钮 */
    $('.refuseBtn').click(function () {
        $('.background').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    });
    renderViewByRole(applyStatus);
});
