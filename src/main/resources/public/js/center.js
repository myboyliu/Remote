let userInfo = {};
let oldTelephone = '';
let oldBeGoodAt = '';
let newTelephone = '';
let newBeGoodAt = '';
let newBeGoodAt = '';
let newBeGoodAt = '';

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
            // _html += '<div type="" class="checkSingle CheckBg" name="' + twoArr[j].id + '">' + twoArr[j].caseTypeName + '</div>'
            _html += '<div parentName="' + result.caseTypeName + '" id="' + twoArr[j].id + '" type="" class="checkSingle " name="' + twoArr[j].id + '">' + twoArr[j].caseTypeName + '</div>'
        }
        _html += '</div>';
    }
    $('.enroll_three').html(_html);
}

function getPersonalInfo() {
    ajaxRequest("GET", getPersonalInfoUrl, null, false, false, false, getPersonalInfoSuccess, getPersonalInfoFailed, null);

    function getPersonalInfoSuccess(personalInfo) {
        console.log(personalInfo)
        userInfo = personalInfo;
    }

    function getPersonalInfoFailed(personalInfo) {
        console.log(personalInfo)
    }
}

$(function () {
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
            let formData = new FormData();
            formData.append("oldPassword", $('.oldPassword').val())
            formData.append("newPassword", $('.newPassword').val())
            ajaxRequest("POST", modifyPassword, formData, false, false, true, modifyPasswordSuccess, modifyPasswordFailed, null);

            function modifyPasswordSuccess() {
                layer.msg("修改密码成功", {time: 3000});
                setTimeout(function () {
                    location.href = '../page/login.html';
                }, 2000);
            }

            function modifyPasswordFailed(result) {
                layer.msg("原密码有误");
                console.log(result)
            }
        }
    });

    /* 添加个人病历要求 */
    // 单个按钮
    $(".enroll_three").on('click', '.checkSingle', function () {
        if ($(this).attr('type') == '') {
            if ($(this).hasClass('CheckBg')) {
                $(this).attr('type', '1').addClass('operate').toggleClass('CheckBg');
            } else {
                $(this).attr('type', '0').addClass('operate').toggleClass('CheckBg');
            }
        } else if ($(this).attr('type') == '0') {
            $(this).attr('type', '').removeClass('operate').toggleClass('CheckBg');
        } else if ($(this).attr('type') == '1') {
            $(this).attr('type', '').removeClass('operate').toggleClass('CheckBg');
        }
        if ($('.operate').length > 0) {
            $('.center_lastBtn').addClass('active');
            $('.center_lastBtn').css('cursor', 'pointer');
        } else {
            $('.center_lastBtn').removeClass('active');
            $('.center_lastBtn').css('cursor', 'default');
        }
    });

    $('.telephone, #textAdaotion').bind('input propertychange', function () {
        if (oldTelephone != $('.telephone').val() || oldBeGoodAt != $('#textAdaotion').val() || $('.operate').length > 0) {
            $('.center_lastBtn').addClass('active');
            $('.center_lastBtn').css('cursor', 'pointer');
        } else {
            $('.center_lastBtn').removeClass('active');
            $('.center_lastBtn').css('cursor', 'default');
        }
    });
    // $('.telephone, #textAdaotion').blur(function () {

    // });
    /* 更改个人信息-电话和擅长 */
    $('.center_lastBtn').click(function () {
        // 修改信息判断
        if (oldTelephone != newTelephone || oldBeGoodAt != newBeGoodAt || $('.operate').length > 0) {
            var caseTypeList = [];
            for (var i = 0; i < $('.operate').length; i++) {
                caseTypeList.push({
                    "caseTypeId": $('.operate').eq(i).attr('name'),
                    "caseTypeName": $('.operate').eq(i).html(),
                    "types": $('.operate').eq(i).attr('type')
                });
            }
            $.ajax({
                type: 'POST',
                url: IP + 'user/updateSelfDetail',
                dataType: 'json',
                data: {
                    "telephone": $('.telephone').val(),
                    "beGoodAt": $('.text-adaption').val(),
                    "caseTypeList": JSON.stringify(caseTypeList)
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    if (data.status == 200) {
                        /* 暂存操作成功操作 */
                        var _$ = layui.jquery;
                        layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 0,
                            area: '340px',
                            skin: 'layui-layer-nobg', //没有背景色
                            // shadeClose: false,
                            shade: 0,
                            time: 2000,
                            content: _$('.storage')
                        });
                        $('.center_lastBtn').attr('disabled', 'true');
                        $('.center_lastBtn').css({
                            color: " #999",
                            background: " #dbdbdb",
                            //    cursor: "default"
                        });
                        setTimeout(() => {
                            location.reload();
                        }, 1100);

                    } else if (data.status == 250) {
                        window.location = '../login/login.html'
                    } else {
                        var _$ = layui.jquery;
                        layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 0,
                            area: '340px',
                            skin: 'layui-layer-nobg', //没有背景色
                            // shadeClose: false,
                            shade: 0,
                            time: 2000,
                            content: _$('.storage')
                        });
                        $('.storage').children('span').html('保存失败');
                        $('.storage').children('img').attr('src', '../images/lose_img.png');
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            });
        }
    });

    /*  //textarea 标签随着文本的高度实现自适应 */
    $('#textAdaotion').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight + 40) + 'px;overflow-y:hidden;');
    }).on('input propertychange', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        console.log(this.scrollHeight)
    });
    $('#textAdaotion').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight + 40) + 'px;overflow-y:hidden;');
    })

});
