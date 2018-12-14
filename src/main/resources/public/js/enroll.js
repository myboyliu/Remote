var managerHospitalDeptId = '';

/**渲染医院下拉列表*/
function renderHospitalSeleted(array) {
    var _html = '<option value="">请选择医院</option>';
    for (var i = 0; i < array.length; i++) {
        _html += '<option value="' + array[i].id + '">' + array[i].hospitalName + '</option>';
    }
    $('.quiz1').html(_html);
};

/**渲染科室下拉列表*/
function renderBranchSeleted(array) {
    var _html = '<option value="">请选择科室</option>';
    for (var i = 0; i < array.length; i++) {
        var childArray = array[i].childList;
        for (var j = 0; j < childArray.length; j++) {
            _html += '<option value="' + childArray[j].id + '">' + childArray[j].customName + '</option>';
        }
    }
    $('.quiz3').html(_html);
};

/**渲染专家类型下拉列表*/
function renderSpecialistTypeSeleted(array) {
    var _html = '<option value="">请选择专家类型</option>';
    for (var i = 0; i < array.length; i++) {
        _html += '<option money="' + array[i].consultationPicturePrice + '" moneyVideo="' + array[i].consultationVideoPrice + '" value="' + array[i].id + '">' + array[i].specialistName + '</option>'
    }
    $('.quiz4').html(_html);
};

/**渲染病历类型列表*/
function renderCaseContentView(caseContentList) {
    var _html = "";
    $.each(caseContentList, function (key, val) {
        _html += '<div class="catalogue clearfix">\<p>' + val.caseTypeName + '</p>\<div class="checkAll" caseTypeName="' + key + '" name="' + val.id + '">全选\</div>';
        var childList = val.childList;
        for (var i = 0; i < childList.length; i++) {
            _html += '<div class="checkSingle" parentName="' + val.caseTypeName + '" name="' + childList[i].id + '">' + childList[i].caseTypeName + '\</div>';
        }
        _html += '</div>';

    });
    $('.enroll_three').append(_html);
};

/**渲染注册成功窗口*/
function renderRegistrationSuccessful() {
    var _$ = layui.jquery;
    layer.open({
        type: 1,
        title: '',
        closeBtn: false,
        area: ['820px', '450px'],
        content: _$('.zcWin'),
        time: 3000,
    });

    setTimeout(function () {
        location.href = 'login.html';
    }, 3000);
}

