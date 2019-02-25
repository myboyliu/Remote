const _$ = layui.jquery;
let fileAllArr = []; //所有图片原始资源
let inviteDoctorArray = [];// 选择的医生信息数组
// 不选医生信息
let hospitalInfo = {};// id hospitalName hospitalPhone hospitalImgPic hospitalVideoPic branchId
// 不选医生的字符串
let scaleNum = 10;// 图片缩放倍数
//姓名 身份证号 验证
let deptId = "";
//转诊时间表
let referralDateList = [];

let fileArr = []; // 当前点击块的文件数据
let indexFile = 0; // 当前点击的索引
let ObjArr = []; //  当前点击块文件数组对象
let selectFileArr = []; // 某一块的图片展示数据
let uploadFile = [];
let fileIndex;
let dateList = [];
let isDraft = false;
let casePatientId = "";
let caseRecordId = "";
let draftId = "";

/** 渲染 病历页面 左侧导航 */
function renderCaseTypeLeftNavigation(data) {
    let _html = '<li class="oneLevelItem patientInfo active">\
                    <p class="oneLevelName">患者基本信息</p>\
                </li>\
                <li class="oneLevelItem caseHistory">\
                    <p class="oneLevelName">电子病历附件</p>\
                    <ul class="twoLevelUl">';
    $.each(data, function (key, val) {
        _html += '<li class="twoLevelItem">\
                                <p class="twoLevelName">' + val.caseTypeName + '</p>\
                                <ul class="threeLevelUl">';
        const childCaseTypeList = val.childList;
        for (let i = 0; i < childCaseTypeList.length; i++) {
            _html += '<li class="threeLevelItem" name="' + childCaseTypeList[i].id + '">' + childCaseTypeList[i].caseTypeName + '</li>'
        }
        _html += '</ul>\
                            </li>'
    })
    _html += '</ul>\
            </li>'
    $('.oneLevelUl').html(_html);
    $('.oneLevelItem').eq(0).addClass('active').find('.twoLevelUl').show().find('.twoLevelItem').eq(0).addClass('active').find('.tthreeLevelUl').slideDown();
    $('.oneLevelUl').css({
        'width': '145px',
        'position': 'fixed',
    });
    $('.twoLevelUl').css({
        'height': $(window).height() - 230 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
    });

    let upfileHtml = '';
    $.each(data, function (key, val) {
        const childCaseTypeList = val.childList;
        for (let i = 0; i < childCaseTypeList.length; i++) {
            upfileHtml += '<li name="' + childCaseTypeList[i].caseTypeName + '" id="' + childCaseTypeList[i].id + '" class="upfileItem clearfix">\
                            <div class="upfileContent">\
                                <div class="operateLeft">' + val.caseTypeName + '-' + childCaseTypeList[i].caseTypeName + '</div>\
                                <ul class="fileContent clearfix">\
                                    <li class="fileAdd">\
                                        <a class="addfileBtn" href="javascript:;"></a>\
                                        <input accept=".png,.jpg,.pdf,.jpeg,.dcm" class="fileInput" type="file" multiple>\
                                        <p class="fileName">添加文件</p>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>'
        }
    });
    $('.upfileUl').html(upfileHtml);
}

