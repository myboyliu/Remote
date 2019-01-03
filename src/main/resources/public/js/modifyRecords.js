let isVideo = false;// 选择的医生信息数组
let applyInfo = {};// 选择的医生信息数组
var fileAllArr = []; //所有图片原始资源
var scaleNum = 10; // 图片缩放倍数
/** 渲染 病历页面 左侧导航 */
function renderCaseTypeLeftNavigation(data) {
    let _html = '<li class="oneLevelItem patientInfo active">\
                    <p class="oneLevelName">患者基本信息</p>\
                </li>\
                <li class="oneLevelItem caseHistory">\
                    <p class="oneLevelName">电子病历附件</p>\
                    <ul class="twoLevelUl">';
    $.each(data, function (key, val) {
        _html += '<li class="twoLevelItem">\
                                <p class="twoLevelName">' + val.caseTypeName + '</p>\
                                <ul class="threeLevelUl">';
        const childCaseTypeList = val.childList;
        for (let i = 0; i < childCaseTypeList.length; i++) {
            _html += '<li class="threeLevelItem" name="' + childCaseTypeList[i].id + '">' + childCaseTypeList[i].caseTypeName + '</li>'
        }
        _html += '</ul>\
                            </li>'
    })
    _html += '</ul>\
            </li>'
    $('.oneLevelUl').html(_html);
    $('.oneLevelItem').eq(0).addClass('active').find('.twoLevelUl').show().find('.twoLevelItem').eq(0).addClass('active').find('.tthreeLevelUl').slideDown();
    $('.oneLevelUl').css({
        'width': '145px',
        'position': 'fixed',
    });
    $('.twoLevelUl').css({
        'height': $(window).height() - 230 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
    });

    let upfileHtml = '';
    $.each(data, function (key, val) {
        const childCaseTypeList = val.childList;
        for (let i = 0; i < childCaseTypeList.length; i++) {
            upfileHtml += '<li name="' + childCaseTypeList[i].caseTypeName + '" id="' + childCaseTypeList[i].id + '" class="upfileItem clearfix">\
                            <div class="upfileContent">\
                                <div class="operateLeft">' + val.caseTypeName + '-' + childCaseTypeList[i].caseTypeName + '</div>\
                                <ul class="fileContent clearfix">\
                                    <li class="fileAdd">\
                                        <a class="addfileBtn" href="javascript:;"></a>\
                                        <input accept=".png,.jpg,.pdf,.jpeg,.dcm" class="fileInput" type="file" multiple>\
                                        <p class="fileName">添加文件</p>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>'
        }
    });
    $('.upfileUl').html(upfileHtml);
}

/** 渲染 病例图片列表 */
let fileParentUi = null; // 当前点击块的父级

function renderFileListView(baseUrl, url, type, fileName) {
    fileParentUi.append(
        `<li class="fileItem" dataBase="${baseUrl}">\
                                        <div style='background-image:url(${url});'></div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/><p type="${type}" desc="" class="fileName">${fileName}</p></li>`
    );
}

