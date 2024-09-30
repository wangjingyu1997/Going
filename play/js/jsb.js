let jsBridge = (function () {

    // 注册事件监听
    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                callback(WebViewJavascriptBridge)
            }, false);
        }
    }

    function JSBridge() {
        // 在JS中注册默认的Handler
        connectWebViewJavascriptBridge(
            function (bridge) {
                //初始化
                bridge.init(function (message, responseCallback) {
                    var data = {
                        'Javascript Responds': 'HelloWorld'
                    };
                    responseCallback(data);
                });

                bridge.registerHandler("onShow", function (data, responseCallback) {
                    var onShowEvent = new Event('onShow', {
                        bubbles: true,
                        cancelable: true
                    });
                    document.dispatchEvent(onShowEvent);
                });

                bridge.registerHandler("onHide", function (data, responseCallback) {
                    var onHideEvent = new Event('onHide', {
                        bubbles: true,
                        cancelable: true
                    });
                    document.dispatchEvent(onHideEvent);
                });
            }
        )
    }
    //这里面写具体的jsBridge方法
    JSBridge.prototype = {
        //调用安卓定义的handler名字叫verifyFace（在我的项目中是安卓定义的打开人脸识别的方法）
        verifyFace: function (params, callback) {
            params = params ? params : {};
            window.WebViewJavascriptBridge.callHandler('verifyFace', params, function (data) {
                //这里回调将接受到的安卓返回的数据返回出去，这里是关键，当回调执行完后，后续如果安卓的active一直开启中继续进行人脸识别
                //会导致后续安卓返回的数据js不会再接收到，那怎么办呢？解决方法就在下面一个方法中
                callback(JSON.parse(data))
            });
        },
        //犹豫我们无法持续接收到安卓返回的数据，那么我么需要安卓自己告诉我们h5，他直接把数据返给我们
        //这里我们需要定义一个handler让安卓调我们。
        //接收持续人脸识别返回的数据
        connectAd: function (callback) {
            connectWebViewJavascriptBridge(function (bridge) {
                bridge.registerHandler("receiveVerify", function (data, responseCallback) {
                    callback(data)
                    // responseCallback(responseData);
                });
            })
        },
    }
    return new JSBridge();
})();