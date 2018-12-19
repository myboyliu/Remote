//  查询医院信息
var doctorInfo = {};

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

/** 渲染医院管理页面*/
function renderHospitalView(result) {
    $(".promptText").show();
    $(".doctorContent").hide();

    $('#hospitalId').val(result.id);
    $('.hospitalName').val(result.hospitalName);
    $('.hospitalTel').val(result.hospitalPhone);
    $('.imgPic').val(result.consultationPicturePrice);
    $('.videoPic').val(result.consultationVideoPrice)
}

/** 渲染科室管理页面*/
function renderBranchListView(array) {
    $('.sectionSubmit').removeClass('active');
    var _html = '';
    for (var i = 0; i < array.length; i++) {
        _html += '<div class="sectionBox">\
                       <div class="sectionTitle clearfix">\
                           <h3 name="' + array[i].id + '">' + array[i].branchName + '</h3>\
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
                               <div id="' + array[i].id + '" class="selectedBox clearfix">';
        var customList = array[i].customBranchList;
        for (var j = 0; j < customList.length; j++) {
            if (customList[j].id) {
                _html += '<a type="ALREADY_BRANCH" baseBranchId="' + customList[j].baseBranchId +
                    '" name="' + customList[j].id + '" href="javascript:;">' + customList[j].customName + '</a>';
            }
        }
        _html += '</div>\
                           </div>\
                           <div class="unselectedContent">\
                               <h4>可添加的二级科室，点击科室自动添加</h4>\
                               <div class="unselectedBox clearfix">'
        for (var j = 0; j < customList.length; j++) {
            if (customList[j].id) {
                continue;
            }
            _html += '<a type="" name="" baseBranchId="' + customList[j].baseBranchId + '" href="javascript:;">' + customList[j].baseBranchName + '</a>'
        }
        _html += '<a centext="' + array[i].id + '" type="ADD_BUTTON" name="" baseBranchId="" href="javascript:;">+</a>'
        _html += '</div>\
                           </div>\
                       </div>\
                   </div>';
    }
    $('.sectionList').html(_html);

}

/** 渲染专家类型管理页面*/
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
    renderSpecialistTypeSelect(array);
}

