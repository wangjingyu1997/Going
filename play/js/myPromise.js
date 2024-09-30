
const PENDING = 'pending';
const RESOLVED = 'resolve';
const REJECTED = 'reject';

function Promise(execute) {
    this.status = PENDING
    this.value = null
    this.reason = null
    this.onFullfillCallback = []
    this.onRejectCallback = []
    const resolve = (value) => {
        if (this.status = PENDING) {
            this.value = value
            this.status = RESOLVED
            if (value instanceof Promise) {
                value.then(value)
            }
            this.onFullfillCallback.forEach((cb) => cb && cb())
        }
    }
    const reject = (reason) => {
        if (this.status = PENDING) {
            this.reason = reason
            this.status = REJECTED
            this.onRejectCallback.forEach((cb) => cb && cb())
        }
    }
    execute(resolve, reject)
}
function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) return reject(new TypeError('循环引用了'));
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            const then = x.then
            if (typeof then === 'function') {
                then.call(x, res => {
                    resolvePromise(promise2, res, resolve, reject)
                }, rej => {
                    reject(rej)
                })
            } else {
                resolve(x)
            }
        } catch (error) {
            reject(error)
        }
    } else {
        resolve(x)
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
    const self = this
    // 如果没有传递成功的值，那么我们给自动传递过去，这个叫做值得穿透，保证可以在后面捕获到异常
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    // 如果错误没有传递，那我们手动传递过去
    onRejected = typeof onRejected === 'function' ? onRejected : function () { throw err };
    const _promise = new Promise((resolve, reject) => {
        if (self.status === RESOLVED) {
            setTimeout(() => {
                try {
                    const x = onFulfilled(self.value)
                    resolvePromise(_promise, x, resolve, reject)
                } catch (error) {
                    reject(error)
                }
            });
        }
        if (self.status === REJECTED) {
            setTimeout(() => {
                try {
                    const x = onRejected(self.reason);
                    resolvePromise(_promise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        }
        if (self.status === PENDING) {
            this.onFullfillCallback.push(function () {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(self.value);
                        resolvePromise(_promise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            this.onRejectCallback.push(function () {
                setTimeout(() => {
                    try {
                        const x = onRejected(self.reason);
                        resolvePromise(_promise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
    })

    return _promise
}
Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        resolve(value);
    });
};
Promise.all = function (prs) {
    let counter = 0,
        result = [];
    return new Promise((resolve, reject) => {
        const process = (idx, value) => {
            result[idx] = val;
            if (prs.length === ++counter) {
                resolve(result)
            }
        }
        const then = p.then
        prs.forEach((p, i) => {
            if (then && typeof then === 'function') {
                then.call(p, y => {
                    process(i, y)
                }, reject
                )
            } else {
                process(i, p)
            }
        })
    });
};
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        let called = false;
        promises.forEach(promise => {
            promise.then(
                value => {
                    // 如果还没有调用过 resolve 或 reject，则调用 resolve  
                    if (!called) {
                        called = true;
                        resolve(value);
                    }
                },
                reason => {
                    // 如果还没有调用过 resolve 或 reject，则调用 reject  
                    if (!called) {
                        called = true;
                        reject(reason);
                    }
                }
            );
        });
    });
};
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('愚222');
    }, 2000);
});
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('愚111');
    }, 2000);
});
const pa = [p, p1]
Promise.race(pa).then((res) => {
    console.log(res)
})
// p.then(
//     data => {
//         console.log(data)
//     },
//     err => console.log(err, '出错了')
// );
// const p2 = p.then(data => {
//     // 可能有人会这么做
//     return new Promise((resolve, reject) => {
//         setTimeout(function () {
//             resolve(
//                 new Promise((resolve, reject) => {
//                     setTimeout(function () {
//                         resolve(
//                             new Promise((resolve, reject) => {
//                                 resolve(3000);
//                             })
//                         );
//                     }, 1000);
//                 })
//             );
//         }, 1000);
//     });
// });

// p2.then(
//     data => {
//         console.log(data, '???');
//     },
//     err => {
//         console.log(err, '失败？？？');
//     }
// );