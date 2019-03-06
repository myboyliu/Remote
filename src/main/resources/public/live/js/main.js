/**
 * 渲染Banner
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

/**
 * 模糊查询直播列表
 */
function searchLiveList() {
    let countData = {};
    $(".sortObj a.active").html();
    countData["param"] = $(".liveSearchInput").val();
    ajaxRequest("GET", searchCountByParamUrl, countData, true, "application/json", true, searchCountSuccess, null, null);
}

function searchCountSuccess(liveCount) {
    if (liveCount === 0) {
        let _html = '<p style="text-align: center;margin-top: 30px;">暂无数据</p>'
        $(".listContent").html(_html);
    } else {
        $(".searchNum").html(liveCount);
        layui.use('laypage', function () {
            let laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: liveCount,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    pageNo = obj.curr;
                    let listData = {};
                    listData["param"] = $(".liveSearchInput").val();
                    ajaxRequest("GET", searchListByParamUrl, listData, true, "application/json", true, renderLiveList, null, null);
                }
            });
        });
    }
}

/**
 * 条件筛选直播列表
 */
function selectLiveList() {
    let countData = {};
    if ($(".classifyObj > a.active").attr("name") !== "LIVE_ALL") {
        countData["liveType"] = $(".classifyObj > a.active").attr("name");

    }
    ajaxRequest("GET", selectCountByParamUrl, countData, true, "application/json", true, selectCountSuccess, null, null);
}

function selectCountSuccess(liveCount) {
    if (liveCount === 0) {
        let _html = '<p style="text-align: center;margin-top: 30px;">暂无数据</p>'
        $(".listContent").html(_html);
    } else {
        $(".searchNum").html(liveCount);
        layui.use('laypage', function () {
            let laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: liveCount,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    pageNo = obj.curr;
                    let listData = {};
                    if ($(".classifyObj > a.active").attr("name") !== "LIVE_ALL") {
                        listData["liveType"] = $(".classifyObj > a.active").attr("name")
                    }
                    ajaxRequest("GET", selectListByParamUrl, listData, true, "application/json", true, renderLiveList, null, null);
                }
            });
        });
    }
}

/**
 * 渲染直播列表
 */
function renderLiveList(liveList) {

    let _html = "";
    for (let i = 0; i < liveList.length; i++) {
        let isGoing = false;
        if (new Date().getTime() > new Date(liveList[i].liveStartTime).getTime() && new Date().getTime() < new Date(liveList[i].liveEndTime).getTime()) {
            isGoing = true;
        }
        _html += '<div name="' + liveList[i].id + '" class="itemBox">\
                                <img src="' + baseUrl + "/" + liveList[i].liveCoverUrl + '" alt="">\
                                <div class="rightBox">\
                                    <h2 class="videoTitle">' + liveList[i].liveName + '</h2>\
                                    <p class="videoInfo">' + liveList[i].liveHospitalName + '-' + liveList[i].liveBranchName + '</p>\
                                    <p class="lievTime">' + liveList[i].liveStartTime + '</p>\
                                </div>'
        if (isGoing) {
            _html += '<a id="playBtn" liveRoomId="' + liveList[i].liveId + '" class="playBtn" href="javascript:;">播放</a>'
        } else if (liveList[i].isFollow) {
            _html += '<a class="followBtn active" href="javascript:;">已关注</a>'
        } else {
            _html += '<a class="followBtn" href="javascript:;">关注</a>'
        }
        _html += '<p class="videoDesc">简介：' + liveList[i].liveDescription + '</p>\
                                <div class="popularBox">\
                                    <a href="javascript:;">\
                                        <img src="/live/img/follow.png" alt="">\
                                    </a>\
                                    <span>关注</span>\
                                    <i class="playNum">' + 0 + '</i>\
                                </div>\
                            </div>';
    }

    $(".listContent").html(_html);
}

$(function () {
    // 获取轮播图
    ajaxRequest("GET", getBannerList, "", false, false, true, renderBannerView, null, null);
    // 筛选部分
    $(".classifyObj").delegate("a", "click", function () {
        $(".liveSearchInput").val("");
        $(this).addClass("active").siblings("a").removeClass("active");
        selectLiveList();
    })
    // 最新 关注度 搜索
    $(".sortObj").delegate("a", "click", function () {
        $(".liveSearchInput").val("");
        $(this).addClass("active").siblings("a").removeClass("active");
        selectLiveList();
    })

    // 关注、取消关注
    function toggleFollow(liveId, status, obj) {
        console.log(liveId)
        console.log(status)
        // $.ajax({
        //     type: 'POST',
        //     url: IP + 'follow/switchFollow',
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
        //             getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), pageNo);
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

    // 关注、取消关注事件
    $(".listContent").delegate(".followBtn", "click", function () {
        if ($(this).hasClass("active")) {
            toggleFollow($(this).parents(".itemBox").attr("name"), true, $(this));
        } else {
            toggleFollow($(this).parents(".itemBox").attr("name"), false, $(this));
        }
    })

    // 搜索回车确定事件
    $('.liveSearchInput').keydown(function (event) {
        if (event.keyCode == 13) {
            // 处理筛选选项
            $(".classifyObj > a").removeClass("active").eq(0).addClass("active");
            $(".sortObj > a").removeClass("active").eq(0).addClass("active");
            searchLiveList();
        }
    });

    // 发布直播按钮
    $(".releaseBtn").click(function () {
        window.location = '/live/release.html';
    })
    $(".listContent").delegate(".playBtn", "click", function () {
        //新窗口打开直播页面
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        window.open("http://www.qlxlm.com/#/to/" + userInfo.userPhone + "/watch-live/" + $(this).attr("liveRoomId"), "_blank");
        return false;
        //本窗口悬浮打开直播页面
        $("#livePlayIframe").attr('src', "http://www.qlxlm.com/#/page/watch-live/" + $(this).attr("liveRoomId"));
        layer.open({
            type: 1,
            title: '',
            area: ['1024px', '600px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('#livePlayBox'),
        });
    })

    $("#livePlayBoxCloseBtn").click(function () {
        layer.closeAll();
        $('#livePlayBox').hide();
    })
    selectLiveList();
})