$(function () {
    /**查询病历类型列表*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, false, renderCaseTypeLeftNavigation, null, null);
    if (JSON.parse(sessionStorage.getItem('applyInfo'))) {
        applyInfo = JSON.parse(sessionStorage.getItem('applyInfo'));
        if ("APPLY_CONSULTATION_VIDEO" === applyInfo.applyType) {
            isVideo = true;
        }
    }
    if (JSON.parse(sessionStorage.getItem('applyInfo'))) {
        applyInfo = JSON.parse(sessionStorage.getItem('applyInfo'));
        if ("APPLY_CONSULTATION_VIDEO" === applyInfo.applyType) {
            isVideo = true;
        }
        $('#username').val(applyInfo.patientName)
        $('#idCard').val(applyInfo.patientCard)
        $('#phone').val(applyInfo.patientPhone)
        $('#address').val(applyInfo.detailAddress)
        var choiceAge = applyInfo.patientAge;
        // $('#age').val(applyInfo.patientAge);
        // $('.choiceAge').val(applyInfo.patientAge);
        $('#high').val(applyInfo.patientHeight);
        $('#weight').val(applyInfo.patientWeight / 1000);
        $('.fileCount').html(applyInfo.caseContentList.length); // 图片总张数
        if (applyInfo.patientSex == '男') {
            $('.sex > a').removeClass('active').eq(0).addClass('active');
        } else {
            $('.sex > a').removeClass('active').eq(1).addClass('active');
        }
        $('.urgent > a').removeClass('active').eq(applyInfo.applyUrgent).addClass('active');
        $('#createCase_textDiagnose').val(applyInfo.caseDiagnosis); //初步诊断
        $('#createCase_textGola').val(applyInfo.applyRemark); //会诊目的
        // 男女选择
        $('.sex > a').click(function () {
            $(this).addClass('active').siblings('a').removeClass('active');
        });
        // 加急选择
        $('.urgent > a').click(function () {
            $(this).addClass('active').siblings('a').removeClass('active');
        });
        /* 电子病历附件 */
        var tempArr = applyInfo.caseContentList;
        for (var i = 0; i < tempArr.length; i++) {
            var fileType = tempArr[i].contentPath.substr(tempArr[i].contentPath.lastIndexOf('.') + 1, tempArr[i].contentPath.length);
            var fileName = tempArr[i].contentPath;
            fileAllArr.push(fileName);
            console.log(tempArr[i].contentTypeId)
            if (fileType == 'png' || fileType == 'jpg') {
                if (tempArr[i].contentRemark == "") {
                    $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '"  class="fileItem">\
                                       <div style = "background-image: url(&apos;' + baseUrl + "/" + tempArr[i].contentPath + '&apos;)"></div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="img" desc="' + tempArr[i].contentRemark + '" class="fileName">' + tempArr[i].contentPath + '</p>\
                                    </li>')
                } else {

                    $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '" class="fileItem">\
                                       <div style = "background-image: url(&apos;' + baseUrl + "/" + tempArr[i].contentPath + '&apos;)"></div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="img" desc="' + tempArr[i].contentRemark + '" class="fileName active">' + tempArr[i].contentPath + '</p>\
                                    </li>')
                }
            } else if (fileType == 'pdf') {
                if (tempArr[i].contentRemark == '') {
                    $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '"  class="fileItem">\
                                        <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="pdf" desc="' + tempArr[i].contentRemark + '" class="fileName">' + tempArr[i].contentPath + '</p>\
                                    </li>')
                } else {
                    $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '" class="fileItem">\
                                        <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="pdf" desc="' + tempArr[i].contentRemark + '" class="fileName active">' + tempArr[i].contentPath + '</p>\
                                    </li>')
                }
            } else if (fileType == 'dcm') {
                if (tempArr[i].contentRemark == '') {
                    $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '"  class="fileItem">\
                                        <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="dcm" desc="' + tempArr[i].contentRemark + '" class="fileName">' + tempArr[i].contentPath + '</p>\
                                    </li>')
                } else {
                    $('.upfileUl').find('#' + tempArr[i].contentTypeId).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].orderWeight + '" filePath="' + tempArr[i].contentPath + '" class="fileItem">\
                                        <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/>\
                                        <p type="dcm" desc="' + tempArr[i].contentRemark + '" class="fileName active">' + tempArr[i].contentPath + '</p>\
                                    </li>')
                }
            }
            $('.fileCount').html(fileAllArr.length);
            $(".fileContent").sortable({
                items: "li:not(.fileAdd)"
            });
        }
    }


// 验证中文名字
    $('#username').blur(function () {
        if ($('#username').val().length === 0) {
            layer.msg('姓名不能为空');
        } else if (!RegExpObj.Reg_Name.test($('#username').val())) {
            layer.msg('输入内容格式有误,请修改')

        }
    });
