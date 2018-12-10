function getResponseJsonByAjax(type, url, data) {
    var responseJson;
    $.ajax({
        type: type,
        url: baseUrl + url,
        processData: false,
        contentType: false,
        dataType: 'json',
        data: data,
        async: false,
        success: function (data) {
            if (data.code == 20000) {
                responseJson = data.result;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
    console.log(responseJson);
    return responseJson;
}

function getDataByAjax(type, url, data) {
    var responseData;
    $.ajax({
        type: type,
        url: baseUrl + url,
        processData: false,
        contentType: false,
        dataType: 'json',
        data: data,
        async: false,
        success: function (data) {
            responseData = data;
        },
        error: function (err) {
            console.log(err);
        }
    });
    console.log(responseData);
    return responseData;
}