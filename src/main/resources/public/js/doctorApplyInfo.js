let applyRecordNavigationShow = false;
let consultantFeedbackNavigationShow = false;
let applyRefuseNavigationShow = false;
let isBranchDoctor = false;
let isInvite = false;
let isVideo = false;
let isReferral = false;
let isConsultation = true;
let consultantReport = [];
let inviteDoctorCount = 0;
let applyFormId;
let applyInfo = {};
let isMainDoctor;
let applyStatus;
let applyTimeList = [];
let caseContentList = [];
let userInfo = {};
let hasDoctorEnjoin = false;
const _$ = layui.jquery;

const statusArr = ["已拒收", '待收诊', '已排期', '会诊中', '待反馈', '已完成'];
const referralStatusArr = ["已拒收", '待收诊', '已排期', '已完成'];

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
    }else if (isReferral){
        _html += '<li class="oneLevelItem patientInfo">\
                        <p class="oneLevelName">转诊排期</p>\
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
                    let fileName = caseContentList[i].contentPath;
                    fileAllArr.push(fileName);
                    if (fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg') {
                        if (caseContentList[i].contentRemark == '') {

                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].orderWeight + '" filePath="' + caseContentList[i].contentPath + '"  class="fileItem">\
                                           <div style = "background-image: url(&apos;' + baseUrl + "/" + caseContentList[i].contentPath + '&apos;)"></div>\
                                            <p type="img" desc="' + caseContentList[i].contentRemark + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                        } else {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].orderWeight + '" filePath="' + caseContentList[i].contentPath + '" class="fileItem">\
                                           <div style = "background-image: url(&apos;' + baseUrl + "/" + caseContentList[i].contentPath + '&apos;)"></div>\
                                            <p type="img" desc="' + caseContentList[i].contentRemark + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                        }
                    } else if (fileType == 'pdf') {
                        if (caseContentList[i].contentRemark == '') {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].orderWeight + '" filePath="' + caseContentList[i].contentPath + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + caseContentList[i].contentRemark + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                        } else {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].orderWeight + '" filePath="' + caseContentList[i].contentPath + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + caseContentList[i].contentRemark + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                        }
                    } else if (fileType == 'dcm') {
                        if (caseContentList[i].contentRemark == '') {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].orderWeight + '" filePath="' + caseContentList[i].contentPath + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + caseContentList[i].contentRemark + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                        } else {
                            $('.upfileUl').find('#' + caseContentList[i].contentTypeId).find('.fileContent').append('<li id="' + caseContentList[i].id + '" sort="' + caseContentList[i].orderWeight + '" filePath="' + caseContentList[i].contentPath + '" class="fileItem">\
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

/** 渲染 医嘱 */
function renderDoctorEnjoin(doctorEnjoinJsonStr) {

    let doctorEnjoinJson = JSON.parse(doctorEnjoinJsonStr)
    if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0) {
        let _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">长期医嘱</p><a class="printBtn no-print" href="">下载</a></h2>\
            <div class="oneList">'
        for (let i = 0; i < doctorEnjoinJson.longTimeArr.length; i++) {
            let twoLevel = doctorEnjoinJson.longTimeArr[i].drugArr;
            _html += '<div class="oneListItem">\
                    <p class="headTop">' + ((i + 1) < 10 ? "0" + (i + 1) : (i + 1)) + '-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;执行时间：' + doctorEnjoinJson.longTimeArr[i].startTime + '&nbsp;&nbsp;&nbsp;&nbsp;结束时间：' + doctorEnjoinJson.longTimeArr[i].endTime + '</p>\
                    <div class="twoList">'
            for (let j = 0; j < twoLevel.length; j++) {
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
        let _html;
        if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0) {
            _html = '<div class="chunkContent"><h2><span>02</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="">下载</a></h2><div class="oneList">'
        } else {
            _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="">下载</a></h2><div class="oneList">'
        }
        if (doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
            for (let i = 0; i < doctorEnjoinJson.temporaryDrugArr.length; i++) {
                let twoLevel = doctorEnjoinJson.temporaryDrugArr[i].drugArr;
                _html += '<div class="oneListItem">\
                    <p class="headTop">' + ((i + 1) < 10 ? "0" + (i + 1) : (i + 1)) + '-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下达时间：' + doctorEnjoinJson.temporaryDrugArr[i].arriveTime + '</p>\
                    <div class="twoList">'
                for (let j = 0; j < twoLevel.length; j++) {
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
            let tempNum;
            if (doctorEnjoinJson.temporaryDrugArr) {
                tempNum = doctorEnjoinJson.temporaryDrugArr.length;
            } else {
                tempNum = 0;
            }
            for (let i = 0; i < doctorEnjoinJson.temporaryTreatArr.length; i++) {
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
        let _html;
        if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
            _html = '<div class="chunkContent">\
            <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn" href="">下载</a></h2>'
        }
        if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
            _html = '<div class="chunkContent">\
                <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="">下载</a></h2>'
        }
        if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0) {
            _html = '<div class="chunkContent">\
            <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="">下载</a></h2>'
        }
        if (doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0) {
            _html = '<div class="chunkContent">\
                <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="">下载</a></h2>'
        }
        if (!doctorEnjoinJson.longTimeArr && !doctorEnjoinJson.temporaryTreatArr && !doctorEnjoinJson.temporaryDrugArr) {
            _html = '<div class="chunkContent">\
                <h2><span>01</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="">下载</a></h2>'
        }
        _html += '<div class="oneList">\
                    <div class="oneListItem">\
                        <div class="twoList">'
        for (let i = 0; i < doctorEnjoinJson.surgeryArr.length; i++) {
            _html += '<p class="twoListItem"><b>' + ((i + 1) > 10 ? (i + 1) : '0' + (i + 1)) + "&nbsp;&nbsp;&nbsp;&nbsp;" + doctorEnjoinJson.surgeryArr[i].surgeryName + '&nbsp;&nbsp;&nbsp;&nbsp;' + doctorEnjoinJson.surgeryArr[i].surgeryNum + '</b></p>';
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

/** 查询申请详情 */
function getApplyInfo() {
    applyFormId = sessionStorage.getItem('applyFormId');
    let formData = {"applyFormId": applyFormId};
    ajaxRequest("GET", getApplyInfoUrl, formData, true, "application/json", false, getApplyInfoSuccess, null, null)

    function getApplyInfoSuccess(result) {
        sessionStorage.setItem('applyInfo', JSON.stringify(result));
        applyInfo = JSON.parse(sessionStorage.getItem('applyInfo'));
        userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        isReferral = applyInfo.applyType === "APPLY_REFERRAL" ? true : false;
        isConsultation = applyInfo.applyType === "APPLY_REFERRAL" ? false : true;
        isMainDoctor = userInfo.id === applyInfo.inviteUserId ? true : false;
        isBranchDoctor = userInfo.branchId === applyInfo.inviteBranchId ? true : false;
        if (applyInfo.consultantUserList) {
            isInvite = applyInfo.consultantUserList.indexOf(userInfo.id) > 0 ? true : false;
        }else{
            isInvite = userInfo.id === applyInfo.inviteUserId ? true : false;
        }
        if(applyInfo.applyStatus === "CONSULTATION_APPLY_ACCEDE"){
            isInvite = isBranchDoctor;
        }

        // isInvite = userInfo.branchId === applyInfo.inviteBranchId ? true : false;
        isVideo = applyInfo.applyType === "APPLY_CONSULTATION_VIDEO" ? true : false;
    }
}

/** 根据不同角色渲染 页面内容*/
function renderViewByRole() {
    /** 动态创建进度条 */
    let str = '';
    for (var i = 1; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>'
        $('.progressBar').html(str);
    }

    if (isInvite && isConsultation) {
        $(".progressBar li:nth-child(1)").addClass("libg");
        if (applyStatus === "CONSULTATION_APPLY_ACCEDE") {
            //待收诊
            if (isMainDoctor) {
                $(".rejection").show();
                if (inviteDoctorCount > 1) {
                    $(".MDTBtn").show();
                } else {
                    $(".receive").show();
                }
            } else if (inviteDoctorCount <= 1) {
                $(".receive").show();
            }
        } else if (applyStatus === "CONSULTATION_SLAVE_ACCEDE") {
            //待收诊
        } else if (applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(2)").addClass("libg");
        } else if (applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".compileReport").show();
            if (isVideo) {
                $(".entrance").show();
            }
        } else if (applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            if (hasDoctorEnjoin) {
                $("#doctorEnjoinTitle").show();
                $("#doctorEnjoinBody").show();
            }
            applyRecordNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            $("#consultantFeedback").show();
            $("#consultantFeedbackContext").show();
            if (hasDoctorEnjoin) {
                $("#doctorEnjoinTitle").show();
                $("#doctorEnjoinBody").show();
            }
            applyRecordNavigationShow = true;
            consultantFeedbackNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_MASTER_REJECT" || applyInfo.applyStatus === "CONSULTATION_SLAVE_REJECT") {
            //已拒绝
            applyRefuseNavigationShow = true;
            $('#refuseReasonBox').show();
            $('.progressBar').empty();
            $('.progressBar').html('<li class="libg">' + statusArr[0] + '</li>');
            // $(".progressBar li:nth-child(1)").addClass("libg");
        }
    } else if (isConsultation) {
        $(".progressBar li:nth-child(1)").addClass("libg");
        if (applyStatus === "CONSULTATION_APPLY_CREATE_SUCCESS") {
            //创建成功
            $(".progressBar").hide()
        } else if (applyStatus === "CONSULTATION_MASTER_REJECT") {
            //会诊医政已拒绝
            applyRefuseNavigationShow = true;
            $('#refuseReasonBox').show();
            $('.progressBar').empty();
            $('.progressBar').html('<li class="libg">' + statusArr[0] + '</li>');
        } else if (applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(2)").addClass("libg");
        } else if (applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            if (isVideo) {
                $(".entrance").show();
            }
        } else if (applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".editClinicalFeedback").show();
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            if (hasDoctorEnjoin) {
                $("#doctorEnjoinTitle").show();
                $("#doctorEnjoinBody").show();
            }
            applyRecordNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            $("#applyRecord").show();
            $("#applyRecordContext").show();
            $("#consultantFeedback").show();
            $("#consultantFeedbackContext").show();
            if (hasDoctorEnjoin) {
                $("#doctorEnjoinTitle").show();
                $("#doctorEnjoinBody").show();
            }
            applyRecordNavigationShow = true;
            consultantFeedbackNavigationShow = true;
        } else {
            //待收诊
        }
    } else {
        $("#applyTimeListTitle").html("转诊排期")
        $('.progressBar').empty();
        let referralStatus = '';
        for (var i = 1; i < referralStatusArr.length; i++) {
            referralStatus += '<li style="width: 400px;">' + referralStatusArr[i] + '</li>'
            $('.progressBar').html(referralStatus);
        }
        $(".progressBar li:nth-child(1)").addClass("libg");
        if (isInvite) {
            if (applyStatus === "INQUIRY_APPLY_CREATE_SUCCESS") {
                //待审核
                $('.progressBar').hide();
                $('#applyTime').hide();
                $('#applyNumber').hide();
                $('.layui-timeline').hide();
            } else if (applyStatus === "INQUIRY_APPLY_ACCEDE") {
                //待收诊
                $("#refuseReferralBtn").show();
                $("#receiveReferralBtn").show();
            } else if (applyStatus === "INQUIRY_SLAVE_ACCEDE") {
                //排期审核

            } else if (applyStatus === "INQUIRY_DATETIME_LOCKED") {
                //已排期
                $(".progressBar li:nth-child(2)").addClass("libg");
            } else if (applyStatus === "INQUIRY_MASTER_REJECT" || applyStatus === "INQUIRY_APPLY_REJECT" || applyStatus === "INQUIRY_SLAVE_REJECT") {
                //已拒收
                $('#refuseReasonBox').show();
                $('.progressBar').empty();
                referralStatus = '<li class="libg" style="width: 100%">' + '已拒收' + '</li>'
                $('.progressBar').html(referralStatus);
            } else if (applyStatus === "INQUIRY_END") {
                //已结束
                $(".progressBar li:nth-child(3)").addClass("libg");
            }
        } else {
            if (applyStatus === "INQUIRY_APPLY_CREATE_SUCCESS") {
                //待审核
                $('.progressBar').hide();
                $('#applyTime').hide();
                $('#applyNumber').hide();
                $('.layui-timeline').hide();
            } else if (applyStatus === "INQUIRY_APPLY_ACCEDE") {
                //待收诊
            } else if (applyStatus === "INQUIRY_SLAVE_ACCEDE") {
                //排期审核
            } else if (applyStatus === "INQUIRY_DATETIME_LOCKED") {
                //已排期
                $(".progressBar li:nth-child(2)").addClass("libg");
            } else if (applyStatus === "INQUIRY_MASTER_REJECT" || applyStatus === "INQUIRY_APPLY_REJECT" || applyStatus === "INQUIRY_SLAVE_REJECT") {
                //已拒收
                $('#refuseReasonBox').show();
                $('.progressBar').empty();
                referralStatus = '<li class="libg" style="width: 100%">' + '已拒收' + '</li>'
                $('.progressBar').html(referralStatus);
            } else if (applyStatus === "INQUIRY_END") {
                //已结束
                $(".progressBar li:nth-child(3)").addClass("libg");
            }
        }
    }
}

/**主会诊医生 修改 会诊排期*/
function updateApplyTime(dateList) {
    let data = new FormData();
    data.append("applyFormId", applyFormId);
    data.append("startEndTime", JSON.stringify(dateList));
    if (isMainDoctor) {
        ajaxRequest("POST", mainDoctorAccede, data, false, false, true, sirUpdateDateSuccess, null, null)
    } else if (isBranchDoctor) {
        ajaxRequest("POST", doctorAcceptOther, data, false, false, true, sirUpdateDateSuccess, null, null)
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

/** 操作 弹窗提示 */
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

/** 订单状态 变化 导致 操作失败 */
function operationFailid(data) {
    $("#alertText").html("订单状态已改变!");
    alertMessage();
    setTimeout(function () {
        window.location = '../page/morkbench.html'
    }, 2000);
}

$(function () {

    getApplyInfo();

    if (applyInfo.inviteUserId && isConsultation) {
        inviteDoctorCount = JSON.parse(applyInfo.consultantUserList).length;
    }
    let applyNodeList = applyInfo.applyNodeList;

    applyTimeList = applyInfo.applyTimeList;
    caseContentList = applyInfo.caseContentList;
    applyStatus = applyInfo.applyStatus;
    /**网页标题*/
    $('head > title').html(applyInfo.patientSex + '/' + applyInfo.patientAge + '/' + applyInfo.caseDiagnosis + '-远程会诊平台');
    /** 拒收原因 */
    $("#refuseReason").html(applyInfo.refuseRemark);
    /**会诊报告*/
    if (applyInfo.consultantReport && isConsultation) {
        consultantReport = JSON.parse(applyInfo.consultantReport);
    }
    let goalHtml = '';
    for (let item of consultantReport) {
        goalHtml += '<pre class="report">' + item.doctorName + ':<br />' + item.report + '</pre>'
        if (item.doctorEnjoin && item.doctorEnjoin.length > 40) {
            hasDoctorEnjoin = true;
            renderDoctorEnjoin(item.doctorEnjoin);
        }
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
    if (isConsultation) {
        $("#consultationPrice").show();
        $('.money').html(applyInfo.consultantPrice);
    }
    //订单编号
    $('.numbers').html(applyInfo.applyNumber);
    //申请时间
    $('.applyDate').html(applyInfo.consultantApplyTime);
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
        $('#applyTimeListView').hide();
        $('.schedule_modules ').hide();
    } else {
        $('#applyTimeListView').show();
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

    renderViewByRole();

    /** 返回按钮 */
    $('.getBack').click(function () {
        window.location = '../page/morkbench.html'
    })
})
