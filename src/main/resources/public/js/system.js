//  查询医院信息
var hospitalId = '';
var oldHospitalName = '';
var oldHospitalTel = '';
var oldImgPic = '';
var oldVideoPic = '';
var newHospitalName = '';
var newHospitalTel = '';
var newImgPic = '';
var newVideoPic = '';

var oldName = ''; // 旧名字
var oldMoney = ''; // 旧图文价格
var oldMoneyVideo = ''; //旧视频价格
var newName = ''; // 新名字
var newMoney = ''; // 新图文价格
var newMoneyVideo = ''; // 新视频价格
var expertId = '';
var operationIndex = '';

function renderHospitalView(result) {
    $(".promptText").show();
    $(".doctorContent").hide();

    $('#hospitalId').val(result.id);
    $('.hospitalName').val(result.hospitalName);
    $('.hospitalTel').val(result.hospitalPhone);
    $('.imgPic').val(result.consultationPicturePrice);
    $('.videoPic').val(result.consultationVideoPrice)
}

function renderBranchListView(array) {
    var _html = '';
    for (var i = 0; i < array.length; i++) {
        _html += '<div class="sectionBox">\
                       <div class="sectionTitle clearfix">\
                           <h3 name="' + array[i].parentId + '">' + array[i].parentName + '</h3>\
                           <div class="problemContent">\
                               <img src="../images/problem.png" alt="">\
                               <div class="problemBox">\
                                   <p>1. 一级科室名称颜色为灰色时，代表该科室未被启用，将不会在通讯录中显示。为蓝色时，表示该科室已被启用。</p>\
                                   <p>2. 选择某个目录下的二级科室后，则默认该一级科室被启用，可在通讯录中查到</p>\
                               </div>\
                           </div>\
                           <p>请在下方提供的列表中选择，添加为该目录下的二级科室</p>\
                           <a class="shrinkBtn" href="javascript:;">展开列表</a>\
                            <div class="lineBox"></div>\
                       </div>\
                       <div class="sectionContent">\
                           <div class="selectedContent">\
                               <h4>已添加的二级科室，点击科室将减去，减去科室之前请先将该目录下的医生移动到其它科室</h4>\
                               <div class="selectedBox clearfix">';
        var changeDept = array[i].changeDept;
        for (var j = 0; j < changeDept.length; j++) {
            _html += '<a type="" deptHospitalId="' + changeDept[j].deptHospitalId +
                '" name="' + changeDept[j].id + '" href="javascript:;">' + changeDept[j].name + '</a>';
        }
        _html += '</div>\
                           </div>\
                           <div class="unselectedContent">\
                               <h4>可添加的二级科室，点击科室自动添加</h4>\
                               <div class="unselectedBox clearfix">'
        var standardDept = array[i].standardDept;
        for (var j = 0; j < standardDept.length; j++) {
            _html += '<a type="" name="' + standardDept[j].id + '" deptHospitalId="" href="javascript:;">' + standardDept[j].name + '</a>'
        }
        _html += '</div>\
                           </div>\
                       </div>\
                   </div>';
    }
    $('.sectionList').html(_html);

}

function updateBranchList() {

    $.ajax({
        type: 'POST',
        url: IP + 'hospitalDept/changeSelfDeptHospitalList',
        dataType: 'json',
        data: {
            "deptHospitalDetailList": JSON.stringify(deptHospitalDetailList),
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            console.log(data)

            if (data.status == 200) {
                if (data.messageStringBuilder != '') {
                    layer.msg(data.messageStringBuilder);
                } else {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['340px', '200px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.successBox'),
                    });
                }
                $.ajax({
                    type: 'GET',
                    url: IP + 'hospitalDept/selectManagerSelfDept',
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: function (data) {
                        console.log(data)
                        if (data.status == 200) {

                            $('.sectionSubmit').removeClass('active');
                            var tempArr = data.hospitalDeptsList;
                            var _html = '';
                            for (var i = 0; i < tempArr.length; i++) {
                                _html += '<div class="sectionBox">\
                                               <div class="sectionTitle clearfix">\
                                                   <h3 name="' + tempArr[i].parentId + '">' + tempArr[i].parentName + '</h3>\
                                                   <div class="problemContent">\
                                                       <img src="../images/problem.png" alt="">\
                                                       <div class="problemBox">\
                                                           <p>1. 一级科室名称颜色为灰色时，代表该科室未被启用，将不会在通讯录中显示。为蓝色时，表示该科室已被启用。</p>\
                                                           <p>2. 选择某个目录下的二级科室后，则默认该一级科室被启用，可在通讯录中查到</p>\
                                                       </div>\
                                                   </div>\
                                                   <p>请在下方提供的列表中选择，添加为该目录下的二级科室</p>\
                                                   <a class="shrinkBtn" href="javascript:;">展开列表</a>\
                                                   <div class="lineBox"></div>\
                                               </div>\
                                               <div class="sectionContent">\
                                                   <div class="selectedContent">\
                                                       <h4>已添加的二级科室，点击科室将减去，减去科室之前请先将该目录下的医生移动到其它科室</h4>\
                                                       <div class="selectedBox clearfix">';
                                var changeDept = tempArr[i].changeDept;
                                for (var j = 0; j < changeDept.length; j++) {
                                    _html += '<a type="" deptHospitalId="' + changeDept[j].deptHospitalId +
                                        '" name="' + changeDept[j].id + '" href="javascript:;">' + changeDept[j].name + '</a>';
                                }
                                _html += '</div>\
                                                   </div>\
                                                   <div class="unselectedContent">\
                                                       <h4>可添加的二级科室，点击科室自动添加</h4>\
                                                       <div class="unselectedBox clearfix">'
                                var standardDept = tempArr[i].standardDept;
                                for (var j = 0; j < standardDept.length; j++) {
                                    _html += '<a type="" name="' + standardDept[j].id + '" deptHospitalId="" href="javascript:;">' + standardDept[j].name + '</a>'
                                }
                                _html += '</div>\
                                                   </div>\
                                               </div>\
                                           </div>';
                            }
                            $('.sectionList').html(_html);
                        } else if (data.status == 250) {
                            // 未登录操作
                            window.location = '/yilaiyiwang/login/login.html';
                        } else {
                            var _$ = layui.jquery;
                            layer.open({
                                type: 1,
                                title: '',
                                area: ['340px', '200px'],
                                closeBtn: false,
                                shade: [0.1, '#000000'],
                                shadeClose: false,
                                time: 2000,
                                content: _$('.loseBox'),
                            });
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                })

            } else if (data.status == 250) {
                // 未登录操作
                window.location = '/yilaiyiwang/login/login.html';
            } else {
                // 其他操作
                layer.msg("操作失败，请稍后重试");
            }
        },
        error: function (err) {
            console.log(err);

        },
    })
}

