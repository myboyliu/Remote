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
    $("#throughBackReferralBoxYesBtn").click(function () {
        let data = new FormData();
        data.append("id", applyFormId);
        ajaxRequest("POST", sirTransferCheckAccede, data, false, false, true, sirTransferCheckAccedeSuccess, failedParamFeadBack, null);
        function sirTransferCheckAccedeSuccess(responseData) {
            console.log(responseData);
            layer.closeAll();
            $("#alertText").html("审核通过");
            alertMessage();
            setTimeout(function () {
                window.location = '../page/administrator.html';
            }, 2000);
        }
        function failedParamFeadBack(failedParam) {
            console.log(failedParam);
            layer.closeAll();
            $("#alertText").html("审核失败");
            alertMessage();
        }
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
        document.documentElement.style.overflow = "hidden";
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

    /** 拒收确定按钮 */
    $('#refuseBackReferralBoxBtn').click(function () {
        if ($('.refuseReason').val() == '') {
            $("#alertText").html("请填写拒收原因");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("id", applyFormId);
            data.append("report", viewText + $('.refuseReason').val());
            console.log(viewText + $('.refuseReason').val());
            ajaxRequest("POST", sirReceiveMasterReject, data, false, false, true, sirReceiveMasterRejectSuccess, null, null);

            function sirReceiveMasterRejectSuccess(result) {
                $("#alertText").html("拒收成功");
                alertMessage();
                setTimeout(function () {
                    window.location = '../page/administrator.html';
                }, 2000);
            }
        }
    });

    $(".noBtn").click(function () {
        layer.closeAll();
        $(".rejectBox").hide();
    })

})