$(function () {
    if (JSON.parse(localStorage.getItem('sendOrderData'))) {
        var data = JSON.parse(localStorage.getItem('sendOrderData'));
        console.log(data);
        let caseSummaryStr = data.caseSummary;
        if (caseSummaryStr.length > 100) {
            caseSummaryStr = caseSummaryStr.substring(0, 100) + "...";
        }
        $('.case').html(caseSummaryStr);
        $('.recipient').html(data.inviteSummary);
        $('.sender').html(data.applySummary);
        $('.details').attr('name', data.id);
    }
    $('.goIndex').click(function () {
        window.location = '../page/morkbench.html';
    })
    $('.backward').click(function () {
        window.location = '../page/createCase.html';
    })

    // 查看此订单按钮 怎么跳到相应的订单页面

    $('.details').click(function () {
        localStorage.setItem('applyFormId', data.id);
        window.location = '../page/doctorApplyInfo.html';
    })

})
