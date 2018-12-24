// 输入身份证号自动计算年龄 性别
let idCardInfo = {};
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
        if (parseInt(idCard.substr(16, 1)) % 2 == 0) {
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
    idCardInfo["sex"] = sex;
    idCardInfo["age"] = num;
    idCardInfo["unit"] = unit;
    idCardInfo["city"] = CityArray[parseInt(idCard.substr(0, 2))];
    console.log(idCardInfo.city)
}

//定义地区数组
let CityArray = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江",
    31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北",
    43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏",
    61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }



