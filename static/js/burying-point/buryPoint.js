/**
 * @description 埋点模块
 * @author Hwg
 * @date 2019/10/15
 */

/**
 * 调用方式
 */
// var buryPoint = buryPoint({
//     publicData: {
//         page_id: 10049,
//         channel_id: 1
//     }
// });
// buryPoint.send('click', {
//     aaa: 1111
// });

;(function(){

    function BuryPoint(options) {

        // 默认配置
        this.defaultOptions = {
            type : 'all', // 可选'all'、'sensors'、’thinking',
            publicData:{} // 公共数据
        };
        this.defaultOptions = _extend(this.defaultOptions,options);
        this.config();
        this.init(this.defaultOptions);

    }

    /**
     * 埋点参数配置
     */
    BuryPoint.prototype.config = function(){
        // 神策配置
        this.sensorsOps = {
            sdk_url: 'https://frontstatic.zhaoliangji.com/static/js/shence/sensorsdata.min.js',
            name: 'sensors',
            // 测试环境
            // server_url:'http://shencedatareport.zhaoliangji.com/sa?project=default',
            // 正式环境
            server_url: 'http://shencedatareport.zhaoliangji.com/sa?project=production',
            //配置打通 App 与 H5 的参数
            use_app_track: true,
            heatmap: {
                //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
                //需要 JSSDK 版本号大于 1.7
                clickmap: 'not_collect',
                //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
                //需要 JSSDK 版本号大于 1.9.1
                scroll_notice_map: 'not_collect'
            }
        };

        // 数数科技配置
        this.thinkingOps = {
            appId: '29c58f5cfb524250badc849f4ebf1cf9', // 正式
            // appId: '564269de83c04d1c96be2b22579913ec', //测试
            name: 'ta', // 全局的调用变量名，可以任意设置，后续的调用使用该名称即可
            sdkUrl: 'https://panda.huodao.hk/admin/js/h5/thinkingdata.js', // 统计脚本URL
            serverUrl: 'http://datareport.zhaoliangji.com/sync_js', // 数据上传的URL
            send_method: 'image', // 数据上传方式
            useAppTrack: true, // 打通 APP 与 H5
            showLog: false
        };
    };

    /**
     * 初始化
     */
    BuryPoint.prototype.init = function (options) {
        if (options.type == 'all'){
            this.sensors(this.sensorsOps);
            this.thinking(this.thinkingOps);
        }else{
            var thisOps = options.type + 'Ops';
            if (this[thisOps]) this[options.type](thisOps);
        }
    };

    /**
     * 神策埋点
     * @param para
     * @returns {boolean}
     */
    BuryPoint.prototype.sensors = function (para) {
        var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
        if (typeof(w['sensorsDataAnalytic201505']) !== 'undefined') {
            return false;
        }
        w['sensorsDataAnalytic201505'] = n;
        w[n] = w[n] || function (a) {
            return function () {
                (w[n]._q = w[n]._q || []).push([a, arguments]);
            }
        };
        var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister'];
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
    };

    /**
     *  数数科技埋点
     * @param param
     */
    BuryPoint.prototype.thinking = function (param) {
        var p = param.sdkUrl,
            n = param.name,
            w = window,
            d = document,
            s = 'script',
            x = null,
            y = null
        w['ThinkingDataAnalyticalTool'] = n
        w[n] = w[n] || function (a) {
            return function () {
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
    };

    /**
     * 发送数据
     * @param params
     */
    BuryPoint.prototype.send = function (name, params) {

        var gid = _getQueryString('gid');
        if (gid) params.group_id = gid;
        params = _extend(params,this.defaultOptions.publicData);
        if (ta) ta.track(name, params);
        if (sensors) sensors.track(name, params);
    };

    /**
     * 获取单一实例
     * @returns {Function}
     */
    BuryPoint.getInstance = function (options) {
        if (!this.instance) this.instance = new BuryPoint(options);
        return this.instance;
    };

    /**
     * 获取地址参数
     * @param name
     * @returns {null}
     * @private
     */
    function _getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.slice(1).match(reg);
        return r != null ? unescape(r[2]) : null;
    }

    /**
     * 合并对象
     * @param to
     * @param from
     * @returns {*}
     */
    function _extend(to, from) {
        for (var key in from) {
            to[key] = from[key];
        }
        return to;
    }

    // 赋予全局变量
    window.buryPoint = BuryPoint.getInstance;

})()