/** 渲染专家类型列表*/
function renderSpecialistTypeView(array) {
    var _html = '';
    for (var i = 0; i < array.length; i++) {
        _html += '<tr name="' + array[i].id + '">\
                        <td><input maxlength="10" class="nameInput" readonly="readonly" type="text" value="' + array[i].specialistName + '" placeholder="请输入"></td>\
                        <td><input maxlength="9" class="imgPicInput" readonly="readonly" type="text" value="' + array[i].consultationPicturePrice + '" placeholder="请输入"></td>\
                        <td><input maxlength="9" class="videoPicInput" readonly="readonly" type="text" value="' + array[i].consultationVideoPrice + '" placeholder="请输入"></td>\
                        <td>\
                            <a class="delBtn" href="javascript:;">删除</a>\
                            <a class="modifyBtn" href="javascript:;">修改</a>\
                            <a class="expertSubmit noClick" href="javascript:;">保存</a>\
                        </td>\
                    </tr>'
    }
    $('.expertTypeTbody').html(_html);
}

$(function () {
    /** 查询医院信息 */
    ajaxRequest("GET", getHospitalByCurrentUserUrl, null, false, false, true, renderHospitalView, null, null);

    /** 查询科室列表信息 */
    ajaxRequest("GET", getBranchListByCurrentUserUrl, null, false, false, true, renderBranchListView, null, null);

    /** 专家类型与诊费 */
    ajaxRequest("GET", getSpecialistTypeByCurrentUser, null, false, false, true, renderSpecialistTypeView, null, null);

    var doctorInfo = {};

    /*  //textarea 标签随着文本的高度实现自适应 */
    $('.text-adaption').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 40 + 'px;overflow-y:hidden;');
    }).on('input propertychange', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });


    // 管理中心切换
    $('.navContent > a').click(function () {
        var _index = $(this).index();
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.mainContent > div').hide().eq(_index).show();
        if (_index == 3) {
            $('.doctorTitleList').css('height', $('body,html').height() - $('.doctorTitleList').offset().top - 70)
        }
    })

    // 判断是否是从新消息过来的
    if (localStorage.getItem('lookDoctorId')) {
        var id = localStorage.getItem('lookDoctorId');
        // doctorIdGetInfo(id);
        $('.navContent > a').eq(2).addClass('active').siblings('a').removeClass('active');
        $('.mainContent > div').hide().eq(2).show();
        localStorage.removeItem('lookDoctorId');
    }


    // 医院信息
    $('.hospitalName').blur(function () {
        if ($(this).val() == '') {
            $('.hospitalNameRemind').show();
        } else {
            newHospitalName = $(this).val();
        }
    }).focus(function () {
        $('.hospitalNameRemind').hide();
    })
    $('.hospitalTel').blur(function () {
        if ($(this).val() == '') {
            $('.hospitalTelRemind').html('内容不能为空').show();
        }
        if ($(this).val().split(';').length > 3) {
            $('.hospitalTelRemind').html("只能输入两个电话号码").show();
        }
        if ($(this).val().split('；').length > 3) {
            $('.hospitalTelRemind').html("只能输入两个电话号码").show();
        } else {
            newHospitalTel = $(this).val();
        }
    }).focus(function () {
        $('.hospitalTelRemind').hide();
    })
    $('.imgPic').blur(function () {
        if ($(this).val() == '') {
            $('.hospitalPicRemind').show();
        } else {
            newImgPic = $(this).val();
        }
    }).focus(function () {
        $('.hospitalPicRemind').hide();
    })
    $('.videoPic').blur(function () {
        if ($(this).val() == '') {
            $('.hospitalPicRemind').show();
        } else {
            newVideoPic = $(this).val();
        }
    }).focus(function () {
        $('.hospitalPicRemind').hide();
    })


    // 修改按钮
    $('.hospitalName,.hospitalTel,.imgPic,.videoPic').bind('input propertychange', function () {
        if ($('.hospitalName').val() != '' && $('.hospitalTel').val() != '' && $('.imgPic').val() != '' && $('.videoPic').val() != '' || oldHospitalName != newHospitalName || oldHospitalTel != newHospitalTel || oldImgPic != newImgPic || oldVideoPic != newVideoPic) {
            $('.submitBtn').addClass('active');
            $(".submitBtn").attr('disabled', false);
        } else {
            $('.submitBtn').removeClass('active');
            $(".submitBtn").attr('disabled', true);
        }
    })

    // 医院保存
    $('.submitBtn').click(function () {
        if ($(this).hasClass('active')) {
            if ($('.hospitalName').val() == '') {
                $('.hospitalNameRemind').show();
            } else if ($('.hospitalTel').val() == '') {
                $('.hospitalTelRemind').show();
            }
            if ($('.hospitalTel').val().split(';').length > 3) {
                $('.hospitalTelRemind').html("只能输入两个电话号码").show();
            }
            if ($('.hospitalTel').val().split('；').length > 3) {
                $('.hospitalTelRemind').html("只能输入两个电话号码").show();
            } else if ($('.imgPic').val() == '' || $('.videoPic').val() == '') {
                $('.hospitalPicRemind').show();
            } else {
                var data = new FormData();

                data.append("id", $("#hospitalId").val());
                data.append("hospitalName", $(".hospitalName").val());
                data.append("hospitalPhone", $(".hospitalTel").val());
                data.append("consultationPicturePrice", $(".imgPic").val());
                data.append("consultationVideoPrice", $(".videoPic").val());

                ajaxRequest("POST", updateHospitalByCurrentUserUrl, data, false, false, true, updateHospitalSuccess, updateHospitalFiled, null);

                function updateHospitalSuccess(result) {
                    renderHospitalView(result);
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['340px', '200px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.successBox'),
                    });
                }

                function updateHospitalFiled() {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['340px', '200px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.loseBox'),
                    });
                }
            }
        }
    })

    // 科室列表、


    // 提示信息、
    $('.sectionList').delegate('.problemContent', 'mouseenter', function () {
        $(this).find('.problemBox').show();
    })
    $('.sectionList').delegate('.problemContent', 'mouseleave', function () {
        $(this).find('.problemBox').hide();
    })
    // 展开、收起
    $('.sectionList').delegate('.sectionTitle', 'click', function () {
        $(this).siblings('.sectionContent').stop(true).slideToggle();
        if ($(this).find('.shrinkBtn').hasClass('active')) {
            $(this).find('.shrinkBtn').removeClass('active').html('展开列表');
        } else {
            $(this).find('.shrinkBtn').addClass('active').html('收起列表');
        }
    })

    // 删除科室
    $('.sectionList').delegate('.selectedContent a', 'click', function () {
        if ($(this).attr('type') == '') {
            $(this).addClass('choose').attr('type', '1').parents('.selectedContent').siblings('.unselectedContent').find('.unselectedBox').prepend($(this));
        } else {
            $(this).removeClass('choose').attr('type', '').parents('.selectedContent').siblings('.unselectedContent').find('.unselectedBox').prepend($(this));
        }
        if ($('.choose').length > 0) {
            $('.sectionSubmit').addClass('active');
        } else {
            $('.sectionSubmit').removeClass('active');
        }
    })
    // 添加科室
    $('.sectionList').delegate('.unselectedContent a', 'click', function () {
        if ($(this).attr('type') == '') {
            $(this).addClass('choose').attr('type', '0').parents('.unselectedContent').siblings('.selectedContent').find('.selectedBox').prepend($(this));
        } else {
            $(this).removeClass('choose').attr('type', '').parents('.unselectedContent').siblings('.selectedContent').find('.selectedBox').prepend($(this));
        }
        if ($('.choose').length > 0) {
            $('.sectionSubmit').addClass('active');
        } else {
            $('.sectionSubmit').removeClass('active');
        }
    })


    $('.sectionSubmit').click(function () {
        if ($(this).hasClass('active')) {
            var deptHospitalDetailList = [];
            var objArr = $('.choose');
            if (objArr.length > 0) {
                for (var i = 0; i < objArr.length; i++) {
                    deptHospitalDetailList.push({
                        "deptId": objArr.eq(i).attr('name'),
                        "deptName": objArr.eq(i).html(),
                        "hospitalDeptId": objArr.eq(i).attr('depthospitalid'),
                        "types": objArr.eq(i).attr('type')
                    })
                }
                updateBranchList();
            }
        }
    })


    // 医生列表
    selectManagerDoctorDeptList();

    function selectManagerDoctorDeptList() {
        $.ajax({
            type: 'GET',
            url: IP + 'hospitalDept/selectManagerDoctorDeptList',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    var tempArr = data.hospitalDeptsList;
                    var _html = '';
                    for (var i = 0; i < tempArr.length; i++) {
                        var twoTempArr = tempArr[i].changeDept;
                        _html += '<li class="oneLevelItem">\
                            <p class="oneLevelName" title="' + tempArr[i].parentName + '">' + tempArr[i].parentName + '</p>\
                            <ul class="twoLevelUl">';
                        for (var j = 0; j < twoTempArr.length; j++) {
                            _html += '<li class="twoLevelItem">\
                                                    <p class="twoLevelName" name="' + twoTempArr[j].deptHospitalId + '" title="' + twoTempArr[j].name + '">' + twoTempArr[j].name + '</p>\
                                                    <ul class="threeLevelUl">';
                            var threeTempArr = twoTempArr[j].userBeanList.userBeanList;
                            if (threeTempArr) {
                                for (var z = 0; z < threeTempArr.length; z++) {
                                    // 0未审核 1通过 2拒绝 3不完整
                                    if (threeTempArr[z].authenticationFlag == 0) {
                                        _html += '<li class="threeLevelItem" stateFlag="' + threeTempArr[z].authenticationFlag + '" name="' + threeTempArr[z].userId + '" title="' + threeTempArr[z].name + '"><span>' + threeTempArr[z].name + '</span><img class="unauthentication" src="../images/unauthentication.png" alt=""/></li>'
                                    } else if (threeTempArr[z].authenticationFlag == 1) {
                                        _html += '<li class="threeLevelItem" stateFlag="' + threeTempArr[z].authenticationFlag + '" name="' + threeTempArr[z].userId + '" title="' + threeTempArr[z].name + '"><span>' + threeTempArr[z].name + '</span></li>'
                                    } else if (threeTempArr[z].authenticationFlag == 2) {
                                        // _html += '<li class="threeLevelItem" stateFlag="'+threeTempArr[z].authenticationFlag+'" name="' + threeTempArr[z].userId + '" title="' + threeTempArr[z].name + '"><span>' + threeTempArr[z].name + '</span><img class="uncomplete" src="/yilaiyiwang/images/Denied.png" alt=""/></li>'
                                    } else if (threeTempArr[z].authenticationFlag == 3) {
                                        _html += '<li class="threeLevelItem" stateFlag="' + threeTempArr[z].authenticationFlag + '" name="' + threeTempArr[z].userId + '" title="' + threeTempArr[z].name + '"><span>' + threeTempArr[z].name + '</span><img class="uncomplete" src="../images/uncomplete.png" alt=""/></li>'
                                    }
                                }
                            }
                            _html += '</ul></li>'
                        }
                        _html += '</ul></li>';
                    }
                    $('.oneLevelUl').html(_html);
                    // 有无子集 处理
                    var objArr = $('.threeLevelUl');
                    for (var i = 0; i < objArr.length; i++) {
                        if (objArr.eq(i).find('.threeLevelItem').length == 0) {
                            objArr.eq(i).parents('.twoLevelItem').addClass('noFlag');
                        }
                    }
                    // 未审核小红点 处理
                    for (var i = 0; i < $('.threeLevelItem[stateFlag=0]').length; i++) {
                        $('.threeLevelItem[stateFlag=0]').parents('.threeLevelUl').siblings('.twoLevelName').addClass('redFlag');
                        $('.threeLevelItem[stateFlag=0]').parents('.twoLevelUl').siblings('.oneLevelName').addClass('redFlag');
                    }

                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }

    // 一级切换
    $('.oneLevelUl').delegate('.oneLevelItem', 'click', function () {
        $(this).addClass('active').siblings('.oneLevelItem').removeClass('active');
        $(this).find('.twoLevelUl').stop(true).slideToggle();
        $(this).siblings('.oneLevelItem').find('.twoLevelUl').stop(true).slideUp();
    })
    // 二级科室切换
    $('.oneLevelUl').delegate('.twoLevelItem', 'click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active').siblings('.twoLevelItem').removeClass('active');
            $('.threeLevelUl').stop(true).slideUp();
        } else {
            $(this).addClass('active').siblings('.twoLevelItem').removeClass('active');
            $('.threeLevelUl').hide();
            // deptIdGetDoctors($(this).attr('depthospitalid'), $(this).find('.threeLevelUl'));
            $(this).find('.threeLevelUl').stop(true).slideDown();
        }
        return false;
    });

    // 三级按钮
    $('.oneLevelUl').delegate('.threeLevelItem', 'click', function () {
        $('.threeLevelItem').removeClass('active');
        $(this).addClass('active');
        $('.promptText').hide();
        $('.doctorContent').show();
        doctorIdGetInfo($(this).attr('name'));
        return false;
    });

    // 根据医生id查医生信息
    function doctorIdGetInfo(id) {

        /** 查询科室列表信息 */
        var data = {"userId": id};
        ajaxRequest("GET", getUserDetailById, data, true, "application/json", true, renderBranchListView, null, null);

        doctorInfo = data;
        // 0未审核 1通过 2拒绝 3不完整
        if (data.authenticationFlag == 0) {
            $('.fexidContent').show().find('div').hide().eq(0).show();
            $('.footer').addClass('marginBottom70');
            // 遮罩 未通过审核遮罩显示 不能修改信息
            $('.coverage').show();
            $('.fexidContent').show();
        } else if (data.authenticationFlag == 2) {
            $('.fexidContent').hide();
        } else {
            $('.fexidContent').show().find('div').hide().eq(1).show();
            $('.footer').addClass('marginBottom70');
            $('.coverage').hide();
            $('.fexidContent').show();
        }
        $('#userName').val(data.userName);
        $('#userName').attr('rolesId', data.userId);
        $('#name').val(data.name);
        $('#telephone').val(data.telephone);
        $('#hospitalName').val(data.hospitalName);
        $('#medicalFees').val(data.medicalFees);
        $('#medicalFeesVideo').val(data.medicalFeesVideo);
        $('#beGoodAt').val(data.beGoodAt);
        $('.powerSelect').val(data.rolesId);
        $('.titleSelect').val(data.occupationId);
        $('.deptSelect').val(data.hospitalDeptId);
        $('.expertSelect').val(data.specialistTypeId);
        $('.cardName').html(data.credentialsImage.substr(data.credentialsImage.lastIndexOf('/'), data.credentialsImage.length));
        $('.signName').html(data.signatureImage.substr(data.signatureImage.lastIndexOf('/'), data.signatureImage.length));
        var tempArr = data.caseTypeList;
        var _html = '';
        for (var i = 0; i < tempArr.length; i++) {
            _html += '<div class="catalogue clearfix">\
                            <p>' + tempArr[i].name + '</p>';
            var twoArr = tempArr[i].caseTypeList;
            for (var j = 0; j < twoArr.length; j++) {
                if (twoArr[j].userChange == '0') {
                    console.log(twoArr[j].userChange)
                    _html += '<div type="" class="checkSingle CheckBg" name="' + twoArr[j].id + '">' + twoArr[j].name + '</div>'
                } else {
                    _html += '<div type="" class="checkSingle " name="' + twoArr[j].id + '">' + twoArr[j].name + '</div>'
                }
            }
            _html += '</div>';
        }
        $('.requireBox').html(_html);
        $('#beGoodAt').each(function () {
            this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
        })
        if (data.credentialsImage != '') {
            $('#olf').html('signatureImage.jpg')
        } else {
            $('#olf').html('')
        }
        if (data.signatureImage != '') {
            $('#uhs').html('credentialsImage.jpg')
        } else {
            $('#uhs').html('')
        }
    }


}

// 获取职称列表
$.ajax({
    type: 'GET',
    url: IP + 'occupation/selectOccupationList',
    dataType: 'json',
    global: false,
    success: function (data) {
        console.log(data);
        if (data.status == 200) {
            var tempArr = [];
            tempArr = data.occupationList;
            var _html = '<option value="">请选择</option>';
            for (var i = 0; i < tempArr.length; i++) {
                _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].name + '</option>'
            }
            $('.titleSelect').html(_html);
        }
    }
})
// 获取专家类型列表 getSpecialistType
// getSpecialistType();

// 获取科室列表
function getDeptList(id) {
    $.ajax({
        type: 'POST',
        url: IP + 'hospitalDept/selectAllDeptList',
        dataType: 'json',
        data: {
            "hospitalId": id,
        },
        global: false,
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                var hospital_office = data.hospitalDeptsList;
                var _html = '<option value="">请选择</option>';
                for (var i = 0; i < hospital_office.length; i++) {
                    _html += ' <option value="' + hospital_office[i].hospitalDeptId + '">' + hospital_office[i].deptName + '</option>';
                }
                $('.deptSelect').html(_html);
                _html = '';
            }
        }
    })
}

// 获取权限类型
$.ajax({
    type: 'GET',
    url: IP + '/roles/getEntityList',
    dataType: 'json',
    global: false,
    success: function (data) {
        // console.log(data);
        if (data.status == 200) {
            var tempArr = [];
            tempArr = data.rolesBeanList;
            var _html = '<option value="">请选择</option>';
            for (var i = 0; i < tempArr.length; i++) {
                _html += '<option value="' + tempArr[i].id + '">' + tempArr[i].remarks + '</option>'
            }
            $('.powerSelect').html(_html);
            _html = "";
        }
    }
})

