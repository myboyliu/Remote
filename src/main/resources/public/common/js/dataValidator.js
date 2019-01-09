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
    if (!RegExpObj.Reg_Name.test($('#username').val()) || !RegExpObj.Reg_IDCardNo.test($('#idCard').val()) || !RegExpObj.Reg_age.test($('#age').val()) || !RegExpObj.Reg_hight.test($('#high').val()) || !RegExpObj.Reg_weight.test($('#weight').val()) || !RegExpObj.Reg_mobilePhone.test($('#phone').val()) || !RegExpObj.Reg_address.test($('#address').val()) || $('#createCase_textDiagnose').val() === '' || $('#createCase_textGola').val() === '') {
        var _$ = layui.jquery;
        layer.open({
            type: 1,
            title: '',
            area: ['300px', '80px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            time: 2000,
            content: _$('.modifier'),
        });
        setTimeout(function () {
            $('.modifier').hide();
        }, 2000);
        return true;
    }
    return false;
}