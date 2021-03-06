$(function () {
    /* 动态创建进度条 */
    var statusArr = ['待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    var str = '';
    for (var i = 0; i < statusArr.length; i++) {
        if (i < 4) {
            str += '<li class="libg">' + statusArr[i] + '</li>'
        } else {
            str += '<li>' + statusArr[i] + '</li>'
        }
        $('.progressBar').html(str);
    }
    let caseContentList = [];
    caseContentList.push({
            contentTypeId: "d1abcce0d678aec9631a0dfc171cd323",
            contentPath: "v81V2xaep435vzD2.jpg",
            contentRemark: "123123",
        },{
            contentType_id: "d1abcce0d678aec9631a0dfc171cd323",
            contentPath: "v81V2xaep435vzD2.jpg",
            contentRemark: "撒大声的",
        }
    );
    let data = {};
    data["consultantReport"] = "会诊报告";
    data["consultantFeedback"] = "临床反馈";
    data["patientSex"] = "男";
    data["patientAge"] = "26岁";
    data["patientHeight"] = "180";
    data["patientWeight"] = "65";
    data["detailAddress"] = "北京";
    data["caseDiagnosis"] = "初步诊断";
    data["applyUrgent"] = "1";
    data["applyRemark"] = "会诊墓地";
    data["caseContentList"] = caseContentList;

    console.log(data);
//网页标题
    $('head > title').html(data.patientSex + '/' + data.patientAge + '/' + data.caseDiagnosis + '-远程会诊平台');
    localStorage.removeItem('data');
// 会诊报告
    $('.lecturer_modules').append(data.consultantFeedback);
// 医嘱与手术备品
// 临床反馈
// 患者基本信息
    $('.patientName').html('***');
    $('.high').html(data.patientHeight);
    $('.sex').html(data.patientSex);
    $('.weight').html(data.patientWeight);
    $('.age').html(data.patientAge);
    $('.address').html(data.detailAddress);
    if (data.applyUrgent == 1) {
        $('.bThree_p').show();
    } else {
        $('.bThree_p').hide();
    }
    $('.tentative').html('初步诊断：' + data.caseDiagnosis);
    $('.telemedicineTarget').html('会/转诊目的：' + data.applyRemark);

// 电子病历附件
    ajaxRequest("GET", getAllCaseContentType, null, true, false, true, renderCaseContentView, null, null);
    function renderCaseContentView(data) {
        console.log(data)
        var upfileHtml = '';
        $.each(data, function (key, val) {
            for (var i = 0; i < val.length; i++) {
                upfileHtml += '<li name="' + val[i].caseTypeName + '" id="' + val[i].id + '" class="upfileItem clearfix">\
                                 <div class="upfileContent">\
                                     <div class="operateLeft">' + key + '-' + val[i].caseTypeName + '</div>\
                                     <ul class="fileContent clearfix">\
                                     </ul>\
                                 </div>\
                             </li>'
            }
        });
        $('.upfileUl').html(upfileHtml);
    }
    var orderTypes = data.caseContentList;
    /* 电子病历附件 */
    var tempArr = data.patientCaseList;
    for (var i = 0; i < tempArr.length; i++) {
        var fileType = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('.') + 1, tempArr[i].filesUrl.length);
        var fileName = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('/') + 1, tempArr[i].filesUrl.length);
        fileAllArr.push(fileName);
        if (fileType == 'png' || fileType == 'jpg') {
            if (tempArr[i].remarks == '') {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                           <div style = "background-image: url(&apos;' + imgIp + tempArr[i].filesUrl + '&apos;)"></div>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
            } else {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                           <div style = "background-image: url(&apos;' + imgIp + tempArr[i].filesUrl + '&apos;)"></div>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
            }
        } else if (fileType == 'pdf') {
            if (tempArr[i].remarks == '') {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
            } else {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
            }
        } else if (fileType == 'dcm') {
            if (tempArr[i].remarks == '') {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
            } else {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(../images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
            }
        }
        $('.sum').html(fileAllArr.length);

    }
// 会诊排期
// 订单信息



    var fileAllArr = []; //所有图片原始资源
    //   var fileArr = [];
    var scaleNum = 10; // 图片缩放倍数
    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'order/selectOrderById',
    //     dataType: 'json',
    //     data: {
    //         "orderId": localStorage.getItem('orderId'),
    //         "type": localStorage.getItem('orderType'), //是那个列表的类型(0:医政受邀列表,1:医政发出列表,2:医生受邀列表,3:医生发出列表)
    //         "readFlag": 1,
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     crossDomain: true,
    //     global: false,
    //     async: false,
    //     success: function(data) {
    //         console.log(data)
    //         if (data.status == 200) {
    //             if (data.orderFormBean.statesName == "排期审核") {
    //                 localStorage.setItem("data", JSON.stringify(data));
    //             } else {
    //                 window.location = "/yilaiyiwang/workbench/workbench.html";
    //             }
    //         } else if (data.status == 250) {
    //             // 未登录操作
    //             window.location = '/yilaiyiwang/login/login.html';
    //         } else {
    //             // 其他操作
    //         }
    //     },
    //     error: function(err) {
    //         console.log(err);
    //     },
    // })
    // var data = JSON.parse(localStorage.getItem('data'));





    /**查询病历类型列表*/
    /**查询病历类型列表*/

    // $.ajax({
    //     type: 'POST',
    //     url: IP + 'order/selectOrderCaseType',
    //     dataType: 'json',
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     async: false,
    //     data: {
    //         orderId: data.orderFormBean.id,
    //     },
    //     success: function(data) {
    //         console.log(data);
    //         if (data.status == 200) {
    //             var upfileHtml = '';
    //             $.each(data.list, function(key, val) {
    //                 for (var i = 0; i < val.length; i++) {
    //                     upfileHtml += '<li name="' + val[i].name + '" id="' + val[i].id + '" class="upfileItem clearfix">\
    //                              <div class="upfileContent">\
    //                                  <div class="operateLeft">' + key + '-' + val[i].name + '</div>\
    //                                  <ul class="fileContent clearfix">\
    //                                  </ul>\
    //                              </div>\
    //                          </li>'
    //                 }
    //             });
    //             $('.upfileUl').html(upfileHtml);
    //         } else if (data.status == 250) {
    //             window.location = '/yilaiyiwang/login/login.html'
    //         }
    //     },
    //     error: function(err) {
    //         console.log(err)
    //     },
    // });



    // 图片点击查看大图
    var objParent = null; // 当前点击块的父级
    var fileArr = []; // 当前点击块的文件数据
    var indexFile = 0; // 当前点击的索引
    var ObjArr = []; //  当前点击块的文件对象
    $('.upfileUl').delegate('.fileItem', 'click', function () {
        var $ = layui.jquery;
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['1167px', '700px'],
            skin: "noBackground",
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            scrollbar: false,
            content: $('.bigImgContainer'),
        });
        // 整理一组图片展示数据

        objParent = $(this).parent('.fileContent');
        indexFile = $(this).index();
        ObjArr = $(this).parent('.fileContent').find('.fileItem');
        for (var i = 0; i < ObjArr.length; i++) {
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
                $('.downlodeFile').hide();

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
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');

        }
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);

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
                $('.downlodeFile').hide();

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

            // 图片的相关操作
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
            ;
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


    })
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
                $('.downlodeFile').hide();

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
    $('.closeBtnImg').click(function () {
        layer.closeAll();
        $('.bigImgContainer').hide();
        var _html = '';
        for (var i = 0; i < fileArr.length; i++) {
            _html += `<li class="fileItem fileNewItem" id="${fileArr[i].id}" filePath="${fileArr[i].filePath}">`;
            if (fileArr[i].type != 'img') {
                _html += `<div class="bgSize" style='background-image:${fileArr[i].src};'></div>`
            } else {
                _html += `<div style='background-image:${fileArr[i].src};'></div>`
            }
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
            var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
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
            var x = e.clientX - parseInt($('.bigImg').css('left'));
            var y = e.clientY - parseInt($('.bigImg').css('top'));
            $('.bigImgBox').on('mousemove', function (e) {
                var newX = e.clientX;
                var newY = e.clientY;
                console.log(newY - y)
                $('.bigImg').css({
                    'top': newY - y + 'px',
                    'left': newX - x + 'px',
                });
            })
        }
    })
    $('.bigImgBox').on('mouseup', function (e) {
        $('.bigImgBox').unbind('mousemove');
    })
    $('.bigImgBox').on('mouseleave', function () {
        $('.bigImgBox').unbind('mousemove');
    })
    // 图片缩放 拖拽 结束


    /* 会诊排期 */
    var orderDateList = data.orderDateList;
    var _dateHtml = '';
    if (data.orderFormBean.orderBeginDate && data.orderFormBean.orderEndDate) {
        _dateHtml = '<p>\
  <span class="startDate">从&nbsp;&nbsp;' + data.orderFormBean.orderBeginDate + '</span> 到&nbsp;&nbsp;\
<span class="endDate">' + data.orderFormBean.orderEndDate + '</span>\
                    </p>'
    } else {
        for (var i = 0; i < orderDateList.length; i++) {
            if (orderDateList[i].types == 1) {
                _dateHtml += '<p>\
                <span class="startDate">从&nbsp;&nbsp;' + orderDateList[i].startDate + '</span> 到&nbsp;&nbsp;\
                <span class="endDate">' + orderDateList[i].endDate + '</span>\
                            </p>'
            }
        }
    }
    $('.schedule_modules').html(_dateHtml);


    //订单编号
    $('.numbers').html(data.orderFormBean.numbers);
    //申请时间
    $('.applyDate').html(data.orderFormBean.applyDate);
    // 发件人信息
    $('.recipientsInfo').html(' <' + data.orderFormBean.doctorName + '/' + data.orderFormBean.doctorTitleName + '/' + data.orderFormBean.doctorDeptName + '/' + data.orderFormBean.doctorHospitalName + '>')

    // //   收件人信息
    var recipientsArr = data.orderDoctorsList;
    var _html = '';
    if (recipientsArr.length == 0) {
        $('.addresserInfo').html("<" + data.orderFormBean.invitedHospitalName + ">")
    } else {
        for (var i = 0; i < recipientsArr.length; i++) {
            _html += '<' + recipientsArr[i].name + '/' + recipientsArr[i].occupation + '/' + recipientsArr[i].deptName + '/' + recipientsArr[i].hospitalName + '>;'
        }
        $('.addresserInfo').html(_html);
    }

    /* 诊费 */
    var _fees = '';
    for (var i = 0; i < recipientsArr.length; i++) {
        _fees += '<tr>\
                        <td>\
                            <' + recipientsArr[i].name + ' / ' + recipientsArr[i].occupation + ' / ' + recipientsArr[i].deptName + ' / ' + recipientsArr[i].hospitalName + ' > \
                        </td>'
        if (data.orderFormBean.orderTypes == 0) {
            _fees += '<td class = "yuan" >' + recipientsArr[i].originalPrice + '</td>'
        } else {
            _fees += '<td class = "yuan" >' + recipientsArr[i].originalPrice + '</td>'
        }
        _fees += '<td>'
        if (data.orderFormBean.orderTypes == 0) {
            _fees += '<input type="text" value="' + recipientsArr[i].price + '" class="fees_input gai" readonly="readonly">'
        } else {
            _fees += '<input type="text" value="' + recipientsArr[i].price + '" class="fees_input gai" readonly="readonly">'
        }
        _fees += '</td></tr>'
    }
    $('.basePic').html(data.orderFormBean.basePrice);
    $('.basePicInput').val(data.orderFormBean.basePrice);
    $('.tbody_doc').html(_fees);
    $('.aggregate').html(data.orderFormBean.money);
    $('.dynamicAggregate').html(data.orderFormBean.money);

    /* 如果是图文会诊，会诊排期模块隐藏 */

    if (data.orderFormBean.orderTypes == '0') {
        $('.schedule ').hide();
        $('.schedule_modules ').hide();
        $('.entrance').hide();

    } else {
        $('.schedule ').show();
        $('.schedule_modules').show();
        $('.entrance').show();
    }


    /* 点击修改按钮收起显示 */
    // 患者基本信息essential_btn
    $('.modifier1').click(function () {
        $('#cut').toggleClass("foundBtn");
        $('.essentialInformation_modules').toggle(500);
    });
    //电子病历
    $('.modifier2').click(function () {
        if ($('#cutEle').hasClass('foundBtn')) {
            $('#cutEle').addClass("chooseBtn");
            $('#cutEle').removeClass("foundBtn");
        } else {
            $('#cutEle').addClass("foundBtn");
            $('#cutEle').removeClass("chooseBtn");
        }

        $('.upfileUl').toggle(500);

    });
    // //  收件医生

    $('#cutDoc').click(function () {
        if ($('#cutDoc').hasClass('foundBtn')) {
            $('#cutDoc').addClass("chooseBtn");
            $('#cutDoc').removeClass("foundBtn");
        } else {
            $('#cutDoc').addClass("foundBtn");
            $('#cutDoc').removeClass("chooseBtn");
        }

        $('.ReceiptDoctor_modules').toggle(500);
    });
    $('#cutSch').click(function () {
        if ($('#cutSch').hasClass('foundBtn')) {
            $('#cutSch').addClass("chooseBtn");
            $('#cutSch').removeClass("foundBtn");
        } else {
            $('#cutSch').addClass("foundBtn");
            $('#cutSch').removeClass("chooseBtn");
        }
        $('.schedule_modules').toggle(500);
    });

    var startMinute = 0; // 开始总分钟数
    var endMinute = 0; // 结束总分钟数
    var startHour = 0; // 开始小时数
    var endHour = 0; // 结束小时数
    var _html = '';
    for (var i = 0; i < 96; i++) {
        startMinute = i * 15;
        endMinute = (i + 1) * 15;
        startHour = parseInt(startMinute / 60);
        endHour = parseInt(endMinute / 60);
        var startM = startMinute %= 60; // 计算后的开始分钟数
        var endM = endMinute %= 60; // 计算后的开始分钟数
        if (endHour == 24) {
            _html += '<li endDate="23:59" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
        } else {
            _html += '<li endDate="' + double(endHour) + ':' + double(endM) + '" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
        }
    }
    $('.rightContent').html(_html);


    // 修改排期
    $('.schedulingBtn').click(function () {
        var $ = layui.jquery;
        layer.open({
            type: 1,
            content: $('.selectTimeContainer'),
            title: '',
            area: ['1060px', '630px'],
            closeBtn: 0,
            skin: 'noBackground',
        });

        for (var i = 0; i < dateTempList.length; i++) {
            if (dateStr == dateTempList[i].date) {
                for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                    $('#timeUl > li').eq(j).addClass('grey');
                }
            }
        }
        if (data.orderFormBean.orderBeginDate) {
            var date = data.orderFormBean.orderBeginDate.split(' ')[0];
            var startDate = data.orderFormBean.orderBeginDate.split(' ')[1];
            var hours = startDate.split(':')[0];
            var minute = startDate.split(':')[1];
            var startIndex = (hours * 60 + minute * 1) / 15;
            var endDate = data.orderFormBean.orderEndDate.split(' ')[1];
            var endHour = endDate.split(':')[0];
            var endMinute = endDate.split(':')[1];
            var endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
            newDateTempList.push({
                "date": date,
                "startIndex": startIndex,
                "endIndex": endIndex - 1,
            });
            for (var i = 0; i < newDateTempList.length; i++) {
                if (dateStr == newDateTempList[i].date) {
                    for (var j = newDateTempList[i].startIndex; j <= newDateTempList[i].endIndex; j++) {
                        $('#timeUl > li').eq(j).addClass('active');
                    }
                }
            }
        }
    });


    var newDateTempList = [];
    var dateTempList = []; // 收集的时间段
    for (var i = 0; i < data.orderDateList.length; i++) {
        var date = data.orderDateList[i].startDate.split(' ')[0];
        var startDate = data.orderDateList[i].startDate.split(' ')[1];
        var hours = startDate.split(':')[0];
        var minute = startDate.split(':')[1];
        var startIndex = (hours * 60 + minute * 1) / 15;
        var endDate = data.orderDateList[i].endDate.split(' ')[1];
        var endHour = endDate.split(':')[0];
        var endMinute = endDate.split(':')[1];
        var endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
        if (data.orderDateList[i].types == '1') {
            newDateTempList.push({
                "date": date,
                "startIndex": startIndex,
                "endIndex": endIndex - 1,
            })
            dateTempList.push({
                "date": date,
                "startIndex": startIndex,
                "endIndex": endIndex - 1,
            })
        }
    }
    var myDate = new Date();
    var flag = true;
    var startIndex = 0;
    var endIndex = 0;
    var dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
    if (data.orderFormBean.orderBeginDate) {
        dateStr = data.orderFormBean.orderBeginDate.split(' ')[0];
    }
    // 渲染日历控件
    var markJson = {};
    for (var i = 0; i < dateTempList.length; i++) {
        markJson[dateTempList[i].date] = '';
    }
    // 渲染日历控件
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#timeBox',
            position: 'static',
            showBottom: false,
            value: dateStr,
            mark: markJson,
            min: 0,
            change: function (value, date) { //监听日期被切换
                flag = true;
                $('#timeUl > li').removeClass('grey');
                $('#timeUl > li').removeClass('active');
                dateStr = value;
                for (var i = 0; i < dateTempList.length; i++) {
                    if (dateStr == dateTempList[i].date) {
                        if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                            for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('grey');
                            }
                        } else {
                            for (var j = dateTempList[i].endIndex; j <= dateTempList[i].startIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('grey');
                            }
                        }
                    }
                }
                for (var i = 0; i < newDateTempList.length; i++) {
                    if (dateStr == newDateTempList[i].date) {
                        if (newDateTempList[i].startIndex <= newDateTempList[i].endIndex) {
                            for (var j = newDateTempList[i].startIndex; j <= newDateTempList[i].endIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        } else {
                            for (var j = newDateTempList[i].endIndex; j <= newDateTempList[i].startIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        }
                    }
                }
            }
        });
    });
    // 分钟选择事件、
    $('#timeUl').delegate('li', 'click', function () {
        if (flag) {
            $(this).addClass('active').siblings('li').removeClass('active');
            flag = false;
            startIndex = $(this).attr('index');
        } else {
            $(this).addClass('active');
            flag = true;
            endIndex = $(this).attr('index');
            if (startIndex <= endIndex) {
                for (var i = startIndex; i < endIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            } else {
                for (var i = endIndex; i < startIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            }
            newDateTempList = [];
            newDateTempList.push({
                "date": dateStr,
                "startIndex": startIndex,
                "endIndex": endIndex,
            });
        }
    });
    // 关闭事件
    $('.closeBtnTime').click(function () {
        newDateTempList = [];
        layer.closeAll();
        $('.selectTimeContainer').hide();
    })

    /* 弹层关闭按钮 */
    $('.refuseBtn').click(function () {
        $('.background').css('display', 'none');
        document.documentElement.style.overflow = "scroll";
    });


    /* 循环时间轴 orderStatesList*/
    var orderStatesList = data.orderStatesList;
    var _html = '';
    for (var i = 0; i < orderStatesList.length; i++) {
        _html += '<li class="layui-timeline-item">\
                                    <i class="layui-icon layui-timeline-axis">&#xe63f;</i>\
                                    <div class="layui-timeline-content layui-text">\
                                        <h3 class="layui-timeline-title">\
                                            <span class="fw">' + orderStatesList[i].time + '</span>\
                                            <span class = "fw pl30" > ' + orderStatesList[i].statesName + ' </span>\
                                        </h3>'
        if (orderStatesList[i].statesName == '已结束') {
            _html += ''
        } else {
            _html += '<p>操作人：' + orderStatesList[i].remarks + '</p>\
                                    </div>\
                                </li>'
        }
    }
    $('.layui-timeline').html(_html);


    $('.selectTimeContainer').find('.yesBtn').click(function () {
        layer.closeAll();
        var startTime = '';
        var endTime = '';
        if (newDateTempList[0].startIndex <= newDateTempList[0].endIndex) {
            startTime = newDateTempList[0].date + ' ' + $('#timeUl > li').eq(newDateTempList[0].startIndex).html() + ':00';
            endTime = newDateTempList[0].date + ' ' + $('#timeUl>li').eq(newDateTempList[0].endIndex).attr('enddate') + ':00'
        } else {
            startTime = newDateTempList[0].date + ' ' + $('#timeUl > li').eq(newDateTempList[0].endIndex).html() + ':00';
            endTime = newDateTempList[0].date + ' ' + $('#timeUl > li').eq(newDateTempList[0].startIndex).attr('enddate') + ':00';
        }
        $.ajax({
            type: 'POST',
            url: IP + 'order/receiveScheduling',
            dataType: 'json',
            data: {
                "orderId": data.orderFormBean.id,
                "startTime": startTime,
                "endTime": endTime,
                "type": '0',
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    // 成功操作
                    layer.closeAll();
                    $('.selectTimeContainer').hide();
                    window.location.reload()
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
    });

    /* 返回按钮 */
    $('.getBack').click(function () {
        window.location = '/yilaiyiwang/workbench/workbench.html'
    });


    /* 拒收按钮弹层 */
    $('.rejection').click(function () {
        $('.background').css('display', 'block');
        $('.re_layer').css('display', 'block');
        /* 开启弹层禁止屏幕滚动 */
        document.documentElement.style.overflow = "hidden";
    });
    $('textarea').focus(function () {
        //  $('.font').css('display','none');
        $('.font').hide();
    }).blur(function () {
        if ($(this).val() == "") {
            $('.font').show();
        } else {
            $('.font').hide();
        }
    });
    $('.font').click(function () {
        $(this).hide();
        $('textarea').focus();
    });
    var viewText = '建议多学科会诊:';
    /* 建议多学科会诊按钮点击事件  */
    $('.suggest').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        })
        $('.otherCause').removeAttr('style');
        viewText = '建议多学科会诊:';
    });
    /* 其他原因按钮点击事件  */
    $('.otherCause').click(function () {
        $(this).css({
            'background': '#516dcf',
            'color': '#fff'
        });
        $('.suggest').removeAttr('style');
        viewText = '其他原因:';
    });
    /* 拒收确定按钮 */
    $('.confirm').click(function () {
        $('.background').hide();
        $.ajax({
            type: 'POST',
            url: IP + 'order/schedulingAudit',
            dataType: 'json',
            data: {
                "states": '0',
                "refuseReason": viewText + $('.refuseReason').val(),
                "orderId": data.orderFormBean.id,
                "statusId": data.orderFormBean.statesId,
                "type": '0',
                "statusId": data.orderFormBean.statesId,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.status == 202) {
                    var $ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['500px', '200px'],
                        closeBtn: false,
                        shade: [0.7, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: $('.returned')
                    });
                    setTimeout(function () {
                        $('.returned').hide();
                        window.location = '/yilaiyiwang/workbench/workbench.html';
                    }, 2000)
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 555) {
                    window.location = '/yilaiyiwang/workbench/workbench.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);

            },
        });
    });
    // /* 审核发布按钮事件  提示信息(200:审核成功,202:拒收成功,502:请求参数有误,555:订单状态发生改变)
    $('.examineBtn').click(function () {
        if (data.orderFormBean.orderBeginDate && data.orderFormBean.orderEndDate) {
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
        } else {
            layer.msg('请选定会诊时间', {
                time: 3000
            });
        }
    });

    $('.submitBox .noBtn').click(function () {
        layer.closeAll();
        $('.submitBox').hide();
    });

    /* 问题： 如果医政不选时间直接审核通过，时间格式传的有毛病 */
    $('.submitBox .yesBtn').click(function () {

        var startTime = '';
        var endTime = '';
        if (newDateTempList[0].startIndex <= newDateTempList[0].endIndex) {
            startTime = newDateTempList[0].date + ' ' + $('#timeUl > li').eq(newDateTempList[0].startIndex).html() + ':00';
            endTime = newDateTempList[0].date + ' ' + $('#timeUl>li').eq(newDateTempList[0].endIndex).attr('enddate') + ':00';
        } else {
            startTime = newDateTempList[0].date + ' ' + $('#timeUl > li').eq(newDateTempList[0].endIndex).html() + ':00';
            endTime = newDateTempList[0].date + ' ' + $('#timeUl > li').eq(newDateTempList[0].startIndex).attr('enddate') + ':00';
        }
        $.ajax({
            type: 'POST',
            url: IP + 'order/schedulingAudit',
            dataType: 'json',
            data: {
                "states": '1',
                "orderId": data.orderFormBean.id,
                "type": '0',
                "statusId": data.orderFormBean.statesId,
                "orderTypes": data.orderFormBean.orderTypes,
                "startTime": startTime,
                "endTime": endTime,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    layer.closeAll();
                    var $ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['500px', '200px'],
                        closeBtn: false,
                        shade: [0.7, '#000000'],
                        shadeClose: false,
                        content: $('.accept'),
                        time: 2000,
                    });
                    setTimeout(function () {
                        window.location = '/yilaiyiwang/workbench/workbench.html'
                    }, 2000)
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 555) {
                    window.location = '/yilaiyiwang/workbench/workbench.html'
                } else if (data.status == 556) {
                    layer.msg('请选择医生', {
                        time: 3000
                    })
                } else {
                    layer.msg("操作失败请稍后重试，或联系院内医务人员协助操作", {
                        time: 3000
                    });
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    });
});
