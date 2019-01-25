let isInvite = false;
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
let isBranchDoctor = false;
let isMainDoctor = false;
let applyInfo = {};
let userInfo = {};
const _$ = layui.jquery;
let referralModifyDoctor = {};
let hasDoctorEnjoin = false;
let isReferral = false;
let isConsultation = false; //true: 会诊订单 false: 不是会诊订单
const statusArr = ["已拒收", '待收诊', '已排期', '会诊中', '待反馈', '已完成'];
const referralStatusArr = ["已拒收", '待收诊', '已排期', '已完成'];

/** 根据 不同角色 渲染 基础页面 元素 */
function renderViewByRole(applyStatus) {
    /** 动态创建进度条 */

    if (isInvite && isConsultation) {
        let str = '';
        for (let i = 1; i < statusArr.length; i++) {
            str += '<li>' + statusArr[i] + '</li>';
            $('.progressBar').html(str);
        }
        if (applyStatus === "CONSULTATION_APPLY_ACCEDE") {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
            $(".modifier3").show();
            $(".modifier5").show();
            $("#refuseConsultationBtn").show();
            if (inviteDoctorCount > 2) {
                $("#MDTConsultationBtn").show();
            } else {
                $("#receiveConsultationBtn").show();
            }
        } else if (applyStatus === "CONSULTATION_SLAVE_ACCEDE" || applyStatus === "CONSULTATION_MASTER_ACCEDE") {
            //排期审核
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
            $(".rejection").show();
            $(".modifier3").show();
            $(".modifier5").show();
            $("#refuseConsultationBtn").show();
            $("#examineConsultationBtn").show();

        } else if (applyStatus === "CONSULTATION_SLAVE_REJECT") {
            //专家协调
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
            $(".rejection").show();
            $(".modifier3").show();
            $(".modifier5").show();
            $("#toBeMDTConsultationBtn").show();
            $("#refuseConsultationBtn").show();

        } else if (applyStatus === "CONSULTATION_DATETIME_LOCKED") {
            //已排期
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".modifier2").show();
            $("#refuseConsultationBtn").show();

        } else if (applyStatus === "CONSULTATION_BEGIN") {
            //会诊中
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".modifier2").show();
            $("#refuseConsultationBtn").show();
            if (isVideo) {
                $("#entryConsultationRoomBtn").show();
            }
        } else if (applyStatus === "CONSULTATION_REPORT_SUBMITTED") {
            //待反馈
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $("#applyRecord").show();
            if (hasDoctorEnjoin) {
                $("#doctorEnjoinTitle").show();
                $("#doctorEnjoinBody").show();
            }
            applyRecordNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            $("#applyRecord").show();
            $("#consultantFeedback").show();
            if (hasDoctorEnjoin) {
                $("#doctorEnjoinTitle").show();
                $("#doctorEnjoinBody").show();
            }
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

    } else if (isConsultation) {
        let str = '';
        for (let i = 1; i < statusArr.length; i++) {
            str += '<li>' + statusArr[i] + '</li>';
            $('.progressBar').html(str);
        }
        if (applyStatus === "CONSULTATION_APPLY_CREATE_SUCCESS") {
            //创建成功
            $(".progressBar").hide();
            $(".modifier1").show();
            $(".modifier3").show();
            $(".modifier5").show();
            $(".modifier22").show();
            $("#sendBackConsultationBtn").show();
            $("#auditConsultationBtn").show();
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
            if (hasDoctorEnjoin) {
                $("#doctorEnjoinTitle").show();
                $("#doctorEnjoinBody").show();
            }
            applyRecordNavigationShow = true;
        } else if (applyStatus === "CONSULTATION_END") {
            //已完成
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".progressBar li:nth-child(2)").addClass("libg");
            $(".progressBar li:nth-child(3)").addClass("libg");
            $(".progressBar li:nth-child(4)").addClass("libg");
            $(".progressBar li:nth-child(5)").addClass("libg");
            $("#applyRecord").show();
            $("#consultantFeedback").show();
            if (hasDoctorEnjoin) {
                $("#doctorEnjoinTitle").show();
                $("#doctorEnjoinBody").show();
            }
            applyRecordNavigationShow = true;
            consultantFeedbackNavigationShow = true;
        } else {
            //待收诊
            $(".progressBar li:nth-child(1)").addClass("libg");
            $(".modifier2").show();
        }
    } else {
        $('#adminConsultationDoctor').hide();
        $(".modifier2").show();
        if (isInvite) {
            $('.progressBar').empty();
            let referralStatus = '';
            for (var i = 1; i < referralStatusArr.length; i++) {
                referralStatus += '<li style="width: 400px;">' + referralStatusArr[i] + '</li>';
                $('.progressBar').html(referralStatus);
            }
            $(".progressBar li:nth-child(1)").addClass("libg");
            if (applyStatus === "INQUIRY_APPLY_ACCEDE") {
                //待收诊
                $(".modifier3").show();
                $("#refuseReferralBtn").show();
                $("#receiveReferralBtn").show();
            } else if (applyStatus === "INQUIRY_SLAVE_ACCEDE") {
                //排期审核
            } else if (applyStatus === "INQUIRY_DATETIME_LOCKED") {
                //已排期
                $(".progressBar li:nth-child(2)").addClass("libg");
            } else if (applyStatus === "INQUIRY_MASTER_REJECT" || applyStatus === "INQUIRY_APPLY_REJECT" || applyStatus === "INQUIRY_SLAVE_REJECT") {
                //已拒收
                $("#refuseReasonBox").show();
                $('.progressBar').empty();
                referralStatus = '<li class="libg" style="width: 100%">' + '已拒收' + '</li>';
                $('.progressBar').html(referralStatus);
            } else if (applyStatus === "INQUIRY_END") {
                //已结束

            }
        } else {
            $('.progressBar').empty();
            let referralStatus = '';
            for (var i = 1; i < referralStatusArr.length; i++) {
                referralStatus += '<li style="width: 400px;">' + referralStatusArr[i] + '</li>';
                $('.progressBar').html(referralStatus);
            }
            $(".progressBar li:nth-child(1)").addClass("libg");
            if (applyStatus === "INQUIRY_APPLY_CREATE_SUCCESS") {
                //待审核
                $(".modifier1").show();
                $(".modifier3").show();
                $(".modifier5").show();

                $('.progressBar').hide();
                $('#applyTime').hide();
                $('#applyNumber').hide();
                $('.layui-timeline').hide();

                $("#sendBackReferralBtn").show();
                $("#throughReferralBtn").show();

            } else if (applyStatus === "INQUIRY_APPLY_ACCEDE") {
                //待收诊
                $("#rejectionReferral").show();
                $("#receiveReferral").show();
            } else if (applyStatus === "INQUIRY_SLAVE_ACCEDE") {
                //排期审核

            } else if (applyStatus === "INQUIRY_DATETIME_LOCKED") {
                //已排期
                $(".progressBar li:nth-child(2)").addClass("libg");
            } else if (applyStatus === "INQUIRY_MASTER_REJECT" || applyStatus === "INQUIRY_APPLY_REJECT" || applyStatus === "INQUIRY_SLAVE_REJECT") {
                //已拒收
                $("#refuseReasonBox").show();
                $('.progressBar').empty();
                referralStatus = '<li class="libg" style="width: 100%">' + '已拒收' + '</li>';
                $('.progressBar').html(referralStatus);
            } else if (applyStatus === "INQUIRY_END") {
                //已结束

            }
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

/** 渲染 医嘱 */
function renderDoctorEnjoin(doctorEnjoinJsonStr) {

    let doctorEnjoinJson = JSON.parse(doctorEnjoinJsonStr)
    console.log(hasDoctorEnjoin)
    console.log(doctorEnjoinJson)
    if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0){
        let _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">长期医嘱</p><a class="printBtn no-print" href="">下载</a></h2>\
            <div class="oneList">'
        for(let i = 0;i < doctorEnjoinJson.longTimeArr.length;i++){
            let twoLevel = doctorEnjoinJson.longTimeArr[i].drugArr;
            _html += '<div class="oneListItem">\
                    <p class="headTop">'+((i+1)<10?"0"+(i+1):(i+1))+'-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;执行时间：'+doctorEnjoinJson.longTimeArr[i].startTime+'&nbsp;&nbsp;&nbsp;&nbsp;结束时间：'+doctorEnjoinJson.longTimeArr[i].endTime+'</p>\
                    <div class="twoList">'
            for(let j = 0;j < twoLevel.length;j++){
                if(j == 0){
                    _html += '<p class="twoListItem"><b>'+twoLevel[j].name+'</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次'+twoLevel[j].singleNum+twoLevel[j].unit+'；'+twoLevel[j].frequency+'；'+twoLevel[j].means+'</p>'
                } else {
                    _html += '<p class="twoListItem"><b>'+twoLevel[j].name+'</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次'+twoLevel[j].singleNum+twoLevel[j].unit+'；</p>'
                }
            }
            _html += '</div>\
                </div>\
                <p class="boundary"></p>';
        }
        _html += '<p class="remarkBox">备注：'+doctorEnjoinJson.longTimeArea+'</p></div></div>';
        $(".doctorEnjoinBody").append(_html);
    }
    if(doctorEnjoinJson.temporaryDrugArr || doctorEnjoinJson.temporaryTreatArr){
        let _html;
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0){
             _html = '<div class="chunkContent"><h2><span>02</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="">下载</a></h2><div class="oneList">'
        } else {
             _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="">下载</a></h2><div class="oneList">'
        }
        if(doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0){
            for(let i = 0;i < doctorEnjoinJson.temporaryDrugArr.length;i++){
                let twoLevel = doctorEnjoinJson.temporaryDrugArr[i].drugArr;
                _html += '<div class="oneListItem">\
                    <p class="headTop">'+((i+1)<10?"0"+(i+1):(i+1))+'-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下达时间：'+doctorEnjoinJson.temporaryDrugArr[i].arriveTime+'</p>\
                    <div class="twoList">'
                for(let j = 0;j < twoLevel.length;j++){
                    if(j == 0){
                        _html += '<p class="twoListItem"><b>'+twoLevel[j].name+'</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次'+twoLevel[j].singleNum+twoLevel[j].unit+'；'+twoLevel[j].means+'</p>'
                    } else {
                        _html += '<p class="twoListItem"><b>'+twoLevel[j].name+'</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次'+twoLevel[j].singleNum+twoLevel[j].unit+'；</p>'
                    }
                }
                _html += '</div>\
                </div>\
                <p class="boundary"></p>';
            }
        }
        if(doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0){
            let tempNum;
            if(doctorEnjoinJson.temporaryDrugArr){
                tempNum = doctorEnjoinJson.temporaryDrugArr.length;
            } else {
                tempNum = 0;
            }
            for(let i = 0;i < doctorEnjoinJson.temporaryTreatArr.length;i++){
                _html += '<div class="oneListItem">\
                <p class="headTop">'+((tempNum+i+1)>10?(tempNum+i+1):'0'+(tempNum+i+1))+'-诊疗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下达时间：'+doctorEnjoinJson.temporaryTreatArr[i].arriveTime+'</p>\
                <div class="twoList">\
                    <p class="twoListItem"><b>'+doctorEnjoinJson.temporaryTreatArr[i].name+'</b></p>\
                </div>\
            </div><p class="boundary"></p>'
            }
        }
        _html += '<p class="remarkBox">备注：'+doctorEnjoinJson.temporaryArea+'</p></div></div>';
        $(".doctorEnjoinBody").append(_html);
    }
    if(doctorEnjoinJson.surgeryArr && doctorEnjoinJson.surgeryArr.length > 0){
        let _html;
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryDrugArr &&doctorEnjoinJson.temporaryDrugArr.length > 0){
             _html = '<div class="chunkContent">\
            <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryTreatArr &&doctorEnjoinJson.temporaryTreatArr.length > 0){
             _html = '<div class="chunkContent">\
                <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryDrugArr &&doctorEnjoinJson.temporaryDrugArr.length > 0){
             _html = '<div class="chunkContent">\
            <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryTreatArr &&doctorEnjoinJson.temporaryTreatArr.length > 0){
             _html = '<div class="chunkContent">\
                <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
        if(!doctorEnjoinJson.longTimeArr && !doctorEnjoinJson.temporaryTreatArr && !doctorEnjoinJson.temporaryDrugArr){
             _html = '<div class="chunkContent">\
                <h2><span>01</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
        _html += '<div class="oneList">\
                    <div class="oneListItem">\
                        <div class="twoList">'
        for(let i = 0;i < doctorEnjoinJson.surgeryArr.length;i++){
            _html += '<p class="twoListItem"><b>'+((i+1)>10?(i+1):'0'+(i+1))+"&nbsp;&nbsp;&nbsp;&nbsp;"+doctorEnjoinJson.surgeryArr[i].surgeryName+'&nbsp;&nbsp;&nbsp;&nbsp;'+doctorEnjoinJson.surgeryArr[i].surgerySize+"&nbsp;&nbsp;&nbsp;&nbsp;"+doctorEnjoinJson.surgeryArr[i].surgeryNum+'</b></p>';
        }
        _html += '</div>\
                    </div>\
                    <p class="boundary"></p>\
                    <p class="remarkBox">备注：'+doctorEnjoinJson.surgeryArea+'</p>\
                </div>\
            </div>';
        $(".doctorEnjoinBody").append(_html);
    }
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
                    if (fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg') {
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
            applyTimeList = result.applyTimeList;
            renderApplyTimeView(applyTimeList);
        }
    }

}

