$(function () {
    /**  首诊退回弹窗 */
    $('#sendBackConsultationBtn').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('#sendBackConsultationBox')
        });
    });
    /** 首诊退回确定按钮 */
    $("#sendBackConsultationBoxYesBtn").click(function () {
        let data = new FormData();
        data.append("applyFormId", applyFormId);
        ajaxRequest("POST", sirSendCheckReject, data, false, false, true, sirSendCheckRejectSuccess, null, null);

        function sirSendCheckRejectSuccess(result) {
            layer.closeAll();
            $(".inviteObj").hide();
            $("#alertText").html("退回成功");
            alertMessage();
            setTimeout(function () {
                $('.returned').hide();
                window.location = '../page/administrator.html';
            }, 2500)
        }
    });

    /** 首诊审核发布弹窗 */
    $('#auditConsultationBtn').click(function () {
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('#auditConsultationBox')
        });
    });
    /** 首诊发布确认按钮 */
    $("#auditConsultationBoxYesBtn").click(function () {
        let data = new FormData();
        data.append("applyFormId", applyFormId);
        ajaxRequest("POST", sirSendCheckAccede, data, false, false, true, sirSendCheckAccedeSuccess, null, null);

        function sirSendCheckAccedeSuccess(result) {
            layer.closeAll();
            $("#alertText").html("发布成功");
            alertMessage();
            setTimeout(function () {
                $('.returned').hide();
                window.location = '../page/administrator.html';
            }, 2000)
        }
    });
    /** 会诊医政接收弹窗*/
    $("#receiveConsultationBtn").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$("#receiveConsultationBox")
        });
    });
    /** 会诊医政  待收诊状态 接收确认按钮*/
    $("#receiveConsultationBoxYesBtn").click(function () {
        if (!applyInfo.inviteUserId) {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请先分配主会诊医生");
            alertMessage();
        } else if ($('#consultationDateTimeList >p').length !== 1 && applyInfo.applyType !== "APPLY_CONSULTATION_IMAGE_TEXT") {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请选定会诊时间");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("applyFormId", applyFormId);
            ajaxRequest("POST", sirReceiveMasterAccede, data, false, false, true, sirReceiveMasterAccedeSuccess, null, null);

            //接收 成功回调
            function sirReceiveMasterAccedeSuccess() {
                $('.submitBox').hide();
                $("#alertText").html("接收成功");
                alertMessage();
                setTimeout(function () {
                    window.location = '../page/administrator.html'
                }, 2000)
            }

            return false;
        }
    });
    /** 会诊医政  专家协调状态 接收确认按钮*/
    $("#MDTConsultationBoxYesBtn").click(function () {
        if (!applyInfo.inviteUserId) {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请先分配主会诊医生");
            alertMessage();
        } else if ($('#consultationDateTimeList >p').length !== 1 && applyInfo.applyType !== "APPLY_CONSULTATION_IMAGE_TEXT") {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请选定会诊时间");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("applyFormId", applyFormId);
            ajaxRequest("POST", sirReceiveHarmonizeAccede, data, false, false, true, sirReceiveHarmonizeAccedeSuccess, null, null);

            //接收 成功回调
            function sirReceiveHarmonizeAccedeSuccess() {
                $('.submitBox').hide();
                $("#alertText").html("接收成功");
                alertMessage();
                setTimeout(function () {
                    window.location = '../page/administrator.html'
                }, 2000)
            }

            return false;
        }
    });
    /** 会诊医政  排期审核状态  接收确认按钮*/
    $("#examineConsultationBoxYesBtn").click(function () {
        if (!applyInfo.inviteUserId) {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请先分配主会诊医生");
            alertMessage();
        } else if ($('#consultationDateTimeList >p').length !== 1 && applyInfo.applyType !== "APPLY_CONSULTATION_IMAGE_TEXT") {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请选定会诊时间");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("applyFormId", applyFormId);
            ajaxRequest("POST", sirReceiveDateCheckAccede, data, false, false, true, sirReceiveDateCheckAccedeSuccess, null, null);

            //接收 成功回调
            function sirReceiveDateCheckAccedeSuccess() {
                $('.submitBox').hide();
                $("#alertText").html("接收成功");
                alertMessage();
                setTimeout(function () {
                    window.location = '../page/administrator.html'
                }, 2000)
            }
            return false;
        }
    });

    /** MDT协调/确认协调 弹窗*/
    $('#MDTConsultationBtn,#toBeMDTConsultationBtn').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('#MDTConsultationBox')
        });
    });
    /** 会诊医政审核通过弹窗*/
    $("#examineConsultationBtn").click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$("#examineConsultationBox")
        });
    });

    /** 拒收弹窗 */
    $('#refuseConsultationBtn').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['1060px', '480px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('#refuseConsultationBox'),
        });
        document.documentElement.style.overflow = "hidden";
    });
    $('textarea').focus(function () {
        //  $('.font').css('display','none');
        $('.font').hide();
    }).blur(function () {
        if ($(this).val() == "") {
            $('.font').show();
        } else {
            $('.font').hide();
        }
    });
    $('.font').click(function () {
        $(this).hide();
        $('textarea').focus();
    });
    let viewText = '建议多学科会诊:';
    /* 建议多学科会诊按钮点击事件  */
    $('.suggest').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        });
        $('.otherCause').removeAttr('style');
        viewText = '建议多学科会诊:';
    });
    /* 其他原因按钮点击事件  */
    $('.otherCause').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        });
        $('.suggest').removeAttr('style');
        viewText = '其他原因:';
    });
    /* 拒收确定按钮 */
    $('#refuseConsultationBoxBtn').click(function () {
        if ($('.refuseReason').val() == '') {
            $("#alertText").html("请填写拒收原因");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("applyFormId", applyFormId);
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


});