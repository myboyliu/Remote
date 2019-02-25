$(function () {
    if(JSON.parse(sessionStorage.getItem('sendOrderData'))){
        var data = JSON.parse(sessionStorage.getItem('sendOrderData'));
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

    $('.details').click(function(){
        sessionStorage.setItem('applyFormId', data.id);
        window.location = '../page/doctorApplyInfo.html';
    })

})