// 上传证书
$('.cardBtn').click(function () {
    if ($('.cardUp')[0].files.length > 0) {
        var fb = new FormData();
        fb.append('userId', $('#userName').attr('rolesid'))
        fb.append('credentialsImage', $('.cardUp')[0].files[0])
        $.ajax({
            type: 'POST',
            url: IP + 'user/uploadCredentials',
            dataType: 'json',
            data: fb,
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['340px', '200px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.successBox'),
                    });
                    setTimeout(function () {
                        $('.successBox').hide();
                    }, 2000)
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['340px', '200px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.loseBox'),
                    });
                    setTimeout(function () {
                        $('.loseBox').hide();
                    }, 2000)
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }
})
// 上传签名
$('.signBtn').click(function () {
    if ($('.signUp')[0].files.length > 0) {
        var fb = new FormData();
        fb.append('userId', $('#userName').attr('rolesid'))
        fb.append('signatureImage', $('.signUp')[0].files[0])
        $.ajax({
            type: 'POST',
            url: IP + 'user/uploadSignature',
            dataType: 'json',
            data: fb,
            processData: false,
            contentType: false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['340px', '200px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.successBox'),
                    });
                    setTimeout(function () {
                        $('.successBox').hide();
                    }, 2000)
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['340px', '200px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.loseBox'),
                    });
                    setTimeout(function () {
                        $('.loseBox').hide();
                    }, 2000)
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }
})
$('.expertSelect').change(function () {
    $('#medicalFees').val($(this).find("option:selected").attr('money'));
    $('#medicalFeesVideo').val($(this).find("option:selected").attr('moneyvideo'));
})
// 重置密码
$('.resetBtn').click(function () {
    var _$ = layui.jquery;
    layer.open({
        type: 1,
        title: '',
        area: ['500px', '200px'],
        closeBtn: false,
        shade: [0.1, '#000000'],
        shadeClose: false,
        content: _$('.replacement'),
    });
});
// 重置密码弹框取消按钮
$('.replacementNoBtn').click(function () {
    layer.closeAll();
})
// 重置密码确定按钮
$('.replacementYesBtn').click(function () {
    $.ajax({
        type: 'POST',
        url: IP + 'user/remarkPassword',
        dataType: 'json',
        data: {
            "userId": $('#userName').attr('rolesid'),
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        success: function (data) {
            console.log(data)
            if (data.status == 200) {
                var _$ = layui.jquery;
                layer.open({
                    type: 1,
                    title: '',
                    area: ['340px', '200px'],
                    closeBtn: false,
                    shade: [0.1, '#000000'],
                    shadeClose: false,
                    //  time: 2000,
                    content: _$('.successBox'),
                });
                setTimeout(function () {
                    layer.closeAll();
                }, 2000)
            } else if (data.status == 250) {
                // 未登录操作
                window.location = '/yilaiyiwang/login/login.html';
            } else {
                var _$ = layui.jquery;
                layer.open({
                    type: 1,
                    title: '',
                    area: ['340px', '200px'],
                    closeBtn: false,
                    shade: [0.1, '#000000'],
                    shadeClose: false,
                    //  time: 2000,
                    content: _$('.loseBox'),
                });
                setTimeout(function () {
                    layer.closeAll();
                }, 2000)
            }
        },
        error: function (err) {
            console.log(err);
        },
    })
})

// 单个按钮
$(".requireBox").on('click', '.checkSingle', function () {
    if ($(this).attr('type') == '') {
        if ($(this).hasClass('CheckBg')) {
            $(this).attr('type', '1').addClass('operate').toggleClass('CheckBg');
        } else {
            $(this).attr('type', '0').addClass('operate').toggleClass('CheckBg');
        }
    } else if ($(this).attr('type') == '0') {
        $(this).attr('type', '').removeClass('operate').toggleClass('CheckBg');
    } else if ($(this).attr('type') == '1') {
        $(this).attr('type', '').removeClass('operate').toggleClass('CheckBg');
    }
    if ($('.operate').length > 0) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
})
// 权限类型
$('.powerSelect').change(function () {
    if ($(this).val() != doctorInfo.rolesId) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
})
// 职称
$('.titleSelect').change(function () {
    if ($(this).val() != doctorInfo.occupationId) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
})
// 科室
$('.deptSelect').change(function () {
    if ($(this).val() != doctorInfo.hospitalDeptId) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
})
// 专家类型
$('.expertSelect').change(function () {
    if ($(this).val() != doctorInfo.specialistTypeId) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
})
// 姓名
$("#name").blur(function () {
    if ($(this).val() != doctorInfo.name) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
})
// 电话
$('#telephone').blur(function () {
    if ($(this).val() != doctorInfo.telephone) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
});
// 图文诊费/元
$('#medicalFees').blur(function () {
    if ($(this).val() != doctorInfo.medicalFees) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
});
// 视频诊费/元
$('#medicalFeesVideo').blur(function () {
    if ($(this).val() != doctorInfo.medicalFeesVideo) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
});
// 擅长
$('#beGoodAt').blur(function () {
    if ($(this).val() != doctorInfo.beGoodAt) {
        $('.modifyBtn').removeClass("disabled");
    }
    disabledFlag();
});

function disabledFlag() {
    if ($('#name').val() == doctorInfo.name && $('#telephone').val() == doctorInfo.telephone && $('#medicalFees').val() == doctorInfo.medicalFees && $('#medicalFeesVideo').val() == doctorInfo.medicalFeesVideo && $('#beGoodAt').val() == doctorInfo.beGoodAt && $('.powerSelect').val() == doctorInfo.rolesId && $('.titleSelect').val() == doctorInfo.occupationId && $('.deptSelect').val() == doctorInfo.hospitalDeptId && $('.expertSelect').val() == doctorInfo.specialistTypeId && $('.operate').length == 0) {
        $('.modifyBtn').addClass("disabled");
    }
}

// 修改信息
$('.modifyBtn').click(function () {
    if (!$(this).hasClass("disabled")) {
        // 修改信息判断
        var caseTypeList = [];
        for (var i = 0; i < $('.operate').length; i++) {
            caseTypeList.push({
                "caseTypeId": $('.operate').eq(i).attr('name'),
                "caseTypeName": $('.operate').eq(i).html(),
                "types": $('.operate').eq(i).attr('type'),
            })
        }
        $.ajax({
            type: 'POST',
            url: IP + 'user/updateDetail',
            dataType: 'json',
            data: {
                "userId": $('#userName').attr('rolesid'),
                "name": $('#name').val(),
                "telephone": $('#telephone').val(),
                "medicalFees": $('#medicalFees').val(),
                "medicalFeesVideo": $('#medicalFeesVideo').val(),
                "beGoodAt": $('#beGoodAt').val(),
                "roleId": $('.powerSelect').val(),
                "occupationId": $('.titleSelect').val(),
                "specialistTypeId": $('.expertSelect').val(),
                "hospitalDeptId": $('.deptSelect').val(),
                "caseTypeList": JSON.stringify(caseTypeList),
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    $('.checkSingle').removeClass('operate');
                    $(".modifyBtn").addClass("disabled");
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['340px', '200px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.successBox'),
                    });
                    setTimeout(function () {
                        $('.successBox').hide();
                    }, 2000);
                    $('.threeLevelItem.active').attr("stateflag", '1').find('img').hide();
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['340px', '200px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.loseBox'),
                    });
                    setTimeout(function () {
                        $('.loseBox').hide();
                    }, 2000)
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }
})