//  校验身份证号
    $('#idCard').blur(function () {
        // 账号的验证 手机号验证
        if ($('#idCard').val().length === 0) {
            layer.msg('身份证号不能为空');
        } else if (!RegExpObj.Reg_IDCardNo.test($('#idCard').val())) {
            layer.msg('输入内容格式有误，请修改');
        } else {
            discriCard($(this).val())
        }
    });

//  校验年龄 身高 体重
    $('#age').blur(function () {
        if (!RegExpObj.Reg_age.test($('#age').val())) {
            layer.msg('输入内容格式有误，请修改')
        } else if ($('#age').val().length == 0) {
            layer.msg('年龄不能为空');
        }
    });
    $('#high').blur(function () {
        if (!RegExpObj.Reg_hight.test($('#high').val())) {
            layer.msg('输入内容格式有误，请修改')

        } else if ($('#high').val().length == 0) {
            layer.msg('身高不能为空');
        }
    });
    $('#weight').blur(function () {
        if (!RegExpObj.Reg_hight.test($('#weight').val())) {

            layer.msg('输入内容格式有误，请修改')
        } else if ($('#weight').val().length == 0) {
            layer.msg('体重不能为空');
        }
    });
//    验证电话号码
    $('#phone').blur(function () {
        if (!RegExpObj.Reg_isPhone.test($('#phone').val())) {
            layer.msg('输入内容格式有误，请修改')
        }
    });
//    验证常住城市
    $('#address').blur(function () {
        if ($('#address').val().length == 0) {
            layer.msg('城市不能为空');
        } else if (!RegExpObj.Reg_address.test($('#address').val())) {
            layer.msg('输入内容格式有误，请修改')
        }
    });
// 验证初步诊断不能为空
    $('#createCase_textDiagnose').blur(function () {
        if ($('#createCase_textDiagnose').val().length == 0) {
            layer.msg('初步诊断不能为空');
        }
    });
// 验证会、转诊目的不能为空
    $('#createCase_textGola').blur(function () {
        if ($('#createCase_textGola').val().length == 0) {
            layer.msg('会/转诊目的不能为空');
        }
    });

// 输入身份证号自动计算年龄 性别 idCard
    function discriCard(UUserCard) {
        console.log(UUserCard)
        var unit = '岁'; // 单位
        var num = 0; // 值
        if (UUserCard.length == 18) {
            //获取出生日期
            var userYear = UUserCard.substring(6, 10);
            var userMonth = UUserCard.substring(10, 12);
            var userDay = UUserCard.substring(12, 14);
            //获取性别
            if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
                $('#man').addClass('active').siblings('a').removeClass('active');
            } else {
                $('#woman').addClass('active').siblings('a').removeClass('active');
                //是女则执行代码 ...
            }
        } else {
            var userYear = 19 + UUserCard.substring(6, 8);
            var userMonth = UUserCard.substring(8, 10);
            var userDay = UUserCard.substring(10, 12);
            //获取性别
            if (parseInt(UUserCard.substring(14, 15)) % 2 == 1) {
                console.log($('.sex > a').html())
                $('#man').addClass('active').siblings('a').removeClass('active');
            } else {
                $('#woman').addClass('active').siblings('a').removeClass('active');
                //是女则执行代码 ...
            }
        }
        // 计算年月日
        var myDate = new Date();
        var year = myDate.getFullYear(); // 当前年份
        var month = myDate.getMonth() + 1; // 当前月份
        var day = myDate.getDate(); // 当前号数
        if (year - userYear > 0) {
            num = year - userYear;
            unit = '岁';
        } else if (month - userMonth > 0) {
            num = month - userMonth;
            unit = '月';
        } else if (day - userDay >= 0) {
            num = day - userDay;
            unit = '天';
        } else {
            layer.msg('输入内容格式有误，请修改');
        }
        $('#age').val(num);
        $('.choiceAge').val(unit);
    }


    $(window).scroll(function () {
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

    /*  //textarea 标签随着文本的高度实现自适应 */
    $('.text-adaption').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    $(window).scroll(function () {
        $('.oneLevelUl').css({
            'width': '145px',
            'position': 'fixed',
        })
    });

    function scrollTo(x) {
        $('html, body').animate({
            scrollTop: x - 100,
        }, 300);
    };

// 病历信息一级按钮
    $('.oneLevelUl').delegate('.oneLevelItem', 'click', function () {
        $(this).addClass('active').siblings('.oneLevelItem').removeClass('active');
        $(this).find('.twoLevelUl').stop(true).slideToggle();
        $(this).siblings('.oneLevelItem').find('.twoLevelUl').stop(true).slideUp();
        scrollTo($('.hosp').not('.hosp:hidden').eq($(this).index()).offset().top);
    })
// 病历信息二级按钮
    $('.oneLevelUl').delegate('.twoLevelItem', 'click', function () {
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
    $('.oneLevelUl').delegate('.threeLevelUl', 'click', function () {
        return false;
    });
    $('.oneLevelUl').delegate('.threeLevelItem', 'click', function () {
        $('.oneLevelUl').find('.threeLevelItem').removeClass('active');
        $(this).addClass('active');
        scrollTo($('#' + $(this).attr('name')).offset().top);
        return false;
    });


    /*创建病例板块 */

    $(".select label").click(function () {
        $(this).siblings("span").addClass("active");
        $(this).parent().siblings("div").find("span").removeClass("active");
    });

    $(".expedited_btn label").click(function () {
        $(this).siblings("span").addClass("active");
        $(this).parent().siblings("div").find("span").removeClass("active");
    });


//点击添加 添加病历图片
    $(".upfileUl").delegate('.fileInput', 'change', function () {
        fileParentUi = $(this).parents(".fileContent");
        uploadFile = $(this)[0].files; // 某一块添加时的原始数据
        fileIndex = 0;
        addCaseFile();
    });

    function addCaseFile() {
        let fileName = uploadFile[fileIndex].name;
        // 重复文件过滤
        for (let i = 0, len = fileAllArr.length; i < len; i++) {
            if (fileAllArr[i].name === fileName) {
                fileIndex++;
                if (fileIndex < uploadFile.length) {
                    addCaseFile();
                    return false;
                }
                event.target.value = "";
                return false;
            }
        }
        let url = "";
        let type = "";
        let data = new FormData();
        //上传文件
        data.append("file", uploadFile[fileIndex]);
        ajaxRequest("POST", uploadFileUrl, data, false, false, true, uploadFileSuccess, null, null);

        function uploadFileSuccess(result) {
            fileAllArr.push({
                "name": fileName,
                "value": result,
            });
            if (/(.png|.jpg|.jpeg)$/gi.test(fileName)) {
                type = "img";
                let reader = new FileReader();
                reader.readAsDataURL(uploadFile[fileIndex]);
                reader.onload = function (e) {
                    url = e.target.result;
                    renderFileListView(fileName, url, type, result);
                }
            } else if (/(.pdf)$/gi.test(fileName)) {
                type = "pdf";
                url = "../images/pdf_icon.png";
                renderFileListView(fileName, url, type, result);
            } else if (/(.dcm)$/gi.test(fileName)) {
                type = "dcm";
                url = "../images/dcm_icon.png";
                renderFileListView(fileName, url, type, result);
            }
            // 总张数
            fileIndex++;
            $('.sum').html(fileAllArr.length);
            if (fileIndex < uploadFile.length) {
                addCaseFile();
            } else {
                // 拖拽排序
                $(".fileContent").sortable({
                    items: "li:not(.fileAdd)"
                });
            }
        }
    }

// 删除文件
    $('.upfileUl').delegate('.delFileBtn', 'click', function () {
        for (let i = 0; i < fileAllArr.length; i++) {
            if ($(this).siblings(".fileName").html() === fileAllArr[i].value) {
                fileAllArr.splice(i, 1);
            }
        }
        for (let i = 0; i < selectFileArr.length; i++) {
            if ($(this).siblings(".fileName").html() === selectFileArr[i].value) {
                selectFileArr.splice(i, 1);
            }
        }
        $(this).parent('.fileItem').remove();
        // 总张数
        $('.sum').html(fileAllArr.length);
        return false;
    })


// 备注保存
    $('.descText').blur(function () {
        fileArr[indexFile].desc = $('.descText').val();
    });


    /* 取消按钮 */
    $('.cancel').click(function () {
        window.history.go(-1);
    })
    /* 保存修改按钮 */
    $('.save').click(function () {
        /* 判断信息是否填写完整 */
        if ($('#username').val() == '' || $('#idCard').val() == '' || $('#phone').val() == '' || $('#address').val() == '' || $('#age').val() + $('.choiceAge').val() == '' || $('#high').val() == '' || $('#weight').val() == '' || $('.sex > a.active').html() == '' || $('#createCase_textDiagnose').val() == '' || $('#createCase_textGola').val() == '') {
            var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: _$('.incomplete'),
            });
            setTimeout(function () {
                $('.incomplete').hide();

            }, 2000);
        } else if (!RegExpObj.Reg_Name.test($('#username').val()) || !RegExpObj.Reg_IDCardNo.test($('#idCard').val()) || !RegExpObj.Reg_age.test($('#age').val()) || !RegExpObj.Reg_hight.test($('#high').val()) || !RegExpObj.Reg_hight.test($('#weight').val()) || !RegExpObj.Reg_mobilePhone.test($('#phone').val()) || !RegExpObj.Reg_address.test($('#address').val()) || $('#createCase_textDiagnose').val() == '' || $('#createCase_textGola').val() == '') {
            var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: _$('.modifier'),
            });
            setTimeout(function () {
                $('.modifier').hide();

            }, 2000);

        } else {
            var amend = new FormData();
            amend.append('orderId', data.orderFormBean.id);
            amend.append('name', $('#username').val());
            amend.append('idCard', $('#idCard').val());
            amend.append('phone', $('#phone').val());
            amend.append('address', $('#address').val());
            amend.append('age', $('#age').val() + $('.choiceAge').val());
            amend.append('high', $('#high').val());
            amend.append('weight', $('#weight').val());
            amend.append('sex', $('.sex > a.active').html());
            amend.append('isUrgent', $('.urgent > a.active').attr('value')); //是否加急(1是0不是)
            amend.append('diagnosis', $('#createCase_textDiagnose').val()); //初步诊断
            amend.append('telemedicineTarget', $('#createCase_textGola').val()); //会诊目的
            // 图片描述和类型
            var descArr = $('.upfileUl > li.upfileItem');
            var detailArr = [];
            var JSONStr = '{';
            var sortStr = "{";
            for (var i = 0; i < descArr.length; i++) {
                var fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
                for (var j = 0; j < fileLi.length; j++) {
                    JSONStr += '"' + fileLi.eq(j).find("p.fileName").html() + '":{detail:"' + fileLi.eq(j).find("p.fileName").attr("desc") + '",typeId:"' + descArr.eq(i).attr("id") + '",typeName:"' + descArr.eq(i).attr("name") + '"},'
                    sortStr += '"' + fileLi.eq(j).attr("id") + '":{"sort":"' + (j + 1) * (i + 1) + '","remarks":"' + fileLi.eq(j).find("p.fileName").attr("desc") + '"},'
                }
            }
            JSONStr += '}';
            sortStr += '}';
            amend.append('fileIdAndSort', sortStr); // 文件排序顺序
            amend.append('detailMap', JSONStr);
            $.ajax({
                type: 'POST',
                url: IP + 'order/applyManagerUpdateOrder',
                dataType: 'json',
                data: amend,
                processData: false,
                contentType: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    console.log(data)
                    if (data.status == 200) {
                        sessionStorage.setItem('orderId', JSON.stringify(data.orderId));
                        window.location = '/yilaiyiwang/workbench/manageAudit.html';
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


    })


})
