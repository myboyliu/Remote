let searchText = '';

let pageCountJson = {};
let count = 10;
let isDoctor;
let searchUrl = "";

function renderLable(tempArr) {
    $('.fruitless').hide();
    // count = data.pageSize * pageSize;
    let _html = '';
    let myDate = new Date();
    let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    let month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
    let day = double(myDate.getDate()); //获取当前日(1-31)
    for (var i = 0; i < tempArr.length; i++) {
        let timeStr = tempArr[i].consultantApplyTime.split(' ')[0];
        let time = tempArr[i].consultantApplyTime.split(' ')[1];
        let _year = timeStr.split('-')[0];
        let _month = timeStr.split('-')[1];
        let _day = timeStr.split('-')[2];
        _html += '<tr name="' + tempArr[i].id + '" inHospitalName="' + tempArr[i].id + '" outHospitalName="' + tempArr[i].id + '">\
                        <td>\
                            <p class="overHidden3" title="' + tempArr[i].caseSummary + '">' + tempArr[i].caseSummary + '</p>\
                        </td>\
                        <td>\
                            <p class="overHidden1" title="' + tempArr[i].inviteSummary + '"> ' + tempArr[i].inviteSummary + '</p>\
                        </td>\
                        <td>\
                            <p class="overHidden2" title="' + tempArr[i].applySummary + '">' + tempArr[i].applySummary + '</p>\
                        </td>'
        _html += '<td class="tc">' + tempArr[i].applyNumber + '</td>'

        if (year == _year && month == _month && day == _day) {
            _html += '<td class="tl2em">今天' + time + '</td>'
        } else {
            _html += '<td class="tl2em">' + tempArr[i].consultantApplyTime + '</td>'
        }
        _html += '</tr>'
    }
    $('.searchTbody').html(_html);
    $('.substance').html('"' + searchText + '"' + count + '条已结束病历');
}

function searchSuccess(data) {
    if (data.length > 0) {
        renderLable(data);
    } else {
        $('.substance').html('"' + $('.searchInput').val() + '"' + '0条已结束病历');
        $('.fruitless').show();
    }
}

function searchCountSuccess(pageCount) {
    count = pageCount;
    if (pageCount === 0) {
        $('.substance').html('"' + $('.searchInput').val() + '"' + '0条已结束病历');
        $('.fruitless').show();
        return false;
    } else {

        console.log(pageCount);
        layui.use('laypage', function () {
            let laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox',
                count: count,
                limit: pageSize,
                theme: '#f6c567',
                jump: function (obj, first) {
                    selectSelfList(obj.curr, pageSize, searchText);
                }
            });
        });
    }
}

// 分页查询
function selectSelfList(currentPageNo, currentPageSize, searchText) {

    pageNo = currentPageNo;
    pageSize = currentPageSize;

    let requestData = {condition: searchText}

    ajaxRequest("GET", searchUrl, requestData, true, "application/json", true, searchSuccess, "", "");
}

$(function () {
    isDoctor = sessionStorage.getItem('rolesName') === '医政' ? false : true;
    searchText = sessionStorage.getItem('searchText');
    $('.searchInput').val(searchText);
    if (isDoctor) {
        searchUrl = doctorSearch;
        let requestData = {condition: searchText}
        ajaxRequest("GET", doctorSearchCount, requestData, true, "application/json", true, searchCountSuccess, "", "");
    } else {
        searchUrl = sirSearch;
        let requestData = {condition: searchText}
        ajaxRequest("GET", sirSearchCount, requestData, true, "application/json", true, searchCountSuccess, "", "");
    }

    $('.searchTbody').delegate('tr', 'click', function () {
        if (sessionStorage.getItem("rolesName") == "医生") {
            // 医生
            sessionStorage.setItem('applyFormId', $(this).attr("name"))
            window.location = '../page/doctorApplyInfo.html';
        } else {
            // 医政
            sessionStorage.setItem('applyFormId', $(this).attr("name"))
            window.location = '../page/adminApplyInfo.html';
        }
    })
})
