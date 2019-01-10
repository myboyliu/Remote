/** 渲染 左侧导航栏 */
function renderLeftNavigation(data) {
    var hospitalArr = data;
    localStorage.setItem('hospitalImgPic', hospitalArr[0].consultationPicturePrice);
    localStorage.setItem('hospitalVideoPic', hospitalArr[0].consultationVideoPrice);
    var _html = '';
    for (var i = 0; i < hospitalArr.length; i++) {
        _html += '<li hospitalId="' + hospitalArr[i].id + '" imgPric="' + hospitalArr[i].consultationPicturePrice + '" videoPric="' + hospitalArr[i].consultationVideoPrice + '" hospitalTel="' + hospitalArr[i].hospitalPhone + '" class="hospitalItem">\
                        <p class="hospitalName" title="' + hospitalArr[i].hospitalName + '">' + hospitalArr[i].hospitalName + '</p>\
                        <ul class="sectionUl">';
        var sectionArr = hospitalArr[i].branchBeanList;
        for (var j = 0; j < sectionArr.length; j++) {
            _html += '<li class="sectionItem">\
                                <p class="sectionName" title="' + sectionArr[j].branchName + '">' + sectionArr[j].branchName + '</p>\
                                <ul class="deptUl">'
            var deptArr = sectionArr[j].customBranchList;
            for (var x = 0; x < deptArr.length; x++) {
                _html += '<li name="' + deptArr[x].id + '" class="deptItem" title="' + deptArr[x].customName + '">' + deptArr[x].customName + '</li>'
            }
            _html += '</ul>\
                         </li>'
        }
        _html += '</ul>\
                    </li>'
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
        'height': $(window).height() - 200 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
    });
    // 获取默认科室的医生
    deptIdGetDoctors($('.hospitalUl').find('.deptItem').eq(0).attr('name'));
}

/** 渲染 医生列表 */
function renderDoctorListView(data) {
    let hospitalId = $("#hospitalBranchNavigation li.active").attr("hospitalid");
    let hospitalName = $("#hospitalBranchNavigation li.active p").attr("title");
    let branchId = $("#hospitalBranchNavigation li.active ul li.active ul li.active").attr("name");
    let branchName = $("#hospitalBranchNavigation li.active ul li.active ul li.active").attr("title");
    let _html = '';
    let currentUserId = localStorage.getItem('token');
    for (let i = 0; i < data.length; i++) {
        if (currentUserId == data[i].id) {
            continue;
        }
        _html += '<li deptName="' + branchName + '" deptId="' + branchId + '" name="' + data[i].id + '" class="doctorChunk">\
                                    <div class="diamond"></div>\
                                    <div class="message">\
                                        <span class="mess_l username">' + data[i].userName + '</span>\
                                        <span class="occupation" name="' + data[i].titleName + '">' + data[i].titleName + '</span>\
                                        <p class="p1 hospital" hospitalVideoPic="' + data[i].consultationVideoPrice
            + '" hospitalImgPic="' + data[i].consultationPicturePrice + '" name="' + hospitalId + '">' + hospitalName + '</p>\
                                        <p class="p2">' + data[i].userStrong + '</p>\
                                        <p medicalFeesVideo="' + data[i].consultationVideoPrice + '" medicalFees="' + data[i].consultationPicturePrice + '" class="p3 pric">图文&nbsp;' + data[i].consultationPicturePrice + '元/视频&nbsp;' + data[i].consultationVideoPrice + '元</p>\
                                    </div>\
                                    <div class="present">\
                                        <h4>联系电话<span>' + data[i].telephone + '</span></h4>\
                                        <h4>擅长</h4>\
                                        <p>' + data[i].userStrong + '</p>\
                                        <h4>病历要求</h4>\
                                        <p>' + data[i].needCaseType + '</p>\
                                <input type="button" value="发病历" class="graphicGroup">\
                            </div>\
                        </li>'
    }
    $('.doctorUl').html(_html);
}