/** 查询订单详情 */
function getApplyInfo() {
    /** 获取缓存 订单ID*/
    applyFormId = sessionStorage.getItem('applyFormId');
    isInvite = eval(sessionStorage.getItem('isInvite'));
    let formData = {"applyFormId": applyFormId};
    ajaxRequest("GET", getApplyInfoUrl, formData, true, "application/json", false, getApplyInfoSuccess, null, null);

    function getApplyInfoSuccess(result) {
        sessionStorage.setItem('applyInfo', JSON.stringify(result));
        /** 当前登陆人 信息*/
        userInfo = JSON.parse(sessionStorage.getItem('userInfo'));                        //当前登陆用户信息
        /** 当前申请 详细信息 */
        applyInfo = JSON.parse(sessionStorage.getItem('applyInfo'));                      //会诊/转诊申请信息
        applyFormId = applyInfo.id;                                                             //申请ID
        applyTypeStr = applyInfo.applyType;                                                     //申请类型标识
        applyStatus = applyInfo.applyStatus;                                                    //申请状态标识
        isReferral = applyTypeStr === "APPLY_REFERRAL" ? true : false;                          //转诊申请标识
        isConsultation = applyTypeStr === "APPLY_REFERRAL" ? false : true;                      //会诊申请标识
        isInvite = userInfo.hospitalId === applyInfo.inviteHospitalId ? true : false;           //受邀医院标识
        isApply = userInfo.hospitalId === applyInfo.applyHospitalId ? true : false;             //申请医院方标识
        inviteDoctorCount = applyInfo.inviteSummary.split(";").length;                          //受邀医生数量
        caseContentList = applyInfo.caseContentList;                                            //病历附件数据
        applyTimeList = applyInfo.applyTimeList;                                                //申请时间数据
        applyNodeList = applyInfo.applyNodeList;                                                //时间轴数据
    }
}

