$(function () {
    /** 转诊退回按钮 */
    $("#sendBackReferral").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('#sendBackReferralBox')
        });
    })
    /** 通过按钮 */
    $("#throughBackReferral").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('#throughBackReferralBox')
        });
    })
    /** 取消按钮*/
    $("#cancelBackReferral").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('#cancelBackReferralBox')
        });
    })
    /** 同意按钮 */
    $("#agreeBackReferral").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('#agreeBackReferralBox')
        });
    })
    /** 拒绝按钮 */
    $("#refuseBackReferral").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['1060px', '480px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('#refuseBackReferralBox'),
        });
    })
    /** 接收按钮 */
    $("#receiveBackReferral").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('#receiveBackReferralBox')
        });
    })

    $(".noBtn").click(function () {
        layer.closeAll();
        $(".rejectBox").hide();
    })

})