/** 渲染医生列表左侧下拉列表*/
function renderDoctorListView(array) {
    var _html = '';
    for (var i = 0; i < array.length; i++) {
        _html += '<li class="oneLevelItem">\
                            <p class="oneLevelName" title="' + array[i].branchName + '">' + array[i].branchName + '</p>\
                            <ul class="twoLevelUl">';
        var twoTempArr = array[i].customBranchList;
        for (var j = 0; j < twoTempArr.length; j++) {
            _html += '<li class="twoLevelItem">\
                                                    <p class="twoLevelName" name="' + twoTempArr[j].id + '" title="' + twoTempArr[j].customName + '">' + twoTempArr[j].customName + '</p>\
                                                    <ul class="threeLevelUl">';
            var threeTempArr = twoTempArr[j].userBeanList;
            if (threeTempArr) {
                for (var z = 0; z < threeTempArr.length; z++) {
                    // AUTHENTICATION_CREATE_SUCCESS未审核 通过 2拒绝 3不完整
                    if (threeTempArr[z].approveStatus == "AUTHENTICATION_CREATE_SUCCESS") {
                        _html += '<li class="threeLevelItem" stateFlag="' + threeTempArr[z].approveStatus + '" name="' + threeTempArr[z].id + '" title="' + threeTempArr[z].userName + '"><span>' + threeTempArr[z].userName + '</span><img class="unauthentication" src="../images/unauthentication.png" alt=""/></li>'
                    } else if (threeTempArr[z].approveStatus == "AUTHENTICATION_ACCEDE") {
                        _html += '<li class="threeLevelItem" stateFlag="' + threeTempArr[z].approveStatus + '" name="' + threeTempArr[z].id + '" title="' + threeTempArr[z].userName + '"><span>' + threeTempArr[z].userName + '</span></li>'
                    } else if (threeTempArr[z].approveStatus == 2) {
                        // _html += '<li class="threeLevelItem" stateFlag="'+threeTempArr[z].authenticationFlag+'" name="' + threeTempArr[z].userId + '" title="' + threeTempArr[z].name + '"><span>' + threeTempArr[z].name + '</span><img class="uncomplete" src="/yilaiyiwang/images/Denied.png" alt=""/></li>'
                    } else if (threeTempArr[z].approveStatus == 3) {
                        _html += '<li class="threeLevelItem" stateFlag="' + threeTempArr[z].approveStatus + '" name="' + threeTempArr[z].id + '" title="' + threeTempArr[z].userName + '"><span>' + threeTempArr[z].userName + '</span><img class="uncomplete" src="../images/uncomplete.png" alt=""/></li>'
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
    for (var i = 0; i < $('.threeLevelItem[stateFlag=AUTHENTICATION_CREATE_SUCCESS]').length; i++) {
        $('.threeLevelItem[stateFlag=AUTHENTICATION_CREATE_SUCCESS]').parents('.threeLevelUl').siblings('.twoLevelName').addClass('redFlag');
        $('.threeLevelItem[stateFlag=AUTHENTICATION_CREATE_SUCCESS]').parents('.twoLevelUl').siblings('.oneLevelName').addClass('redFlag');
    }
}

/** 渲染医生信息页面角色下拉列表 */
function renderRolesSelect(result) {
    var _html = '<option value="">请选择</option>';
    for (var i = 0; i < result.length; i++) {
        _html += '<option value="' + result[i].id + '">' + result[i].remarks + '</option>'
    }
    $('.powerSelect').html(_html);
}

/** 渲染医生信息页面科室下拉列表*/
function renderBranchSelect(result) {
    var _html = '<option value="">请选择</option>';
    for (var i = 0; i < result.length; i++) {
        var customBranchList = result[i].customBranchList;
        for (var j = 0; j < customBranchList.length; j++) {
            _html += ' <option value="' + customBranchList[j].id + '">' + customBranchList[j].customName + '</option>';
        }
    }
    $('.deptSelect').html(_html);

}

/** 渲染医生信息页面专家类型下拉列表*/
function renderSpecialistTypeSelect(array) {
    var _html = '';
    var _html = '<option value="" money="" moneyVideo="">请选择</option>';
    for (var i = 0; i < array.length; i++) {
        _html += ' <option money="' + array[i].consultationPicturePrice + '" moneyVideo="' + array[i].consultationVideoPrice + '" value="' + array[i].id + '">' + array[i].specialistName + '</option>'
    }
    $('.expertSelect').html(_html);
}

/** 渲染医生信息页面*/
function renderDoctorInfoView(result) {
    doctorInfo = result;
    // AUTHENTICATION_CREATE_SUCCESS未审核 AUTHENTICATION_ACCEDE通过 2拒绝 3不完整
    if (result.approveStatus == "AUTHENTICATION_CREATE_SUCCESS") {
        $('.fexidContent').show().find('div').hide().eq(0).show();
        $('.footer').addClass('marginBottom70');
        // 遮罩 未通过审核遮罩显示 不能修改信息
        $('.coverage').show();
        $('.fexidContent').show();
    } else if (result.approveStatus == 2) {
        $('.fexidContent').hide();
    } else {
        $('.fexidContent').show().find('div').hide().eq(1).show();
        $('.footer').addClass('marginBottom70');
        $('.coverage').hide();
        $('.fexidContent').show();
    }
    $('#userName').val(result.userName);
    $('#userId').val(result.id);
    $('#name').val(result.userName);
    $('#telephone').val(result.userPhone);
    $('#hospitalName').val(result.hospitalName);
    $('#medicalFees').val(result.consultationPicturePrice);
    $('#medicalFeesVideo').val(result.consultationVideoPrice);
    $('#beGoodAt').val(result.userStrong);
    $('.powerSelect').val(result.rolesId);
    $('.titleSelect').val(result.titleName);
    $('.deptSelect').val(result.branchId);
    $('.expertSelect').val(result.specialistTypeId);
    if (result.doctorCardFront) {
        $('.cardName').html(result.doctorCardFront);
    }
    if (result.signature) {
        $('.signName').html(result.signature);
    }
    var caseTypeList = result.caseTypeIds;
    for (var i = 0; i < caseTypeList.length; i++) {
        var caseTypeDomId = "#" + caseTypeList[i].caseTypeId;
        $(caseTypeDomId).addClass("CheckBg");
    }
    $('#beGoodAt').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    })
}

/** 渲染医生详细信息页面病例类型*/
function renderCaseView(result) {
    var _html = '';
    for (var i = 0; i < result.length; i++) {
        _html += '<div class="catalogue clearfix">\
                            <p>' + result[i].caseTypeName + '</p>';
        var twoArr = result[i].childList;
        for (var j = 0; j < twoArr.length; j++) {
            // _html += '<div type="" class="checkSingle CheckBg" name="' + twoArr[j].id + '">' + twoArr[j].caseTypeName + '</div>'
            _html += '<div parentName="' + result.caseTypeName + '" id="' + twoArr[j].id + '" type="" class="checkSingle " name="' + twoArr[j].id + '">' + twoArr[j].caseTypeName + '</div>'
        }
        _html += '</div>';
    }
    $('.requireBox').html(_html);
}

/** 请求空结果处理 */
function emptyResult() {
}

$(function () {

    /** 获取医院信息 */
    ajaxRequest("GET", getHospitalByCurrentUserUrl, null, false, false, true, renderHospitalView, emptyResult, null);

    /** 获取科室列表信息 */
    ajaxRequest("GET", getBranchListByCurrentUserUrl, null, false, false, true, renderBranchListView, emptyResult, null);

    /** 获取专家类型与诊费 */
    ajaxRequest("GET", getSpecialistTypeByCurrentUser, null, false, false, true, renderSpecialistTypeView, emptyResult, null);

    /** 查询医生管理页面左侧导航医生列表 */
    ajaxRequest("GET", getDoctorListByCurrentUserUrl, null, false, false, true, renderDoctorListView, emptyResult, null);

    /**获取医生信息页面科室下拉列表数据*/
    ajaxRequest("GET", getBranchListByCurrentUserUrl, null, false, false, true, renderBranchSelect, emptyResult, null);

    // 获取权限类型
    // ajaxRequest("GET", getRolesListUrl, null, false, false, true, renderRolesSelect, null, null);

    /**获取病历类型列表*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, true, renderCaseView, null, null);

    /** textarea 标签随着文本的高度实现自适应 */
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
    /** 医院信息页面组件事件*/
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

    /** 医院信息修改按钮状态改变事件*/
    $('.hospitalName,.hospitalTel,.imgPic,.videoPic').bind('input propertychange', function () {
        if ($('.hospitalName').val() != '' && $('.hospitalTel').val() != '' && $('.imgPic').val() != '' && $('.videoPic').val() != '' || oldHospitalName != newHospitalName || oldHospitalTel != newHospitalTel || oldImgPic != newImgPic || oldVideoPic != newVideoPic) {
            $('.submitBtn').addClass('active');
            $(".submitBtn").attr('disabled', false);
        } else {
            $('.submitBtn').removeClass('active');
            $(".submitBtn").attr('disabled', true);
        }
    })

    /** 医院信息修改提交事件 */
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
                        content: _$('.successBox')
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

    /** 科室管理页面*/
    // 提示信息
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
        if ($(this).attr('type') == 'CUSTOM_BRANCH') {
            $(this).remove();
        } else if ($(this).attr('type') == 'ALREADY_BRANCH') {
            $(this).addClass('choose').attr('type', 'REMOVE_BRANCH').parents('.selectedContent').siblings('.unselectedContent').find('.unselectedBox').prepend($(this));
        } else {
            //"ADD_BRANCH"
            $(this).removeClass('choose').attr('type', '').parents('.selectedContent').siblings('.unselectedContent').find('.unselectedBox').prepend($(this));
        }
        if ($('.choose').length > 0) {
            $('.sectionSubmit').addClass('active');
        } else {
            $('.sectionSubmit').removeClass('active');
        }
    })
    //添加科室
    $('.sectionList').delegate('.unselectedContent a', 'click', function () {
        if ($(this).attr('type') == 'ADD_BUTTON') {

            var data = {"parentId": $(this).attr('centext')}
            ajaxRequest("GET", getBranchListByParentIdUrl, data, true, "application/json", false, renderCustomBranchSelect, null, null);

            function renderCustomBranchSelect(result) {
                $("#customBranchSelect").empty();
                $("#customBranchName").val("");
                var _HTML = '';
                for (var i = 0; i < result.length; i++) {
                    _HTML += '<option value="' + result[i].id + '">' + result[i].branchName + '</option>';
                }
                $("#customBranchSelect").append(_HTML);
            }

            var id = "#" + $(this).attr('centext')
            layer.open({
                type: 1,
                title: '',
                area: ['500px', '300px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                content: $('#CUSTOM_BRANCH_VIEW') //调到新增页面
            });
            // 添加科室
            $("#closCustomBranchView").one("click", function () {
                $('#CUSTOM_BRANCH_VIEW').hide();
                layer.closeAll();
            })
            $("#addCustomBranch").bind("click", function () {
                if ($.trim($("#customBranchName").val()).length < 1) {
                    layer.msg("自定义科室名字不能为空")
                    $("#customBranchName").val("");
                    return;
                }
                $('#CUSTOM_BRANCH_VIEW').hide();
                layer.closeAll();
                var _html = '<a class="choose" type="CUSTOM_BRANCH" baseBranchId="' + $("#customBranchSelect").val() +
                    '" name="" href="javascript:;">' + $("#customBranchName").val() + '</a>';
                $(id).prepend(_html);
                $(this).unbind();
            })


        } else if ($(this).attr('type') == '') {
            $(this).addClass('choose').attr('type', 'ADD_BRANCH').parents('.unselectedContent').siblings('.selectedContent').find('.selectedBox').prepend($(this));
        } else {
            $(this).removeClass('choose').attr('type', 'ALREADY_BRANCH').parents('.unselectedContent').siblings('.selectedContent').find('.selectedBox').prepend($(this));
        }
        if ($('.choose').length > 0) {
            $('.sectionSubmit').addClass('active');
        } else {
            $('.sectionSubmit').removeClass('active');
        }
    })

    /** 科室修改列表提交*/
    $('.sectionSubmit').click(function () {
        if ($(this).hasClass('active')) {
            var deptHospitalDetailList = [];
            var objArr = $('.choose');
            if (objArr.length > 0) {
                let str = "";
                for (var i = 0; i < objArr.length; i++) {
                    deptHospitalDetailList.push({
                        "customBranchId": objArr.eq(i).attr('name'),
                        "customBranchName": objArr.eq(i).html(),
                        "baseBranchId": objArr.eq(i).attr('baseBranchId'),
                        "type": objArr.eq(i).attr('type')
                    })
                }
                var data = new FormData;
                data.append("customBranchStr", JSON.stringify(deptHospitalDetailList))

                /** 自定义科室列表变更提交*/
                ajaxRequest("POST", updateCustomBranchListUrl, data, false, false, true, updateCustomBranchSuccess, updateCustomBranchFailed, null);

                function updateCustomBranchFailed(result) {
                    /** 查询科室列表信息 */
                    ajaxRequest("GET", getBranchListByCurrentUserUrl, null, false, false, true, renderBranchListView, null, null);
                    layer.msg(result);
                }

                function updateCustomBranchSuccess() {
                    /** 查询科室列表信息 */
                    ajaxRequest("GET", getBranchListByCurrentUserUrl, null, false, false, true, renderBranchListView, null, null);
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
            }
        }
    })

    /**医生管理页面*/
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
        // doctorIdGetInfo($(this).attr('name'));
        /** 查询医生详细信息 */
        var data = {"userId": $(this).attr('name')};
        ajaxRequest("GET", getDoctorDetailByIdUrl, data, true, "application/json", true, renderDoctorInfoView, null, null);
        return false;
    });




    var doctorCard = "0";
    var signature = "0";


    //上传医师资格证，记录文件名添加到span里
    cardUpload.onchange = function () {
        cardName.innerHTML = cardUpload.files[0].name;
    };
    var signature;
    //上传签名，记录文件名添加到span里
    signUpload.onchange = function () {
        signName.innerHTML = signUpload.files[0].name;
    }
    /** 证书上传事件*/
    $('.cardBtn').click(function () {
        if ($('.cardUp')[0].files.length > 0) {
            var fileData = new FormData();
            fileData.append('file', $('.cardUp')[0].files[0])
            doctorCard = "1";
            ajaxRequest("POST", uploadFileUrl, fileData, false, false, true, uploadSuccess, uploadFailed, null);
        }
    })

    /** 签名上传事件*/
    $('.signBtn').click(function () {
        if ($('.signUp')[0].files.length > 0) {
            var fb = new FormData();
            fb.append('file', $('.signUp')[0].files[0])
            signature = "1";
            ajaxRequest("POST", uploadFileUrl, fb, false, false, true, uploadSuccess, uploadFailed, null);
        }
    })

    /** 上传成功回调方法*/
    function uploadSuccess(result) {
        if (doctorCard == "1") {
            doctorCard = result;
            $('.cardName').html(doctorCard);
        }else {
            signature = result;
            $('.signName').html(signature);
        }
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
    }

    /** 上传失败回调方法*/
    function uploadFailed() {
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
        var data = new FormData();
        data.append("userId", $('#userName').attr('userId'));
        ajaxRequest("POST", "", data, false, false, true, resetSuccess, resetFailed, null);

        function resetSuccess() {
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
        }

        function resetFailed() {
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

// 修改医生信息
    $('.modifyBtn').click(function () {
        if (!$(this).hasClass("disabled")) {
            // 修改信息判断
            var data = new FormData();
            if ($('.operate').length > 0) {
                var caseTypeJsonStr = "{";
                for (var i = 0; i < $('.CheckBg').length; i++) {
                    var a = $('.checkSingle.CheckBg').eq(i).attr('name');
                    var b = $('.checkSingle.CheckBg').eq(i).html();
                    var c = $('.checkSingle.CheckBg').eq(i).attr('parentName');
                    caseTypeJsonStr += "'" + a + "':'" + c + "-" + b + "',";
                }
                caseTypeJsonStr = caseTypeJsonStr.substring(0, caseTypeJsonStr.length - 1);
                caseTypeJsonStr += "}";
                data.append("idTypeName", caseTypeJsonStr);
            }

            if (doctorCard.length > 16) {
                data.append('doctorCardFront', doctorCard);
            }
            if (signature.length > 16) {
                data.append("signature", signature);
            }
            data.append("userName", $('#name').val());
            data.append("telephone", $('#telephone').val());
            data.append("consultationPicturePrice", $('#medicalFees').val());
            data.append("consultationVideoPrice", $('#medicalFeesVideo').val());
            data.append("userStrong", $('#beGoodAt').val());
            data.append("titleName", $('.titleSelect').val());
            data.append("specialistTypeId", $('.expertSelect').val());
            data.append("branchId", $('.deptSelect').val());
            data.append("userId", $('#userName').attr('userId'));

            ajaxRequest("POST", updateDoctorDetailUtl, data, false, false, true, updateDoctorDetailSuccess, updateDoctorDetailFailed, null);

            function updateDoctorDetailSuccess() {
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
            }

            function updateDoctorDetailFailed() {
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

        var data = new FormData();

        data.append("id", $('#userId').val());
        ajaxRequest("POST", approveRegisterUrl, data, false, false, true, approveRegisterSuccess, approveRegisterFailed, null);

        function approveRegisterSuccess(result) {
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
            }, 2000)
            // 通过后删掉左面导航栏上的图标，
            $('.threeLevelItem.active').find('img').remove();
            // 调用查医生信息方法
            renderDoctorInfoView(result);
        }

        function approveRegisterFailed() {
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
        var data = new FormData();
        data.append("id", $('#userId').val());
        ajaxRequest("POST", overruleRegisterUrl, data, false, false, true, overruleRegisterSuccess, overruleRegisterFailed, null);

        function overruleRegisterSuccess() {
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
            // doctorIdGetInfo($('.threeLevelItem.active').attr('name'));
            $('.fexidContent').hide();
            setTimeout(function () {
                layer.closeAll();
            }, 3000);
        }

        function overruleRegisterFailed() {
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
