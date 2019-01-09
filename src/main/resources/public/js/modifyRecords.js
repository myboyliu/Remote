let isVideo = false;// 选择的医生信息数组
let applyInfo = {};// 选择的医生信息数组
let fileAllArr = []; //所有图片原始资源
let scaleNum = 10; // 图片缩放倍数

let fileArr = []; // 当前点击块的文件数据
let indexFile = 0; // 当前点击的索引
let ObjArr = []; //  当前点击块文件数组对象
let selectFileArr = []; // 某一块的图片展示数据
let uploadFile = [];
let fileIndex;
let objParent = null; // 当前点击块的父级
let caseId;
let casePatientId ;

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
function renderFileListView(baseUrl, url, type, fileName) {
    objParent.append(
        `<li class="fileItem" dataBase="${baseUrl}">\
                                        <div style='background-image:url(${url});'></div>\
                                        <img class="delFileBtn" src="../images/delete_file.png"/><p type="${type}" desc="" class="fileName">${fileName}</p></li>`
    );

}

function success(data) {
    fileAllArr.push(name);
    // 成功操作
    if (/[png|jpg]$/gi.test(name)) {
        objParent.append(
            `<li class="fileItem fileNewItem" sort="${sort}" id="${data.patientCaseId}" filePath="${data.patientCaseUrl}">\
                                          <div style='background-image:url(${imgIp + data.patientCaseUrl});'></div>\
                                          <img class="delFileBtn" src="../images/delete_file.png"/><p type="img" desc="" class="fileName">${name}</p></li>`
        );
    } else if (/[pdf]$/gi.test(name)) {
        // console.log('是pdf类型')
        objParent.append(
            `<li class="fileItem fileNewItem" sort="${sort}" id="${data.patientCaseId}" filePath="${data.patientCaseUrl}">\
                                                        <div class="bgSize" style='background-image:url(../images/pdf_icon.png);'></div>\
                                                        <img class="delFileBtn" src="../images/delete_file.png"/><p type="pdf" desc="" class="fileName">${name}</p></li>`
        );
    } else if (/[dcm]$/gi.test(name)) {
        objParent.append(
            `<li class="fileItem fileNewItem" sort="${sort}" id="${data.patientCaseId}" filePath="${data.patientCaseUrl}">\
                                                        <div class="bgSize" style='background-image:url(../images/dcm_icon.png);'></div>\
                                                        <img class="delFileBtn" src="../images/delete_file.png"/><p type="dcm" desc="" class="fileName">${name}</p></li>`
        );
    } else {
        layer.msg('请上传png/jpg/pdf/dcm类型的文件');
    }
    $('.fileCount').html(Number($('.fileCount').html()) + 1);
}

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
                renderFileListView(result, url, type, result);
            }
        } else if (/(.pdf)$/gi.test(fileName)) {
            type = "pdf";
            url = "../images/pdf_icon.png";
            renderFileListView(baseUrl + "/" + result, url, type, result);
        } else if (/(.dcm)$/gi.test(fileName)) {
            type = "dcm";
            url = "../images/dcm_icon.png";
            renderFileListView(baseUrl + "/" + result, url, type, result);
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


/** 提交病历信息*/
function buildCaseData() {
    let data = new FormData();
    let caseContentArray = [];
    if (fileAllArr.length > 0) {
        // 图片描述和类型
        const descArr = $('.upfileUl > li.upfileItem');
        for (let i = 0; i < descArr.length; i++) {
            const fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
            for (let j = 0; j < fileLi.length; j++) {
                caseContentArray.push({
                    contentTypeId: descArr.eq(i).attr("id"),
                    contentPath: fileLi.eq(j).find("p.fileName").html(),
                    contentRemark: fileLi.eq(j).find("p.fileName").attr("desc"),
                    orderWeight: j
                })
            }
        }
    }
    let patientSex = $('.sex > a.active').html();
    let patientAge = $('#age').val() + $('.choiceAge').val();
    let caseDiagnosis = $('#createCase_textDiagnose').val();
    let caseSummary = "***/" + patientSex + "/" + patientAge + "/" + caseDiagnosis;
    //病历信息
    data.append("caseRecordId", caseId);
    data.append("casePatientId", casePatientId);
    data.append("applyFormId", applyFormId);
    data.append("patientName", $('#username').val());
    data.append("patientCard", $('#idCard').val());
    data.append("patientPhone", $('#phone').val());
    data.append("detailAddress", $('#address').val());
    data.append("patientAge", $('#age').val());
    data.append("patientSex", patientSex);
    data.append("patientHeight", $('#high').val());
    data.append("patientWeight", Number($('#weight').val()) * 1000);
    data.append("caseDiagnosis", caseDiagnosis); //初步诊断
    data.append("weightPathTypeId", JSON.stringify(caseContentArray)); //病历附件信息
    //申请信息
    data.append("caseSummary", caseSummary); //病历摘要信息
    data.append('applyUrgent', $('.urgent > a.active').attr('value')); //是否加急(1加急/是，0不加急/否)
    data.append('applyRemark', $('#createCase_textGola').val()); //会诊目的
    /** 修改病历信息 */
    console.log(JSON.stringify(caseContentArray));
    ajaxRequest("POST", sirUpdateCase, data, false, false, true, updateCaseSuccess, failedParam, null);
    /** 修改申请信息 */
    function failedParam(data) {
        console.log(data);
        return false;
        layer.closeAll();
        layer.msg(data.result);
    }

    function updateCaseSuccess(result) {
        console.log(result);
        window.location = '../page/adminApplyInfo.html';
    }

}

$(function () {
    /**查询病历类型列表*/
    ajaxRequest("GET", getAllCaseContentType, null, true, false, false, renderCaseTypeLeftNavigation, null, null);

    if (JSON.parse(sessionStorage.getItem('applyInfo'))) {
        applyInfo = JSON.parse(sessionStorage.getItem('applyInfo'));
        if ("APPLY_CONSULTATION_VIDEO" === applyInfo.applyType) {
            isVideo = true;
        }
        caseId = applyInfo.caseRecordId;
        applyFormId = applyInfo.id;
        casePatientId = applyInfo.patientId;
        $('#username').val(applyInfo.patientName)
        $('#idCard').val(applyInfo.patientCard)
        $('#phone').val(applyInfo.patientPhone)
        $('#address').val(applyInfo.detailAddress)
        let choiceAge = applyInfo.patientAge;
        $('#age').val(choiceAge);
        $('.choiceAge').val("岁");
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
        let tempArr = applyInfo.caseContentList;
        for (let i = 0; i < tempArr.length; i++) {
            let fileType = tempArr[i].contentPath.substr(tempArr[i].contentPath.lastIndexOf('.') + 1, tempArr[i].contentPath.length);
            let fileName = tempArr[i].contentPath;
            fileAllArr.push({
                name:fileName,
            });
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
    $('.upfileUl').delegate('.fileInput', 'change', function () {
        objParent = $(this).parents(".fileContent");
        uploadFile = $(this)[0].files; // 某一块添加时的原始数据
        fileIndex = 0;
        addCaseFile();
    });
    // 删除文件
    $('.upfileUl').delegate('.delFileBtn', 'click', function () {
        let fileId = $(this).parents('.fileItem').attr('id');
        let filePath = $(this).parents('.fileItem').attr('filePath');
        let fileName = filePath.substr(filePath.lastIndexOf('/'), filePath.length)
        let data = new FormData();
        data.append("id", fileId);
        ajaxRequest("POST", softDelPicture, data, false, false, true, removeFileSuccess, null, null);

        function removeFileSuccess(result) {
            fileAllArr.splice(fileAllArr.splice(fileAllArr.indexOf(fileName), 1));
            $('.fileCount').html(Number($('.fileCount').html()) - 1);
        }
        $(this).parent('.fileItem').remove();
        return false;
    });
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
            // 提交病历信息
            buildCaseData()
        }
    })

    // 图片点击查看大图
    $('.upfileUl').delegate('.fileItem', 'click', function () {
        let $ = layui.jquery;
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['1167px', '700px'], skin: "noBackground",
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            scrollbar: false,
            content: $('.bigImgContainer'),
        });
        // 整理一组图片展示数据
        objParent = $(this).parent('.fileContent');
        indexFile = $(this).index() - 1;
        ObjArr = $(this).parent('.fileContent').find('.fileItem');
        for (let i = 0; i < ObjArr.length; i++) {
            fileArr.push({
                'id': ObjArr.eq(i).attr('id'),
                'name': ObjArr.eq(i).find('p').html(),
                'type': ObjArr.eq(i).find('p').attr('type'),
                'src': ObjArr.eq(i).find('div').css('backgroundImage'),
                'desc': ObjArr.eq(i).find('p').attr('desc'),
                'filePath': ObjArr.eq(i).attr('filepath'),
            });
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        if (fileArr[indexFile].type != 'img') {
            // pdf dcm
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
            } else {
                $('.downlodeFile').hide();
                $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
                $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');
            }
        } else {
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');

        }
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);

        /* 如果是png/jpg/pdf格式 downlodeFile 隐藏 */
        if (fileArr[indexFile].type == 'dcm') {
            $('.downlodeFile').show();
        } else {
            $('.downlodeFile').hide();

        }

    });

    // 上一个
    $('.switchBox .prev').click(function () {
        if (indexFile <= 0) {
            indexFile = 0;
        } else {
            indexFile--;
        }
        if (fileArr[indexFile].type != 'img') {
            // pdf dcm
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                // pdf 相关操作
                // 1、往 .bigImg 渲染pdf
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
                $('.bigImgContainer').find('.bigImg').addClass('bgSize').html('');
            }
        } else {
            // 图片的相关操作
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        scaleNum = 10;
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);

    });
    // 下一个
    $('.switchBox .next').click(function () {
        if (indexFile >= fileArr.length - 1) {
            indexFile = fileArr.length - 1;
        } else {
            indexFile++;
        }
        if (fileArr[indexFile].type != 'img') {
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                $('.downlodeFile').show();
                $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
                $('.bigImgContainer').find('.bigImg').addClass('bgSize').html('');
            }
        } else {
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        scaleNum = 10;
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);

    });
    // 关闭
    $('.closeBtn').click(function () {
        layer.closeAll();
        $('.bigImgContainer').hide();
        let _html = '<li class="fileAdd">\
            <a class="addfileBtn" href="javascript:;"></a>\
            <input class="fileInput" type="file" multiple>\
            <p class="fileName">添加文件</p>\
        </li>';
        for (let i = 0; i < fileArr.length; i++) {
            _html += `<li class="fileItem fileNewItem" id="${fileArr[i].id}" filePath="${fileArr[i].filePath}">`;
            if (fileArr[i].type != 'img') {
                _html += `<div class="bgSize" style='background-image:${fileArr[i].src};'></div>`
            } else {
                _html += `<div style='background-image:${fileArr[i].src};'></div>`
            }
            _html += `<img class="delFileBtn" src="../images/delete_file.png"/>`;
            if (fileArr[i].desc == '') {
                _html += '<p type="' + fileArr[i].type + '" desc="" class="fileName">' + fileArr[i].name + '</p>';
            } else {
                _html += '<p type="' + fileArr[i].type + '" desc="' + fileArr[i].desc + '" class="fileName active">' + fileArr[i].name + '</p>';
            }
            _html += '</li>'
        }
        objParent.html(_html);
        selectFileArr = [];
        objParent = null; // 当前点击块的父级
        fileArr = []; // 当前点击块的文件数据
        indexFile = 0; // 当前点击的索引
        ObjArr = []; //  当前点击块的文件对象
    });

    // 图片缩放 拖拽
    $('.bigImgBox').on("mousewheel DOMMouseScroll", function (e) {
        if (!$('.bigImgBox .bigImg').hasClass('bgSize')) {
            let delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
            if (delta > 0) {
                // 向上滚
                if (scaleNum <= 50) {
                    scaleNum += 2
                }
            } else if (delta < 0) {
                // 向下滚
                if (scaleNum > 4) {
                    scaleNum -= 2
                }
            }
            $('.bigImg').css('transform', 'scale(' + scaleNum / 10 + ')')
        }
    });
    $('.bigImgBox').on('mousedown', function (e) {
        if (!$('.bigImgBox .bigImg').hasClass('bgSize')) {
            let x = e.clientX - parseInt($('.bigImg').css('left'));
            let y = e.clientY - parseInt($('.bigImg').css('top'));
            $('.bigImgBox').on('mousemove', function (e) {
                let newX = e.clientX;
                let newY = e.clientY;
                console.log(newY - y)
                $('.bigImg').css({
                    'top': newY - y + 'px',
                    'left': newX - x + 'px',
                });
            });
        }
    });
    $('.bigImgBox').on('mouseup', function (e) {
        $('.bigImgBox').unbind('mousemove');
    })
    $('.bigImgBox').on('mouseleave', function () {
        $('.bigImgBox').unbind('mousemove');
    });

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
        let unit = '岁'; // 单位
        let num = 0; // 值
        if (UUserCard.length == 18) {
            //获取出生日期
            let userYear = UUserCard.substring(6, 10);
            let userMonth = UUserCard.substring(10, 12);
            let userDay = UUserCard.substring(12, 14);
            //获取性别
            if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
                $('#man').addClass('active').siblings('a').removeClass('active');
            } else {
                $('#woman').addClass('active').siblings('a').removeClass('active');
                //是女则执行代码 ...
            }
        } else {
            let userYear = 19 + UUserCard.substring(6, 8);
            let userMonth = UUserCard.substring(8, 10);
            let userDay = UUserCard.substring(10, 12);
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
        let myDate = new Date();
        let year = myDate.getFullYear(); // 当前年份
        let month = myDate.getMonth() + 1; // 当前月份
        let day = myDate.getDate(); // 当前号数
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
})
