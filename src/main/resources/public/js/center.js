let userInfo = {};
let oldTelephone = '';
let oldBeGoodAt = '';
let newTelephone = '';
let newBeGoodAt = '';
let isModify = false;
let userCaseTypeIsModify = false;
let _$ = layui.jquery;

function renderUserInfo() {
    $('.name').val(userInfo.userName);
    $('.userName').val(userInfo.userPhone);
    $('.rolesName').val(userInfo.rolesName);
    $('.occupationName').val(userInfo.titleName);
    $('.specialistTypeName').val(userInfo.specialistTypeName);
    $('.hospitalName').val(userInfo.hospitalName);
    $('.deptName').val(userInfo.branchName);
    $('.telephone').val(userInfo.telephone);
    $('.medicalFees').val(userInfo.consultationPicturePrice);
    $('.medicalFeesVideo').val(userInfo.consultationVideoPrice);
    $('.text-adaption').val(userInfo.userStrong);
    $('.rolesName').val(sessionStorage.getItem("rolesName"));

    let caseTypeList = userInfo.caseTypeIds;
    for (let i = 0; i < caseTypeList.length; i++) {
        let caseTypeDomId = "#" + caseTypeList[i].caseTypeId;
        $(caseTypeDomId).addClass("CheckBg");
    }
    if (userInfo.signature) {
        $("#signatureUploadBox").hide();
        $('#signatureImgBox').attr("src", baseUrl + "/" + userInfo.signature);
    } else {
        $("#signatureImgBox").hide();
    }
    if (userInfo.doctorCardFront) {
        $("#doctorCardUploadBox").hide();
        $('#doctorCardImgBox').attr("src", baseUrl + "/" + userInfo.doctorCardFront);
    } else {
        $("#doctorCardImgBox").hide();
    }
}

/** 渲染医生详细信息页面病例类型*/
function renderCaseView(result) {
    let _html = '';
    for (let i = 0; i < result.length; i++) {
        _html += '<div class="catalogue clearfix">\
                            <p>' + result[i].caseTypeName + '</p>';
        let twoArr = result[i].childList;
        for (let j = 0; j < twoArr.length; j++) {
            _html += '<div parentName="' + result[i].caseTypeName + '" id="' + twoArr[j].id + '" type="" class="checkSingle " name="' + twoArr[j].id + '">' + twoArr[j].caseTypeName + '</div>'
        }
        _html += '</div>';
    }
    $('.enroll_three').html(_html);
}

function getPersonalInfo() {
    ajaxRequest("GET", getPersonalInfoUrl, null, false, false, false, getPersonalInfoSuccess, getPersonalInfoFailed, null);

    function getPersonalInfoSuccess(personalInfo) {
        userInfo = personalInfo;
    }

    function getPersonalInfoFailed(personalInfo) {
        layer.msg('查询个人信息失败!');
        setTimeout(function () {
            location.href = '../page/login.html';
        }, 2000);
    }
}

