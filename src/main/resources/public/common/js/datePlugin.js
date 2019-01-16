let initDate = new Date();
let initValue = '';
let initYear = initDate.getFullYear();
let initMonth = initDate.getMonth() + 1;
let initDay = initDate.getDate();
let markReferralJson = {};

let isOnly = false;

function showDateView() {
    referralSelectRender();
    // 打开转诊选时间面板
    layer.open({
        type: 1,
        content: $('#checkDateBox'),
        title: false,
        area: ['600px', '580px'],
        closeBtn: 0,
        skin: 'noBackground'
    })

}

function referralSelectRender() {
    $("#referralTimeScope").html('');
    layui.use('laydate', function () {
        let layDate = layui.laydate;
        //执行一个laydate实例
        layDate.render({
            elem: '#referralTimeScope',
            position: 'static',
            showBottom: false,
            min: 0,
            value: initValue,
            mark: markReferralJson,
            change: function (value, date) { //监听日期被切换
                if (date.date == initDay && date.month != initMonth || date.year != initYear) {

                } else {
                    if(isOnly){
                        markReferralJson = {};
                        markReferralJson[value] = '';
                    }else{
                        let _flag = true;
                        for (var key in markReferralJson) {
                            if (key == value) {
                                _flag = false;
                                delete markReferralJson[value];
                                break;
                            }
                        }
                        if (_flag) {
                            markReferralJson[value] = '';
                        }
                    }
                }
                initValue = value;
                initYear = date.year;
                initMonth = date.month;
                initDay = date.date;
                referralSelectRender();
            }
        });
    });
};

$(function () {
    // 清空按钮
    $("#checkDateBoxClearBtn").click(function () {
        markReferralJson = {};
        referralSelectRender();
    })
})