function runqueen(queen, iterator, cb) {
    function next(index) {
        if (index >= queen.length) {
            return cb()
        }
        const hook = queen[index]
        iterator(hook, () => next(index + 1)
        )

    }

    next(0)
}


const iterator = (hook, next) => {
    hook(next)
}
class Croe {
    constructor() {
        this.beforeEachs = []
    }
    excute() {
        const queen = this.beforeEachs
        runqueen(queen, iterator, () => {   
            console.log('完成了跳转', queen)
        })

    }
    beforeEach(fn) {
        this.beforeEachs.push(fn) 
    }

}
const router = new Croe()
router.beforeEach((next) => {
    setTimeout(() => {
        console.log('我进入了11111')
        next()
    }, 1000);
})
router.beforeEach((next) => {
    setTimeout(() => {
        console.log('我进入了2222')
        next()
    }, 2000);
})
router.beforeEach((next) => {
    setTimeout(() => {
        console.log('我进入了33333')
        next()
    }, 2000);
})
router.excute()