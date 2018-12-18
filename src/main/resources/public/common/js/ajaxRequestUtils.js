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
function ajaxRequest(type, url, data, processData, contentType, async, successCallback, failedCallBack, errorCallBack) {

    $.ajax({
        type: type,
        url: baseUrl + url,
        processData: processData,
        contentType: contentType,
        dataType: 'json',
        data: data,
        async: async,
        headers: {
            token: localStorage.getItem("token")
        },
        success: function (data) {
            if (data.code == 20000) {
                successCallback(data.result);
            } else if (data.code == 40000 || data.code == 41006) {
                failedCallBack();
            } else if (data.code == 50000) {

            }
        },
        error: function (err) {
            errorCallBack();
        }
    });
}
