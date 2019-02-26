$(function () {
    var selectFlag = true;
    var countNum = 0;
    var pageSize = 10;
    var pageNo = 1;
    // 筛选部分
    $(".classifyObj").delegate("a", "click", function () {
        $(".videoSearchInput").val("");
        $(this).addClass("active").siblings("a").removeClass("active");
        getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), pageNo);
    })
    // 最新 关注度 搜索
    $(".sortObj").delegate("a", "click", function () {
        $(".videoSearchInput").val("");
        $(this).addClass("active").siblings("a").removeClass("active");
        getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), pageNo);
    })
    // 获取轮播图
    ajaxRequest("GET", "", "", false, false, true, renderSwiperView, null, null);

    function renderSwiperView(data) {
        let tempArr = data;
        let _html = '';
        for (let i = 0; i < tempArr.length; i++) {
            _html += '<a class="swiper-slide" target="_blank" href="http://' + tempArr[i].linkPath + '"><img src="' + IP + tempArr[i].picturePath + '" alt=""/></a>';
        }
        $(".swiper-wrapper").html(_html);
        let mySwiper = new Swiper('.swiper-container', {
            direction: "horizontal",
            loop: true, // 循环模式选项
            autoplay: true,
        })
    }

    // 获取总条数
    function getCount(typeId, typeName, pageNo) {
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'video/findVideoListByType',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     data: {
        //         "typeId": typeId,
        //         "typeName": typeName,
        //         "pageNo": pageNo,
        //         "pageSize": pageSize,
        //     },
        //     crossDomain: true,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.code == 1) {
        //             countNum = data.data.page;
        //             $(".searchNum").html(countNum);
        //             // 分页
        //             layui.use('laypage', function () {
        //                 var laypage = layui.laypage;
        //                 //执行一个laypage实例
        //                 laypage.render({
        //                     elem: 'listBox',
        //                     count: countNum,
        //                     limit: pageSize,
        //                     theme: '#f6c567',
        //                     jump: function (obj, first) {
        //                         if (!first) {
        //                             findAnnouncementByType($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), obj.curr);
        //                         }
        //                     }
        //                 });
        //             });
        //         } else if (data.code == 250) {
        //             // 未登录操作
        //             window.location = '/yilaiyiwang/login/login.html';
        //         } else {
        //             // 其他操作
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
    }

    // 根据直播类型查询直播列表
    function findAnnouncementByType(typeId, typeName, pageNo) {
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'video/findVideoListByType',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     data: {
        //         "typeId": typeId,
        //         "typeName": typeName,
        //         "pageNo": pageNo,
        //         "pageSize": pageSize,
        //     },
        //     crossDomain: true,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.code == 1) {
        //             var tempArr = data.data.videoList;
        //             var _html = "";
        //             if (tempArr.length > 0) {
        //                 for (var i = 0; i < tempArr.length; i++) {
        //                     _html += '<div name="' + tempArr[i].id + '" class="itemBox">\
        //                             <img src="'+ tempArr[i].videoCoverUrl + '" alt="">\
        //                             <div class="rightBox">\
        //                                 <h2 class="videoTitle">'+ tempArr[i].videoName + '</h2>\
        //                                 <p class="videoInfo">'+ tempArr[i].hospitalName + '</p>\
        //                                 <p class="videoInfo">' + tempArr[i].deptName + '</p>\
        //                             </div>\
        //                             <a class="playBtn" target="_blank" href="'+ tempArr[i].videoUrl + '">播放</a>\
        //                             <p class="videoDesc">简介：' + tempArr[i].videoDescribe + '</p>\
        //                             <div class="popularBox">\
        //                                 <a href="javascript:;">\
        //                                     <img src="../img/playNum.png" alt="">\
        //                                 </a>\
        //                                 <span>播放</span>\
        //                                 <i class="playNum">'+ tempArr[i].playback + '</i>\
        //                             </div>\
        //                         </div>';
        //                 }
        //             } else {
        //                 _html = '<p style="text-align: center;margin-top: 30px;">暂无数据</p>'
        //             }
        //             $(".listContent").html(_html);
        //         } else if (data.code == 250) {
        //             // 未登录操作
        //             window.location = '/yilaiyiwang/login/login.html';
        //         } else {
        //             // 其他操作
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
    }

    // 获取列表数据
    function getListData(typeId, findType, pageNo) {
        findAnnouncementByType(typeId, findType, pageNo);
        getCount(typeId, findType, pageNo);
    }

    getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), pageNo);

    // 关注、取消关注
    function toggleFollow(liveId, status, obj) {
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'follow/addFollow',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     data: {
        //         "liveId": liveId,
        //         "status": status,
        //     },
        //     crossDomain: true,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.code == 1) {
        //             if (status) {
        //                 obj.removeClass("active").html("关注");
        //             } else {
        //                 obj.addClass("active").html("已关注");
        //             }
        //         } else if (data.code == 250) {
        //             // 未登录操作
        //             window.location = '/yilaiyiwang/login/login.html';
        //         } else {
        //             // 其他操作
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
    }

    // 获取搜索结果总条数，渲染分页器
    function getSearchCount(typeName, pageNo) {
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'video/searchVideo',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     data: {
        //         "videoName": $(".videoSearchInput").val(),
        //         "typeName": typeName,
        //         "pageNo": pageNo,
        //         "pageSize": pageSize,
        //     },
        //     crossDomain: true,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.code == 1) {
        //             countNum = data.data.page;
        //             $(".searchNum").html(countNum);
        //             // 分页
        //             layui.use('laypage', function () {
        //                 var laypage = layui.laypage;
        //                 //执行一个laypage实例
        //                 laypage.render({
        //                     elem: 'listBox',
        //                     count: countNum,
        //                     limit: pageSize,
        //                     theme: '#f6c567',
        //                     jump: function (obj, first) {
        //                         if (!first) {
        //                             searchVideo($(".sortObj a.active").html(), obj.curr);
        //                         }
        //                     }
        //                 });
        //             });
        //         } else if (data.code == 250) {
        //             // 未登录操作
        //             window.location = '/yilaiyiwang/login/login.html';
        //         } else {
        //             // 其他操作
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
    }

    // 模糊搜索点播视频
    function searchVideo(typeName, pageNo) {
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'video/searchVideo',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     data: {
        //         "videoName": $(".videoSearchInput").val(),
        //         "typeName": typeName,
        //         "pageNo": pageNo,
        //         "pageSize": pageSize,
        //     },
        //     crossDomain: true,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.code == 1) {
        //             var tempArr = data.data.videoList;
        //             var _html = "";
        //             if (tempArr.length > 0) {
        //                 for (var i = 0; i < tempArr.length; i++) {
        //                     _html += '<div name="' + tempArr[i].id + '" class="itemBox">\
        //                             <img src="'+ tempArr[i].videoCoverUrl + '" alt="">\
        //                             <div class="rightBox">\
        //                                 <h2 class="videoTitle">'+ tempArr[i].videoName + '</h2>\
        //                                 <p class="videoInfo">'+ tempArr[i].hospitalName + '</p>\
        //                                 <p class="videoInfo">' + tempArr[i].deptName + '</p>\
        //                             </div>\
        //                             <a class="playBtn" target="_blank" href="'+ tempArr[i].videoUrl + '">播放</a>\
        //                             <p class="videoDesc">简介：' + tempArr[i].videoDescribe + '</p>\
        //                             <div class="popularBox">\
        //                                 <a href="javascript:;">\
        //                                     <img src="../img/playNum.png" alt="">\
        //                                 </a>\
        //                                 <span>关注</span>\
        //                                 <i class="playNum">'+ tempArr[i].playback + '</i>\
        //                             </div>\
        //                         </div>';
        //                 }
        //             } else {
        //                 _html = '<p style="text-align: center;margin-top: 30px;">暂无数据</p>'
        //             }
        //             $(".listContent").html(_html);
        //         } else if (data.code == 250) {
        //             // 未登录操作
        //             window.location = '/yilaiyiwang/login/login.html';
        //         } else {
        //             // 其他操作
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
    }

    // 搜索回车确定事件
    $('.videoSearchInput').keydown(function (event) {
        if (event.keyCode == 13) {
            // 处理筛选选项
            $(".classifyObj > a").removeClass("active").eq(0).addClass("active");
            $(".sortObj > a").removeClass("active").eq(0).addClass("active");
            page = 1;
            // 调用搜索接口
            getSearchCount($(".sortObj a.active").html(), page);
            searchVideo($(".sortObj a.active").html(), page);
        }
    });

    // 点击量/播放量
    $(".listContent").delegate(".playBtn", "click", function () {
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'video/addClicks',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     data: {
        //         "videoId": $(this).parents(".itemBox").attr("name"),
        //     },
        //     crossDomain: true,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.code == 1) {
        //
        //         } else if (data.code == 250) {
        //             // 未登录操作
        //             window.location = '/yilaiyiwang/login/login.html';
        //         } else {
        //             // 其他操作
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
    })

    // 发布点播按钮
    $(".releaseBtn").click(function () {
        window.location = '/video/release.html';
        // 检测是否有发布点播视频权限
        // $.ajax({
        //     type: 'GET',
        //     url: IP + 'video/testPermissions',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     crossDomain: true,
        //     cache: false,
        //     contentType: false,
        //     dataType: "json",
        //     async: false,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.status == 200) {
        //             window.location = '/yilaiyiwang/premierCourseRelease/release.html';
        //         } else if (data.code == 250) {
        //             // 未登录操作
        //             window.location = '/yilaiyiwang/login/login.html';
        //         } else if (data.status == 251) {
        //             layer.msg("您没有上传视频的权限");
        //             return false;
        //         } else {
        //             // 其他操作
        //             layer.msg("请稍后重试");
        //             return false;
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     },
        // });
    })

})