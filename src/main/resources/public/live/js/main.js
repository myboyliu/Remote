/**
 * 渲染Banner
 * @param data
 */
function renderBannerView(data) {
    console.log(data);
    let tempArr = data;
    let _html = '';
    for (let i = 0; i < tempArr.length; i++) {
        _html += '<a class="swiper-slide" target="_blank" href="javascript:;"><img src="' + baseUrl + "/" + tempArr[i].picturePath + '" alt=""/></a>';
    }
    $(".swiper-wrapper").html(_html);
    let mySwiper = new Swiper('.swiper-container', {
        direction: "horizontal",
        loop: true, // 循环模式选项
        autoplay: true,
    })
}
$(function () {
    // 获取轮播图
    ajaxRequest("GET", getBannerList, "", false, false, true, renderBannerView, null, null);
    let countNum = 0;
    let pageSize = 10;
    let pageNo = 1;
    // 筛选部分
    $(".classifyObj").delegate("a", "click", function () {
        $(".liveSearchInput").val("");
        $(this).addClass("active").siblings("a").removeClass("active");
        getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), pageNo);
    })
    // 最新 关注度 搜索
    $(".sortObj").delegate("a", "click", function () {
        $(".liveSearchInput").val("");
        $(this).addClass("active").siblings("a").removeClass("active");
        getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), pageNo);
    })


    // 获取总条数
    function getCount(typeId, findType, pageNo) {
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'live/findAnnouncementByType',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     data: {
        //         "typeId": typeId,
        //         "findType": findType,
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
    function findAnnouncementByType(typeId, findType, pageNo) {
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'live/findAnnouncementByType',
        //     dataType: 'json',
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     data: {
        //         "typeId": typeId,
        //         "findType": findType,
        //         "pageNo": pageNo,
        //         "pageSize": pageSize,
        //     },
        //     crossDomain: true,
        //     success: function (data) {
        //         console.log(data)
        //         if (data.code == 1) {
        //             var tempArr = data.data.liveBroadcastList;
        //             var _html = "";
        //             if (tempArr.length > 0) {
        //                 for (var i = 0; i < tempArr.length; i++) {
        //                     _html += '<div name="' + tempArr[i].id + '" class="itemBox">\
        //                             <img src="'+ IP + tempArr[i].liveCoverUrl + '" alt="">\
        //                             <div class="rightBox">\
        //                                 <h2 class="videoTitle">'+ tempArr[i].liveName + '</h2>\
        //                                 <p class="videoInfo">'+ tempArr[i].hospitalName + '-' + tempArr[i].deptName + '</p>\
        //                                 <p class="lievTime">'+ tempArr[i].liveStartTime + '</p>\
        //                             </div>'
        //                     if (tempArr[i].isFollow) {
        //                         _html += '<a class="followBtn active" href="javascript:;">已关注</a>'
        //                     } else {
        //                         _html += '<a class="followBtn" href="javascript:;">关注</a>'
        //                     }
        //                     _html += '<p class="videoDesc">简介：' + tempArr[i].liveDescribe + '</p>\
        //                             <div class="popularBox">\
        //                                 <a href="javascript:;">\
        //                                     <img src="../img/follow.png" alt="">\
        //                                 </a>\
        //                                 <span>关注</span>\
        //                                 <i class="playNum">'+ tempArr[i].followNum + '</i>\
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
        $.ajax({
            type: 'POST',
            url: IP + 'follow/switchFollow',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                "liveId": liveId,
                "status": status,
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.code == 1) {
                    getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), pageNo);
                } else if (data.code == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    }
    // 关注、取消关注事件
    $(".listContent").delegate(".followBtn", "click", function () {
        if ($(this).hasClass("active")) {
            toggleFollow($(this).parents(".itemBox").attr("name"), true, $(this));
        } else {
            toggleFollow($(this).parents(".itemBox").attr("name"), false, $(this));
        }
    })

    // 获取搜索总条数
    function getSearchCount(findType, pageNo) {
        $.ajax({
            type: 'POST',
            url: IP + 'live/searchLive',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                "liveName": $(".liveSearchInput").val(),
                "findType": findType,
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.code == 1) {
                    countNum = data.data.page;
                    $(".searchNum").html(countNum);
                    // 分页
                    layui.use('laypage', function () {
                        var laypage = layui.laypage;
                        //执行一个laypage实例
                        laypage.render({
                            elem: 'listBox',
                            count: countNum,
                            limit: pageSize,
                            theme: '#f6c567',
                            jump: function (obj, first) {
                                if (!first) {
                                    searchLive($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), obj.curr);
                                }
                            }
                        });
                    });
                } else if (data.code == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    }
    // 直播搜索
    function searchLive(findType, pageNo) {
        $.ajax({
            type: 'POST',
            url: IP + 'live/searchLive',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                "liveName": $(".liveSearchInput").val(),
                "findType": findType,
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.code == 1) {
                    var tempArr = data.data.liveBroadcastList;
                    var _html = "";
                    if (tempArr.length > 0) {
                        for (var i = 0; i < tempArr.length; i++) {
                            _html += '<div name="' + tempArr[i].id + '" class="itemBox">\
                                    <img src="'+ IP + tempArr[i].liveCoverUrl + '" alt="">\
                                    <div class="rightBox">\
                                        <h2 class="videoTitle">'+ tempArr[i].liveName + '</h2>\
                                        <p class="videoInfo">'+ tempArr[i].hospitalName + '-' + tempArr[i].deptName + '</p>\
                                        <p class="lievTime">'+ tempArr[i].liveStartTime + '</p>\
                                    </div>'
                            if (tempArr[i].isFollow) {
                                _html += '<a class="followBtn active" href="javascript:;">已关注</a>'
                            } else {
                                _html += '<a class="followBtn" href="javascript:;">关注</a>'
                            }
                            _html += '<p class="videoDesc">简介：' + tempArr[i].liveDescribe + '</p>\
                                    <div class="popularBox">\
                                        <a href="javascript:;">\
                                            <img src="../img/follow.png" alt="">\
                                        </a>\
                                        <span>关注</span>\
                                        <i class="playNum">'+ tempArr[i].followNum + '</i>\
                                    </div>\
                                </div>';
                        }
                    } else {
                        _html = '<p style="text-align: center;margin-top: 30px;">暂无数据</p>'
                    }
                    $(".listContent").html(_html);
                } else if (data.code == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    }
    // 搜索回车确定事件
    $('.liveSearchInput').keydown(function (event) {
        if (event.keyCode == 13) {
            // 处理筛选选项
            $(".classifyObj > a").removeClass("active").eq(0).addClass("active");
            $(".sortObj > a").removeClass("active").eq(0).addClass("active");
            page = 1;
            // 调用搜索接口
            getSearchCount($(".sortObj a.active").html(), page);
            searchLive($(".sortObj a.active").html(), page);
        }
    });

    // 发布直播按钮
    $(".releaseBtn").click(function () {
        window.location = '/live/release.html';
    })
})