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
    var _html = '';
    var tempArr = data;
    for (var i = 0; i < tempArr.length; i++) {
        _html += '<li deptName="' +branchName + '" deptId="' + branchId + '" name="' + tempArr[i].id + '" class="doctorChunk">\
                                    <div class="diamond"></div>\
                                    <div class="message">\
                                        <span class="mess_l username">' + tempArr[i].userName + '</span>\
                                        <span class="occupation" name="' + tempArr[i].titleName + '">' + tempArr[i].titleName + '</span>\
                                        <p class="p1 hospital" hospitalVideoPic="' + tempArr[i].consultationVideoPrice
            + '" hospitalImgPic="' + tempArr[i].consultationPicturePrice + '" name="' + hospitalId + '">' + hospitalName + '</p>\
                                        <p class="p2">' + tempArr[i].userStrong + '</p>\
                                        <p medicalFeesVideo="' + tempArr[i].consultationVideoPrice + '" medicalFees="' + tempArr[i].consultationPicturePrice + '" class="p3 pric">图文&nbsp;' + tempArr[i].consultationPicturePrice + '元/视频&nbsp;' + tempArr[i].consultationVideoPrice + '元</p>\
                                    </div>\
                                    <div class="present">\
                                        <h4>联系电话<span>' + tempArr[i].telephone + '</span></h4>\
                                        <h4>擅长</h4>\
                                        <p>' + tempArr[i].userStrong + '</p>\
                                        <h4>病历要求</h4>\
                                        <p>' + tempArr[i].needCaseType + '</p>\
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
        var favoriteArr = [];
        favoriteArr.push({
            id: $(this).parents('.doctorChunk').attr('name'), // 医生id
            hospitalName: $(this).parents('.doctorChunk').find('.hospital').html(), // 医院名字
            hospitalId: $(this).parents('.doctorChunk').find('.hospital').attr('name'), // 医院id
            hospitalImgPic: $(this).parents('.doctorChunk').find('.hospital').attr('hospitalimgpic'), // 医院图文价格
            hospitalVideoPic: $(this).parents('.doctorChunk').find('.hospital').attr('hospitalvideopic'), // 医院视频价格
            deptName: $(this).parents('.doctorChunk').attr('deptName'), // 科室名字
            deptId: $(this).parents('.doctorChunk').attr('deptId'), // 科室id
            name: $(this).parents('.doctorChunk').find('.username').html(), // 医生名字
            medicalFees: $(this).parents('.doctorChunk').find('.pric').attr('medicalFees'), // 图文价格
            medicalFeesVideo: $(this).parents('.doctorChunk').find('.pric').attr('medicalFeesVideo'), // 视频价格
            occupationName: $(this).parents('.doctorChunk').find('.occupation').html(), // 职称名字
            occupationId: $(this).parents('.doctorChunk').find('.occupation').attr('name'), // 职称id
        })
        sessionStorage.setItem('favoriteArr', JSON.stringify(favoriteArr));
        window.location = '../page/createCase.html';
    });


});