/** 渲染 医生页面 左侧导航 */
function renderDoctorNavigation(data) {
    let _html = '';
    for (let i = 0; i < data.length; i++) {
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
                _html += '<li id="' + deptArr[x].id + '" name="' + deptArr[x].id + '" class="deptItem" title="' + deptArr[x].customName + '">' + deptArr[x].customName + '</li>'
            }
            _html += '</ul>\
                         </li>'
        }
        _html += '</ul>\
                    </li>'
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

    hospitalInfo["id"] = data[0].id;
    hospitalInfo["hospitalName"] = data[0].hospitalName;
    hospitalInfo["hospitalPhone"] = data[0].hospitalPhone;
    hospitalInfo["hospitalImgPrice"] = data[0].consultationPicturePrice;
    hospitalInfo["hospitalVideoPrice"] = data[0].consultationVideoPrice;
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
                            <p class="p1" hospitalVideoPic="' + hospitalInfo.hospitalVideoPrice + '" hospitalImgPic="' + hospitalInfo.hospitalImgPrice + '" deptId="' + hospitalInfo.branchId + '" name="' + hospitalInfo.id + '">' + hospitalInfo.hospitalName + '</p>\
                            <p class="p4">选择此项,申请将发送至对方医院远程中心,由医务人员为您调度医生资源,诊费会在选定医生后确定。<br />请将您的备注信息填至【会/转诊目的】 </p>\
                        </div>\
                    </li>';
    let currentUserId = sessionStorage.getItem('token');
    for (let i = 0; i < data.length; i++) {
        if (currentUserId === data[i].id) {
            continue;
        }
        _html += '<li id="' + data[i].id + '" deptName="' + hospitalInfo.branchName + '" deptId="' + hospitalInfo.branchId + '" name="' + data[i].id + '" class="doctorChunk">\
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

/** 展示选择的医生 */
function favoriteHtml() {
    let _html = "";
    $('.doctorCount').html(inviteDoctorArray.length);
    if (inviteDoctorArray.length === 0) {
        _html = '<li class="clearfix"><span>主会诊人:未选择</span></li>';
        $('.imgPric').html(hospitalInfo.hospitalImgPrice ? hospitalInfo.hospitalImgPrice : '-');
        $('.videoPric').html(hospitalInfo.hospitalVideoPrice ? hospitalInfo.hospitalVideoPrice : '-');
    } else {
        let imgPric = Number(inviteDoctorArray[0].hospitalImgPrice);
        let videoPric = Number(inviteDoctorArray[0].hospitalVideoPrice);
        for (let i = 0; i < inviteDoctorArray.length; i++) {
            if (i === 0) {
                _html += '<li class="clearfix"><span>主会诊人:<' + inviteDoctorArray[i].hospitalName + ';' + inviteDoctorArray[i].branchName + ';' + inviteDoctorArray[i].doctorName + ';' + inviteDoctorArray[i].doctorTitleName + '>;</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
            } else {
                _html += '<li class="clearfix"><span><' + inviteDoctorArray[i].hospitalName + ';' + inviteDoctorArray[i].branchName + ';' + inviteDoctorArray[i].doctorName + ';' + inviteDoctorArray[i].doctorTitleName + '>;</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
            }
            imgPric += Number(inviteDoctorArray[i].doctorPicturePrice);
            videoPric += Number(inviteDoctorArray[i].doctorVideoPrice);
        }
        $('.imgPric').html(imgPric);
        $('.videoPric').html(videoPric);
    }
    $('.favoriteUl').html(_html);
}

/** 根据二级科室id查询医生 */
function getDoctorByBranchId(deptId) {
    deptId = deptId;
    const data = {"branchId": deptId};
    ajaxRequest("GET", getDoctorListByBranchIdUrl, data, true, "application/json", false, renderDoctorList, null, null);
}

/** 修改草稿病历 */
function updateDraftCaseData(successCallBack) {
    let data = new FormData();
    let caseContentArray = [];
    if (fileAllArr.length > 0) {
        // 图片描述和类型
        const descArr = $('.upfileUl > li.upfileItem');
        for (let i = 0; i < descArr.length; i++) {
            const fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
            for (let j = 0; j < fileLi.length; j++) {
                caseContentArray.push({
                    contentTypeId: descArr.eq(i).attr("id"),
                    contentPath: fileLi.eq(j).find("p.fileName").html(),
                    contentRemark: fileLi.eq(j).find("p.fileName").attr("desc"),
                    orderWeight: j
                })
            }
        }
    }
    let patientSex = $('.sex > a.active').html();
    let patientAge = $('#age').val() + $('.choiceAge').val();
    let caseDiagnosis = $('#createCase_textDiagnose').val();
    //患者信息
    data.append("casePatientId", casePatientId);
    data.append("patientName", $('#username').val());
    data.append("patientCard", $('#idCard').val());
    data.append("patientPhone", $('#phone').val());
    data.append("detailAddress", $('#address').val());
    //病历信息
    data.append("caseRecordId", caseRecordId);
    data.append("patientAge", $('#age').val());// + $('.choiceAge').val()
    data.append("patientSex", patientSex);
    data.append("patientHeight", $('#high').val());
    data.append("patientWeight", Number($('#weight').val()) * 1000);
    data.append("caseDiagnosis", caseDiagnosis); //初步诊断
    data.append("weightPathTypeId", JSON.stringify(caseContentArray)); //病历附件信息
    let caseSummary = "***/" + patientSex + "/" + patientAge + "/" + caseDiagnosis;

    /** 提交病历信息*/
    ajaxRequest("POST", updateDraftCase, data, false, false, true, createCaseSuccess, failedParam, null);

    function failedParam(data) {
        layer.closeAll();
        layer.msg(data.result);
    }

    function createCaseSuccess(result) {
        successCallBack(result.id, caseSummary);
    }
}

function updateCaseData(successCallBack) {
    let data = new FormData();
    let caseContentArray = [];
    if (fileAllArr.length > 0) {
        // 图片描述和类型
        const descArr = $('.upfileUl > li.upfileItem');
        for (let i = 0; i < descArr.length; i++) {
            const fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
            for (let j = 0; j < fileLi.length; j++) {
                caseContentArray.push({
                    contentTypeId: descArr.eq(i).attr("id"),
                    contentPath: fileLi.eq(j).find("p.fileName").html(),
                    contentRemark: fileLi.eq(j).find("p.fileName").attr("desc"),
                    orderWeight: j
                })
            }
        }
    }
    let patientSex = $('.sex > a.active').html();
    let patientAge = $('#age').val() + $('.choiceAge').val();
    let caseDiagnosis = $('#createCase_textDiagnose').val();
    //患者信息
    data.append("casePatientId", casePatientId);
    data.append("patientName", $('#username').val());
    data.append("patientCard", $('#idCard').val());
    data.append("patientPhone", $('#phone').val());
    data.append("detailAddress", $('#address').val());
    //病历信息
    data.append("caseRecordId", caseRecordId);
    data.append("patientAge", $('#age').val());// + $('.choiceAge').val()
    data.append("patientSex", patientSex);
    data.append("patientHeight", $('#high').val());
    data.append("patientWeight", Number($('#weight').val()) * 1000);
    data.append("caseDiagnosis", caseDiagnosis); //初步诊断
    data.append("weightPathTypeId", JSON.stringify(caseContentArray)); //病历附件信息
    let caseSummary = "***/" + patientSex + "/" + patientAge + "/" + caseDiagnosis;

    /** 提交病历信息*/
    ajaxRequest("POST", draftFullCase, data, false, false, true, createCaseSuccess, failedParam, null);

    function failedParam(data) {
        layer.closeAll();
        layer.msg(data.result);
    }

    function createCaseSuccess(result) {
        successCallBack(result.id, caseSummary);
    }
}

/** 创建不完整病历 */
function createHalfCase(successCallBack) {
    let data = new FormData();
    let caseContentArray = [];
    if (fileAllArr.length > 0) {
        // 图片描述和类型
        const descArr = $('.upfileUl > li.upfileItem');
        for (let i = 0; i < descArr.length; i++) {
            const fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
            for (let j = 0; j < fileLi.length; j++) {
                caseContentArray.push({
                    contentTypeId: descArr.eq(i).attr("id"),
                    contentPath: fileLi.eq(j).find("p.fileName").html(),
                    contentRemark: fileLi.eq(j).find("p.fileName").attr("desc"),
                    orderWeight: j
                })
            }
        }
    }
    let patientSex = $('.sex > a.active').html();
    let patientAge = $('#age').val() + $('.choiceAge').val();
    let caseDiagnosis = $('#createCase_textDiagnose').val();
    //患者信息
    data.append("patientName", $('#username').val());
    data.append("patientCard", $('#idCard').val());
    data.append("patientPhone", $('#phone').val());
    data.append("detailAddress", $('#address').val());
    //病历信息
    data.append("patientAge", $('#age').val());// + $('.choiceAge').val()
    data.append("patientSex", patientSex);
    data.append("patientHeight", $('#high').val());
    if (Number($('#weight').val()) > 1) {
        data.append("patientWeight", Number($('#weight').val()) * 1000);
    }
    data.append("caseDiagnosis", caseDiagnosis); //初步诊断
    data.append("weightPathTypeId", JSON.stringify(caseContentArray)); //病历附件信息
    let caseSummary = "***/" + patientSex + "/" + patientAge + "/" + caseDiagnosis;

    /** 提交病历信息*/
    ajaxRequest("POST", insertHalfCase, data, false, false, true, createCaseSuccess, failedParam, null);

    function failedParam(data) {
        layer.closeAll();
        let errorMsg = data.result;
        if (errorMsg.patientName) {
            layer.msg("患者姓名错误!");
        } else if (errorMsg.patientWeight) {
            layer.msg("体重数值错误!");
        } else {
            layer.msg(errorMsg);
        }
    }

    function createCaseSuccess(result) {
        successCallBack(result.id, caseSummary);
    }
}

/** 创建完整病历 */
function buildCaseData(successCallBack) {
    let data = new FormData();
    let caseContentArray = [];
    if (fileAllArr.length > 0) {
        // 图片描述和类型
        const descArr = $('.upfileUl > li.upfileItem');
        for (let i = 0; i < descArr.length; i++) {
            const fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
            for (let j = 0; j < fileLi.length; j++) {
                caseContentArray.push({
                    contentTypeId: descArr.eq(i).attr("id"),
                    contentPath: fileLi.eq(j).find("p.fileName").html(),
                    contentRemark: fileLi.eq(j).find("p.fileName").attr("desc"),
                    orderWeight: j
                })
            }
        }
    }
    let patientSex = $('.sex > a.active').html();
    let patientAge = $('#age').val() + $('.choiceAge').val();
    let caseDiagnosis = $('#createCase_textDiagnose').val();
    //患者信息
    data.append("patientName", $('#username').val());
    data.append("patientCard", $('#idCard').val());
    data.append("patientPhone", $('#phone').val());
    data.append("detailAddress", $('#address').val());
    //病历信息
    data.append("patientAge", $('#age').val());// + $('.choiceAge').val()
    data.append("patientSex", patientSex);
    data.append("patientHeight", $('#high').val());
    data.append("patientWeight", Number($('#weight').val()) * 1000);
    data.append("caseDiagnosis", caseDiagnosis); //初步诊断
    data.append("weightPathTypeId", JSON.stringify(caseContentArray)); //病历附件信息
    let caseSummary = "***/" + patientSex + "/" + patientAge + "/" + caseDiagnosis;

    /** 提交病历信息*/
    ajaxRequest("POST", createCaseUrl, data, false, false, true, createCaseSuccess, failedParam, null);

    function failedParam(data) {
        layer.closeAll();
        let errorMsg = data.result;
        if (errorMsg.patientName) {
            layer.msg("患者姓名错误!");
        } else {
            layer.msg(errorMsg);
        }

    }

    function createCaseSuccess(result) {
        successCallBack(result.id, caseSummary);
    }
}

/** 创建草稿*/
function createDraftApplyData(caseId, caseSummary) {
    const data = new FormData();
    if (isDraft) {
        data.append('draftId', draftId); //病历ID
    }
    data.append('applyUrgent', $('.urgent > a.active').attr('value'));
    data.append('applyRemark', $('#createCase_textGola').val());
    data.append("caseSummary", caseSummary);
    data.append("caseRecordId", caseId);

    if (inviteDoctorArray.length > 0) {
        let doctorList = [];
        let consultantReport = [];
        data.append('inviteHospitalId', inviteDoctorArray[0].hospitalId);
        data.append('inviteBranchId', inviteDoctorArray[0].branchId);
        data.append('inviteUserId', inviteDoctorArray[0].doctorId);
        data.append('hospitalPrice', "0");
        let inviteSummary = "";
        for (let i = 0; i < inviteDoctorArray.length; i++) {
            let inviteDoctor = "<" + inviteDoctorArray[i].doctorName + "/" + inviteDoctorArray[i].doctorTitleName + "/" + inviteDoctorArray[i].branchName + "/" + inviteDoctorArray[i].hospitalName + ">";
            doctorList.push({
                "doctorName": inviteDoctor,
                "doctorId": inviteDoctorArray[i].doctorId,
                "price": "0",
                "branchId": inviteDoctorArray[i].branchId,
                "doctorPicturePrice": inviteDoctorArray[i].doctorPicturePrice,
                "doctorVideoPrice": inviteDoctorArray[i].doctorVideoPrice,
                "hospitalImgPrice": inviteDoctorArray[i].hospitalImgPrice,
                "hospitalVideoPrice": inviteDoctorArray[i].hospitalVideoPrice,
            });
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
    } else {
        data.append("inviteSummary", "<" + hospitalInfo.hospitalName + ">");
        data.append('inviteHospitalId', hospitalInfo.id);
        if ($('.videoPric').html() !== "-"){
            data.append('inviteBranchId', hospitalInfo.branchId);
        }
        data.append('hospitalPrice', "0");
    }
    ajaxRequest("POST", createDraft, data, false, false, true, createDraftSuccess, null, null);

    //添加成功
    function createDraftSuccess(result) {
        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['340px', '200px'],
            shade: 0.01,
            time: 2000,
            content: _$('.storage'),
        });
        sessionStorage.setItem('draftId', result.id);
        location.href = "../page/createCase.html?isDraft";
    }
}

