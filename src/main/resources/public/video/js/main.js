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

/** 模糊搜索 数量查询成功 回调函数 */
function getSearchCountSuccess(videoListCount) {
    if (videoListCount === 0) {
        let _html = '<p style="text-align: center;margin-top: 30px;">暂无数据</p>';
        $(".listContent").html(_html);
        // layer.msg("暂无数据")
        return false
    } else {
        $(".searchNum").html(videoListCount);
        let requestData = {param: $(".videoSearchInput").val()};
        ajaxRequest("GET", fuzzySearchVideoList, requestData, true, "application/json", true, renderVideoList, null, null);
        // 分页
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: videoListCount,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    if (!first) {
                        // findAnnouncementByType($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), obj.curr);
                        // renderVideoList($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").html(), obj.curr);
                        let requestData = {param: $(".videoSearchInput").val()};
                        pageNo = obj.curr;
                        ajaxRequest("GET", fuzzySearchVideoList, requestData, true, "application/json", true, renderVideoList, null, null);
                    }
                }
            });
        });

    }
}

function renderVideoList(videoList) {
    let tempArr = videoList;
    let _html = "";
    for (let i = 0; i < tempArr.length; i++) {
        _html += '<div name="' + tempArr[i].id + '" class="itemBox">\
                                <img src="' + tempArr[i].videoCoverUrl + '" alt="">\
                                <div class="rightBox">\
                                    <h2 class="videoTitle">' + tempArr[i].videoName + '</h2>\
                                    <p class="videoInfo">' + tempArr[i].hospitalName + '</p>\
                                    <p class="videoInfo">' + tempArr[i].branchName + '</p>\
                                </div>\
                                <a name="' + tempArr[i].videoFileId + '"  class="playBtn" target="_blank">播放</a>\
                                <p class="videoDesc">简介：' + tempArr[i].videoDescribe + '</p>\
                                <div class="popularBox">\
                                    <a href="javascript:;">\
                                        <img src="../video/img/playNum.png" alt="">\
                                    </a>\
                                    <span>播放</span>\
                                    <i class="playNum">' + tempArr[i].playback + '</i>\
                                </div>\
                            </div>';
    }
    $(".listContent").html(_html);

}

let selectRule = {
    VIDEO_CLASSICAL_OPERATION: "VIDEO_CLASSICAL_OPERATION",
    VIDEO_EXPERT_LECTURE: "VIDEO_EXPERT_LECTURE",
    VIDEO_ACADEMIC_CONFERENCE: "VIDEO_ACADEMIC_CONFERENCE"
}
let groupRule = {
    groupByTime: "groupByTime",
    groupByHot: "groupByHot"
}

// 获取列表数据
function getListData(pageNo) {

    let typeName = $(".classifyObj > a.active").attr("name");
    let groupBy = $(".sortObj > a.active").attr("name");
    let paramData = {}
    if (selectRule[typeName]) {
        paramData["videoType"] = selectRule[typeName];
    }
    if (groupRule[groupBy]) {
        paramData[groupRule[groupBy]] = "0";
    }
    ajaxRequest("GET", getVideoListCountUrl, paramData, true, "application/json", true, getVideoListCountSuccess, null, null);

}

function getVideoListCountSuccess(videoListCount) {
    if (videoListCount === 0) {
        let _html = '<p style="text-align: center;margin-top: 30px;">暂无数据</p>';
        $(".listContent").html(_html);
        // layer.msg("暂无数据")
        return false
    } else {
        $(".searchNum").html(videoListCount);
        let typeName = $(".classifyObj > a.active").attr("name");
        let groupBy = $(".sortObj > a.active").attr("name");
        let paramData = {}
        if (selectRule[typeName]) {
            paramData["videoType"] = selectRule[typeName];
        }
        if (groupRule[groupBy]) {
            paramData[groupRule[groupBy]] = "0";
        }
        ajaxRequest("GET", getVideoListUrl, paramData, true, "application/json", true, renderVideoList, null, null);
        // 分页
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: videoListCount,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    if (!first) {
                        pageNo = obj.curr;
                        ajaxRequest("GET", getVideoListUrl, paramData, true, "application/json", true, renderVideoList, null, null);

                    }
                }
            });
        });
    }
}

// 获取搜索结果总条数，渲染分页器
function getSearchCount(typeName, pageNo) {
    let requestData = {param: $(".videoSearchInput").val()};
    ajaxRequest("GET", fuzzySearchVideoListCount, requestData, true, "application/json", true, getSearchCountSuccess, null, null);
}

$(function () {
    // 筛选部分
    $(".classifyObj").delegate("a", "click", function () {
        $(".videoSearchInput").val("");
        $(this).addClass("active").siblings("a").removeClass("active");
        getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").attr("name"), pageNo);
    });
    // 最新 关注度 搜索
    $(".sortObj").delegate("a", "click", function () {
        $(".videoSearchInput").val("");
        $(this).addClass("active").siblings("a").removeClass("active");
        getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").attr("name"), pageNo);
    });
    // 获取轮播图
    ajaxRequest("GET", getBannerList, "", false, false, true, renderBannerView, null, null);

    getListData($(".classifyObj > a.active").attr("name"), $(".sortObj > a.active").attr("name"), pageNo);

    // 搜索回车确定事件
    $('.videoSearchInput').keydown(function (event) {
        if (event.keyCode == 13) {
            // 处理筛选选项
            $(".classifyObj > a").removeClass("active").eq(0).addClass("active");
            $(".sortObj > a").removeClass("active").eq(0).addClass("active");
            page = 1;
            // 调用搜索接口
            getSearchCount($(".sortObj a.active").html(), page);
        }
    });
    let player;
    $("#videoBoxCloseBtn").click(function () {
        layer.closeAll();
        $('#videoBox').hide();
        player.dispose();
    })
    // 点击量/播放量
    $(".listContent").delegate(".playBtn", "click", function () {
        $("#videoCount").append('<video style="height: 100%; width: 100%" id="player-container-id" preload="auto" playsinline webkit-playsinline></video>')
        layer.open({
            type: 1,
            title: '',
            area: ['1060px', '480px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            content: $('#videoBox'),
        });
        player = TCPlayer('player-container-id', {
            fileID: $(this).attr("name"),
            appID: '1256684112'
        });
        let requestData = new FormData();
        requestData.append("videoId", $(this).parents(".itemBox").attr("name"));
        ajaxRequest("POST", addClickCountUrl, requestData, false, false, true, addClickCountSuccess, null, null);

        function addClickCountSuccess(result) {
            console.log(result);
        }
    });

    // 发布点播按钮
    $(".releaseBtn").click(function () {
        window.location = '/video/release.html';
    })

});