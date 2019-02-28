$(function () {
    // 登录账号input失去焦点时所触发的函数
    $('#iphoneInputIn').blur(function () {
        // 账号的验证 手机号验证
        if (!RegExpObj.Reg_mobilePhone.test($(this).val())) {
            $("#an").css("display", "block");
        }
    }).focus(function () {
        $("#an").css("display", "none");
    });
    //密码输入框事件
    $('#passwordUp').blur(function () {
        if ($(this).val() == '') {
            $("#pw").css("display", "block");
        }
    }).focus(function () {
        $("#pw").css("display", "none");
    });
    //  鼠标点击登录按钮 执行login函数
    $('.loginBtn').click(function () {
        if (!RegExpObj.Reg_mobilePhone.test($('#iphoneInputIn').val())) {
            $("#an").css("display", "block");
        } else {
            $("#an").css("display", "none");
            $("#pw").css("display", "none");
            var index = layer.msg('请勿重复操作,正在处理...', {icon: 16, shade: 0.3, time: 0});
            var data = new FormData();
            data.append("userPhone", $('#iphoneInputIn').val());
            data.append("userPassword", $('#passwordUp').val());
            ajaxRequest("POST", loginUrl, data, false, false, true, loginSuccess, loginFailed, null);

            function loginFailed(data) {
                layer.msg(data.result, {time: 2000});
            }

            /**登陆成功回调方法*/
            function loginSuccess(responseJson) {
                localStorage.setItem('userInfo', JSON.stringify(responseJson));
                localStorage.setItem('token', responseJson.id);
                localStorage.setItem('token', responseJson.id);
                layer.close(index);
                if (responseJson.telephone === "18888888888" || responseJson.telephone === "17777777777") {
                    localStorage.setItem('rolesName', "医政");
                    window.location.href = '/page/administrator.html';
                } else {
                    localStorage.setItem('rolesName', "医生");
                    layer.closeAll();
                    window.location.href = '/page/morkbench.html';
                }
            }
        }
    });
    // 点击回车调用按钮点击事件
    $("body").keydown(function (event) {
        if (event.keyCode == "13") {
            $('.loginBtn').click();
        }
    });
});