/** 创建图文会诊申请*/
function createPictureApplyData(caseId, caseSummary) {
    const data = new FormData();
    if (isDraft) {
        data.append('draftId', draftId); //病历ID
    }
    data.append("caseRecordId", caseId); //病历ID
    data.append("caseSummary", caseSummary); //病历摘要信息
    data.append("applyUrgent", $('.urgent > a.active').attr('value')); //是否加急(1是0不是)
    data.append("applyRemark", $('#createCase_textGola').val()); //会诊目的
    data.append("consultantPrice", $('.imgPric').html()); // 费用

    if (inviteDoctorArray.length > 0) {
        let doctorList = [];
        let consultantReport = [];
        data.append('inviteHospitalId', inviteDoctorArray[0].hospitalId); // 会诊医院id
        data.append('inviteBranchId', inviteDoctorArray[0].branchId); // 主会诊科室id
        data.append('inviteUserId', inviteDoctorArray[0].doctorId);
        data.append('hospitalPrice', inviteDoctorArray[0].hospitalImgPrice); // 医院图文基本价格
        let inviteSummary = "";
        for (let i = 0; i < inviteDoctorArray.length; i++) {
            let inviteDoctor = "<" + inviteDoctorArray[i].doctorName + "/" + inviteDoctorArray[i].doctorTitleName + "/" + inviteDoctorArray[i].branchName + "/" + inviteDoctorArray[i].hospitalName + ">";
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
    } else {
        data.append("inviteSummary", "<" + hospitalInfo.hospitalName + ">");
        data.append('inviteHospitalId', hospitalInfo.id);
        data.append('inviteBranchId', hospitalInfo.branchId);
        data.append('hospitalPrice', hospitalInfo.hospitalImgPrice); // 医院图文基本价格
    }
    ajaxRequest("POST", createPictureApplyUrl, data, false, false, true, createPictureApplySuccess, requestField, null);

    function createPictureApplySuccess(result) {

        sessionStorage.setItem('sendOrderData', JSON.stringify(result));

        window.location = '../page/sendSuccess.html';
    }
}

/** 创建视频会诊*/
function createVideoApplyData(caseId, caseSummary) {
    const data = new FormData();
    if (isDraft) {
        data.append('draftId', draftId); //病历ID
    }
    data.append('caseRecordId', caseId); //病历ID
    data.append("caseSummary", caseSummary); //病历摘要信息
    data.append('applyUrgent', $('.urgent > a.active').attr('value')); //是否加急(1加急/是，0不加急/否)
    data.append('applyRemark', $('#createCase_textGola').val()); //会诊目的
    data.append('consultantPrice', $('.videoPric').html()); // 费用

    if (inviteDoctorArray.length > 0) {
        const doctorList = [];
        let consultantReport = [];
        data.append('inviteHospitalId', inviteDoctorArray[0].hospitalId); // 会诊医院id
        data.append('inviteBranchId', inviteDoctorArray[0].branchId); // 主会诊科室id
        data.append('inviteUserId', inviteDoctorArray[0].doctorId);
        data.append('hospitalPrice', inviteDoctorArray[0].hospitalVideoPrice); // 医院视频基本价格
        let inviteSummary = "";
        for (let i = 0; i < inviteDoctorArray.length; i++) {
            let inviteDoctor = "<" + inviteDoctorArray[i].doctorName + "/" + inviteDoctorArray[i].doctorTitleName + "/" + inviteDoctorArray[i].branchName + "/" + inviteDoctorArray[i].hospitalName + ">";
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
    } else {
        data.append("inviteSummary", "<" + hospitalInfo.hospitalName + ">");
        data.append('inviteHospitalId', hospitalInfo.id);
        data.append('inviteBranchId', hospitalInfo.branchId);
        data.append('hospitalPrice', hospitalInfo.hospitalVideoPrice); // 医院视频基本价格
    }
    // 选择时间数组
    data.append('startEndTime', JSON.stringify(dateList));
    ajaxRequest("POST", createVideoApplyUrl, data, false, false, true, createVideoApplySuccess, requestField, null);

    function createVideoApplySuccess(result) {
        sessionStorage.setItem('sendOrderData', JSON.stringify(result));
        window.location = '../page/sendSuccess.html';
    }

}

/** 创建转诊申请*/
function createReferralApplyData(caseId, caseSummary) {

    let inviteSummary;

    const data = new FormData();
    if (isDraft) {
        data.append('draftId', draftId); //病历ID
    }
    data.append('caseRecordId', caseId); //病历ID
    data.append('caseSummary', caseSummary); //病历摘要信息
    data.append('applyUrgent', $('.urgent > a.active').attr('value')); //是否加急(1加急/是，0不加急/否)
    data.append('applyRemark', $('#createCase_textGola').val()); //会诊目的
    data.append('startEndTime', JSON.stringify(referralDateList));
    if (inviteDoctorArray.length > 0) {
        inviteSummary = "<" + inviteDoctorArray[0].doctorName + "/" + inviteDoctorArray[0].doctorTitleName + "/" + inviteDoctorArray[0].branchName + "/" + inviteDoctorArray[0].hospitalName + ">";
        data.append('inviteSummary', inviteSummary); //受邀医生摘要信息
        data.append('inviteHospitalId', inviteDoctorArray[0].hospitalId); // 会诊医院id
        data.append('inviteBranchId', inviteDoctorArray[0].branchId); // 会诊科室id
        data.append('inviteUserId', inviteDoctorArray[0].doctorId);
    } else {
        data.append("inviteSummary", "<" + hospitalInfo.hospitalName + ">");
        data.append('inviteHospitalId', hospitalInfo.id);
        data.append('inviteBranchId', hospitalInfo.branchId);
    }
    ajaxRequest("POST", createReferralApplyUrl, data, false, false, true, createReferralApplySuccess, requestField, null);

    function createReferralApplySuccess(result) {
        sessionStorage.setItem('sendOrderData', JSON.stringify(result));
        window.location = '../page/referralSuccess.html';
    }
}

/** 请求失败回调函数*/
function requestField(data) {
    layer.msg(data.result);
}

/** 渲染 病例图片列表 */
let objParent = null; // 当前点击块的父级
function renderFileListView(baseUrl, url, type, fileName) {
    objParent.append(
        `<li class="fileItem" dataBase="${baseUrl}">\
                                        <div style='background-image:url(${url});'></div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/><p type="${type}" desc="" class="fileName">${fileName}</p></li>`
    );
    // objParent.append('<li dataBase="${baseUrl}" filePath="' + fileName + '"  class="fileItem">\
    //                                    <div style = "background-image: url(&apos;' + url + '&apos;)"></div>\
    //                                     <img class="delFileBtn" src="../images/delete_file.png"/>\
    //                                     <p type="${type}" desc="" class="fileName">' + fileName + '</p>\
    //                                 </li>');
}

/** 校验病历是否完整 */
function checkCaseInfo() {
    if ($('#username').val() === '' || $('#idCard').val() === '' || $('#phone').val() === '' || $('#address').val() === '' || $('#age').val() + $('.choiceAge').val() === '' || $('#high').val() === '' || $('#weight').val() === '' || $('.sex > a.active').html() === '' || $('#createCase_textDiagnose').val() === '' || $('#createCase_textGola').val() === '' || fileAllArr.length <= '0') {
        layer.open({
            type: 1,
            title: '',
            area: ['300px', '80px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            time: 2000,
            content: $('.incomplete'),
        });
        setTimeout(function () {
            //  layer.closeAll();
            $('.incomplete').hide();
        }, 2000);
        return true;
    }
    return false;
}

/** 校验病历是否正确 */
function checkCase() {
    let isFailedParam = false;
    if (!RegExpObj.Reg_Name.test($('#username').val())) {
        $("#failedParamMessage").html("患者姓名错误!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    } else if (!RegExpObj.Reg_IDCardNo.test($('#idCard').val())) {
        $("#failedParamMessage").html("身份证号格式错误!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    } else if (!RegExpObj.Reg_age.test($('#age').val())) {
        $("#failedParamMessage").html("年龄错误!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    } else if (!RegExpObj.Reg_hight.test($('#high').val())) {
        $("#failedParamMessage").html("身高错误!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    } else if (!RegExpObj.Reg_weight.test($('#weight').val())) {
        $("#failedParamMessage").html("体重错误!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    } else if (!RegExpObj.Reg_mobilePhone.test($('#phone').val())) {
        $("#failedParamMessage").html("电话号码错误!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    } else if (!RegExpObj.Reg_address.test($('#address').val())) {
        $("#failedParamMessage").html("常住城市错误!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    } else if ($('#createCase_textDiagnose').val() === '') {
        $("#failedParamMessage").html("初步诊断不能为空!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    } else if ($('#createCase_textGola').val() === '') {
        $("#failedParamMessage").html("会/转诊目的不能为空!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    } else if (fileAllArr.length === 0) {
        $("#failedParamMessage").html("电子病历附件不能为空!");
        isFailedParam = true;
        showFailedParamMessage()
        return true;
    }
    return isFailedParam;
}

function showFailedParamMessage() {
    layer.open({
        type: 1,
        title: '',
        area: ['300px', '80px'],
        closeBtn: false,
        shade: [0.1, '#000000'],
        shadeClose: false,
        time: 2000,
        content: _$('#failedParamMessageBox'),
    });
}

/** 渲染 草稿信息 */
function renderDraftInfo(draftInfo) {

    casePatientId = draftInfo.patientId;
    caseRecordId = draftInfo.caseRecordId;
    $('#username').val(draftInfo.patientName)
    $('#idCard').val(draftInfo.patientCard)
    $('#phone').val(draftInfo.patientPhone)
    $('#address').val(draftInfo.detailAddress)
    let choiceAge = draftInfo.patientAge;
    $('#age').val(choiceAge);
    $('.choiceAge').val("岁");
    $('#high').val(draftInfo.patientHeight);
    if (draftInfo.patientWeight) {
        $('#weight').val(draftInfo.patientWeight / 1000);
    }
    $('.fileCount').html(draftInfo.caseContentList.length); // 图片总张数
    if (draftInfo.patientSex == '男') {
        $('.sex > a').removeClass('active').eq(0).addClass('active');
    } else {
        $('.sex > a').removeClass('active').eq(1).addClass('active');
    }
    $('.urgent > a').removeClass('active').eq(draftInfo.applyUrgent).addClass('active');
    $('#createCase_textDiagnose').val(draftInfo.caseDiagnosis); //初步诊断
    $('#createCase_textGola').val(draftInfo.applyRemark); //会诊目的
    // 男女选择
    $('.sex > a').click(function () {
        $(this).addClass('active').siblings('a').removeClass('active');
    });
    // 加急选择
    $('.urgent > a').click(function () {
        $(this).addClass('active').siblings('a').removeClass('active');
    });
    /* 电子病历附件 */
    let tempArr = draftInfo.caseContentList;
    for (let i = 0; i < tempArr.length; i++) {
        let fileType = tempArr[i].contentPath.substr(tempArr[i].contentPath.lastIndexOf('.') + 1, tempArr[i].contentPath.length);
        let fileName = tempArr[i].contentPath;
        fileAllArr.push({
            name: fileName,
        });
        if (fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg') {
            if (tempArr[i].contentRemark == "") {
                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '"  class="fileItem">\
                                       <div style = "background-image: url(&apos;' + baseUrl + "/" + tempArr[i].contentPath + '&apos;)"></div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="img" desc="' + tempArr[i].contentRemark + '" class="fileName">' + tempArr[i].contentPath + '</p>\
                                    </li>')
            } else {

                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '" class="fileItem">\
                                       <div style = "background-image: url(&apos;' + baseUrl + "/" + tempArr[i].contentPath + '&apos;)"></div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="img" desc="' + tempArr[i].contentRemark + '" class="fileName active">' + tempArr[i].contentPath + '</p>\
                                    </li>')
            }
        } else if (fileType == 'pdf') {
            if (tempArr[i].contentRemark == '') {
                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '"  class="fileItem">\
                                        <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="pdf" desc="' + tempArr[i].contentRemark + '" class="fileName">' + tempArr[i].contentPath + '</p>\
                                    </li>')
            } else {
                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '" class="fileItem">\
                                        <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="pdf" desc="' + tempArr[i].contentRemark + '" class="fileName active">' + tempArr[i].contentPath + '</p>\
                                    </li>')
            }
        } else if (fileType == 'dcm') {
            if (tempArr[i].contentRemark == '') {
                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '"  class="fileItem">\
                                        <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="dcm" desc="' + tempArr[i].contentRemark + '" class="fileName">' + tempArr[i].contentPath + '</p>\
                                    </li>')
            } else {
                $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '" class="fileItem">\
                                        <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="dcm" desc="' + tempArr[i].contentRemark + '" class="fileName active">' + tempArr[i].contentPath + '</p>\
                                    </li>')
            }
        }
        $('.fileCount').html(fileAllArr.length);
        $(".fileContent").sortable({
            items: "li:not(.fileAdd)"
        });
    }

    if (draftInfo.inviteUserId) {
        if (draftInfo.consultantUserList) {
            let consultantUserList = JSON.parse(draftInfo.consultantUserList)
            for (let item of consultantUserList) {
                console.log(item);
                let inviteDoctorArr = item.doctorName.replace("<", "").replace(">", "").split("/");
                let doctorName = inviteDoctorArr[0];
                let doctorTitleName = inviteDoctorArr[1];
                let branchName = inviteDoctorArr[2];
                let hospitalName = inviteDoctorArr[3];
                inviteDoctorArray.push({
                    hospitalId: draftInfo.inviteHospitalId, // 医院id
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
        }
    }

    $('.sum').html(fileAllArr.length);
    favoriteHtml();
    /*  //textarea 标签随着文本的高度实现自适应 */
    $('.text-adaption').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

$(function () {

    // let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // if(userInfo)
    /**查询病历类型列表*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, false, renderCaseTypeLeftNavigation, null, null);
    /** 获取通讯录左侧导航数据 */
    ajaxRequest("GET", getMasterHospitalBranchList, null, false, false, false, renderDoctorNavigation, null, null);

    // 判断是从医生通讯录来的
    if (JSON.parse(sessionStorage.getItem('inviteDoctorArray'))) {
        inviteDoctorArray = JSON.parse(sessionStorage.getItem('inviteDoctorArray'));
        sessionStorage.removeItem('inviteDoctorArray');
        favoriteHtml();
    }

    // 上面tab切换
    $('.tabContent > a').click(function () {
        const _index = $(this).index();
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.contentBox > div').eq(_index).show().siblings('div').hide();
        $('.tabBox > a').eq(_index).show().siblings('a').hide();
    });
    // 底部上一步下一步切换
    $('.tabBox > a').click(function () {
        const _index = $(this).index();
        $(this).hide().siblings('a').show();
        $('.contentBox > div').eq(_index).hide().siblings('div').show();
        $('.tabContent > a').eq(_index).removeClass('active').siblings('a').addClass('active');
    });

    // 男女选择
    $('.sex > a').click(function () {
        $(this).addClass('active').siblings('a').removeClass('active');
    });
    // 加急选择
    $('.urgent > a').click(function () {
        $(this).addClass('active').siblings('a').removeClass('active');
    });

    // 选医生左侧三级列表切换
    $('.hospitalUl').delegate('.hospitalItem', 'click', function () {
        $(this).addClass('active').siblings('.hospitalItem').removeClass('active');
        $(this).find('.sectionUl').stop(true).slideToggle();
        $(this).siblings('.hospitalItem').find('.sectionUl').stop(true).slideUp();

    })
    $('.hospitalUl').delegate('.sectionItem', 'click', function () {
        if ($(this).find('.deptUl').css('display') === 'none') {
            $(this).addClass('active').siblings('.sectionItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.sectionItem').removeClass('active');
        }
        $(this).find('.deptUl').stop(true, true).slideToggle();
        $(this).siblings('.sectionItem').find('.deptUl').stop(true, true).slideUp();
        return false;
    })
    $('.hospitalUl').delegate('.deptItem', 'click', function () {
        $('.hospitalUl').find('.deptItem').removeClass('active');

        hospitalInfo["id"] = $('.hospitalItem.active').attr("hospitalid");
        hospitalInfo["hospitalName"] = $('.hospitalItem.active').find('.hospitalName').html();
        hospitalInfo["hospitalPhone"] = $('.hospitalItem.active').attr("hospitaltel");
        hospitalInfo["hospitalImgPrice"] = $('.hospitalItem.active').attr("imgpric");
        hospitalInfo["hospitalVideoPrice"] = $('.hospitalItem.active').attr("videopric");
        hospitalInfo["branchId"] = $(this).attr('name');
        hospitalInfo["branchName"] = $(this).html();

        $('.hospitalTel').html($('.hospitalItem.active').attr("hospitaltel"));
        $(this).addClass('active');
        getDoctorByBranchId($(this).attr('name'));
        return false;
    });

    // 选医生鼠标移入展示详情
    $('.doctorUl').delegate('.doctorChunk', 'mouseover', function (event) {
        event.stopPropagation();
        $(".doctorChunk").css("border", "1px solid #efefef");
        $(this).css("border", "1px solid #F6C567");
        if (($(this).index() + 1) % 3 === 0) {
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
    // 选医生鼠标移出收起详情
    $('.doctorUl').delegate('.doctorChunk', 'mouseleave', function (event) {
        $(this).find('.present').hide();
        $(this).css("border", "1px solid #efefef");
    });
    // 选择医生事件--添加
    $('.doctorUl').delegate('.doctorChunk', 'click', function (event) {
        if ($(this).hasClass('noDoctor')) {
            hospitalInfo["id"] = $(this).find('.p1').attr('name');
            hospitalInfo["branchId"] = $(this).find('.p1').attr('deptId');
            hospitalInfo["hospitalImgPrice"] = $(this).find('.p1').attr('hospitalImgPic');
            hospitalInfo["hospitalName"] = $(this).find('.p1').html();
            hospitalInfo["hospitalVideoPrice"] = $(this).find('.p1').attr('hospitalVideoPic');
            inviteDoctorArray = [];
            favoriteHtml();
        } else if (inviteDoctorArray.length > 0 && $(this).find('.hospital').attr('name') != inviteDoctorArray[0].hospitalId) {
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: _$('.operateBox'),
            });
            setTimeout(function () {
                $('.operateBox').hide();
            }, 2000)
        } else {
            hospitalInfo = {};
            let flag = true;
            for (let i = 0; i < inviteDoctorArray.length; i++) {
                if (inviteDoctorArray[i].doctorId === $(this).attr('name')) {
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
            favoriteHtml();
        }
    });
    // 选择医生事件--删除
    $('.favoriteUl').delegate('.delDocBtn', 'click', function () {
        inviteDoctorArray.splice($(this).parent('li').index(), 1);
        favoriteHtml();
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
        if ($(this).find('.threeLevelUl').css('display') === 'none') {
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
        scrollTo($('#' + $(this).attr('name')).offset().top - 20);
        return false;
    });

//点击添加 添加病历图片
    $(".upfileUl").delegate('.fileInput', 'change', function () {
        objParent = $(this).parents(".fileContent");
        uploadFile = $(this)[0].files; // 某一块添加时的原始数据
        fileIndex = 0;
        addCaseFile();
    });

    function addCaseFile() {
        if (!uploadFile[fileIndex]) {
            return false;
        }
        let fileName = uploadFile[fileIndex].name;
        // 重复文件过滤
        for (let i = 0, len = fileAllArr.length; i < len; i++) {
            if (fileAllArr[i].name === fileName) {
                fileIndex++;
                if (fileIndex < uploadFile.length) {
                    addCaseFile();
                    return false;
                }
                event.target.value = "";
                return false;
            }
        }
        let data = new FormData();
        //上传文件
        data.append("file", uploadFile[fileIndex]);
        ajaxRequest("POST", uploadFileUrl, data, false, false, true, uploadFileSuccess, null, null);

        function uploadFileSuccess(result) {
            if (/(.png|.jpg|.jpeg)$/gi.test(result)) {
                let type = "img";
                // let reader = new FileReader();
                // reader.readAsDataURL(uploadFile[fileIndex]);
                // reader.onload = function (e) {
                //     url = e.target.result;
                //     renderFileListView(baseUrl + "/" + result, url, type, result);
                // }
                let url = baseUrl + "/" + encodeURI(result);
                renderFileListView(baseUrl + "/" + result, url, type, result);
            } else if (/(.pdf)$/gi.test(result)) {
                let type = "pdf";
                let url = "../images/pdf_icon.png";
                renderFileListView(baseUrl + "/" + result, url, type, result);
            } else if (/(.dcm)$/gi.test(result)) {
                let type = "dcm";
                let url = "../images/dcm_icon.png";
                renderFileListView(baseUrl + "/" + result, url, type, result);
            }
            fileAllArr.push({
                "name": fileName,
                "value": result,
            });
            // 总张数
            fileIndex++;
            // $('.sum').html(fileAllArr.length);
            $('.sum').html(Number($('.sum').html()) + 1);
            if (fileIndex < uploadFile.length) {
                addCaseFile();
            } else {
                // 拖拽排序
                $(".fileContent").sortable({
                    items: "li:not(.fileAdd)"
                });
            }
        }
    }

// 删除文件
    $('.upfileUl').delegate('.delFileBtn', 'click', function () {
        let fileId = $(this).parents('.fileItem').attr('id');
        let filePath = $(this).parents('.fileItem').attr('filePath');
        let data = new FormData();
        data.append("id", fileId);
        ajaxRequest("POST", softDelPicture, data, false, false, true, removeFileSuccess, null, null);

        function removeFileSuccess(result) {
            for (let i = 0; len = fileAllArr.length, i < len; i++) {
                if (fileAllArr[i].name === filePath) {
                    fileAllArr.splice(i, 1);
                }
            }
            $('.sum').html(Number($('.sum').html()) - 1);
        }

        $(this).parent('.fileItem').remove();
        return false;
    })

// 图片点击查看大图
    $('.upfileUl').delegate('.fileItem', 'click', function () {
        fileArr = [];
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['1167px', '700px'], skin: "noBackground",
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            scrollbar: false,
            content: _$('.bigImgContainer'),
        });
        // 整理一组图片展示数据
        objParent = $(this).parent('.fileContent');
        indexFile = $(this).index() - 1;
        ObjArr = $(this).parent('.fileContent').find('.fileItem');

        for (var i = 0; i < ObjArr.length; i++) {
            fileArr.push({
                'id': ObjArr.eq(i).attr('id'),
                'name': ObjArr.eq(i).find('p').html(),
                'type': ObjArr.eq(i).find('p').attr('type'),
                'src': ObjArr.eq(i).find('div').css('backgroundImage'),
                'desc': ObjArr.eq(i).find('p').attr('desc'),
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
                PDFObject.embed(baseUrl + "/" + fileArr[indexFile].name, ".bigImg", {
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

// 备注保存
    $('.descText').blur(function () {
        fileArr[indexFile].desc = $('.descText').val();
    });
// 上一个
    $('.switchBox .prev').click(function () {
        if (indexFile <= 0) {
            indexFile = 0;
            return false;
        } else {
            indexFile--;
        }
        if (fileArr[indexFile].type != 'img') {
            // pdf dcm
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                // pdf 相关操作
                // 1、往 .bigImg 渲染pdf
                PDFObject.embed(baseUrl + "/" + fileArr[indexFile].name, ".bigImg", {
                    page: "1"
                });
                $('.downlodeFile').hide();

            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', baseUrl + "/" + fileArr[indexFile].name);
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
            return false;
        } else {
            indexFile++;
        }
        if (fileArr[indexFile].type != 'img') {
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                PDFObject.embed(baseUrl + "/" + fileArr[indexFile].name, ".bigImg", {
                    page: "1"
                });
                $('.downlodeFile').hide();

            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', baseUrl + "/" + fileArr[indexFile].name);
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
    $('.closeBtn').click(function () {
        layer.closeAll();
        $('.bigImgContainer').hide();
        let _html = '<li class="fileAdd">\
            <a class="addfileBtn" href="javascript:;"></a>\
            <input accept=".png,.jpg,.pdf,.jpeg,.dcm" class="fileInput" type="file" multiple>\
            <p class="fileName">添加文件</p>\
        </li>';
        for (let i = 0; i < fileArr.length; i++) {
            _html += '<li class="fileItem">'
            if (fileArr[i].type != 'img') {
                _html += `<div class="bgSize" style='background-image:${fileArr[i].src};'></div>`
            } else {
                _html += `<div style='background-image:${fileArr[i].src};'></div>`
            }
            _html += '<img class="delFileBtn" src="../images/delete_file.png"/>';
            if (fileArr[i].desc === '') {
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
            const delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
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
            const x = e.clientX - parseInt($('.bigImg').css('left'));
            const y = e.clientY - parseInt($('.bigImg').css('top'));
            $('.bigImgBox').on('mousemove', function (e) {
                const newX = e.clientX;
                const newY = e.clientY;
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

    // 保存草稿
    $('.ServeDrafts').click(function () {
        //前端数据校验
        if ($('#username').val() === '' || $('#idCard').val() === '' || fileAllArr.length <= '0') {
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: $('.incomplete'),
            });
            setTimeout(function () {
                $('.incomplete').hide();
            }, 2000);
            return false;
        }
        if (isDraft) {
            updateDraftCaseData(createDraftApplyData);
        } else {
            createHalfCase(createDraftApplyData);
        }
        return false;

    });

// 图文会诊、
    $('.graphicGroup').click(function () {
        /* 判断信息是否填写完整 */
        // let isIncomplete = checkCaseInfo();
        // if (isIncomplete) {
        //     return false;
        // }
        let isIncorrect = checkCase();
        if (isIncorrect) {
            return false;
        }
        if ($('.imgPric').html() === "-") {
            layer.msg('请选择医生或医院');
            return false;
        } else {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                content: _$('.imgContent'),
                // zIndex: 1000,
            });
            if (inviteDoctorArray.length > 0) {
                var hospitalName = inviteDoctorArray[0].hospitalName;
            } else {
                var hospitalName = hospitalInfo.hospitalName;
            }
            $('.imgContent .submitText').html('您的病历将发送到' + hospitalName + '，请确认');
        }
    });

// 视频会诊
    $('.videoBtn').click(function () {
        // let isIncomplete = checkCaseInfo();
        // if (isIncomplete) {
        //     return false;
        // }
        let isIncorrect = checkCase();
        if (isIncorrect) {
            return false;
        }
        if ($('.videoPric').html() === "-") {
            layer.msg('请选择医生或医院');
            return false;
        } else {
            layer.open({
                type: 1,
                content: $('.selectTimeContainer'),
                title: false,
                area: ['1060px', '630px'],
                closeBtn: 0,
                skin: 'noBackground'
            })
            dateTempList = [];
            redrawDate();
        }
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
            const startM = startMinute %= 60; // 计算后的开始分钟数
            const endM = endMinute %= 60; // 计算后的开始分钟数
            if (endHour === 24) {
                _html += '<li endDate="23:59" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
            } else {
                _html += '<li endDate="' + double(endHour) + ':' + double(endM) + '" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
            }
        }
        $('.rightContent').html(_html)
    })

    $('.noBtn').click(function () {
        $('.imgContent').hide();
        $('.videoContent').hide();
        $('.selectTimeContainer').css('display', 'none');
        layer.closeAll();
    })

// 图文的确认弹窗确定按钮事件
    $('.imagebtnBox .yesBtn').click(function () {
        if (isDraft) {
            updateCaseData(createPictureApplyData);
        } else {
            buildCaseData(createPictureApplyData);
        }
    });

    let dateTempList = [];
    const myDate = new Date();
    var flag = true;
    let startIndex = 0;
    let endIndex = 0;
    let dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());

    function redrawDate() {
        $('#timeBox').html('');
        markJson = {};
        for (var i = 0; i < dateTempList.length; i++) {
            markJson[dateTempList[i].date] = "";
        }
        // 渲染日历控件
        layui.use('laydate', function () {
            const laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#timeBox',
                position: 'static',
                showBottom: false,
                value: dateStr,
                mark: markJson,
                min: 0,
                change: function (value, date) { //监听日期被切换
                    $('#timeUl > li').removeClass('active');
                    flag = true;
                    dateStr = value;
                    for (let i = 0; i < dateTempList.length; i++) {
                        if (dateStr === dateTempList[i].date) {
                            if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                                for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                                    $('#timeUl > li').eq(j).addClass('active');
                                }
                            } else {
                                for (var j = dateTempList[i].endIndex; j <= dateTempList[i].startIndex; j++) {
                                    $('#timeUl > li').eq(j).addClass('active');
                                }
                            }
                        }
                    }
                }
            });
        });
    }

// 分钟选择事件、
    $('#timeUl').delegate('li', 'click', function () {
        if (flag) {
            $(this).addClass('active').siblings('li').removeClass('active');
            flag = false;
            startIndex = $(this).attr('index');
        } else {
            $(this).addClass('active');
            flag = true;
            endIndex = $(this).attr('index');
            if (startIndex <= endIndex) {
                for (var i = startIndex; i < endIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            } else {
                for (var i = endIndex; i < startIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            }
            if (dateTempList.length === 0) {
                dateTempList.push({
                    "date": dateStr,
                    "startIndex": startIndex,
                    "endIndex": endIndex,
                });
            } else {
                for (var i = 0; i < dateTempList.length; i++) {
                    if (dateTempList[i].date === dateStr) {
                        dateTempList.splice(i, 1);
                    }
                }
                dateTempList.push({
                    "date": dateStr,
                    "startIndex": startIndex,
                    "endIndex": endIndex,
                });
            }
            redrawDate();
        }
    });
// 清空当页数据
    $('.selectTimeContent').find('.clearBtn').click(function () {
        for (let i = 0; i < dateTempList.length; i++) {
            if (dateTempList[i].date === dateStr) {
                dateTempList.splice(i, 1);
            }
        }
        $('#timeUl > li').removeClass('active');
        redrawDate();
    })
// 关闭事件
    $('.closeBtnTime').click(function () {
        dateTempList = [];
        layer.closeAll();
        $('.selectTimeContainer').hide();
    })
//发送视频会诊 确定事件 === 发送视频会诊
    $('.selectTimeContainer .selectTimeContent .btnBox .yesBtn').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('.videoContent'),
            // zIndex: 1000,
        });
        if (inviteDoctorArray.length > 0) {
            var hospitalName = inviteDoctorArray[0].hospitalName;
        } else {
            var hospitalName = hospitalInfo.hospitalName;
        }
        $('.videoContent .submitText').html('您的病历将发送到' + hospitalName + '，请确认');
    });

    $('.videoContent .noBtn').click(function () {
        layer.closeAll();
    });

    $('.videoContent .yesBtn').click(function () {
        dateList = [];
        for (let i = 0; i < dateTempList.length; i++) {
            if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                dateList.push({
                    'startTime': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).html() + ':00',
                    'endTime': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).attr('enddate') + ':00'
                });
            } else {
                dateList.push({
                    'startTime': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).html() + ':00',
                    'endTime': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).attr('enddate') + ':00'
                });
            }
        }
        if (dateList.length <= 0) {
            layer.msg('请选择时间', {time: 3000});
            setTimeout(function () {
                layer.closeAll();
            }, 3000);
            return false;
        }
        if (isDraft) {
            updateCaseData(createVideoApplyData);
        } else {
            buildCaseData(createVideoApplyData);

        }
    });

// 填病例底部取消按钮
    $('.cancel').click(function () {
        if ($('#username').val() === '' && $('#idCard').val() === '' && $('#phone').val() === '' && $('#address').val() === '' && $('#age').val() === '' && $('#high').val() === '' && $('#weight').val() === '' && $('#createCase_textDiagnose').val() === '' && $('#createCase_textGola').val() === '' && fileAllArr.length <= 0 && inviteDoctorArray.length <= 0) {
            history.back();
        } else {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                content: _$('.keepContent'),
            });
        }
    });
    $('.keepContent .saveBtn').click(function () {
        //前端数据校验
        if ($('#username').val() === '' || $('#idCard').val() === '' || fileAllArr.length <= '0') {
            layer.closeAll();
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: $('.incomplete'),
            });
            setTimeout(function () {
                $('.incomplete').hide();
            }, 2000);
            return false;
        }
        if (isDraft) {
            updateDraftCaseData(createDraftApplyData);
        } else {
            createHalfCase(createDraftApplyData);
        }
        return false;
    });
    $('.keepContent .onsaveBtn').click(function () {
        window.location = '../page/morkbench.html'
    });
    $('.keepContent .cancelBtn').click(function () {
        layer.closeAll();
    });

    let markReferralJson = {};

    const initDate = new Date();
    let initValue = '';
    let initYear = initDate.getFullYear();
    let initMonth = initDate.getMonth() + 1;
    let initDay = initDate.getDate();

    function referraSelectRender() {
        $("#referralTimeScope").html('');
        layui.use('laydate', function () {
            let laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#referralTimeScope',
                position: 'static',
                showBottom: false,
                min: 0,
                value: dateStr,
                mark: markReferralJson,
                change: function (value, date) { //监听日期被切换
                    console.log(date)
                    if (date.date === initDay && date.month != initMonth || date.year != initYear) {

                    } else {
                        let _flag = true;
                        for (let key in markReferralJson) {
                            if (key === value) {
                                _flag = false;
                                delete markReferralJson[value];
                                break;
                            }
                        }
                        if (_flag) {
                            markReferralJson[value] = '';
                        }
                    }
                    dateStr = value;
                    initYear = date.year;
                    initMonth = date.month;
                    initDay = date.date;
                    referraSelectRender();
                }
            });
        });
    };
    referraSelectRender();
// 底部转诊按钮事件
    $(".referralBtn").click(function () {
        /* 判断信息是否填写完整 */
        // let isIncomplete = checkCaseInfo();
        // if (isIncomplete) {
        //     return false;
        // }
        //判断病历信息是否正确
        let isIncorrect = checkCase();
        if (isIncorrect) {
            return false;
        }
        if ($('.videoPric').html() === "-") {
            layer.msg('请选择医院');
            return false;
        }
        if (!hospitalInfo.id && inviteDoctorArray.length <= 0) {
            layer.msg('请选择医生或医院');
        } else if (hospitalInfo.id && hospitalInfo.id === sessionStorage.getItem("hospitalId")) {
            layer.msg('转诊不能选择本院');
        } else if (inviteDoctorArray.length > 0 && inviteDoctorArray[0].hospitalId === sessionStorage.getItem("hospitalId")) {
            layer.msg('转诊不能选择本院医生');
        } else if (inviteDoctorArray.length > 1) {
            layer.msg('转诊只可邀请1位医生');
        } else {
            // 打开转诊选时间面板
            layer.open({
                type: 1,
                content: $('.referralTimeSelect'),
                title: false,
                area: ['600px', '580px'],
                closeBtn: 0,
                skin: 'noBackground'
            })
        }
    })
// 转诊选择时间清空按钮
    $(".referralTimeSelect").find(".clearBtn").click(function () {
        markReferralJson = {};
        referraSelectRender();
    })
// 转诊选完时间，确认事件，调出 确认 提示

    $(".referralTimeSelect").find(".yesBtn").click(function () {
        referralDateList = [];
        for (let key in markReferralJson) {
            referralDateList.push(key);
        }
        if (referralDateList.length > 0) {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                content: _$('.referralContent'),
                // zIndex: 1000,
            });
            if (inviteDoctorArray.length > 0) {
                var hospitalName = inviteDoctorArray[0].hospitalName;
            } else {
                var hospitalName = hospitalInfo.hospitalName;
            }
            $('.referralContent .submitText').html('您的病历将发送到' + hospitalName + '，请确认');
        } else {
            layer.msg("请选择时间")
        }
    })
// 选完时间后的确认框
// 确认事件
    $(".referralContent").find(".yesBtn").click(function () {
        if (referralDateList.length <= 0) {
            layer.msg('请选择时间', {time: 3000});
            setTimeout(function () {
                layer.closeAll();
            }, 3000);
            return false;
        }
        if (isDraft) {
            updateCaseData(createReferralApplyData);
        } else {
            buildCaseData(createReferralApplyData);
        }
    })
// 取消事件
    $(".referralContent").find(".noBtn").click(function () {
        layer.closeAll();
        $(".referralContent").hide();
        $(".referralTimeSelect").hide();
    })

    /**
     * 表单数据校验
     */
    // // 验证中文名字
    // $("#username").blur(function () {
    //     if ($("#username").val().length < 2) {
    //         layer.msg('请输入长度为2-16的名字');
    //     } else if (!RegExpObj.Reg_Name.test($('#username').val())) {
    //         layer.msg('输入内容格式有误,请修改')
    //         $('this').css('background', 'red');
    //     }
    // });
    // // 校验身份证号
    $('#idCard').blur(function () {
        // 账号的验证 手机号验证
        if ($('#idCard').val().length === 0) {
            layer.msg('身份证号不能为空');
        } else if (!RegExpObj.Reg_IDCardNo.test($('#idCard').val())) {
            layer.msg('输入内容格式有误，请修改');
        } else {
            discriCard($(this).val());
            $('#age').val(idCardInfo.age);
            $('.choiceAge').val(idCardInfo.unit);
            // $('#address').val(idCardInfo.city);
            //获取性别
            if (idCardInfo.sex % 2 == 1) {
                $('#man').addClass('active').siblings('a').removeClass('active');
            } else {
                $('#woman').addClass('active').siblings('a').removeClass('active');
            }
        }
    });
    // // 校验年龄 身高 体重
    // $('#age').blur(function () {
    //     if (!RegExpObj.Reg_age.test($('#age').val())) {
    //         layer.msg('输入内容格式有误，请修改')
    //     }
    // });
    // $('#high').blur(function () {
    //     if (!RegExpObj.Reg_hight.test($('#high').val())) {
    //         layer.msg('输入内容格式有误，请修改')
    //         // layer.msg('请输入10-300的数字来描述身高')
    //     }
    // });
    // $('#weight').blur(function () {
    //     if (!RegExpObj.Reg_weight.test($('#weight').val())) {
    //         layer.msg('体重值不在正常范围(1-300kg)内')
    //     }
    // });
    // // 验证电话号码
    // $('#phone').blur(function () {
    //     if (!RegExpObj.Reg_isPhone.test($('#phone').val())) {
    //         layer.msg('输入内容格式有误，请修改')
    //     }
    // });
    // // 验证常住城市
    // $('#address').blur(function () {
    //     if (!RegExpObj.Reg_address.test($('#address').val())) {
    //         layer.msg('输入内容格式有误，请修改')
    //     }
    // });
    // // 验证初步诊断不能为空
    // $('#createCase_textDiagnose').blur(function () {
    //     if ($('#createCase_textDiagnose').val().length === 0) {
    //         layer.msg('初步诊断不能为空');
    //     }
    // });
    // // 验证会、转诊目的不能为空
    // $('#createCase_textGola').blur(function () {
    //     if ($('#createCase_textGola').val().length === 0) {
    //         layer.msg('会/转诊目的不能为空');
    //     }
    // });
    /** 草稿 进入*/
    if (window.location.search.indexOf("isDraft") === -1) {
        sessionStorage.removeItem("draftId");
    } else {
        if (sessionStorage.getItem('draftId')) {
            draftId = sessionStorage.getItem("draftId");
            isDraft = true;

            $("#draftDeleteBtn").show();
            let formData = {"applyFormId": draftId};
            ajaxRequest("GET", getApplyInfoUrl, formData, true, "application/json", true, renderDraftInfo, null, null);
        }
    }

    //删除草稿 按钮事件
    $("#draftDeleteBtn").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('#deleteDraftBox'),
        });
    })
    //删除草稿 确认按钮事件
    $("#deleteDraftBoxYesBtn").click(function () {

        let deleteDraftFormData = {"applyFormId": draftId};
        ajaxRequest("GET", draftDel, deleteDraftFormData, true, "application/json", true, draftDelSuccess, null, null);

        function draftDelSuccess(result) {
            window.location = '../page/morkbench.html';
        }
    })

    // 滚动事件
    $(window).scroll(function () {
        $('.hospitalUl').css({
            'width': '145px',
            'position': 'fixed',
        });
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
            $('.sectionUl').css({
                'height': $(window).height() - 300 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            });
        } else {
            $('.sectionUl').css({
                'height': $(window).height() - 230 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            });
        }
    });

    $(window).scroll(function () {
        $('.oneLevelUl').css({
            'width': '145px',
            'position': 'fixed',
        })
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
            $('.twoLevelUl').css({
                'height': $(window).height() - 300 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
            });
        } else {
            $('.twoLevelUl').css({
                'height': $(window).height() - 230 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
            });
        }
    });

    /*  //textarea 标签随着文本的高度实现自适应 */

    const ie = !!window.attachEvent && !window.opera;
    const ie9 = ie && (!!+"\v1");
    const inputhandler = function (node, fun) {
        if ("oninput" in node) {
            node.oninput = fun;
        } else {
            node.onpropertychange = fun;
        }
        if (ie9) node.onkeyup = fun;
    };
    /* 初步诊断随诊文本增加高度自适应 */
    let createCase_textDiagnose = document.getElementById("createCase_textDiagnose");
    inputhandler(createCase_textDiagnose, function () {
        if (!ie) createCase_textDiagnose.style.height = 40 + "px";
        const height = createCase_textDiagnose.scrollHeight;
        if (height >= 40) {
            createCase_textDiagnose.style.height = height + "px";
        } else {
            createCase_textDiagnose.style.height = 40 + "px";
        }
    });
    /*会/转诊目的文本增加高度自适应 */
    let createCase_textGola = document.getElementById("createCase_textGola");
    inputhandler(createCase_textGola, function () {
        if (!ie) createCase_textGola.style.height = 40 + "px";
        const height = createCase_textGola.scrollHeight;
        if (height >= 40) {
            createCase_textGola.style.height = height + "px";
        } else {
            createCase_textGola.style.height = 40 + "px";
        }
    });

})
