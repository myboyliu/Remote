$(function() {
    var fileAllArr = []; //所有图片原始资源
    var hospitalName = '';
    var hospitalId = '';
    // 选择的医生信息数组
    var favoriteArr = [];
    var hospitalPicArr = [];
    var price = 0;
    // 获取选医生左侧通讯录数据
    $.ajax({
        type: 'GET',
        url: IP + 'hospital/findHospitalDetailList',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        crossDomain: true,
        success: function(data) {
            console.log(data);
            if (data.status == 200) {
                var hospitalArr = data.hospitalListBeanList;
                hospitalId = hospitalArr[0].hospitalId;
                hospitalName = hospitalArr[0].hospitalName;
                var _html = '';
                for (var i = 0; i < hospitalArr.length; i++) {
                    if (localStorage.getItem('orderType') == '0') {
                        // 会诊医政
                        if (localStorage.getItem('hospitalId') == hospitalArr[i].hospitalId) {
                            hospitalPicArr.push({
                                "hospitalId": hospitalArr[i].hospitalId,
                                "hospitalImgPic": hospitalArr[i].price,
                                "hospitalVideoPic": hospitalArr[i].priceVideo
                            });
                            _html += '<li hospitalId="' + hospitalArr[i].hospitalId + '" imgPric="' + hospitalArr[i].price + '" videoPric="' + hospitalArr[i].priceVideo + '" hospitalTel="' + hospitalArr[i].phone + '" class="hospitalItem">\
                        <p class="hospitalName" title="' + hospitalArr[i].hospitalName + '">' + hospitalArr[i].hospitalName + '</p>\
                        <ul class="sectionUl">';
                            var sectionArr = hospitalArr[i].hospitalDeptsManagerBeanList;
                            for (var j = 0; j < sectionArr.length; j++) {
                                _html += '<li class="sectionItem">\
                                <p class="sectionName" title="' + sectionArr[j].parentName + '">' + sectionArr[j].parentName + '</p>\
                                <ul class="deptUl">'
                                var deptArr = sectionArr[j].changeDept;
                                for (var x = 0; x < deptArr.length; x++) {
                                    _html += '<li name="' + deptArr[x].deptHospitalId + '" class="deptItem" title="' + deptArr[x].name + '">' + deptArr[x].name + '</li>'
                                }
                                _html += '</ul>\
                         </li>'
                            }
                            _html += '</ul>\
                    </li>'
                        }
                    } else {
                        hospitalPicArr.push({
                            "hospitalId": hospitalArr[i].hospitalId,
                            "hospitalImgPic": hospitalArr[i].price,
                            "hospitalVideoPic": hospitalArr[i].priceVideo
                        });
                        _html += '<li hospitalId="' + hospitalArr[i].hospitalId + '" imgPric="' + hospitalArr[i].price + '" videoPric="' + hospitalArr[i].priceVideo + '" hospitalTel="' + hospitalArr[i].phone + '" class="hospitalItem">\
                        <p class="hospitalName" title="' + hospitalArr[i].hospitalName + '">' + hospitalArr[i].hospitalName + '</p>\
                        <ul class="sectionUl">';
                        var sectionArr = hospitalArr[i].hospitalDeptsManagerBeanList;
                        for (var j = 0; j < sectionArr.length; j++) {
                            _html += '<li class="sectionItem">\
                                <p class="sectionName" title="' + sectionArr[j].parentName + '">' + sectionArr[j].parentName + '</p>\
                                <ul class="deptUl">'
                            var deptArr = sectionArr[j].changeDept;
                            for (var x = 0; x < deptArr.length; x++) {
                                _html += '<li name="' + deptArr[x].deptHospitalId + '" class="deptItem" title="' + deptArr[x].name + '">' + deptArr[x].name + '</li>'
                            }
                            _html += '</ul>\
                         </li>'
                        }
                        _html += '</ul>\
                    </li>'
                    }

                }
                $('.hospitalUl').html(_html);
                // 默认选项
                $('.hospitalItem').eq(0).addClass('active').find('.sectionUl').show().find('.sectionItem').eq(0).addClass('active').find('.deptUl').slideDown();
                $('.hospitalUl').find('.deptItem').eq(0).addClass('active');
                $('.hospitalUl').css({
                    'width': '145px',
                    'position': 'fixed',
                });
                $('.sectionUl').css({
                    'height': $(window).height() - 230 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
                });
                // 医院价格 和 手机号 处理
                $('.hospitalTel').html(hospitalArr[0].phone);
                favoriteHtml();
                // 获取默认科室的医生
                deptIdGetDoctors($('.hospitalUl').find('.deptItem').eq(0).attr('name'));
            } else if (data.status == 250) {
                window.location = '/yilaiyiwang/login/login.html';
            }
        }
    });
    $.ajax({
        type: 'POST',
        url: IP + 'order/selectOrderById',
        dataType: 'json',
        data: {
            "orderId": localStorage.getItem('orderId'),
            "type": localStorage.getItem('orderType'), //是那个列表的类型(0:医政受邀列表,1:医政发出列表,2:医生受邀列表,3:医生发出列表)
            "readFlag": 1,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        async: false,
        success: function(data) {
            console.log(data)
            if (data.status == 200) {
                if (data.orderFormBean.statesName == "待收诊" || data.orderFormBean.statesName == "排期审核" || data.orderFormBean.statesName == "专家协调" || data.orderFormBean.statesName == "已排期" || data.orderFormBean.statesName == "首诊待审核") {
                    sessionStorage.setItem("data", JSON.stringify(data));
                } else {
                    window.location = "/yilaiyiwang/workbench/workbench.html";
                }
            } else if (data.status == 250) {
                // 未登录操作
                window.location = '/yilaiyiwang/login/login.html';
            } else {
                // 其他操作
            }
        },
        error: function(err) {
            console.log(err);
        },
    })
    if (JSON.parse(sessionStorage.getItem('data'))) {
        var data = JSON.parse(sessionStorage.getItem('data'));
        // 清楚缓存数据
        // sessionStorage.removeItem('data');
        for (var i = 0; i < data.orderDoctorsList.length; i++) {
            for (var j = 0; j < hospitalPicArr.length; j++) {
                if (data.orderDoctorsList[i].hospitalId == hospitalPicArr[j].hospitalId) {
                    if (data.orderDoctorsList[i].firstDoctor == 1) {
                        favoriteArr.unshift({
                            id: data.orderDoctorsList[i].id, // 医生id
                            hospitalName: data.orderDoctorsList[i].hospitalName, // 医院名字
                            hospitalId: data.orderDoctorsList[i].hospitalId, // 医院id
                            deptName: data.orderDoctorsList[i].deptName, // 科室名字
                            deptId: data.orderDoctorsList[i].deptId, // 科室id
                            name: data.orderDoctorsList[i].name, // 医生名字
                            medicalFees: data.orderDoctorsList[i].picPrice, // 图文价格
                            medicalFeesVideo: data.orderDoctorsList[i].avPrice, // 视频价格
                            occupationName: data.orderDoctorsList[i].occupation, // 职称名字
                            occupationId: data.orderDoctorsList[i].occupationId, // 职称id
                            hospitalImgPic: hospitalPicArr[j].hospitalImgPic, // 医院图文价格
                            hospitalVideoPic: hospitalPicArr[j].hospitalVideoPic, // 医院视频价格
                        });
                    } else {
                        favoriteArr.push({
                            id: data.orderDoctorsList[i].id, // 医生id
                            hospitalName: data.orderDoctorsList[i].hospitalName, // 医院名字
                            hospitalId: data.orderDoctorsList[i].hospitalId, // 医院id
                            deptName: data.orderDoctorsList[i].deptName, // 科室名字
                            deptId: data.orderDoctorsList[i].deptId, // 科室id
                            name: data.orderDoctorsList[i].name, // 医生名字
                            medicalFees: data.orderDoctorsList[i].picPrice, // 图文价格
                            medicalFeesVideo: data.orderDoctorsList[i].avPrice, // 视频价格
                            occupationName: data.orderDoctorsList[i].occupation, // 职称名字
                            occupationId: data.orderDoctorsList[i].occupationId, // 职称id
                            hospitalImgPic: hospitalPicArr[j].hospitalImgPic, // 医院图文价格
                            hospitalVideoPic: hospitalPicArr[j].hospitalVideoPic, // 医院视频价格
                        });
                    }
                }
            }
        }
        favoriteHtml();
    }



    // 遍历选择的医生信息
    favoriteHtml();

    function favoriteHtml() {
        var _html = "";
        var imgPric = Number($('.imgPric').attr('imgPric'));
        var videoPric = Number($('.videoPric').attr('videoPric'));
        $('.doctorCount').html(favoriteArr.length);

        if (favoriteArr.length == 0) {
            _html = '<li class="clearfix"><span>主会诊人:未选择</span></li>';
            $('.imgPric').html($('.imgPric').attr('imgPric'));
            $('.videoPric').html($('.videoPric').attr('videoPric'));
        } else {
            for (var i = 0; i < favoriteArr.length; i++) {
                console.log(favoriteArr)
                if (i == 0) {
                    _html += '<li class="clearfix"><span>主会诊人:<' + favoriteArr[i].hospitalName + ';' + favoriteArr[i].deptName + ';' + favoriteArr[i].name + ';' + favoriteArr[i].occupationName + '>;</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
                } else {
                    _html += '<li class="clearfix"><span><' + favoriteArr[i].hospitalName + ';' + favoriteArr[i].deptName + ';' + favoriteArr[i].name + ';' + favoriteArr[i].occupationName + '>;</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
                }
                imgPric += Number(favoriteArr[i].medicalFees);
                videoPric += Number(favoriteArr[i].medicalFeesVideo);
            }
        }
        $('.favoriteUl').html(_html);

    }

    $(window).scroll(function() {
        $('.hospitalUl').css({
            'width': '145px',
            'position': 'fixed',
        })
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
            $('.sectionUl').css({
                'height': $(window).height() - 300 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            })
        } else {
            $('.sectionUl').css({
                'height': $(window).height() - 230 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            })
        }
    });

    // 医院切换
    $('.hospitalUl').delegate('.hospitalItem', 'click', function() {
        $(this).addClass('active').siblings('.hospitalItem').removeClass('active');
        $(this).find('.sectionUl').stop(true).slideToggle();
        $(this).siblings('.hospitalItem').find('.sectionUl').stop(true).slideUp();
        $('.hospitalTel').html($(this).attr('phone'));
        hospitalId = $(this).attr('hospitalid');
        hospitalName = $(this).find('.hospitalName').html();
    })
    // 一级科室切换
    $('.hospitalUl').delegate('.sectionItem', 'click', function() {
        if ($(this).find('.deptUl').css('display') == 'none') {
            $(this).addClass('active').siblings('.sectionItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.sectionItem').removeClass('active');
        }
        $(this).find('.deptUl').stop(true, true).slideToggle();
        $(this).siblings('.sectionItem').find('.deptUl').stop(true, true).slideUp();
        return false;
    })
    // 二级科室切换
    $('.hospitalUl').delegate('.deptUl', 'click', function() {
        return false;
    });
    $('.hospitalUl').delegate('.deptItem', 'click', function() {
        $('.hospitalUl').find('.deptItem').removeClass('active');
        $(this).addClass('active');
        deptIdGetDoctors($(this).attr('name'));
        return false;
    });

    // 根据二级科室id查询医生
    function deptIdGetDoctors(deptId) {
        // deptId 二级科室id
        $.ajax({
            type: 'POST',
            url: IP + 'user/selectSimpleUserWithDeptId',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                deptHospitalId: deptId,
            },
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    var _html = '<li class="doctorChunk noDocter">\
                        <div class="Firstdiamond"></div>\
                        <div class="message">\
                            <span class="mess_l">不选医生</span><span>远程中心</span>\
                            <p class="p1" deptId="' + deptId + '" name="' + hospitalId + '">' + hospitalName + '</p>\
                            <p class="p4">选择此项,申请将发送至对方医院远程中心,由医务人员为您调度医生资源,诊费会在选定医生后确定。<br />请将您的备注信息填至【会/转诊目的】 </p>\
                        </div>\
                    </li>';
                    var tempArr = data.userList;
                    var userCaseHistoryBeanList = [];
                    for (var i = 0; i < tempArr.length; i++) {
                        // 获取病历要求
                        $.ajax({
                            type: 'POST',
                            url: IP + 'userCaseHistory/selectCaseTypeList',
                            dataType: 'json',
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            data: {
                                userId: tempArr[i].id,
                            },
                            async: false,
                            success: function(data) {
                                console.log(data);
                                if (data.status == 200) {
                                    userCaseHistoryBeanList = data.userCaseHistoryBeanList;
                                } else if (data.status == 250) {

                                } else {

                                }
                            },
                            error: function(err) {
                                console.log(err)
                            },
                        });

                        _html += '<li deptName="' + tempArr[i].hospitalDept.dept.name + '" deptId="' + tempArr[i].hospitalDept.id + '" name="' + tempArr[i].id + '" class="doctorChunk">\
                            <div class="diamond"></div>\
                            <div class="message">\
                                <span class="mess_l username">' + tempArr[i].name + '</span>\
                                <span class="occupation" name="' + tempArr[i].occupation.id + '">' + tempArr[i].occupation.name + '</span>\
                                <p class="p1 hospital" hospitalImgPic="' + tempArr[i].hospitalDept.hospital.price + '" hospitalVideoPic="' + tempArr[i].hospitalDept.hospital.priceVideo + '" name="' + tempArr[i].hospitalDept.hospital.id + '">' + tempArr[i].hospitalDept.hospital.name + '</p>\
                                <p class="p2">' + tempArr[i].beGoodAt + '</p>\
                                <p medicalFeesVideo="' + tempArr[i].medicalFeesVideo + '" medicalFees="' + tempArr[i].medicalFees + '" class="p3 pric">图文&nbsp;' + tempArr[i].medicalFees + '元/视频&nbsp;' + tempArr[i].medicalFeesVideo + '元</p>\
                            </div>\
                            <div class="present">\
                                <h4>联系电话<span>' + tempArr[i].telephone + '</span></h4>\
                                <h4>擅长</h4>\
                                <p>' + tempArr[i].beGoodAt + '</p>\
                                <h4>病历要求</h4>\
                                <p>'
                        for (var j = 0; j < userCaseHistoryBeanList.length; j++) {
                            _html += userCaseHistoryBeanList[j].detialName + "、"
                        }
                        _html += '</p>\
                            </div>\
                        </li>'
                    }
                    $('.doctorUl').html(_html);
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';
                } else {

                }
            },
            error: function(err) {
                console.log(err)
            },
        });
    }

    // 选医生鼠标移入
    $('.doctorUl').delegate('.doctorChunk', 'mouseover', function(event) {
        event.stopPropagation();
        $(".doctorChunk").css("border", "1px solid #efefef");
        $(this).css("border", "1px solid #F6C567");
        if (($(this).index() + 1) % 3 == 0) {
            $(this).children(".present").css({
                "top": "0",
                "left": "-462px"
            }).show();
        } else {
            $(this).children(".present").css({
                "top": "0",
                "right": "0"
            }).show();
        }
    })

    // 选医生鼠标移出、
    $('.doctorUl').delegate('.doctorChunk', 'mouseleave', function(event) {
        $(this).find('.present').hide();
        $(this).css("border", "1px solid #efefef");
    });

    // 选择医生事件--添加
    $('.doctorUl').delegate('.doctorChunk', 'click', function(event) {
        if ($(this).hasClass('noDocter')) {
            // 点的不选医生
            favoriteArr = [];
            favoriteHtml();
            if (data.orderFormBean.orderTypes == 0) {
                // 图文
                price = $('.deptItem.active').parents('.hospitalItem.active').attr('imgpric');
            } else {
                // 视频
                price = $('.deptItem.active').parents('.hospitalItem.active').attr('videopric');
            }
            hospitalId = $(this).find('.p1').attr('name');
        } else if (favoriteArr.length > 0 && $(this).find('.hospital').attr('name') != favoriteArr[0].hospitalId) {
            var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: _$('.promptText'),
            });
            setTimeout(function() {
                $('.promptText').hide();
            }, 2000)
        } else if ($(this).attr('name') == data.orderFormBean.doctorId) {
            layer.msg('所选医生不能为该病历的发件医生');
        } else {
            // 点的某一个医生
            var flag = true;
            for (var i = 0; i < favoriteArr.length; i++) {
                if (favoriteArr[i].id == $(this).attr('name')) {
                    flag = false
                }
            }
            if (flag) {
                favoriteArr.push({
                    id: $(this).attr('name'), // 医生id
                    hospitalName: $(this).find('.hospital').html(), // 医院名字
                    hospitalId: $(this).find('.hospital').attr('name'), // 医院id
                    hospitalImgPic: $(this).find('.hospital').attr('hospitalimgpic'), // 医院图文价格
                    hospitalVideoPic: $(this).find('.hospital').attr('hospitalvideopic'), // 医院视频价格
                    deptName: $(this).attr('deptName'), // 科室名字
                    deptId: $(this).attr('deptId'), // 科室id
                    name: $(this).find('.username').html(), // 医生名字
                    medicalFees: $(this).find('.pric').attr('medicalFees'), // 图文价格
                    medicalFeesVideo: $(this).find('.pric').attr('medicalFeesVideo'), // 视频价格
                    occupationName: $(this).find('.occupation').html(), // 职称名字
                    occupationId: $(this).find('.occupation').attr('name'), // 职称id
                });
            }
            favoriteHtml();
        }
    });
    // 选择医生事件--删除
    $('.favoriteUl').delegate('.delDocBtn', 'click', function() {
        favoriteArr.splice($(this).parent('li').index(), 1);
        favoriteHtml();
    })

    $(window).scroll(function() {
        $('.oneLevelUl').css({
            'width': '145px',
            'position': 'fixed',
        })
        // if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
        //     $('.twoLevelUl').css({
        //         'height': $(window).height() - 300 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
        //     })
        // } else {
        //     $('.twoLevelUl').css({
        //         'height': $(window).height() - 230 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
        //     })
        // }
    });

    function scrollTo(x) {
        console.log(x)
        $('html, body').animate({
            scrollTop: x - 100,
        }, 300);
    };

    // 病历信息一级按钮
    $('.oneLevelUl').delegate('.oneLevelItem', 'click', function() {
        $(this).addClass('active').siblings('.oneLevelItem').removeClass('active');
        $(this).find('.twoLevelUl').stop(true).slideToggle();
        $(this).siblings('.oneLevelItem').find('.twoLevelUl').stop(true).slideUp();
        scrollTo($('.hosp').not('.hosp:hidden').eq($(this).index()).offset().top);
    })
    // 病历信息二级按钮
    $('.oneLevelUl').delegate('.twoLevelItem', 'click', function() {
        if ($(this).find('.threeLevelUl').css('display') == 'none') {
            $(this).addClass('active').siblings('.twoLevelItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.twoLevelItem').removeClass('active');
        }
        $(this).find('.threeLevelUl').stop(true, true).slideToggle();
        $(this).siblings('.twoLevelItem').find('.threeLevelUl').stop(true, true).slideUp();
        return false;
    })
    // 病历信息三级按钮
    $('.oneLevelUl').delegate('.threeLevelUl', 'click', function() {
        return false;
    });
    $('.oneLevelUl').delegate('.threeLevelItem', 'click', function() {
        $('.oneLevelUl').find('.threeLevelItem').removeClass('active');
        $(this).addClass('active');
        scrollTo($('#' + $(this).attr('name')).offset().top);
        return false;
    });

    $('.cancel').click(function() {
        window.history.back(-1);
    })
    //    首诊医政修改病历基本信息 order/applyManagerUpdateOrder
    $('.save').click(function() {
        var doctorList = [];
        if (favoriteArr.length > 0) {
            // 选择医生-情况
            var hospitalPrice = 0;
            if (data.orderFormBean.orderTypes == 0) {
                // 图文
                price = Number(favoriteArr[0].hospitalImgPic);
                hospitalPrice = Number(favoriteArr[0].hospitalImgPic);
                hospitalId = favoriteArr[0].hospitalId;
            } else {
                // 视频
                price = Number(favoriteArr[0].hospitalVideoPic);
                hospitalPrice = Number(favoriteArr[0].hospitalVideoPic);
                hospitalId = favoriteArr[0].hospitalId;
            }
            for (var i = 0; i < favoriteArr.length; i++) {
                if (data.orderFormBean.orderTypes == 0) {
                    // 图文
                    price += Number(favoriteArr[i].medicalFees);
                    doctorList.push({
                        "doctorId": favoriteArr[i].id,
                        "money": favoriteArr[i].medicalFees,
                    });
                } else {
                    // 视频
                    price += Number(favoriteArr[i].medicalFeesVideo);
                    doctorList.push({
                        "doctorId": favoriteArr[i].id,
                        "money": favoriteArr[i].medicalFeesVideo,
                    });
                }
            }
        } else {
            // 不选医生-情况
            if (price == 0) {
                layer.msg('请选择医生或医院');
            } else {
                hospitalPrice = price;
            }
        }

        $.ajax({
            type: 'POST',
            url: IP + 'order/updateDoctor',
            dataType: 'json',
            data: {
                "orderId": data.orderFormBean.id,
                "doctorList": JSON.stringify(doctorList),
                "price": price,
                "hospitalPrice": hospitalPrice,
                "hospitalId": hospitalId,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                if (data.status == 200) {
                    sessionStorage.setItem('orderId', JSON.stringify(data.orderId));
                    history.go(-1);
                    //   window.location = '/yilaiyiwang/workbench/manageAudit.html';
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    })
})
