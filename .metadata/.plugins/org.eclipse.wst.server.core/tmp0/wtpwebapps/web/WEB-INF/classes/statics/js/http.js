// 基础域名
let finance_host = window.location.host
let finance_port = window.location.port
// if (port) { //端口号不是80处理
//   window.location.href = '//' + window.location.hostname + window.location.pathname
// }

let baseURL = contextPath + "/";
let baseURLPage = `${baseURL}finance/`
// switch (host) {
//     case 'localhost':
//         baseURL = '../../';
//         break;
//     case 'ht-web.com':
//         baseURL = 'http://ht-web.com:8001/finance/';
//         break;
//     default:
//         baseURL = '../';
//         break;
// }


/** 
 * 该方法仅支持IE8以上 
* 网络请求方法 
* url：请求地址 
* options = { 
*   catchs: 异常处理，控制台抛出的异常是否自己处理：true 是，false 否 由公共方法统一处理优化显示给用户 默认 false 
*   credentials: 请求带上cookies，是每次请求保持会话一直 
*   method: 请求使用的方法，如 GET、POST 
*   headers: 请求的头信息，形式为 Headers 对象或 ByteString。 
*   body: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。 
*   mode: 请求的模式，如 cors、no-cors 或者same-origin。是否允许跨域请求 
*   cache:  请求的 cache 模式: default, no-store, reload, no-cache, force-cache, or only-if-cached. 
* } 
*/
var http = {};

http.header = {
    'Accept': 'application/json',
    //json形式
    'Content-Type': 'application/json'
}
/**
 * 基于 fetch 封装的 GET请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
http.get = function (url, params, headers) {
    if (params) {
        let paramsArray = [];
        //encodeURIComponent
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'GET',
            headers: headers,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    reject({ status: response.status })
                }
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject({ status: -1 });
            })
    })
}


/**
 * 基于 fetch 封装的 POST请求  FormData 表单数据
 * @param url
 * @param formData
 * @param headers
 * @returns {Promise}
 */

http.post = function (url, formData, headers) {
    // 添加时间戳
    if (url.search(/\?/) === -1) {
        url += '?r=' + new Date().getTime()
    } else {
        url += '&r=' + + new Date().getTime()
    }
    // var _header = headers ? Object.assign(headers, http.header) : http.header;
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'POST',
            headers: headers,
            // headers: headers || http.header,
            mode: "cors",
            credentials: 'include',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    reject({ status: response.status })
                }
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject({ status: -1 });
            })
    })
}

http.msg = function (res) {

}

/**
 * 网络请求工具类
 * Songlcy create
 * params:请求参数
 * successCallback:成功回调
 * failCallback:失败回调
 */

// import RootToast from '../pages/RootToast/RootToast'

// import Environment from '../environment/Environment'

// import ShowProgress from '../pages/ProgressHUD/ShowProgress';

// const host = 'https:doSubmit.do'

// const showProgress = new ShowProgress;

// 参考完善
// http.Network = {

//     postNetwork: (params, successCallBack, failCallBack) => {

//         if (params.isProgress === '1') {

//             showProgress.show();

//         }

//         console.log('***********************网络请求报文******************************');
//         console.log(JSON.stringify(params));
//         console.log('================================================================');

//         // const host = Environment.host();

//         paramStr = 'transCode=' + params.transCode + '&requestBodyJson=' + JSON.stringify(params.request);

//         fetch(host,
//             {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',

//                 },
//                 body: paramStr
//             }
//         ).then((response) => {

//             // showProgress.hidden();

//             if (response.ok) {

//                 return response.json();

//             } else {

//                 // RootToast.show('服务器连接异常');

//             }
//         }).then((response) => {

//             console.log('***********************成功返回****************************');
//             console.log(JSON.stringify(response));
//             console.log('================================================================');

//             if (response.responseBody == null) {

//                 RootToast.show(response.errorMsg);
//                 if (failCallBack && typeof (failCallBack) == 'function') {

//                     failCallBack(response);

//                 }

//             } else {

//                 successCallBack(response);

//             }

//         }).catch((error) => {

//             showProgress.hidden();

//             console.log(error.message);

//             if (failCallBack && typeof (failCallBack) == 'function') {

//                 failCallBack(error);

//             }
//         })

//     }

// }
