$(function () {
    /** 编辑会诊报告 */
    $('.compileReport').click(function () {
        if(isMainDoctor){
            window.location = "../page/doctorEnjoin.html"
        }else{
            for (let item of consultantReport) {
                if (item.doctorId === userInfo.id) {
                    if (item.reportStatus === "0") {
                        $('.hold').attr('disabled', true);
                        $('.refer').attr('disabled', true);
                        $('.hold').addClass('disabled');
                        $('.refer').addClass('disabled');
                        $('#textarea').attr('disabled', 'disabled');
                    }
                    $('#textarea').val(item.report);
                }
            }
            layer.open({
                type: 1,
                title: '',
                area: ['1060px', '480px'],
                closeBtn: false,
                shade: [0.7, '#000000'],
                shadeClose: false,
                content: _$('#consultantReportIframe')
            });
        }
    })
    /* 编辑会诊报告提交按钮 */
    $('.refer').click(function () {
        for (let i = 1, len = consultantReport.length; i < len; i++) {
            if (isMainDoctor && consultantReport[i].reportStatus === "1") {
                // $('#consultantReportIframe').css('display', 'none');
                layer.open({
                    type: 1,
                    title: '',
                    area: ['500px', '200px'],
                    closeBtn: false,
                    //shade: [0.7, '#000000'],
                    shadeClose: false,
                    zIndex: layer.zIndex,
                    time: 1000,
                    content: $('.promptText')
                });
                setTimeout(function () {
                    $('.promptText').hide();
                }, 1000)
                return false;
            }
        }
        for (const item of consultantReport) {
            if (item.doctorId === userInfo.id) {
                item["report"] = $('#textarea').val();
                item["reportStatus"] = "0";
            }
        }
        let data = new FormData();
        data.append("applyFormId", applyFormId);
        data.append("report", JSON.stringify(consultantReport));
        if (!isMainDoctor) {
            ajaxRequest("POST", doctorSendFeedbackReportMoment, data, false, false, true, success, failed, null);
        } else {
            ajaxRequest("POST", doctorSendFeedbackReport, data, false, false, true, success, failed, null);
        }

        function success() {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                //   shade: [0.7, '#000000'],
                shadeClose: false,
                zIndex: layer.zIndex,
                time: 2000,
                content: $('.working')
            });
            $('.working').html('提交成功')
            setTimeout(function () {
                window.location = "../page/morkbench.html"
            }, 2000);
        }

        function failed() {
            // 其他操作
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                //   shade: [0.7, '#000000'],
                shadeClose: false,
                zIndex: layer.zIndex,
                time: 2000,
                content: $('.working')
            });
            $('.working').html('提交失败')
        }
    })
    /* 编辑会诊报告暂存按钮 */
    $('.hold').click(function () {
        for (const item of consultantReport) {
            if (item.doctorId === userInfo.id) {
                item["report"] = $('#textarea').val();
            }
        }
        let data = new FormData();
        data.append("report", JSON.stringify(consultantReport));
        data.append("applyFormId", applyFormId);
        ajaxRequest("POST", doctorSendFeedbackReportMoment, data, false, false, true, success, failed, null);
        console.log(consultantReport);

        function success() {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                //   shade: [0.7, '#000000'],
                shadeClose: false,
                zIndex: layer.zIndex,
                // time: 2000,
                content: $('.working')
            });
            $('.working').html('暂存成功')
            setTimeout(function () {
                layer.closeAll();
                $('.working').hide();
                $('.background').hide();
                $('.rejectionLayer').hide();

            }, 2000);
            document.documentElement.style.overflow = "scroll";
        }

        function failed() {
            // 其他操作
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                //   shade: [0.7, '#000000'],
                shadeClose: false,
                zIndex: layer.zIndex,
                time: 2000,
                content: $('.working')
            });
            $('.working').html('暂存失败')
        }

    })

    /** 编辑临床反馈 */
    $('#editConsultationFeedbackBtn').click(function () {
        layer.open({
            type: 1,
            title: '',
            area: ['1060px', '480px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: _$('#consultationFeedbackBox')
        });

        $('#consultantFeedbackValue').val(applyInfo.consultantFeedback);
    })

    /** 编辑临床反馈提交按钮 /order/feedBack 首诊反馈 */
    $('.feed_SM').click(function () {
        let newConsultantFeedback = $('.feedback_Val').val();
        let data = new FormData();
        data.append("consultantFeedback", newConsultantFeedback);
        data.append("applyFormId", applyFormId);
        ajaxRequest("POST", doctorSendFeedbackReport, data, false, false, true, doctorSendFeedbackReportSuccess, doctorSendFeedbackReportFailed, null);

    })
    /** 编辑临床反馈暂存按钮 */
    $('.feed_TS').click(function () {
        let newConsultantFeedback = $('.feedback_Val').val();
        let data = new FormData();
        data.append("applyFormId", applyFormId);
        data.append("consultantFeedback", newConsultantFeedback);
        ajaxRequest("POST", doctorSendFeedbackReportMoment, data, false, false, true, doctorSendFeedbackReportMomentSuccess, doctorSendFeedbackReportMomentFailed, null);
    })

    function doctorSendFeedbackReportSuccess(result) {
        layer.closeAll();
        $('#alertText').html('提交成功');
        alertMessage();
        setTimeout(function () {
            window.location = '../page/morkbench.html'
        }, 2000);
        getApplyInfo();
    }

    function doctorSendFeedbackReportFailed(result) {
        $('#alertText').html('提交失败');
        alertMessage();
    }

    function doctorSendFeedbackReportMomentSuccess(result) {
        layer.closeAll();
        $('#alertText').html('保存成功');
        alertMessage();
        setTimeout(function () {
            $('.alertBox').hide();
        }, 2000);
        getApplyInfo();
    }

    function doctorSendFeedbackReportMomentFailed(result) {
        $('#alertText').html('保存失败');
        alertMessage();
    }

    /** 拒收 申请 操作 事件 */
    $('.rejection').click(function () {
        if (isInvite) {
            $('#rejectIframe').css('display', 'block');
            $('#rejectView').css('display', 'block');
            document.documentElement.style.overflow = "hidden";
        } else {
            layer.msg('只有主会诊医生才能进行此操作');
        }
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
    })
    let viewText;
    /* 建议多学科会诊按钮点击事件  */
    $('.suggest').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        })
        $('.otherCause').removeAttr('style');
        viewText = '建议多学科会诊:';
    })
    /* 其他原因按钮点击事件  */
    $('.otherCause').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        })
        $('.suggest').removeAttr('style');
        viewText = '其他原因:';
    })
    /* 弹层关闭按钮 */
    $('.refuseBtn').click(function () {
        $('.background').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    })
