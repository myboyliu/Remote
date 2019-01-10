$(function () {
    /**  会诊退回按钮弹出层 */
    $('.sendBack').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('.inviteObj')
        });
    });
// 弹出层取消按钮
    $(".inviteObj").find('.agin').click(function () {
        layer.closeAll();
        $('.inviteObj').hide();
    });
// 弹出层是的按钮
    $(".inviteObj").find('.yes').click(function () {
        let data = new FormData();
        data.append("id", applyFormId);
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

    /** 审核发布按钮接口 */
    $('.audit').click(function () {
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('.auditObj')
        });
    });

    $(".auditObj").find(".agin").click(function () {
        layer.closeAll();
        $('.auditObj').hide();
    });
    $(".auditObj").find(".yes").click(function () {
        let data = new FormData();
        data.append("id", applyFormId);
        ajaxRequest("POST", sirSendCheckAccede, data, false, false, true, sirSendCheckAccedeSuccess, null, null);

        function sirSendCheckAccedeSuccess(result) {
            $("#alertText").html("发布成功");
            alertMessage();
            $('.succeed').hide();
            window.location = "../page/administrator.html";
        }
    });
    /**MDT协调按钮*/
    $('.MDTBtn').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('.MDTBox'),
        });
    });
    /** 会诊医政接收按钮*/
    $('.accept').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('.Receive'),
        });
    });

    $('.submitBox .noBtn').click(function () {
        layer.closeAll();
        $('.submitBox').hide();
    });

    $('.submitBox .acceptBtn').click(function () {
        if (!applyInfo.inviteUserId) {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请先分配主会诊医生");
            alertMessage();
        } else if ($('.schedule_modules >p').length !== 1 && applyInfo.applyType !== "APPLY_CONSULTATION_IMAGE_TEXT") {
            layer.closeAll();
            $('.submitBox').hide();
            $("#alertText").html("请选定会诊时间");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("id", applyFormId);
            ajaxRequest("POST", sirReceiveMasterAccede, data, false, false, true, sirReceiveMasterAccedeSuccess, null, null)

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
    /** 拒收按钮事件 */
    $('#refuseConsultation').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['1060px', '480px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('#refuseConsultationBox'),
        });
        // $('#refuseConsultationBox').css('display', 'block');
        // // $('.background').css('display', 'block');
        // $('.re_layer').css('display', 'block');
        // /* 开启弹层禁止屏幕滚动 */
        // document.documentElement.style.overflow = "hidden";
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
    let viewText;
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
    $('.confirm').click(function () {
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
    /** 弹层关闭按钮 */
    $('.refuseBtn').click(function () {
        $('.background').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    });

    function alertMessage() {
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            time: 2000,
            zIndex: layer.zIndex,
            content: _$('#alertBox')
        });
    }
});