$(function () {
    if(JSON.parse(sessionStorage.getItem('sendOrderData'))){
        var data = JSON.parse(sessionStorage.getItem('sendOrderData'));
        console.log(data);

        $('.case').html(data.caseSummary);
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
        window.location = ' ../page/Rfinish.html';
    })

})