// 拒绝确定按钮
    $('.confirm').click(function () {
        if ($('.refuseReason').val() == '') {
            $("#alertText").html("请填写拒收原因");
            alertMessage();
        } else {
            let data = new FormData();
            data.append("id", applyFormId);
            data.append("report", viewText + $('.refuseReason').val());
            ajaxRequest("POST", doctorReceiveReject, data, false, false, true, doctorReceiveRejectSuccess, null, null)

            function doctorReceiveRejectSuccess(result) {
                $("#alertText").html("拒收成功");
                alertMessage();
                setTimeout(function () {
                    window.location = '../page/morkbench.html'
                }, 1000);
            }
        }
    })

// MDT协调按钮     MDTBtn
    $('.MDTBtn').click(function () {
        window.location = '../page/MTD.html';
    })

    //受邀医生接收 会诊申请按钮点击事件
    $("#receiveConsultationBtn").click(function () {
        if (!isVideo) {
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '200px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                content: _$('#receiveConsultationBox'),
            });
        } else {
            isOnly = true;
            showTimeView(applyTimeList)
        }
    })
    $("#receiveConsultationBoxYesBtn").click(function () {
        
    })
    $("#receiveConsultationTimeBoxYesBtn").click(function () {
        dateList = [];
        for (let i = 0; i < newDateTimeList.length; i++) {
            if (newDateTimeList[i].startIndex <= newDateTimeList[i].endIndex) {
                dateList.push({
                    'startTime': newDateTimeList[i].date + ' ' + $('#timeUl > li').eq(newDateTimeList[i].startIndex).html() + ':00',
                    'endTime': newDateTimeList[i].date + ' ' + $('#timeUl > li').eq(newDateTimeList[i].endIndex).attr('enddate') + ':00'
                });
            } else {
                dateList.push({
                    'startTime': newDateTimeList[i].date + ' ' + $('#timeUl > li').eq(newDateTimeList[i].endIndex).html() + ':00',
                    'endTime': newDateTimeList[i].date + ' ' + $('#timeUl > li').eq(newDateTimeList[i].startIndex).attr('enddate') + ':00'
                });
            }

        }
        if (dateList.length === 0) {
            $("#alertText").html("请选择排期时间!");
            alertMessage();
            return false;
        }
        let data = new FormData();
        data.append("applyFormId", applyFormId);
        data.append("startEndTime", JSON.stringify(dateList));
        if (isMainDoctor) {
            ajaxRequest("POST", mainDoctorAccede, data, false, false, true, sirUpdateDateSuccess, null, null)
        } else if (isBranchDoctor) {
            ajaxRequest("POST", doctorAcceptOther, data, false, false, true, sirUpdateDateSuccess, null, null)
        }

        function sirUpdateDateSuccess(result) {
            $("#alertText").html("接收成功");
            alertMessage();
            setTimeout(function () {
                window.location = '../page/morkbench.html'
            }, 2000);
            return false;
        }
    })
});