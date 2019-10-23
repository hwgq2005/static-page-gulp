
;(function () {
    // 测试环境
    // var actHost = 'http://testact.zhaoliangji.com';
    // var proHost = 'http://testproduct.zhaoliangji.com';
    // var phost = 'http://testpanda.huodao.hk';
    // var staticHost = 'http://testfrontstatic.zhaoliangji.com';

    // 预发布环境
    // var actHost = 'https://preact.zhaoliangji.com';
    // var proHost = 'https://preproduct.zhaoliangji.com';
    // var phost = 'https://prepanda.huodao.hk';
    // var staticHost = 'https://prefrontstatic.zhaoliangji.com';

    // 正式环境
    var actHost = 'https://act.zhaoliangji.com';
    var proHost = 'https://product.zhaoliangji.com';
    var phost = 'https://panda.huodao.hk';
    var staticHost = 'https://frontstatic.zhaoliangji.com';
    var timer, timer1;

    // 价格是否错误
    var priceError = false;

    var selectParams = {
        propKeyword: {}
    };
    var shaixuanLabelTemp = {};

    new Vue({
        el: '#app',
        data: {

            // 屏幕高度
            screenHeight: 0,

            // 是否显示页面
            isShowPage:false,

            floatData: [],
            floatTime: '',
            floatStatus: false,
            floatIndex: 0,

            // 仅剩
            total: 0,
            // 时间倒计时
            countTimedate: {
                d: 0,
                h: 0,
                m: 0,
                s: 0,
                ms: 9
            },

            // 是否结束
            deadline: false,

            // 是否展示优惠券
            isShowConpon: false,

            // 是否领取优惠券
            isReceiveRedStatus: false,

            // 分期乐相关数据
            fqlData: '',

            // 查询
            listQuery: {

                // 分页
                page: 1,

                // 筛选属性
                prop_str: '',

                // 价格排序
                price_sort: 0,

                // 价格范围
                price_range: '',

                // 是否在售
                only_onsale: 0,

                // 分类数据
                tag_id: 0
            },

            // 详情数据
            detailData: '',

            // 是否打开筛选
            searchBox: false,

            // 商品相关数据
            isLoad: false,
            productData: [],
            sortData: {},
            sortItem: {
                index: 0,
                name: '全部'
            },
            isFull: false,

            // tab高度
            tabHeight: 0,
            // 是否固定
            isFixed: false,

            // 是否隐藏回到顶部icon
            isHideTop: true,

            // 地址参数
            activityId: '',
            sk: '',
            gid: '',

            // 价格区间
            price: '',
            priceTemp: '',
            priceList: [],
            priceListStatus: {},
            priceSelectVal: '',
            priceSelectIndex: '',
            firstPrice: '', //最低价格
            lastPrice: '', //最高价格

            // 筛选数据
            selectData: {},
            shaixuanLabel: {},
            shaixuanLabelLength: 0,
            totalNum: 0,

            // 选中标签
            selectedLabel: {},
            selectedLabelTemp: {},
            selectedLabelLength: 0,

            // 属性id对接参数名称
            propKey: {
                8: 'network',
                9: 'version',
                10: 'color',
                11: 'memrory',
                12: 'percentage',
                14: 'ppi',
                16: 'SIM',
                23: 'system_version'
            }

        },

        watch: {
            firstPrice(val) {
                this.priceSelectIndex = '';
                this.bindPrice();
            },
            lastPrice(val) {
                this.priceSelectIndex = '';
                this.bindPrice();
            }
        },
        created() {
            var vm = this;
            this.activityId = this.getQueryString('activity_id');
            this.sk = this.getQueryString('sk');
            this.gid = this.getQueryString('gid');

            this.getPriceList();
            this.getSelectData();

            if (this.isAPP()) {
                this.appMethods();
            } else {
                this.getDetailData();
            }
            zlj.on('onPageShow',function(){
                vm.enterEvent();
            });

            this.screenHeight = window.screen.height;
        },
        mounted() {

            clearTimeout(timer);
            clearTimeout(timer1);
            this.tabControlHandle();
            this.getProductData();
            zlj.switchRefresh(false);
        },

        methods: {

            // 进入事件
            enterEvent(){

                //进入页面时触发
                if (window.__wxjs_environment === 'miniprogram') {
                    this.eventPoint('enter_h5_act_page', {
                        page_id: 10049,
                        activity_id: this.activityId ,
                        activity_name: document.title,
                        channel_id: 2
                    })
                }else{

                    this.shencePoint('enter_activity_page', {
                        activity_id: this.activityId ,
                        activity_name: document.title,
                        event_type:'pageview'
                    });

                    this.eventPoint('enter_h5_act_page', {
                        page_id: 10049,
                        activity_id: this.activityId,
                        activity_name: document.title,
                        channel_id: 1
                    });
                }
            },

            // 获取tab高度
            getTabHeight() {
                var tabWrapper = document.getElementById('tab-box');
                this.tabHeight = tabWrapper.offsetHeight;
            },

            //app交互方法
            appMethods() {
                var vm = this;
                // 登录
                window.goLoginMsg = function (obj) {
                    if (typeof obj == 'string') {
                        // 安卓
                        window.userData = JSON.parse(obj);
                    } else {
                        // IOS
                        window.userData = obj;
                    }
                    vm.getDetailData();
                };
                // 注册
                window.goLoginOutMsg = (msg) => {
                    vm.getDetailData();
                };

                // 返回页面
                window.onPageShow = function(){
                }
            },

            // 判断是否在app
            isAPP() {
                let status = false;
                // 调用app方法
                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.goLogin) {
                    // IOS
                    status = true;
                } else if (window.control && window.control.goLogin) {
                    // 安卓
                    status = true;
                }
                return status;
            },


            // 获取浮动数据
            getFloatData() {
                var vm = this;
                var urlParams = {};
                if (vm.floatTime) {
                    urlParams.current_time = vm.floatTime;
                }

                axios.get(phost + '/api/account/shaidan/get_float_data', {params: urlParams}).then(function (res) {
                    var data = res.data;
                    if (data.code == 1) {
                        if (data.data.length == 0) return;
                        vm.floatStatus = true;
                        vm.floatData = data.data[vm.floatIndex];

                        var t = setInterval(function () {
                            vm.floatIndex++;
                            if (vm.floatIndex <= data.data.length) {
                                vm.floatData = data.data[vm.floatIndex];
                                vm.floatStatus = true;
                                setTimeout(function () {
                                    vm.floatStatus = false;
                                }, 1500)
                            } else {
                                vm.floatIndex = 0;
                                vm.floatTime = data.data[vm.floatIndex].buy_time;
                                vm.getFloatData();
                                clearInterval(t);
                            }
                        }, 1000 * 60)

                        setTimeout(function () {
                            vm.floatStatus = false;
                        }, 1500)

                    }
                })


            },

            // 获取详情数据
            getDetailData() {
                var vm = this;
                axios.get(actHost + '/api/theme/activity_detail?activity_id=' + vm.activityId).then(function (res) {
                    var data = res.data;
                    if (data.code === '1') {
                        vm.detailData = data.data;
                        vm.countTime(vm.detailData.end_time);
                        // vm.countTime(1568284275);
                        vm.countTimeMs();
                        document.title = data.data.activity_title;
                        zlj.changeTitle(data.data.activity_title);
                        // 判断是否有优惠券
                        if (vm.detailData.coupon_info) {
                            if (window.userData) {
                                vm.isReceiveConpon(vm.detailData.coupon_info.bonus_code);
                            } else {
                                vm.isShowConpon = true;
                                vm.isReceiveRedStatus = false;
                            }
                        }
                        vm.getFloatData();
                        vm.enterEvent();

                        // 判断是否有分期乐
                        if (vm.detailData.show_fenqi == 1) {
                            vm.getFQLData();
                        }
                        vm.$nextTick(function () {
                            vm.isShowPage = true;
                        });

                    }
                })
            },

            // 判断优惠券是否领取过
            isReceiveConpon(code) {
                var vm = this;
                var params = {};
                params.token = window.userData.token;
                params.bonus_code = code;
                axios.post(actHost + '/api/bonus/check_user_bonus_status', params).then(function (res) {
                    var data = res.data;
                    if (data.code === '1') {
                        if (data.data.status == 1) {
                            vm.isReceiveRedStatus = true;
                        } else {
                            vm.isReceiveRedStatus = false;
                        }
                    }
                    vm.isShowConpon = true;
                });
            },

            // 领取优惠券
            receiveCoupon() {
                var vm = this;
                if (vm.isReceiveRedStatus) return;
                if (window.userData && window.userData.token) {
                    var params = {};
                    params.token = window.userData.token;
                    params.bonus_code = vm.detailData.coupon_info.bonus_code;
                    params.activity_id = vm.activityId;
                    axios.post(actHost + '/api/bonus/draw_bonus', params).then(function (res) {
                        var data = res.data;
                        if (data.code === '1') {
                            Modal({
                                title: '提示',
                                content: data.msg,
                                cancelButton: false,
                                confirmText: '知道了'
                            });
                            vm.isReceiveRedStatus = true;

                            //领取成功页面
                            vm.eventPoint('get_coupon', {
                                page_id: 10049,
                                activity_id: vm.activityId,
                                activity_name: document.title,
                                coupon_id: vm.detailData.coupon_info.bonus_id,
                                coupon_name: vm.detailData.coupon_info.bonus_name,
                                coupon_cost: vm.detailData.coupon_info.bonus_amount,
                                event_type: 'click'
                            })

                        } else if (data.code == -5) {
                            Modal({
                                title: '提示',
                                content: data.msg,
                                cancelButton: false,
                                confirmText: '知道了'
                            });
                            vm.isReceiveRedStatus = false;
                        }else{
                            Modal({
                                title: '提示',
                                content: data.msg,
                                cancelButton: false,
                                confirmText: '知道了'
                            });
                        }
                    });
                } else {
                    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.goLogin) {
                        window.webkit.messageHandlers.goLogin.postMessage({});
                    } else if (window.control && window.control.goLogin) {
                        window.control.goLogin();
                    } else {
                        Modal({
                            title: '提示',
                            content: '请下载找靓机App',
                            cancelButton: false,
                            confirmText: '知道了'
                        });
                    }
                }
            },

            // 获取分期乐数据
            getFQLData() {
                var vm = this;
                axios.get(actHost + '/api/fenqi/get_fenqile_quota').then(function (res) {
                    var data = res.data;
                    if (data.code === '1') {
                        vm.fqlData = data.data;
                    }
                })
            },

            // 获取调起分期乐SDK参数接口
            getFQLAttach() {
                if (window.userData && window.userData.token) {
                    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getFQLQuota) {
                        this.gotoFql();
                    } else if (window.control && window.control.getFQLQuota) {
                        this.gotoFql();
                    } else {
                        Modal({
                            title: '提示',
                            content: '请下载找靓机app',
                            cancelButton: false,
                            confirmText: '知道了'
                        });
                    }
                } else {
                    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.goLogin) {
                        window.webkit.messageHandlers.goLogin.postMessage({});
                    } else if (window.control && window.control.goLogin) {
                        window.control.goLogin();
                    } else {
                        Modal({
                            title: '提示',
                            content: '请下载找靓机app',
                            cancelButton: false,
                            confirmText: '知道了'
                        });
                    }
                }
            },

            // 进入分期乐页面
            gotoFql() {
                var params = {};
                params.token = window.userData.token;
                params.phone = window.userData.mobile;
                params.type = 1;
                axios.get(actHost + '/api/fenqi/get_fenqile_attach', {params: params}).then(function (res) {
                    var data = res.data;
                    if (data.code === '1') {
                        var attachData = data.data;
                        var obj = {
                            "agent": "1081565",
                            "redirectUri": attachData && attachData.redirect_uri ? attachData.redirect_uri : '',
                            "attach": attachData && attachData.attach ? JSON.stringify(attachData.attach) : ''
                        };
                        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getFQLQuota) {
                            window.webkit.messageHandlers.getFQLQuota.postMessage(obj);
                        } else if (window.control && window.control.getFQLQuota) {
                            window.control.getFQLQuota(JSON.stringify(obj));
                        }
                    } else {
                        Modal({
                            title: '提示',
                            content: data.msg,
                            cancelButton: false,
                            confirmText: '知道了'
                        });
                    }
                });
            },

            // 倒计时
            countTime(endTime) {
                var vm = this;
                var date = new Date();
                var now = date.getTime();
                // var endDate = new Date(vm.deadlineDate);//设置截止时间
                var end = endTime * 1000;
                var leftTime = end - now; //时间差
                var d, h, m, s;
                if (leftTime >= 0) {
                    d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                    h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                    m = Math.floor(leftTime / 1000 / 60 % 60);
                    s = Math.floor(leftTime / 1000 % 60);
                    if (s < 10) s = "0" + s;
                    if (m < 10) m = "0" + m;
                    if (h < 10) h = "0" + h;
                } else {
                    d = '0';
                    h = '00';
                    m = '00';
                    s = '00';
                    vm.countTimedate.ms = '0';
                    vm.deadline = true;
                    clearTimeout(timer);
                }
                vm.countTimedate.d = d;
                vm.countTimedate.h = h;
                vm.countTimedate.m = m;
                vm.countTimedate.s = s;
                if (!vm.deadline) {
                    timer = setTimeout(function () {
                        vm.countTime(endTime);
                    }, 1000);
                }

            },

            // 毫秒倒计时
            countTimeMs() {
                var vm = this;
                if (vm.deadline) {
                    clearTimeout(timer1);
                    return
                }
                vm.countTimedate.ms ? vm.countTimedate.ms-- : vm.countTimedate.ms = 9;
                timer1 = setTimeout(vm.countTimeMs, 100);
            },

            // 价格排序
            changePrice() {
                if (!this.listQuery.price_sort) {
                    this.listQuery.price_sort = 'asc'
                } else if (this.listQuery.price_sort === 'asc') {
                    this.listQuery.price_sort = 'desc'
                } else if (this.listQuery.price_sort === 'desc') {
                    this.listQuery.price_sort = ''
                }
                this.isFull = false;
                this.listQuery.page = 1;


                if (this.listQuery.price_sort) {

                    var obj = {
                        page_id: 10049,
                        operation_module: '价格',
                        filter_content: {},
                        event_type: 'click',
                        is_cancel: 1
                    };


                    if (this.listQuery.price_sort === 'asc') {
                        obj.filter_content.sort = '降序'
                    } else if (this.listQuery.price_sort === 'desc') {
                        obj.filter_content.sort = '升序'
                    }
                    obj.filter_content = JSON.stringify(obj.filter_content);
                    this.shencePoint('click_filter_goods', obj);
                    this.eventPoint('click_filter_goods', obj);
                }

                this.getProductData();
            },

            // 切换是否在售
            changeonlyOnsale() {

                this.isFull = false;
                this.listQuery.page = 1;
                this.listQuery.only_onsale == 0 ? this.listQuery.only_onsale = 1 : this.listQuery.only_onsale = 0;
                this.getProductData();

                var obj = {
                    page_id: 10049,
                    operation_module: '是否在售',
                    filter_content: {},
                    event_type: 'click'
                };
                if (this.listQuery.only_onsale === 0) {
                    obj.filter_content.is_sale = '不在售';
                    obj.is_cancel = 0;
                } else if (this.listQuery.only_onsale === 1) {
                    obj.filter_content.is_sale = '在售';
                    obj.is_cancel = 1;
                }
                obj.filter_content = JSON.stringify(obj.filter_content);
                this.shencePoint('click_filter_goods', obj);
                this.eventPoint('click_filter_goods', obj);
            },

            // 是否打开筛选
            openSearch() {
                this.searchBox = !this.searchBox;
                document.body.classList.add('overflow-hidden');
                // this.openBodyScroll();
            },

            // 隐藏筛选
            hideSelectBox() {
                this.searchBox = false;
                document.body.classList.remove('overflow-hidden');
                // this.closeBodyScroll()
                event.preventDefault();
                this.confirmSelect();
            },

            // 阻止事件
            stopModal() {
                event.stopPropagation();
                // event.preventDefault();
            },


            // 获取价格区间
            getPriceList() {
                var vm = this;
                axios.get(proHost + '/api/product/filter_price').then(function (res) {
                    var data = res.data;
                    if (data.code === '1') {
                        vm.priceList = data.data;
                    }
                });
            },

            // 选择价格区间
            priceSelect(e) {

                var vm = this,
                    _currentTarget = e.currentTarget,
                    val = _currentTarget.dataset.val,
                    index = _currentTarget.dataset.index;

                // 请求没完成的话阻止
                if (!vm.isLoad) return;

                if (index == vm.priceSelectIndex) {
                    vm.priceSelectIndex = '';
                } else {
                    vm.priceSelectIndex = index;
                }

                var price = '';
                if (vm.priceSelectIndex) {
                    // 选择价格区间
                    price = vm.priceList[vm.priceSelectIndex - 1];
                    vm.$set(vm.selectedLabelTemp, 'price', {
                        price: price
                    })

                } else {
                    delete vm.selectedLabelTemp['price'];
                    price = '';
                }

                priceError = false;

                // 对价格是否出现以上的文字做出来
                if (price && price.indexOf('-') == -1) {
                    vm.priceTemp = price.split('以')[0] + "-99999";
                } else {
                    vm.priceTemp = price;
                }
                vm.firstPrice = '';
                vm.lastPrice = '';
            },

            // 修改价格文本框
            bindPrice() {
                // 价格区间 start
                var vm = this;
                var price = '';
                if (vm.firstPrice || vm.lastPrice) {
                    // 输入价格区间
                    if (vm.firstPrice && vm.lastPrice) {
                        if (Number(vm.firstPrice) <= Number(vm.lastPrice)) {
                            price = vm.firstPrice + '-' + vm.lastPrice;
                        } else {
                            priceError = true;
                            return;
                        }
                    }
                    if (vm.firstPrice && !vm.lastPrice) {
                        price = vm.firstPrice + '以上';
                    }
                    if (!vm.firstPrice && vm.lastPrice) {
                        price = '0-' + vm.lastPrice;
                    }
                } else {
                    price = '';
                }
                priceError = false;

                // 对价格是否出现以上的文字做出来
                if (price && price.indexOf('-') == -1) {
                    vm.priceTemp = price.split('以')[0] + "-99999";
                } else {
                    vm.priceTemp = price;
                }


            },

            // 获取筛选数据
            getSelectData() {
                var vm = this;
                var urlParams = {};
                urlParams.type_id = vm.detailData.type_id;
                urlParams.brand_id = vm.detailData.brand_id;
                urlParams.model_id = vm.detailData.model_id;
                axios.get(proHost + '/api/product/filter_attr', {params: urlParams}).then(function (res) {
                    var data = res.data;
                    if (data.code === '1') {
                        vm.selectData = data.data.main;
                    }
                });

            },

            // 类型选择
            selectLabel(event) {
                var vm = this;
                var pnid = event.currentTarget.dataset.pnid;
                var pvid = event.currentTarget.dataset.pvid;
                var pindex = event.currentTarget.dataset.pindex;
                var index = event.currentTarget.dataset.index;
                var name = event.currentTarget.dataset.name;
                // 请求没完成的话阻止
                if (!vm.isLoad) return;
                var isactive = vm.selectData[pindex].filter_data[index].isactive;

                // 判断是否已选择
                if (isactive) {
                    delete selectParams.propKeyword[pvid];

                    //  start 选择标签值
                    var propArr = shaixuanLabelTemp[pnid];
                    for (var i = 0; i < propArr.length; i++) {
                        if (propArr[i] == name) {
                            shaixuanLabelTemp[pnid].splice(i, 1);
                            if (shaixuanLabelTemp[pnid].length == 0) {
                                delete shaixuanLabelTemp[pnid];
                            }
                        }
                    }
                    //  end 选择标签值

                    vm.$set(vm.selectData[pindex].filter_data[index], 'isactive', false);
                } else {
                    selectParams.propKeyword[pvid] = pnid + ':' + pvid;
                    vm.$set(vm.selectData[pindex].filter_data[index], 'isactive', true);

                    if (!shaixuanLabelTemp[pnid]) shaixuanLabelTemp[pnid] = [];
                    shaixuanLabelTemp[pnid].push(name);
                }

            },

            // 确定选择属性
            confirmSelect() {
                var vm = this;

                // 价格区间判断
                if (priceError) {
                    Modal({
                        title: '请输入正确的价格区间',
                        content: data.msg,
                        cancelButton: false,
                        confirmText: '知道了'
                    });
                    return;
                }

                // 筛选属性拼接
                var propArr = [];
                for (var key in selectParams.propKeyword) {
                    propArr.push(selectParams.propKeyword[key]);
                }
                if (vm.detailData.model_id && propArr.length > 0) {
                    propArr.unshift('5:' + vm.detailData.model_id);
                }
                vm.searchBox = false;
                vm.$set(vm.listQuery, 'prop_str', propArr.join(';'));
                vm.$set(vm.listQuery, 'page', 1);
                vm.$set(vm.listQuery, 'price_range', vm.priceTemp);
                vm.shaixuanLabelLength = Object.keys(shaixuanLabelTemp).length;
                vm.getProductData();

                var obj = {
                    page_id: 10049,
                    operation_module: '筛选',
                    filter_content: {},
                    // is_cancel: 1,
                    event_type: 'click'
                };
                for (var key in shaixuanLabelTemp) {
                    if (this.propKey[key]) {
                        obj.filter_content[this.propKey[key]] = shaixuanLabelTemp[key];
                    }
                }
                obj.filter_content.price = vm.priceTemp;
                obj.filter_content = JSON.stringify(obj.filter_content);
                vm.price = vm.priceTemp;
                this.shencePoint('click_filter_goods', obj);
                this.eventPoint('click_filter_goods', obj);
                document.body.classList.remove('overflow-hidden');
                // this.closeBodyScroll()
            },

            // 重置
            cancelSelect(event) {

                var vm = this;
                var type;
                if (event) {
                    type = event.currentTarget.dataset.type;
                }
                if (vm.selectData.length > 0) {
                    vm.selectData.map(function (item, pindex) {
                        item.filter_data.map(function (label, num) {
                            vm.$set(vm.selectData[pindex].filter_data[num], 'isactive', false);
                        })
                    });
                }
                selectParams.propKeyword = {};

                shaixuanLabelTemp = {};
                vm.shaixuanLabelLength = 0;

                // 重置价格区间
                vm.priceSelectIndex = '';
                vm.firstPrice = '';
                vm.lastPrice = '';
                vm.priceTemp = '';
                vm.price = '';
                vm.$set(vm.listQuery, 'page', 1);
                vm.$set(vm.listQuery, 'prop_str', '');
                vm.$set(vm.listQuery, 'price_range', '');
                vm.getProductData();
            },

            // 切换标签
            changeSort(data) {
                this.sortItem = data;
                this.isFull = false;
                this.$set(this.listQuery, 'page', 1);
                this.$set(this.listQuery, 'tag_id', data.id);

                // 滑动位置
                var leftElement = document.getElementById('tag-' + (data.index - 1));
                var left = 0;
                if (leftElement) left = leftElement.offsetLeft;
                document.getElementById('act-classification').scrollLeft = left ;
                this.getProductData();
            },

            // 获取商品列表
            getProductData() {
                var vm = this;
                var params = Object.assign({}, vm.listQuery);
                params.activity_id = vm.activityId;
                vm.isLoad = false;
                axios.get(proHost + '/api/activity/activity_detail_product_list', {params: params}).then(function (res) {
                    var data = res.data;

                    if (data.code === '1') {
                        if (params.page == 1) {
                            // 新增默认标签
                            vm.total = data.data.onsale_count;
                            vm.sortData = data.data.tag_list;
                            vm.sortData[0] = '全部';
                            vm.productData = data.data.product_list;
                            vm.$nextTick(function () {
                                vm.getTabHeight();
                            });

                        } else {
                            vm.productData.push.apply(vm.productData, data.data.product_list);
                        }

                        // 判断是否加载完成
                        if (data.data.has_next_page == 0) {
                            vm.isFull = true;
                        }
                        vm.isLoad = true;
                    }

                })
            },


            // 跳转详情
            goToDetail(item, index) {
                if (item.product_status != 1) return;
                var obj = {
                    pid: item.product_id,
                    pic: item.main_pic,
                    sk: '7-' + this.activityId
                };
                if (this.sk) obj.sk = this.sk;

                var eventObj = {
                    page_id: 10049,
                    channel_id: 1,
                    event_type: 'click',
                    activity_id: this.activityId,
                    activity_name: document.title,
                    goods_id: item.product_id,
                    goods_name: item.product_name,
                    goods_devices_id: item.imei,
                    goods_price: item.price,
                    goods_origin_price: item.ori_price,
                    is_promotion: false,
                    click_title: this.sortItem.index + 1 + '~' + this.sortItem.name,
                    click_index: Number(index) + 1
                };

                var scobj = {
                    event_type: 'click',
                    activity_id: this.activityId ,
                    activity_name: document.title,
                    goods_id: item.product_id,
                    goods_name: item.product_name,
                    is_promotion: false,
                    operation_index: Number(index) + 1,
                    business_type:5
                };

                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.gotoPage) {
                    this.eventPoint('click_enter_goods_details', eventObj);
                    this.shencePoint('click_enter_goods_details', scobj);
                    window.webkit.messageHandlers.gotoPage.postMessage(obj);
                } else if (window.control && window.control.gotoPage) {
                    this.eventPoint('click_enter_goods_details', eventObj);
                    this.shencePoint('click_enter_goods_details', scobj);
                    window.control.gotoPage(JSON.stringify(obj));
                } else if (window.__wxjs_environment === 'miniprogram') {
                    wx.miniProgram.navigateTo({url: '../commodity-detail/commodity-detail?productId=' + obj.pid + '&sk=' + obj.sk});
                } else {
                    Modal({
                        title: '提示',
                        content: '请下载找靓机app',
                        cancelButton: false,
                        confirmText: '知道了'
                    });
                }
            },

            // 跳转推荐活动
            gotoAct(item, index) {
                var obj = {
                    page_id: 10049,
                    theme__id: item.id,
                    theme__name: item.name,
                    activity_id: this.activityId,
                    operation_index: index + 1,
                    event_type: 'click'
                };
                this.eventPoint('click_activity_subject_recommend', obj);
                var url = staticHost + '/shop/act/activity/activity.html?activity_id=' + item.id;
                window.location.href = 'zljgo://native_api?type=1&content=' + encodeURIComponent(url);
                // var host = window.location.host;
                // window.location.href = host + '/shop/act/active.html?activity_id=' + item.id;
            },

            // 跳转到配件
            gotoPart(item, index) {

                var obj = {
                    type: 2,
                    pid: item.product_id,
                    pic: item.main_pic
                };
                var newObj = {
                    page_id: 10049,
                    pat_sku_id: item.product_id,
                    operation_index: index + 1,
                    pat_sku_name: item.product_name,
                    event_type: 'click'
                };

                var scObj = {
                    activity_id: this.activity_id,
                    activity_name: document.title,
                    goods_id:item.product_id,
                    goods_name:item.product_name,
                    is_promotion:0,
                    business_type:'1',
                    event_type:'click'
                };
                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.gotoPage) {
                    this.shencePoint('click_enter_goods_details', scObj);
                    this.eventPoint('click_activity_accessories', newObj);
                    window.webkit.messageHandlers.gotoPage.postMessage(obj);
                } else if (window.control && window.control.gotoPage) {
                    this.shencePoint('click_enter_goods_details', scObj);
                    this.eventPoint('click_activity_accessories', newObj);
                    window.control.gotoPage(JSON.stringify(obj));
                } else {
                    Modal({
                        title: '提示',
                        content: '请下载找靓机app',
                        cancelButton: false,
                        confirmText: '知道了'
                    });
                }

            },

            // 跳转到配件列表
            gotoPartList(){

                var obj = {
                    activity_id: this.activity_id,
                    activity_name: document.title,
                    operation_module:'查看更多',
                    operation_area:'10049.1',
                    event_type:'click'
                };
                this.shencePoint('click_app', obj);
                window.location.href = 'zljgo://native_api?type=14&content=' + encodeURIComponent('{"categoryId":"19"}');
            },

            // 加载更多
            loadMore() {
                var obj = {
                    page_id: 10049,
                    activity_id: this.activityId,
                    activity_name: document.title,
                    event_type: 'click'
                };

                this.eventPoint('click_activity_show_more', obj);
                this.listQuery.page = this.listQuery.page + 1;
                this.getProductData();
            },

            // 导航定位控制
            tabControlHandle() {
                var vm = this;
                window.onscroll = function () { //为了保证兼容性，这里取两个值，哪个有值取哪一个　　
                    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    var tabWrapper = document.getElementById('tab-wrapper');

                    // 判断滚动条位置是否大于内容位置
                    if (scrollTop >= tabWrapper.offsetTop + 94 * 2) {
                        vm.isFixed = true;
                    } else {
                        vm.isFixed = false;
                    }

                    // 是否隐藏回到顶部
                    if (scrollTop > 200) {
                        vm.isHideTop = false;
                    } else {
                        vm.isHideTop = true;
                    }
                };
            },

            //跳转客服
            openCustomerService() {

                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.goContactIM) {
                    window.webkit.messageHandlers.goContactIM.postMessage({});
                } else if (window.control && window.control.goContactIM) {
                    window.control.goContactIM();
                } else {
                    window.open('https://zhaoliangji.qiyukf.com/client?k=2ccdb2756aad2cafdc96c1351b4e71ec&wp=1', 'service')
                }

                //进入客服
                this.eventPoint('click_online_customer_service', {
                    page_id: 10049,
                    activity_id: this.activityId,
                    activity_name: document.title,
                    event_type: 'click'
                });

                //进入客服
                this.shencePoint('click_online_customer_service', {
                    activity_id: this.activityId ,
                    activity_name: document.title,
                    event_type: 'click'
                })
            },

            // 回到顶部
            gotoTop() {
                window.scroll(0, 0);
            },

            // 获取参数
            getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.slice(1).match(reg);
                return r != null ? unescape(r[2]) : null;
            },

            //事件埋点
            eventPoint(name, params) {
                if (this.gid) params.group_id = this.gid;
                ta.track(name, params);
            },

            // 神策埋点
            shencePoint(name, params) {
                if (this.gid) params.group_id = [this.gid];

                console.log(sensors,'神策sdk');
                sensors.track(name, params);
            },

            // 禁止滚动
            openBodyScroll() {
                window.lockMaskScrollTop = document.scrollingElement.scrollTop || document.body.scrollTop;
                document.body.classList.add('overflow-hidden');
                document.body.style.top = -window.lockMaskScrollTop + "px";
            },

            // 取消滚动
            closeBodyScroll() {
                if (document.body.classList.contains('overflow-hidden')) {
                    document.body.classList.remove('overflow-hidden');
                    document.scrollingElement.scrollTop = window.lockMaskScrollTop;
                }
            }


        }
    });
})();

