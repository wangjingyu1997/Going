function CancelToken(executor) {
    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
    });

    var token = this;
    executor((message) => {
        if (token.reason) {
            return;
        }
        console.log('cancel了')
        token.reason = (message + '!!!!!!!');
        resolvePromise(token.reason);
    });
}

CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
        cancel = c;
    });
    return {
        token: token,
        cancel: cancel
    };
};
const source = CancelToken.source()
source.cancel('11111')