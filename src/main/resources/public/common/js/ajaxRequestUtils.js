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
        headers: {
            token: localStorage.getItem("token")
        },
        success: function (data) {
            if (data.code == 20000) {
                responseJson = data.result;
            }

        },
        error: function (err) {
            console.log(err);
            return;
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
        header: {
            token: localStorage.getItem("token")
        },
        success: function (data) {
            switch (data.code) {
                case 20000:
                    responseData = data;
                    break;
                case 50000:

                    return;
                case 40000:

                    return;
            }
        },
        error: function (err) {
            console.log(err);
            return;
        }
    });
    console.log(responseData);
    return responseData;
}

/**
 *
 * @param type
 * @param url
 * @param data
 * @param async
 * @param successCallback
 * @param failedCallBack
 * @param errorCallBack
 * @returns {}
 */
function ajaxRequest(type, url, data, async, successCallback, failedCallBack, errorCallBack) {
    $.ajax({
        type: type,
        url: baseUrl + url,
        processData: false,
        contentType: false,
        dataType: 'json',
        data: data,
        async: async,
        header: {
            token: localStorage.getItem("token")
        },
        success: function (data) {
            switch (data.code) {
                case 20000:
                    break;
                case 40000:
                    break;
                case 50000:
                    break;
            }
        },
        error: function (err) {
            errorCallBack();
            return;
        }
    });
}