$(function () {

    let formData = new FormData();
    /**获取病历类型列表*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, false, renderCaseView, null, null);
    getPersonalInfo();
    renderUserInfo();


    $('.telephone').blur(function () {
        if (!RegExpObj.Reg_isPhone.test($('.telephone').val())) {
            layer.msg('电话输入内容有误，请修改');
            return false;
        } else {
            newTelephone = $(this).val();
        }

    });
    $('#textAdaotion').blur(function () {
        newBeGoodAt = $(this).val();
    });
    //上传医师资格证
    $("#doctorCardUploadInput").change(function () {
        let fileObj = new FormData();
        fileObj.append("file", this.files[0]);
        ajaxRequest("POST", uploadFileUrl, fileObj, false, false, true, uploadSuccess, null, null);

        function uploadSuccess(result) {
            $('#doctorCardImgBox').attr("src", baseUrl + "/" + result);
            $("#doctorCardUploadBox").hide();
            $('#doctorCardImgBox').show();
            formData.append("doctorCardFront", result);
            isModify = true;
            $('.center_lastBtn').addClass('active');
            $('.center_lastBtn').css('cursor', 'pointer');
        }
    })
    //上传签名
    $("#signatureUploadInput").change(function () {
        let fileObj = new FormData();
        fileObj.append("file", this.files[0]);
        ajaxRequest("POST", uploadFileUrl, fileObj, false, false, true, uploadSuccess, null, null);

        function uploadSuccess(result) {
            $('#signatureImgBox').attr("src", baseUrl + "/" + result);
            $("#signatureUploadBox").hide();
            $('#signatureImgBox').show();
            formData.append("signature", result);
            isModify = true;
            $('.center_lastBtn').addClass('active');
            $('.center_lastBtn').css('cursor', 'pointer');
        }
    })
    /* 点击修改按钮修改个人密码 */
    $('#modifyPasswordBtn').click(function () {
        if (!RegExpObj.Reg_PassWord.test($('.newPassword').val())) {
            layer.msg('密码格式不正确', {time: 3000});
        } else if ($('.newPassword').val() == '') {
            layer.msg('密码不能为空', {time: 3000});
        } else if ($('.newPassword').val() != $('.center_three_input_three').val()) {
            layer.msg('两次密码输入不一致', {time: 3000});
        } else {
            $('.newPassword').val();
            let passwordFormData = new FormData();
            passwordFormData.append("oldPassword", $('.oldPassword').val())
            passwordFormData.append("newPassword", $('.newPassword').val())
            ajaxRequest("POST", modifyPassword, passwordFormData, false, false, true, modifyPasswordSuccess, modifyPasswordFailed, null);

            function modifyPasswordSuccess() {
                layer.msg("修改密码成功", {time: 3000});
                setTimeout(function () {
                    location.href = '../page/login.html';
                }, 2000);
            }

            function modifyPasswordFailed(result) {
                layer.msg("原密码有误");
            }
        }
    });

    /* 添加个人病历要求 */
    // 单个按钮
    $(".enroll_three").on('click', '.checkSingle', function () {
        if ($(this).hasClass('CheckBg')) {
            if ($(this).hasClass('operate')) {
                $(this).removeClass('operate');
            } else {
                $(this).addClass('operate');
            }
            $(this).removeClass('CheckBg');
        } else {
            if ($(this).hasClass('operate')) {
                $(this).removeClass('operate');
            } else {
                $(this).addClass('operate');
            }
            $(this).addClass('CheckBg');
        }

        if ($('.operate').length > 0) {
            userCaseTypeIsModify = true;
            isModify = true;
            $('.center_lastBtn').addClass('active');
            $('.center_lastBtn').css('cursor', 'pointer');
        } else {
            userCaseTypeIsModify = false;
            $('.center_lastBtn').removeClass('active');
            $('.center_lastBtn').css('cursor', 'default');
        }
    });

    $('.telephone, #textAdaotion').bind('input propertychange', function () {
        if (oldTelephone != $('.telephone').val() || oldBeGoodAt != $('#textAdaotion').val() || $('.operate').length > 0) {
            isModify = true;
            $('.center_lastBtn').addClass('active');
            $('.center_lastBtn').css('cursor', 'pointer');
        } else {
            $('.center_lastBtn').removeClass('active');
            $('.center_lastBtn').css('cursor', 'default');
        }
    });

    /* 更改个人信息-电话和擅长 */
    $('.center_lastBtn').click(function () {

        // 修改信息判断
        if (isModify) {
            if (userCaseTypeIsModify) {
                let caseTypeJsonStr = "{";
                for (let i = 0; i < $('.checkSingle.CheckBg').length; i++) {
                    let a = $('.checkSingle.CheckBg').eq(i).attr('name');
                    let b = $('.checkSingle.CheckBg').eq(i).html();
                    let c = $('.checkSingle.CheckBg').eq(i).attr('parentName');
                    caseTypeJsonStr += "'" + a + "':'" + c + "-" + b + "',";
                }
                caseTypeJsonStr = caseTypeJsonStr.substring(0, caseTypeJsonStr.length - 1);
                caseTypeJsonStr += "}";
                formData.append("idTypeName", caseTypeJsonStr);
            }

            formData.append("userStrong", $('.text-adaption').val());
            formData.append("phoneNumber", $('.telephone').val());
            ajaxRequest("POST", modifyPersonalInfo, formData, false, false, true, modifyPersonalInfoSuccess, modifyPersonalInfoFailed, null);

            function modifyPersonalInfoSuccess(result) {
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    area: '340px',
                    skin: 'layui-layer-nobg', //没有背景色
                    shade: 0,
                    time: 2000,
                    content: _$('.storage')
                });
                $('.center_lastBtn').attr('disabled', 'true');
                $('.center_lastBtn').css({
                    color: " #999",
                    background: " #dbdbdb",
                });
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }

            function modifyPersonalInfoFailed(result) {
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    area: '340px',
                    skin: 'layui-layer-nobg',
                    shade: 0,
                    time: 2000,
                    content: _$('.storage')
                });
                $('.storage').children('span').html('保存失败');
                $('.storage').children('img').attr('src', '../images/lose_img.png');
            }
        }
    });

    /*  //textarea 标签随着文本的高度实现自适应 */
    $('#textAdaotion').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight + 40) + 'px;overflow-y:hidden;');
    }).on('input propertychange', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    $('#textAdaotion').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight + 40) + 'px;overflow-y:hidden;');
    })

});
