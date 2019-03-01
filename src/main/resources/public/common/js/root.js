let stompClient = null;

function connectServer(token) {
    //地址+端点路径，构建websocket链接地址,注意，对应config配置里的addEndpoint
    let socket = new SockJS(baseUrl + "/myUrl?token=" + token);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        //监听的路径以及回调
        stompClient.subscribe('/user/queue/sendUser', function (response) {
            console.log(response.body);
        });
    });
}

function disconnectServer() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function send() {
    let name = $('#name').val();
    let message = $('#messgae').val();
    /*//发送消息的路径,由客户端发送消息到服务端
    stompClient.send("/sendServer", {}, message);
    */
    /*// 发送给所有广播sendTopic的人,客户端发消息，大家都接收，相当于直播说话 注：连接需开启 /topic/sendTopic
    stompClient.send("/sendAllUser", {}, message);
    */
    /* 这边需要注意，需要启动不同的前端html进行测试，需要改不同token ，例如 token=1234，token=4567
    * 然后可以通过写入name 为token  进行指定用户发送
    */
    stompClient.send("/sendMyUser", {}, JSON.stringify({name: name, message: message}));
}

let RegExpObj = {
    Reg_IDCardNo: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/, // 身份证
    Reg_isPhone: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3,4,6,5,7,8]\d{9})$)/, // 手机号和座机号
    Reg_mobilePhone: /^[1][3,4,5,6,7,8][0-9]{9}$/, //手机号
    Reg_isMob: /^(\d3,4|\d{3,4}-)?\d{7,8}$/,
    Reg_PassWord: /(?![a-z]+$|[0-9]+$|_+$)^[a-zA-Z0-9_]{8,16}$/, // 登录密码

    Reg_Number: /^\d+$/, // 验证数字
    Reg_hight: /^\b[1-9]\d\b|\b[1-2]\d\d\b|\b300\b$/, //身高体重
    Reg_weight: /^\b[1-9]\b|\b[1-9]\d\b|\b[1-2]\d\d\b|\b300\b$/, //体重
    Reg_age: /^[0-9]{1,2}$/, //验证年龄
    Reg_Name: /[a-zA-Z]{2,20}|[\u4e00-\u9fa5]{2,10}/, //验证名字
    Reg_Text: /[0-9a-zA-Z\u4e00-\u9fa5`~!@#$^&*\\()=|{}':;',\\\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]/,
    Reg_email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/, //邮箱
    Reg_address: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, //验证城市 中英数
    RegExp_File: /\(|\)|【|】/g //匹配文件名
};
let currentUserInfo = {};

function double(num) {
    var str = Number(num) < 10 ? '0' + num : '' + num;
    return str;
}

// nav
$(function () {
    if (!localStorage.getItem('token')) {
        window.location = "/page/login.html";
    }
    // 0医生  1医政
    if (localStorage.getItem('rolesName') === '医政') {
        $('.guide > li[type=0]').hide();
    } else {
        $('.guide > li[type=1]').hide();
    }

    // 个人中心
    // $('.name').html(localStorage.getItem('name'))
    // $('.occupationName').html(localStorage.getItem('occupationName'))
    // $('.deptName').html(localStorage.getItem('deptName'))
    // $('.hospitalName').html(localStorage.getItem('hospitalName'))
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    currentUserInfo = JSON.parse(localStorage.getItem('userInfo'))
    // console.log(userInfo);
    $('.personalCenter').html(userInfo.userName + '/' + userInfo.hospitalName);
    $('div.personal').mouseenter(function () {
        $(this).find('ul').show();
    });
    $('div.personal').mouseleave(function () {
        $('.personal').find('ul').hide();
    });
    // 退出登录
    $('a.loginOut').click(function () {
        ajaxRequest("POST", signOutUrl, null, false, false, false, signOutSuccess, null, null);

        function signOutSuccess(data) {
            localStorage.clear();
            localStorage.clear();
            window.location = "../page/login.html";
        }
    });
    $('.searchBtn').click(function () {
        let searchText = $('.searchInput').val();
        if (searchText.replace(/\s+/g, "").length === 0) {
            layer.msg("搜索内容不能为空!")
            return false;
        }
        localStorage.setItem('searchText', searchText.replace(/\s+/g, ""));
        window.location = '../page/seek.html';
    });
    $('.searchInput').keydown(function (e) {
        if (e.keyCode == 13) {
            let searchText = $('.searchInput').val();
            if (searchText.replace(/\s+/g, "").length === 0) {
                layer.msg("搜索内容不能为空!")
                return false;
            }
            localStorage.setItem('searchText', searchText.replace(/\s+/g, ""));
            window.location = '../page/seek.html';
        }
    });

    connectServer(localStorage.getItem('token'));
});
