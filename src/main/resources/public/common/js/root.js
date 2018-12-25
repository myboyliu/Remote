﻿// var IP = 'http://47.104.136.124:8080/'; //云
// var IP = 'http://192.168.0.123:8080/'; // 丁
// var IP = 'http://192.168.0.125:8080/'; // 薛
var IP = 'http://192.168.0.222:8080/'; // 服务器

var imgIp = 'http://192.168.0.222:8080/'; //图片ip地址
// var imgIp = 'http://47.104.136.124:8080/'; //图片ip地址
var RegExpObj = {
    Reg_IDCardNo: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/, // 身份证
    Reg_isPhone: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3,4,6,5,7,8]\d{9})$)/, // 手机号和座机号
    Reg_mobilePhone: /^[1][3,4,5,6,7,8][0-9]{9}$/, //手机号
    Reg_isMob: /^(\d3,4|\d{3,4}-)?\d{7,8}$/,
    Reg_PassWord: /(?![a-z]+$|[0-9]+$|_+$)^[a-zA-Z0-9_]{8,16}$/, // 登录密码

    Reg_Number: /^\d+$/, // 验证数字
    Reg_hight: /^[1-9]\d{0,2}$/, //身高体重
    Reg_age: /^[0-9]{1,2}$/, //验证年龄
    Reg_Name: /[a-zA-Z]{1,20}|[\u4e00-\u9fa5]{1,10}/, //验证名字
    Reg_Text: /[0-9a-zA-Z\u4e00-\u9fa5`~!@#$^&*\\()=|{}':;',\\\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]/,
    Reg_email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/, //邮箱
    Reg_address: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, //验证城市 中英数
    RegExp_File: /\(|\)|【|】/g //匹配文件名
};

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
    if (localStorage.getItem('rolesName') == '医政') {
        $('.guide > li[type=0]').hide();
    } else {
        $('.guide > li[type=1]').hide();
    }

    // 个人中心

    // $('.name').html(localStorage.getItem('name'))
    // $('.occupationName').html(localStorage.getItem('occupationName'))
    // $('.deptName').html(localStorage.getItem('deptName'))
    // $('.hospitalName').html(localStorage.getItem('hospitalName'))
    $('.personalCenter').html(localStorage.getItem('name') + '/' + localStorage.getItem('hospitalName'));
    // $('personalCenter').html("本医生")
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
            // localStorage.removeItem('token');
            localStorage.clear();
            window.location = "../page/login.html";
        }
    });
    $('.searchBtn').click(function () {
        localStorage.setItem('searchText', $('.searchInput').val());
        window.location = '../page/seek.html';
    });
    $('.searchInput').keydown(function (e) {
        if (e.keyCode == 13) {
            localStorage.setItem('searchText', $('.searchInput').val());
            window.location = '../page/seek.html';
        }
    });
});
