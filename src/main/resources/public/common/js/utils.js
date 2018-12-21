// 输入身份证号自动计算年龄 性别

function discriCard(idCard) {
    let unit = '岁'; // 单位
    let num = 0; // 值
    let userYear;
    let userMonth;
    let userDay;
    let sex = 1;
    if (idCard.length == 18) {
        //获取出生日期
        userYear = idCard.substring(6, 10);
        userMonth = idCard.substring(10, 12);
        userDay = idCard.substring(12, 14);
        //获取性别
        if (parseInt(UUserCard.substr(16, 1)) % 2 == 0) {
            sex = 0;
        }
    } else {
        userYear = 19 + idCard.substring(6, 8);
        userMonth = idCard.substring(8, 10);
        userDay = idCard.substring(10, 12);
        if (parseInt(idCard.substring(14, 15)) % 2 == 0) {
            sex = 0;
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