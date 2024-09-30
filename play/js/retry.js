const delay = delayInMs => new Promise(res => setTimeout(res, delayInMs));
const takeAttempt = (fn, params, count, delayInMs) =>
    Promise.resolve(params).then(fn).catch(err => {
        if (count > 0) {
            return delay(delayInMs).then((res) => {
                takeAttempt(fn, params, count - 1, delayInMs)
            })
        } else {
            return Promise.reject('重试已达上限')
        }
    })

const retry = ({ attempt = 3, interval = 1000 } = {}) => fn => params => takeAttempt(fn, params, attempt - 1, interval)
const fetch = () => {
    if (Math.random() > 0.5) {
        console.log('错误了')
        return Promise.reject(1)

    }
    console.log('成功了')
    return Promise.resolve(1)
}
const retryFetch = retry()(fetch)
retryFetch(111)


export default retry