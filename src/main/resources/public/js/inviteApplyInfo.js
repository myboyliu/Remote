
$(function() {
       var fileAllArr = []; //所有图片原始资源
       //   var fileArr = [];
       var scaleNum = 10; // 图片缩放倍数

    /* 动态创建进度条 */
    var statusArr = ['待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    var str = '';
    for (var i = 0; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>';
        $('.progressBar').html(str);

    }
    $('.progressBar li:first-child').addClass('libg');
    $('.progressBar li:nth-child(2)').addClass('libg');
    $('.progressBar li:nth-child(3)').addClass('libg');
    $('.progressBar li:nth-child(4)').addClass('libg');
    $('.progressBar li:nth-child(5)').addClass('libg');
    /* 点击修改按钮收起显示 */
    // 患者基本信息essential_btn
    $('#cut').click(function() {
        $(this).toggleClass("foundBtn");
        $('.essentialInformation_modules').toggle(500);
    });
    //电子病历
    $('.modifier2').click(function() {

        $('.upfileUl').toggle(500);
        // console.log($('#cutEle').attr("class"))
        if ($('#cutEle').attr("class") == "chooseBtn") {
            $('#cutEle').addClass('foundBtn');
            $('#cutEle').removeClass('chooseBtn');
        } else {
            $('#cutEle').addClass('chooseBtn');
            $('#cutEle').removeClass(' foundBtn');
        }

    });

    //  收件医生
    $('#cutDoc').click(function() {
        $(this).toggleClass("foundBtn");
        $('.ReceiptDoctor_modules').toggle(500);
    });
    //  会诊排期
    $('#cutSch').click(function() {
        $(this).toggleClass("foundBtn");
        $('.schedule_modules').toggle(500);
    });
    //  会诊报告
    $('#cutLec').click(function() {
        $(this).toggleClass("foundBtn");
        $('.lecturer_modules').toggle(500);
    });
    //  临床反馈
    $('#cutTic').click(function() {
        $(this).toggleClass("foundBtn");
        $('.tickling_modules').toggle(500);
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
                if (data.orderFormBean.statesName == "已结束") {
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
    var data = JSON.parse(sessionStorage.getItem('data'));
    $('head > title').html(data.orderFormBean.sex+'/'+data.orderFormBean.age+'/'+data.orderFormBean.diagnosis+'-远程会诊平台');
    // sessionStorage.removeItem('data');
    console.log(data);
     $('.patientName').html('***');
    $('.high').html(data.orderFormBean.high);
    $('.sex').html(data.orderFormBean.sex);
    $('.weight').html(data.orderFormBean.weight);
    $('.age').html(data.orderFormBean.age);
    $('.address').html(data.orderFormBean.address);
    if (data.orderFormBean.isurgent == 1) {
        $('.bThree_p').show();
    } else {
        $('.bThree_p').hide();
    }
    $('.tentative').html('初步诊断：' + data.orderFormBean.diagnosis);
    $('.telemedicineTarget').html('会/转诊目的：' + data.orderFormBean.telemedicineTarget);
     //会诊排期
     $('.startDate').html('从&nbsp;&nbsp;' + data.orderFormBean.orderBeginDate);
     $('.endDate').html(data.orderFormBean.orderEndDate);
   // 医嘱
   if(data.orderFormBean.orders){
    doctorEnjoin();
} else {
    $(".doctorEnjoinBox").hide();
}
function doctorEnjoin(){
    var doctorEnjoinJson = JSON.parse(data.orderFormBean.orders);
    console.log(doctorEnjoinJson)
    if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0){
        var _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">长期医嘱</p><a class="printBtn no-print" href="'+IP+"download/standingOrders?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>\
            <div class="oneList">'
            for(var i = 0;i < doctorEnjoinJson.longTimeArr.length;i++){
                var twoLevel = doctorEnjoinJson.longTimeArr[i].drugArr;
                _html += '<div class="oneListItem">\
                    <p class="headTop">'+((i+1)<10?"0"+(i+1):(i+1))+'-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;执行时间：'+doctorEnjoinJson.longTimeArr[i].startTime+'&nbsp;&nbsp;&nbsp;&nbsp;结束时间：'+doctorEnjoinJson.longTimeArr[i].endTime+'</p>\
                    <div class="twoList">'
                    for(var j = 0;j < twoLevel.length;j++){
                        if(j == 0){
                            _html += '<p class="twoListItem"><b>'+twoLevel[j].name+'</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次'+twoLevel[j].singleNum+twoLevel[j].unit+'；'+twoLevel[j].frequency+'；'+twoLevel[j].means+'</p>'
                        } else {
                            _html += '<p class="twoListItem"><b>'+twoLevel[j].name+'</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次'+twoLevel[j].singleNum+twoLevel[j].unit+'；</p>'
                        }
                    }
                    _html += '</div>\
                </div>\
                <p class="boundary"></p>';
            }
            _html += '<p class="remarkBox">备注：'+doctorEnjoinJson.longTimeArea+'</p></div></div>';
            $(".doctorEnjoinBody").append(_html);
    }
    if(doctorEnjoinJson.temporaryDrugArr || doctorEnjoinJson.temporaryTreatArr){
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0){
            var _html = '<div class="chunkContent"><h2><span>02</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="'+IP+"download/statOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2><div class="oneList">'
        } else {
            var _html = '<div class="chunkContent"><h2><span>01</span><p class="chunkType">临时医嘱</p><a class="printBtn no-print" href="'+IP+"download/statOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2><div class="oneList">'
        }
        if(doctorEnjoinJson.temporaryDrugArr && doctorEnjoinJson.temporaryDrugArr.length > 0){
            for(var i = 0;i < doctorEnjoinJson.temporaryDrugArr.length;i++){
                var twoLevel = doctorEnjoinJson.temporaryDrugArr[i].drugArr;
                _html += '<div class="oneListItem">\
                    <p class="headTop">'+((i+1)<10?"0"+(i+1):(i+1))+'-药物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下达时间：'+doctorEnjoinJson.temporaryDrugArr[i].arriveTime+'</p>\
                    <div class="twoList">'
                    for(var j = 0;j < twoLevel.length;j++){
                        if(j == 0){
                            _html += '<p class="twoListItem"><b>'+twoLevel[j].name+'</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次'+twoLevel[j].singleNum+twoLevel[j].unit+'；'+twoLevel[j].means+'</p>'
                        } else {
                            _html += '<p class="twoListItem"><b>'+twoLevel[j].name+'</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单次'+twoLevel[j].singleNum+twoLevel[j].unit+'；</p>'
                        }
                    }
                    _html += '</div>\
                </div>\
                <p class="boundary"></p>';
            }
        }
        if(doctorEnjoinJson.temporaryTreatArr && doctorEnjoinJson.temporaryTreatArr.length > 0){
            if(doctorEnjoinJson.temporaryDrugArr){
                var tempNum = doctorEnjoinJson.temporaryDrugArr.length;
            } else {
                var tempNum = 0;
            }
            for(var i = 0;i < doctorEnjoinJson.temporaryTreatArr.length;i++){
                _html += '<div class="oneListItem">\
                <p class="headTop">'+((tempNum+i+1)>10?(tempNum+i+1):'0'+(tempNum+i+1))+'-诊疗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下达时间：'+doctorEnjoinJson.temporaryTreatArr[i].arriveTime+'</p>\
                <div class="twoList">\
                    <p class="twoListItem"><b>'+doctorEnjoinJson.temporaryTreatArr[i].name+'</b></p>\
                </div>\
            </div><p class="boundary"></p>'
            }
        } 
        _html += '<p class="remarkBox">备注：'+doctorEnjoinJson.temporaryArea+'</p></div></div>';
        $(".doctorEnjoinBody").append(_html);
    }
    if(doctorEnjoinJson.surgeryArr && doctorEnjoinJson.surgeryArr.length > 0){
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryDrugArr &&doctorEnjoinJson.temporaryDrugArr.length > 0){
            var _html = '<div class="chunkContent">\
            <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 || doctorEnjoinJson.temporaryTreatArr &&doctorEnjoinJson.temporaryTreatArr.length > 0){
            var _html = '<div class="chunkContent">\
                <h2><span>02</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryDrugArr &&doctorEnjoinJson.temporaryDrugArr.length > 0){
            var _html = '<div class="chunkContent">\
            <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
        if(doctorEnjoinJson.longTimeArr && doctorEnjoinJson.longTimeArr.length > 0 && doctorEnjoinJson.temporaryTreatArr &&doctorEnjoinJson.temporaryTreatArr.length > 0){
            var _html = '<div class="chunkContent">\
                <h2><span>03</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
        if(!doctorEnjoinJson.longTimeArr && !doctorEnjoinJson.temporaryTreatArr && !doctorEnjoinJson.temporaryDrugArr){
            var _html = '<div class="chunkContent">\
                <h2><span>01</span><p class="chunkType">手术备品</p><a class="printBtn no-print" href="'+IP+"download/specificationsOrder?orderId="+localStorage.getItem("orderId")+'">下载</a></h2>'
        }
                _html += '<div class="oneList">\
                    <div class="oneListItem">\
                        <div class="twoList">'
                        for(var i = 0;i < doctorEnjoinJson.surgeryArr.length;i++){
                            _html += '<p class="twoListItem"><b>'+((i+1)>10?(i+1):'0'+(i+1))+"&nbsp;&nbsp;&nbsp;&nbsp;"+doctorEnjoinJson.surgeryArr[i].surgeryName+'&nbsp;&nbsp;&nbsp;&nbsp;'+doctorEnjoinJson.surgeryArr[i].surgerySize+"&nbsp;&nbsp;&nbsp;&nbsp;"+doctorEnjoinJson.surgeryArr[i].surgeryNum+'</b></p>';
                        }
                        _html += '</div>\
                    </div>\
                    <p class="boundary"></p>\
                    <p class="remarkBox">备注：'+doctorEnjoinJson.surgeryArea+'</p>\
                </div>\
            </div>';
        $(".doctorEnjoinBody").append(_html);
    }
}
    //    临床反馈
    $('.applyFeedBack').html(data.orderFormBean.applyFeedBack);

    var orderTypes = data.orderFormBean.orderTypes;
    $.ajax({
        type: 'POST',
        url: IP + 'order/selectOrderCaseType',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        data: {
            orderId: data.orderFormBean.id,
        },
        success: function(data) {
            console.log(data);
            if (data.status == 200) {
                var upfileHtml = '';
                $.each(data.list, function(key, val) {
                    for (var i = 0; i < val.length; i++) {
                        upfileHtml += '<li name="' + val[i].name + '" id="' + val[i].id + '" class="upfileItem clearfix">\
                             <div class="upfileContent">\
                                 <div class="operateLeft">' + key + '-' + val[i].name + '</div>\
                                 <ul class="fileContent clearfix">\
                                 </ul>\
                             </div>\
                         </li>'
                    }
                });
                $('.upfileUl').html(upfileHtml);
            } else if (data.status == 250) {
                window.location = '/yilaiyiwang/login/login.html'
            }
        },
        error: function(err) {
            console.log(err)
        },
    });
    /* 电子病历附件 */
    var tempArr = data.patientCaseList;
    for (var i = 0; i < tempArr.length; i++) {
        var fileType = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('.') + 1, tempArr[i].filesUrl.length);
        var fileName = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('/') + 1, tempArr[i].filesUrl.length);
        fileAllArr.push(fileName);
        if (fileType == 'png' || fileType == 'jpg') {
            if (tempArr[i].remarks == '') {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                           <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"></div>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
            } else {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                           <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"></div>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
            }
        } else if (fileType == 'pdf') {
            if (tempArr[i].remarks == '') {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
            } else {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/pdf_icon.png)"> </div>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
            }
        } else if (fileType == 'dcm') {
            if (tempArr[i].remarks == '') {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
            } else {
                $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/dcm_icon.png)"> </div>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
            }
        }
        $('.sum').html(fileAllArr.length);

    }




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
            area: ['1167px', '700px'],skin: "noBackground",
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
          $('.downlodeFile').hide();            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');

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
            // 图片的相关操作
           $('.downlodeFile').hide();          $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');;
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
           $('.downlodeFile').hide();          $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
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



    //订单编号
    $('.numbers').html(data.orderFormBean.numbers);
    //申请时间
    $('.applyDate').html(data.orderFormBean.applyDate);
    // 发件人信息
    $('.recipientsInfo').html(' <' + data.orderFormBean.doctorName + '/' + data.orderFormBean.doctorTitleName + '/' + data.orderFormBean.doctorHospitalName + '>');

    // //   收件人信息
    var recipientsArr = data.orderDoctorsList;
    var _html = '';
    var _feedBack = '';
     if (recipientsArr.length == 0) {
         $('.addresserInfo').html("<" + data.orderFormBean.invitedHospitalName + ">")
     } else {
        for (var i = 0; i < recipientsArr.length; i++) {
            _html += '<' + recipientsArr[i].name + '/' + recipientsArr[i].occupation + '/' + recipientsArr[i].deptName + '/' + recipientsArr[i].hospitalName + '>;'
            _feedBack += '<pre>' + recipientsArr[i].name + ':<br />' + recipientsArr[i].feedBack + '</pre>'
        }
        $('.addresserInfo').html(_html);
        // 会诊报告
        $('.lecturer_modules').append(_feedBack);
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
    $('.basePicInput').val(data.orderFormBean.hospitalPrice);
    $('.tbody_doc').html(_fees);
    $('.aggregate').html(data.orderFormBean.originalPrice);
    $('.dynamicAggregate').html(data.orderFormBean.money);

    /* 如果是图文会诊，会诊排期模块隐藏 */
    if (data.orderFormBean.orderTypes == '0') {
        $('.schedule ').hide();
        $('.schedule_modules ').hide();
        $('.entrance').hide();

    } else {
        $('.schedule ').show();
        $('.schedule_modules ').show();
        $('.entrance').show();
    }
    // $('')
    // $('.tbody_doc').html(_fees)
    // $('.aggregate').html(data.orderFormBean.money)
    // $('.dynamicAggregate').html(data.orderFormBean.money)

    var deptNumber = '';
    $.ajax({
        type: 'POST',
        url: IP + 'user/selectDeptNumberWithUserId',
        dataType: 'json',
        data: {
            "userId": data.orderFormBean.doctorId,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            console.log(data)
            if (data.status == 200) {
                deptNumber = data.deptNumber;
                // 成功操作
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






    /* 返回按钮 */
    $('.getBack').click(function() {
        window.location = '/yilaiyiwang/workbench/workbench.html'
    });
});