$(function () {
    var Name = $('.userName'); // 账号（手机号）
    var passWord = $('.passWord'); // 密码
    var passwords = $('.passwords'); // 确认密码
    var photo1 = [];
    var photo2 = [];
    /**用户账号区域输入框blur事件*/
    Name.blur(function () {
        if (!RegExpObj.Reg_mobilePhone.test(Name.val())) {
            $('.tip1').html('* 手机号码格式不正确');
        } else {
            $('.tip1').html('');
        }
    }).focus(function () {
        $('.tip1').html('');
    });
    passWord.blur(function () {
        if ($(this).val() == '') {
            $('.tip2').html('不能为空!');
        } else if (!RegExpObj.Reg_PassWord.test($(this).val())) {
            $('.tip2').html('密码格式错误!');
        } else {
            $('.tip2').html('');
        }
    }).focus(function () {
        $('.tip2').html('*8-16个字符，必须包含英文(不分大小写)、数字、下划线中至少两种');
    });
    passwords.blur(function () {
        if (passWord.val() != passwords.val()) {
            // alert(passWord.val());
            $('.tip3').html('*两次密码输入不一致！');
        } else {
            $('.tip3').html('');
        }
    }).focus(function () {
        $('.tip3').html('');
    });
    /**查询医院列表*/
    ajaxRequest("GET", getAllHospital, null, true, false, true, renderHospitalSeleted, null, null);
    /**查询病历类型列表*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, true, renderCaseContentView, null, null);
    // 专家类型切换 修改 诊费
    $('.quiz4').change(function () {
        $('.money').val($(this).find('option:selected').attr('money'));
        $('.moneyVideo').val($(this).find('option:selected').attr('moneyVideo'));
    });
    // 医院下拉列表切换
    $('.quiz1').change(function () {
        /**查询科室列表*/
        var data = {"hospitalId": $('.quiz1').val()};
        ajaxRequest("GET", getBranchByHospitalIdUrl, data, true, "application/json", false, renderBranchSeleted, emptyBranch, null);
        function emptyBranch() {
            var branch_html = '<option value="">请选择科室</option>';
            $('.quiz3').html(branch_html);
        }
        /**查询专家类型列表*/
        ajaxRequest("GET", getSpecialistTypeByHospitalId, data, true, "application/json", false, renderSpecialistTypeSeleted, emptySpecialistType, null);
        function emptySpecialistType() {
            var specialistType_html = '<option value="">请选择专家类型</option>';
            $('.quiz4').html(specialistType_html);
        }
    });


    // 全选按钮
    $(".enroll_three").on('click', '.checkAll', function () {
        if ($(this).hasClass('CheckBg')) {
            $(this).removeClass('CheckBg').siblings(".checkSingle").removeClass('CheckBg');
        } else {
            $(this).addClass('CheckBg').siblings(".checkSingle").addClass('CheckBg');
        }
    });
    // 单个按钮
    $(".enroll_three").on('click', '.checkSingle', function () {
        if ($(this).hasClass('CheckBg')) {
            $(this).removeClass('CheckBg').siblings('.checkAll').removeClass('CheckBg');
        } else {
            $(this).addClass('CheckBg');
            if ($(this).siblings('.checkSingle.CheckBg').length == $(this).parent('.catalogue').find('.checkSingle').length - 1) {
                $(this).siblings('.checkAll').addClass('CheckBg')
            }
        }
    });
    //上传医师资格证，记录文件名添加到span里
    var doctorCardFront;
    upload.onchange = function () {
        var fileObj = new FormData();
        olf.innerHTML = upload.files[0].name;
        photo1.push(upload.files[0]);
        fileObj.append("file", upload.files[0]);
        doctorCardFront = getResponseJsonByAjax("POST", uploadFileUrl, fileObj);
    }
    var signatureImg = new FormData();
    var signature;
    //上传签名，记录文件名添加到span里
    uploadTwo.onchange = function () {
        var fileObj = new FormData();
        uhs.innerHTML = uploadTwo.files[0].name;
        photo2.push(uploadTwo.files[0]);
        fileObj.append("file", uploadTwo.files[0]);
        signature = getResponseJsonByAjax("POST", uploadFileUrl, fileObj);
    }
    /** textarea 标签随着文本的高度实现自适应 */
    $('.text-adaption').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    // 注册按钮点击事件
    $('.enroll_button').click(function () {
        if (!RegExpObj.Reg_mobilePhone.test(Name.val())) {
            layer.msg('请检查用户名');
        } else if (!RegExpObj.Reg_PassWord.test(passWord.val())) {
            layer.msg('请检查密码');
        } else if (passWord.val() != passwords.val()) {
            layer.msg('请检查确认密码');
        } else if (!RegExpObj.Reg_Name.test($('.name').val())) {
            layer.msg('请检查姓名');
        } else if (!RegExpObj.Reg_isPhone.test($('.phone').val())) {
            layer.msg('请检查手机号');
        } else if ($('.quiz1').val() == '') {
            layer.msg('请选择医院');
        } else if ($('.quiz3').val() == '') {
            layer.msg('请选择科室');
        } else if ($('.quiz5').val() == '') {
            layer.msg('请选择职称');
        } else if ($('.quiz4').val() == '') {
            layer.msg('请选择专家类型');
        } else {
            //禁用注册按钮
            $(".enroll_button").attr({"disabled": "disabled"});
            var caseTypeJsonStr = "{";
            for (var i = 0; i < $('.checkSingle.CheckBg').length; i++) {
                var a = $('.checkSingle.CheckBg').eq(i).attr('name');
                var b = $('.checkSingle.CheckBg').eq(i).html();
                var c = $('.checkSingle.CheckBg').eq(i).attr('parentName');
                caseTypeJsonStr += "'" + a + "':'" + c + "-" + b + "',";
            }
            caseTypeJsonStr = caseTypeJsonStr.substring(0, caseTypeJsonStr.length - 1);
            caseTypeJsonStr += "}";
            var data = new FormData();
            data.append("userName", $('.name').val());
            data.append("userPhone", $('.userName').val());
            data.append("userPassword", $('.passWord').val());
            data.append("telephone", $('.phone').val());
            data.append("rolesId", $('.quiz2').val());
            data.append("hospitalId", $('.quiz1').val());
            data.append("branchId", $('.quiz3').val());
            data.append("titleName", $('.quiz5').val());
            data.append("specialistTypeId", $('.quiz4').val());
            data.append("userStrong", $("#textAdaotion").val());
            data.append("consultationPicturePrice", $("#consultationPicturePrice").val());
            data.append("consultationVideoPrice", $("#consultationVideoPrice").val());
            data.append("idTypeName", caseTypeJsonStr);
            data.append('doctorCardFront', doctorCardFront);
            data.append("signature", signature);
            data.append("managerHospitalDeptId", managerHospitalDeptId);
            ajaxRequest("POST", registrationUrl, data, false, false, true, renderRegistrationSuccessful, function () {
                $('.tip1').html('* 手机号码已经注册过了!');
            }, null);

        }
    });
});