/** 操作提示弹窗 */
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

$(function () {
    getApplyInfo();

    if (isReferral) {
        $("#consultationPriceView").hide();
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
    isVideo = applyInfo.applyType === "APPLY_CONSULTATION_VIDEO" ? true : false;
    //订单编号
    $('.numbers').html(applyInfo.applyNumber);
    //申请时间
    $('.applyDate').html(applyInfo.consultantApplyTime);
    // 发件人信息
    $('.recipientsInfo').html(applyInfo.applySummary);
    // 收件人信息
    $('.addresserInfo').html(applyInfo.inviteSummary);
    renderApplyTimeView(applyTimeList);
    /**会诊报告*/
    if (applyInfo.consultantReport) {
        consultantReport = JSON.parse(applyInfo.consultantReport);

    }
    let recordHtml = '';
    for (let item of consultantReport) {
        recordHtml += '<pre class="report">' + item.doctorName + ':<br />' + item.report + '</pre>'
        if (item.doctorEnjoin) {
            hasDoctorEnjoin = true;
            renderDoctorEnjoin(item.doctorEnjoin);
        }
    }
    $('.lecturer_modules').append(recordHtml);
    //    临床反馈
    $('.applyFeedBack').html(applyInfo.consultantFeedback);
    //如果是图文会诊
    if (isVideo) {
        $('#consultationDateTimeBox').show();
        $('#referralDateTimeBox').hide();
    } else if (isReferral) {
        $('#referralDateTimeBox').show();
        $('#consultationDateTimeBox').hide();
    } else {
        $('#referralDateTimeBox').hide();
        $('#consultationDateTimeBox').hide();
    }

    /** 诊费 */
    let consultantPrice = applyInfo.consultantPrice;
    let hospitalPrice = applyInfo.hospitalPrice;
    if (applyInfo.consultantUserList) {
        consultantUserList = JSON.parse(applyInfo.consultantUserList);
    }
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
    $('.cutSch').click(function () {
        $(this).toggleClass("foundBtn");
        $('.schedule_modules').toggle(500);
    });
    // 修改排期
    $('#updateConsultationDateTimeBtn').click(function () {
        if (isInvite) {
            isOnly = true;
        } else {
            isOnly = false;
        }
        showTimeView(applyTimeList);
    });

    /** 返回按钮 */
    $('.getBack').click(function () {
        window.location = '../page/administrator.html'
    });
    renderViewByRole(applyStatus);
});
