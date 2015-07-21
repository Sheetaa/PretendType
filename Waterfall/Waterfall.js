/**
 * @file Waterfall瀑布流组件
 * @author Yao Chang(yaochang@baidu.com)
 * @date 2015-7-21
 */

define(function (require) {
    var $ = require('./zepto');
    var utils = require('./utils');

    // 用户可配置参数
    var defaultOptions = {
        prefix: 'waterfall',
        colNum: 3,
        gutterWidth: 10,
        gutterHeight: 10,
        resizable: false,
        // 节流阀间隔时间
        interval: 500,
        // 即将绑定在scroll事件上的回调函数列表
        callbackList: [loadMore],
        // 异步请求相关参数
        ajaxConf: {
            method: 'POST',
            url: '',
            // 一次加载多少张卡片
            limit: 30
        }
    };
    // 计算相关参数
    var isLoading = false;
    var isRendering = false;
    var page = 1;
    var colHeight = [];

    /**
     * 加载更多
     *
     * @param {number} num 加载卡片的个数
     */
    function loadMore(num) {
        if (caniload() && !isLoading) {
            isLoading = true;
            var ajaxConf = this.options.ajaxConf;
            num = num || ajaxConf.limit;
            $.ajax({
                type: ajaxConf.method,
                url: ajaxConf.url,
                data: {
                    page: page,
                    limit: num
                },
                dataType: 'json'
            }).done(function (data) {
                page++;
                dispatchCards(data.dataset);
            }).always(function () {
                isLoading = false;
            });
        }
    }

    function caniload() {

    }

    function init(options) {

        // 初始化配置
        this.options = utils.extend(defaultOptions, options);
        console.log(this.options);

        // 初始化各列高度
        for (var i = 0, len = this.options.colNum; i < len; i++) {
            colHeight[i] = 0;
        }

        // 处理window scroll事件
        var throttled = utils.throttle(this.options.callbackList, this.options.interval);
        $(window).on('scroll', throttled);

        // 加载首屏瀑布流内容
        loadMore();
    }

    return {
        init: init
    };
});
