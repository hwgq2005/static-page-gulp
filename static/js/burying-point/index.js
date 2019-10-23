
// 神策
(function(para) {
    var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script',x = null,y = null;
    if(typeof(w['sensorsDataAnalytic201505']) !== 'undefined') {
        return false;
    }
    w['sensorsDataAnalytic201505'] = n;
    w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
    var ifs = ['track','quick','register','registerPage','registerOnce','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister'];
    for (var i = 0; i < ifs.length; i++) {
        w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
        x = d.createElement(s), y = d.getElementsByTagName(s)[0];
        x.async = 1;
        x.src = p;
        w[n].para = para;
        y.parentNode.insertBefore(x, y);
    }
})({
    sdk_url: 'https://frontstatic.zhaoliangji.com/static/js/shence/sensorsdata.min.js',
    name: 'sensors',
    // 测试环境
    server_url:'http://shencedatareport.zhaoliangji.com/sa?project=default',
    // 正式环境
    // server_url:'http://shencedatareport.zhaoliangji.com/sa?project=production',
    //heatmap_url神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。如果神策代码中 `sensorsdata.min.js` 版本是 1.13.1 及以前版本，这个参数须配置，高于此版本不需要配置。
    //        heatmap_url: "https://frontstatic.zhaoliangji.com/static/js/shence/heatmap.min.js",
    //web_url 神策分析中点击分析及触达分析功能会用到此地址，代码生成工具会自动生成。如果神策后台版本及 `sensorsdata.min.js` 均是 1.10 及以上版本，这个参数不需要配置。
    //        web_url:"http://shence.zhaoliangji.com",
    //配置打通 App 与 H5 的参数
    use_app_track: true,
    heatmap: {
        //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
        //需要 JSSDK 版本号大于 1.7
        clickmap:'not_collect',
        //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
        //需要 JSSDK 版本号大于 1.9.1
        scroll_notice_map:'not_collect'
    }
});

// 公告属性
sensors.registerPage({
    page_id: 10049,
    channel_id: 1
});


// 数数
(function(param) {
    var p = param.sdkUrl,
        n = param.name,
        w = window,
        d = document,
        s = 'script',
        x = null,
        y = null
    w['ThinkingDataAnalyticalTool'] = n
    w[n] = w[n] || function(a) {
        return function() {
            (w[n]._q = w[n]._q || []).push([a, arguments])
        }
    }
    var methods = ['track', 'quick', 'login', 'logout', 'trackLink', 'userSet', 'userSetOnce', 'userAdd', 'userDel', 'setPageProperty']
    for (var i = 0; i < methods.length; i++) {
        w[n][methods[i]] = w[n].call(null, methods[i])
    }
    if (!w[n]._t) {
        x = d.createElement(s), y = d.getElementsByTagName(s)[0]
        x.async = 1
        x.src = p
        y.parentNode.insertBefore(x, y)
        w[n].param = param
    }
})({
    // appId: '29c58f5cfb524250badc849f4ebf1cf9', // 正式
    appId: '564269de83c04d1c96be2b22579913ec', //测试
    name: 'ta', // 全局的调用变量名，可以任意设置，后续的调用使用该名称即可
    sdkUrl: 'https://panda.huodao.hk/admin/js/h5/thinkingdata.js', // 统计脚本URL
    serverUrl: 'http://datareport.zhaoliangji.com/sync_js', // 数据上传的URL
    send_method: 'image', // 数据上传方式
    useAppTrack: true, // 打通 APP 与 H5
    showLog: false
})
