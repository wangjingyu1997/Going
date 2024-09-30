
const defaults = {
    timeout: 0,
    headers: {}
}
class InterceptorManager {
    constructor() {
        this.handlers = []
    }
    use(fulfilled, rejected) {
        this.handlers.push({
            fulfilled,
            rejected
        });
    }
}
class Axios {
    constructor(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        }
    }
    get(url, config) {
        return this({
            url,
            ...config
        })
    }
    post(url, data, config) {
        return this({
            method: "post",
            url,
            data,
            ...config
        })
    }
    request(configOrUrl = {}, config = {}) {
        // 判断configOrUrl是否为地址
        if (typeof configOrUrl === "string") {
            // 将地址作为配置对象中的url属性值
            config.url = configOrUrl;
        } else {
            // 将configOrUrl作为配置对象处理
            config = configOrUrl;
        }
        config = {
            ...this.defaults,
            ...config
        };
        config.method = (config.method || "get").toLowerCase();
        // 处理params
        if (config.params) {
            // {age:12,sex:"男”}=====>age=12&sex="男"
            config.url += "?" + Object.keys(config.params).map(key => key + "=" + config.params[key]).join("&");
        }
        // 当baseURL有值，且config.url不是一个完整地址
        if (config.baseURL && !config.url.startsWith("http://")) {
            config.url = config.baseURL + config.url;
        }
        const _dispatchRequest = function () {
            return new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                if (config.cancelToken) {
                    config.cancelToken.cancel.then(() => {
                        request.abort();
                    })
                }
                request.onabort = function () {
                    reject({
                        code: "ERR_CANCELED",
                        message: "canceled",
                        name: "CanceledError"
                    })
                }
                // 超时时间
                request.timeout = config.timeout;
                request.responseType = "json";
                request.open(config.method, config.url);
                // 设置请求头
                if (config.headers) {
                    for (let key in config.headers) {
                        request.setRequestHeader(key, config.headers[key])
                    }
                }
                // 设置请求体的条件：1-请求方式为POST,PUT,DELETE 2- 设置了data
                if (config.method === "post" && config.data) {
                    if (typeof config.data === "object") {
                        request.setRequestHeader("Content-Type", "application/json");
                        config.data = JSON.stringify(config.data);
                    } else request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                }
                request.send(config.data);

                request.onload = function () {
                    if (request.status >= 200 || request.status < 300) {
                        resolve({
                            config,
                            data: request.response,
                            headers: request.getAllResponseHeaders(),
                            request,
                            status: request.status,
                            statusText: request.statusText
                        })
                    } else {
                        reject({
                            code: "ERR_BAD_REQUEST",
                            config,
                            message: "Request failed with status code " + request.status,
                            name: "AxiosError",
                            request,
                            response: request.response
                        })
                    }

                }
                request.onerror = function (err) {
                    reject({
                        code: "ERR_NETWORK",
                        config,
                        message: "Network Error",
                        name: "AxiosError",
                        request
                    })
                }
                request.ontimeout = function () {
                    reject({
                        code: "ECONNABORTED",
                        config,
                        message: "timeout of " + config.timeout + "ms exceeded",
                        name: "AxiosError",
                        request
                    })
                }
            })
        }
        // 声明一个数组，数组的初始值为dispatchRequest函数
        const chain = [_dispatchRequest.bind(this), undefined];
        this.interceptors.request.handlers.forEach(item => {
            chain.unshift(item.fulfilled, item.rejected);
        })
        this.interceptors.response.handlers.forEach(item => {
            chain.push(item.fulfilled, item.rejected);
        });
        let promise = Promise.resolve(config);
        while (chain.length) {// 4
            promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
    }
}
function createInstance(defaultConfig) {
    // 实例化Axios类，得到的实例赋值给常量context
    const context = new Axios(defaultConfig);
    // 将Axios.prototype.request函数中的this绑定为context,赋值给常量instance
    const instance = Axios.prototype.request.bind(context);
    // 将context的实例属性复制到instance中。
    for (let key in context) {
        instance[key] = context[key];
    }
    // 将Axios.prototype复制到instance中
    Object.getOwnPropertyNames(Axios.prototype).forEach(key => {
        instance[key] = Axios.prototype[key];
    })
    return instance;
}

const axios = createInstance(defaults);
axios.CancelToken = function (cb) {
    this.cancel = new Promise(resolve => {
        cb(resolve);
    })
}
export default axios;
