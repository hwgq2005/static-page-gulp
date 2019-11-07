'use strict';

(function (param) {
    var p = param.sdkUrl,
        n = param.name,
        w = window,
        d = document,
        s = 'script',
        x = null,
        y = null;
    w['ThinkingDataAnalyticalTool'] = n;
    w[n] = w[n] || function (a) {
        return function () {
            (w[n]._q = w[n]._q || []).push([a, arguments]);
        };
    };
    var methods = ['track', 'quick', 'login', 'logout', 'trackLink', 'userSet', 'userSetOnce', 'userAdd', 'userDel', 'setPageProperty'];
    for (var i = 0; i < methods.length; i++) {
        w[n][methods[i]] = w[n].call(null, methods[i]);
    }
    if (!w[n]._t) {
        x = d.createElement(s), y = d.getElementsByTagName(s)[0];
        x.async = 1;
        x.src = p;
        y.parentNode.insertBefore(x, y);
        w[n].param = param;
    }
})({
    appId: '29c58f5cfb524250badc849f4ebf1cf9', //正式
    // appId: '564269de83c04d1c96be2b22579913ec', //测试
    name: 'ta', //全局的调用变量名，可以任意设置，后续的调用使用该名称即可
    sdkUrl: 'https://panda.huodao.hk/admin/js/h5/thinkingdata.js', //统计脚本URL
    serverUrl: 'http://datareport.zhaoliangji.com/sync_js', //数据上传的URL
    send_method: 'image', //数据上传方式
    useAppTrack: true, // 打通 APP 与 H5
    showLog: false
});