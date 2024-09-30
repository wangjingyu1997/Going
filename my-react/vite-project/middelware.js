function applyMiddlerware(...middlerWares) {
    return function (createStore) {
        return function (reducer) {
            let soter = createStore(reducer)
            let dispatch
            let middlerWareAPI = {
                getState: store.getState,
                dispatch
            }
            const chain = middlerWares.map((middlerWare) => middlerWare(middlerWareAPI))
            const [promise, thunk, logger] = chain
            // dispatch = promise(thunk(logger(store.dispatch)))
            dispatch = compose(promise, thunk, logger)(store.dispatch)

            return {
                ...store,
                dispatch
            }
        } 
    }
}
function compose(...fns) { 
    return function (args){
        return fns.reduce((prev,cur)=>{
            return cur(prev)
        }, args)
    }
}
function logger({ getState }) {
    return function (next) {
        return function (action) {
            console.log(getState, 'next----logger')
            next(action)
        }
    }
}
function thunk({ getState }) {
    return function (next) {
        return function (action) {
            console.log(getState, 'next----thunk')
            next(action)
        }
    }
}
function promise({ getState }) {
    return function (next) {
        return function (action) {
            console.log(getState, 'next----promise')
            next(action)
        }
    }
}
function createStore() {
    console.log('createStore')
    return store
}
var store = {
    dispatch() {
        console.log('原始dispatch')
    },
    getState() {
        return 1
    }
}
var rootReducer = 'rootReducer'

store = applyMiddlerware(promise, thunk, logger)(createStore)(rootReducer)
store.dispatch()
