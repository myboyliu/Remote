$(function () {
    /** 转诊退回按钮 */
    $("#sendBackReferralBtn").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['1060px', '480px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('#sendBackReferralBox'),
        });
    })
    $("#sendBackReferralBoxYesBtn").click(function () {
        console.log(applyFormId);
        console.log($('#sendBackReferralBoxText').val().replace(/\s+/g,""));

        if ($('#sendBackReferralBoxText').val().replace(/\s+/g,"") == '') {
            $("#alertText").html("请填写退回原因");
            alertMessage();
            return false;

        } else {
            return false;
            let formData = new FormData();
            formData.append("applyFormId",applyFormId);
            formData.append("refuseRemark",$('#sendBackReferralBoxText').val());
            ajaxRequest("POST",sirTransferCheckReject,formData,false,false,false,sendBackSuccess,sendBackFailed,null)
            function sendBackSuccess() {
                layer.closeAll();
                $('.referBox').hide();
                $("#alertText").html("退回成功");
                alertMessage();
                setTimeout(function () {
                    window.location = '../page/administrator.html'
                }, 2000);
            }
            function sendBackFailed() {
                $("#alertText").html("退回失败");
                alertMessage();
                layer.closeAll();
                $('.referBox').hide();
            }
        }
    })

    /** 通过按钮 */
    $("#throughReferralBtn").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('#throughReferralBox')
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

    /** 拒绝按钮 */
    $("#refuseReferralBtn").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['1060px', '480px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('#refuseReferralBox'),
        });
    })
    /** 接收按钮 */
    $("#receiveReferralBtn").click(function () {
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
    $("#receiveReferralBoxYesBtn").click(function () {
        let data = new FormData();
        data.append("id", applyFormId);
        ajaxRequest("POST", sirTransferMasterAccede, data, false, false, true, sirTransferMasterAccedeSuccess, failedParamFeadBack, null);

        function sirTransferMasterAccedeSuccess(responseData) {
            console.log(responseData);
            layer.closeAll();
            $("#alertText").html("接收成功");
            alertMessage();
            setTimeout(function () {
                window.location = '../page/administrator.html';
            }, 2000);
        }

        function failedParamFeadBack(failedParam) {
            console.log(failedParam);
            layer.closeAll();
            $("#alertText").html("接收失败");
            alertMessage();
        }
    })
    /** 拒收确定按钮 */
    $('#refuseReferralBoxBtn').click(function () {
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