(function(para) {
    if(typeof(window['sensorsDataAnalytic201505']) !== 'undefined') {
        return false;
    }
    window['sensorsDataAnalytic201505'] = para.name;
    window[para.name] = {
        para: para
    };
})({
    name: 'sensors',
    //    测试环境
    //    server_url:'http://shencedatareport.zhaoliangji.com/sa?project=default',
    // 正式环境
    server_url:'http://shencedatareport.zhaoliangji.com/sa?project=production',
    //如果神策代码中 `sensorsdata.min.js` 是 1.13.1 以前的版本，必须须配置 heatmap_url，高于此版本不需要配置。heatmap_url 神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。
    //如果神策后台版本及 `sensorsdata.min.js` 均是 1.10 及以上版本，不需要配置 web_url 参数。web_url 神策分析中点击分析及触达分析功能会用到此地址，代码生成工具会自动生成。
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
