$(function () {
    if(JSON.parse(sessionStorage.getItem('sendOrderData'))){
        var data = JSON.parse(sessionStorage.getItem('sendOrderData'));
        console.log(data);
        sessionStorage.removeItem('sendOrderData');
        console.log(data);

        $('.case').html(data.case);
        $('.recipient').html(data.recipient);
        $('.sender').html(data.sender);
        $('.details').attr('name', data.id);
    }
    $('.goIndex').click(function () {
        window.location = '../page/morkbench.html';
    })
    $('.backward').click(function () {
        window.location = '../page/createCase.html';
    })

    // 查看此订单按钮 怎么跳到相应的订单页面

    $('.details').click(function(){
        localStorage.setItem('orderId', data.id);
        localStorage.setItem('orderType', 3);
        window.location = ' ../page/toAudit.html';
    })

})