/** 根据二级科室id查询医生 */
function deptIdGetDoctors(deptId) {
    var data = {"branchId": deptId};
    ajaxRequest("GET", getDoctorListByBranchIdUrl, data, true, "application/json", false, renderDoctorListView, null, null);
}

$(function () {
    /** 获取通讯录左侧导航数据 */
    ajaxRequest("GET", getHospitalBranchListUrl, null, false, false, true, renderLeftNavigation, null, null);

    $(window).scroll(function () {
        $('.hospitalUl').css({
            'width': '145px',
            'position': 'fixed',
        });
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
            $('.sectionUl').css({
                'height': $(window).height() - 200 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            });
        } else {
            $('.sectionUl').css({
                'height': $(window).height() - 200 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            });
        }
    });

    // 医院切换
    $('.hospitalUl').delegate('.hospitalItem', 'click', function () {
        $(this).addClass('active').siblings('.hospitalItem').removeClass('active');
        $(this).find('.sectionUl').stop(true).slideToggle();
        $(this).siblings('.hospitalItem').find('.sectionUl').stop(true).slideUp();
        localStorage.setItem('hospitalImgPic', $(this).attr('imgpric'));
        localStorage.setItem('hospitalVideoPic', $(this).attr('videopric'));
    });
    // 一级科室切换
    $('.hospitalUl').delegate('.sectionItem', 'click', function () {
        if ($(this).find('.deptUl').css('display') == 'none') {
            $(this).addClass('active').siblings('.sectionItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.sectionItem').removeClass('active');
        }
        $(this).find('.deptUl').stop(true, true).slideToggle();
        $(this).siblings('.sectionItem').find('.deptUl').stop(true, true).slideUp();
        return false;
    });
    // 二级科室切换
    $('.hospitalUl').delegate('.deptUl', 'click', function () {
        return false;
    });
    $('.hospitalUl').delegate('.deptItem', 'click', function () {
        $('.hospitalUl').find('.deptItem').removeClass('active');
        $(this).addClass('active');
        deptIdGetDoctors($(this).attr('name'));
        return false;
    });

    // 鼠标移入
    $('.doctorUl').delegate('.doctorChunk', 'mouseover', function (event) {
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
    });
    // 鼠标移出、
    $('.doctorUl').delegate('.doctorChunk', 'mouseleave', function (event) {
        $(this).find('.present').hide();
        $(this).css("border", "1px solid #efefef");
    });

    // 点击按钮
    $('.doctorUl').delegate('.doctorChunk .graphicGroup', 'click', function () {
        let inviteDoctorArray = [];
        inviteDoctorArray.push({
            doctorId: $(this).parents('.doctorChunk').attr('name'), // 医生id
            hospitalName: $(this).parents('.doctorChunk').find('.hospital').html(), // 医院名字
            hospitalId: $(this).parents('.doctorChunk').find('.hospital').attr('name'), // 医院id
            hospitalImgPrice: $(this).parents('.doctorChunk').find('.hospital').attr('hospitalimgpic'), // 医院图文价格
            hospitalVideoPrice: $(this).parents('.doctorChunk').find('.hospital').attr('hospitalvideopic'), // 医院视频价格
            branchName: $(this).parents('.doctorChunk').attr('deptName'), // 科室名字
            branchId: $(this).parents('.doctorChunk').attr('deptId'), // 科室id
            doctorName: $(this).parents('.doctorChunk').find('.username').html(), // 医生名字
            doctorPicturePrice: $(this).parents('.doctorChunk').find('.pric').attr('medicalFees'), // 图文价格
            doctorVideoPrice: $(this).parents('.doctorChunk').find('.pric').attr('medicalFeesVideo'), // 视频价格
            doctorTitleName: $(this).parents('.doctorChunk').find('.occupation').html(), // 职称名字
        })
        sessionStorage.setItem('inviteDoctorArray', JSON.stringify(inviteDoctorArray));
        window.location = '../page/createCase.html';
    });


});
