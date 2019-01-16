let refuseReferralReasonPrefix = "病床已满:";

function receiveReferralApplySuccess(responseData) {
    console.log(responseData);
    layer.closeAll();
    $("#alertText").html("接收成功");
    alertMessage();
    setTimeout(function () {
        window.location = '../page/morkbench.html';
    }, 2000);
}

function failedParamFeadBack(failedParam) {
    console.log(failedParam);
    layer.closeAll();
    $("#alertText").html("接收失败");
    alertMessage();
}

function refuseReferralApplySuccess(result) {
    $("#alertText").html("拒收成功");
    alertMessage();
    setTimeout(function () {
        window.location = '../page/morkbench.html';
    }, 2000);
}

$(function () {
    /** 发起方操作 */
    /** 接收方操作*/
    /** 拒绝按钮 */
    $("#refuseReferralBtn").click(function () {
        console.log(1233)
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
    $("#isFullRefuseReferralReason").click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        });
        $('#otherRefuseReferralReason').removeAttr('style');
        refuseReferralReasonPrefix = "病床已满:";
    })
    $("#otherRefuseReferralReason").click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        });
        $('#isFullRefuseReferralReason').removeAttr('style');
        refuseReferralReasonPrefix = "其他原因:";
    })
    /** 接收按钮 */
    $("#receiveReferralBtn").click(function () {
        isOnly = true;
        showDateView();
    })
    $("#checkDateBoxYesBtn").click(function () {

        dateList = [];
        let tempHtml = '';
        for (let key in markReferralJson) {
            tempHtml += '<p>' + key + '</p>';
            dateList.push(key);
        }
        $(".schedule_modules").html(tempHtml);
        if (dateList.length === 1) {
            layer.closeAll();
            $(".referralDateSelect").hide();
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                content: _$('#receiveReferralBox')
            });
        } else if (dateList.length === 0) {

        } else {
            $("#alertText").html("当前时间不符合要求，您只能选择一天转诊");
            alertMessage();
        }
    })
    //不发送医政
    $("#receiveBySelfBtn").click(function () {
        let data = new FormData();
        data.append("applyFormId", applyFormId);
        data.append("inquiryDatetime", dateList[0]);
        ajaxRequest("POST", doctorTransDateSure, data, false, false, true, receiveReferralApplySuccess, failedParamFeadBack, null);
    })
    //发送给医政
    $("#sendManagerBtn").click(function () {
        let data = new FormData();
        data.append("applyFormId", applyFormId);
        data.append("inquiryDatetime", dateList[0]);
        ajaxRequest("POST", doctorTransDateCheck, data, false, false, true, receiveReferralApplySuccess, failedParamFeadBack, null);
    })
    /** 拒收确定按钮 */
    $('#refuseReferralBoxBtn').click(function () {
        if ($('#refuseReferralReason').val() == '') {
            $("#alertText").html("请填写拒收原因");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("applyFormId", applyFormId);
            data.append("refuseRemark", refuseReferralReasonPrefix + $('#refuseReferralReason').val());
            ajaxRequest("POST", doctorTransferReject, data, false, false, true, refuseReferralApplySuccess, null, null);
        }
    });

    $(".noBtn").click(function () {
        layer.closeAll();
        $(".rejectBox").hide();
        $(".referBox").hide();
        $(".referralDateSelect").hide();
    })
})