// 通过审核按钮
$('.adoptBtn').click(function () {
    var _$ = layui.jquery;
    layer.open({
        type: 1,
        title: '',
        area: ['500px', '200px'],
        closeBtn: false,
        shade: [0.1, '#000000'],
        shadeClose: false,
        content: _$('.approved'),
    });


})
// 通过审核弹窗的取消按钮
$('.approvedNoBtn').click(function () {
    layer.closeAll();
})
// 通过审核弹窗的确定按钮
$('.approvedYesBtn').click(function () {
    $.ajax({
        type: 'POST',
        url: IP + 'user/authorizationUser',
        dataType: 'json',
        data: {
            "userId": $('#userName').attr('rolesid'),
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        success: function (data) {
            console.log(data)
            if (data.status == 200) {
                var _$ = layui.jquery;
                layer.open({
                    type: 1,
                    title: '',
                    area: ['340px', '200px'],
                    closeBtn: false,
                    shade: [0.1, '#000000'],
                    shadeClose: false,
                    time: 2000,
                    content: _$('.successBox'),
                });
                setTimeout(function () {
                    $('.successBox').hide();
                    layer.closeAll();
                    //  审核通过操作成功后刷新页面，底部操作按钮变化
                    //   window.location.reload();

                }, 2000)
                // 什么通过后删掉左面导航栏上的图标，
                $('.threeLevelItem.active').find('img').remove();
                // 调用查医生信息方法
                doctorIdGetInfo($('.threeLevelItem.active').attr('name'));
            } else if (data.status == 250) {
                // 未登录操作
                window.location = '/yilaiyiwang/login/login.html';
            } else {
                var _$ = layui.jquery;
                layer.open({
                    type: 1,
                    title: '',
                    area: ['340px', '200px'],
                    closeBtn: false,
                    shade: [0.1, '#000000'],
                    shadeClose: false,
                    time: 2000,
                    content: _$('.loseBox'),
                });
                setTimeout(function () {
                    $('.loseBox').hide();
                }, 2000)
            }
        },
        error: function (err) {
            console.log(err);
        },
    })
})


// 拒绝审核
$('.refuseBtn').click(function () {
    var _$ = layui.jquery;
    layer.open({
        type: 1,
        title: '',
        area: ['500px', '200px'],
        closeBtn: false,
        shade: [0.1, '#000000'],
        shadeClose: false,
        content: _$('.decline'),
    });


    // 拒绝审核弹窗的取消按钮
    $('.declineNoBtn').click(function () {
        layer.closeAll();
    })


})
// 拒绝审核的确定按钮
$('.declineYesBtn').click(function () {
    $.ajax({
        type: 'POST',
        url: IP + 'user/refuseAuthorizationUser',
        dataType: 'json',
        data: {
            "userId": $('#userName').attr('rolesid'),
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        success: function (data) {
            console.log(data)
            if (data.status == 200) {
                var _$ = layui.jquery;
                layer.open({
                    type: 1,
                    title: '',
                    area: ['340px', '200px'],
                    closeBtn: false,
                    shade: [0.1, '#000000'],
                    shadeClose: false,
                    time: 3000,
                    content: _$('.successBox'),
                });
                //    拒绝后改变图片
                $('.threeLevelItem.active').find('img').attr('src', '../images/Denied.png'); //
                doctorIdGetInfo($('.threeLevelItem.active').attr('name'));
                $('.fexidContent').hide();
                setTimeout(function () {

                    layer.closeAll();
                    //  window.location.reload();
                }, 3000);

            } else if (data.status == 250) {
                // 未登录操作
                window.location = '/yilaiyiwang/login/login.html';
            } else {
                var _$ = layui.jquery;
                layer.open({
                    type: 1,
                    title: '',
                    area: ['340px', '200px'],
                    closeBtn: false,
                    shade: [0.1, '#000000'],
                    shadeClose: false,
                    time: 2000,
                    content: _$('.loseBox'),
                });
                setTimeout(function () {
                    $('.loseBox').hide();
                }, 2000)
            }
        },
        error: function (err) {
            console.log(err);
        },
    })
})


// 修改
$('.expertTypeTbody').delegate('.modifyBtn', 'click', function () {
    operationIndex = $(this).parents('tr').index();
    if ($(this).html() == '修改') {
        oldName = $(this).parents('tr').find('input.nameInput').val();
        oldMoney = $(this).parents('tr').find('input.imgPicInput').val();
        oldMoneyVideo = $(this).parents('tr').find('input.videoPicInput').val();
        newName = $(this).parents('tr').find('input.nameInput').val();
        newMoney = $(this).parents('tr').find('input.imgPicInput').val();
        newMoneyVideo = $(this).parents('tr').find('input.videoPicInput').val();
        $(this).html('取消').parents('tr').find('input').addClass('revisability').removeAttr('readonly');
        $(this).parents('tr').siblings('tr').find('input').removeClass('revisability').attr('readonly', 'readonly');
        $(this).parents('tr').siblings('tr').find('.modifyBtn').html('修改');
    } else {
        $(this).html('修改').parents('tr').find('input').removeClass('revisability').attr('readonly', 'readonly');
        $(this).parents('tr').find('input.nameInput').val(oldName);
        $(this).parents('tr').find('input.imgPicInput').val(oldMoney);
        $(this).parents('tr').find('input.videoPicInput').val(oldMoneyVideo);
    }
})

$('.expertTypeTbody').delegate('input.nameInput', 'blur', function () {
    newName = $(this).val();
    if (oldName == newName && oldMoney == newMoney && oldMoneyVideo == newMoneyVideo) {
        $(this).parents('td').siblings('td').find('.expertSubmit').addClass('noClick');
    } else if (newName == '' || newMoney == '' || newMoneyVideo == '') {
        $(this).parents('td').siblings('td').find('.expertSubmit').addClass('noClick');
    } else {
        $(this).parents('td').siblings('td').find('.expertSubmit').removeClass('noClick');
    }
})
$('.expertTypeTbody').delegate('input.imgPicInput', 'blur', function () {
    newMoney = $(this).val();
    if (oldName == newName && oldMoney == newMoney && oldMoneyVideo == newMoneyVideo) {
        $(this).parents('td').siblings('td').find('.expertSubmit').addClass('noClick');
    } else if (newName == '' || newMoney == '' || newMoneyVideo == '') {
        $(this).parents('td').siblings('td').find('.expertSubmit').addClass('noClick');
    } else {
        $(this).parents('td').siblings('td').find('.expertSubmit').removeClass('noClick');
    }
})
$('.expertTypeTbody').delegate('input.videoPicInput', 'blur', function () {
    newMoneyVideo = $(this).val();
    if (oldName == newName && oldMoney == newMoney && oldMoneyVideo == newMoneyVideo) {
        $(this).parents('td').siblings('td').find('.expertSubmit').addClass('noClick');
    } else if (newName == '' || newMoney == '' || newMoneyVideo == '') {
        $(this).parents('td').siblings('td').find('.expertSubmit').addClass('noClick');
    } else {
        $(this).parents('td').siblings('td').find('.expertSubmit').removeClass('noClick');
    }
})
// 删除、
$('.expertTypeTbody').delegate('.delBtn', 'click', function () {
    expertId = $(this).parents('tr').attr('name');
    operationIndex = $(this).parents('tr').index();
    var _$ = layui.jquery;
    layer.open({
        type: 1,
        title: '',
        area: ['500px', '200px'],
        closeBtn: false,
        shade: [0.1, '#000000'],
        shadeClose: false,
        content: _$('.deleteBox'),
    });
})
$('.deleteBox .noBtn').click(function () {
    if (expertId == '') {
        layer.closeAll();
        $('.expertTypeTbody > tr').eq(operationIndex).remove();
    } else {
        // 删除专家类型
        var data = new FormData();
        data.append("specialistTypeId", expertId);
        ajaxRequest("POST", deleteSpecialistType, data, false, false, true, deleteSpecialistTypeSuccess, null, null);

        function deleteSpecialistTypeSuccess() {
            $('.expertTypeTbody > tr').eq(operationIndex).remove();
            layer.closeAll();
        }
    }
})

$('.deleteBox .yesBtn').click(function () {
    layer.closeAll();
})
// 添加
$('.addTypeBtn').click(function () {
    $('.expertTypeTbody').append('<tr hospitalId="" name="">\
            <td><input  maxlength="10"  class="nameInput revisability" type="text" value="" placeholder="请输入"></td>\
            <td><input  maxlength="9"  class="imgPicInput revisability" type="text" value="" placeholder="请输入"></td>\
            <td><input  maxlength="9"  class="videoPicInput revisability" type="text" value="" placeholder="请输入"></td>\
            <td>\
                <a class="delBtn" href="javascript:;">删除</a>\
                <a style="display: none;" class="modifyBtn" href="javascript:;">修改</a>\
                <a class="expertSubmit noClick" href="javascript:;">保存</a>\
            </td>\
        </tr>');
})
// 保存
$('.expertTypeTbody').delegate('.expertSubmit', 'click', function () {
    if (oldName == newName && oldMoney == newMoney && oldMoneyVideo == newMoneyVideo) {

    } else if (newName == '' || newMoney == '' || newMoneyVideo == '') {

    } else {
        expertId = $(this).parents('tr').attr('name');
        hospitalId = $(this).parents('tr').attr('hospitalId');
        operationIndex = $(this).parents('tr').index();
        var _$ = layui.jquery;
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            content: _$('.submitBox'),
        });
    }
})
$('.submitBox .noBtn').click(function () {
    layer.closeAll()
})
$('.submitBox .yesBtn').click(function () {
    if (hospitalId == '' && expertId == '') {
        // 添加专家类型
        var data = new FormData();
        data.append("specialistName", newName);
        data.append("consultationPicturePrice", newMoney);
        data.append("consultationVideoPrice", newMoneyVideo);

        ajaxRequest("POST", addSpecialistType, data, false, false, true, addSpecialistTypeSuccess, null, null);

        function addSpecialistTypeSuccess() {
            ajaxRequest("GET", getSpecialistTypeByCurrentUser, null, false, false, true, renderSpecialistTypeView, null, null);
            layer.closeAll();
            $('.expertTypeTbody > tr').eq(operationIndex).find('input').removeClass('revisability').attr('readonly', 'readonly');
            $('.expertTypeTbody > tr').eq(operationIndex).find('.modifyBtn').show().html('修改');
        }
    } else {
        // 修改专家类型
        var data = new FormData();
        data.append("specialistName", newName);
        data.append("consultationPicturePrice", newMoney);
        data.append("consultationVideoPrice", newMoneyVideo);
        data.append("id", expertId);
        ajaxRequest("POST", updateSpecialistType, data, false, false, true, updateSpecialistTypeSuccess, null, null);

        function updateSpecialistTypeSuccess() {
            /** 重新渲染专家类型列表 */
            ajaxRequest("GET", getSpecialistTypeByCurrentUser, null, false, false, true, renderSpecialistTypeView, null, null);
            layer.closeAll();
            $('.expertTypeTbody > tr').eq(operationIndex).find('input').removeClass('revisability').attr('readonly', 'readonly');
            $('.expertTypeTbody > tr').eq(operationIndex).find('.modifyBtn').html('修改');
        }
    }
    newName = '';
    newMoney = '';
    newMoneyVideo = '';
})
})
