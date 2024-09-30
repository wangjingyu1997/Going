//观察者模式
// class Subject {
//     constructor() {
//         this.observes = [];
//     }
//     add(observe) {
//         this.observes.push(observe)
//         return this;
//     }
//     notify(...args) {
//         this.observes.forEach(ob => ob.update(...args));
//         return this;
//     }
// }
// let id = 0;
// class Observer {
//     constructor(name) {
//         this.name = name || ++id;
//     }
//     update(...args) {
//         console.log(`${this.name} 收到了通知：${args}`);
//     }
// }
// const observe1 = new Observer('wjy')
// const s = new Subject();
// s.add(observe1)
// s.notify()



// 发布订阅模式
// class Emitter {
//     constructor() {
//         this.callbacks = {};
//     }
//     on(type, fn) {
//         if (!this.callbacks[type]) {
//             this.callbacks[type] = [];
//         }
//         this.callbacks[type].push(fn);
//         return this;
//     }
//     emit(type, ...args) {
//         if (!this.callbacks[type]) return;
//         this.callbacks[type].forEach(fn => fn(...args));
//         return this;
//     }
//     off(type, fn) {
//         if (!this.callbacks[type]) return;
//         const callbacks = this.callbacks[type];
//         const index = callbacks.indexOf(fn);
//         if (index !== -1) {
//             callbacks.splice(index, 1);
//         }
//         if (callbacks.length === 0) {
//             delete this.callbacks[fn]; // 如果没有订阅者，则删除事件  
//         }
//         return this;
//     }
//     once(type, fn) {
//         const wrapFn = (...args) => {
//             fn(...args);
//             this.off(type, wrapFn);
//         };
//         this.on(type, wrapFn);
//     }
// }
// const em = new Emitter();

// const fn1 = (a, b) => console.log('哈哈哈哈哈第一次', a, b);
// const fn2 = a => console.log('哈哈哈哈哈第二次', a);
// const fn3 = a => console.log('测试 once', a);
// em.once('aaa', fn3);
// em.emit('aaa', 1);
// em.emit('aaa', 2);

// class EventEmitter {
//     constructor() {
//         this.events = {};
//     }

//     // 订阅事件  
//     on(eventName, callback) {
//         if (!this.events[eventName]) {
//             this.events[eventName] = [];
//         }
//         this.events[eventName].push(callback);
//         return this; // 链式调用  
//     }

//     // 取消订阅事件  
//     off(eventName, callback) {
//         if (!this.events[eventName]) return;
//         const callbacks = this.events[eventName];
//         const index = callbacks.indexOf(callback);
//         if (index !== -1) {
//             callbacks.splice(index, 1);
//         }
//         if (callbacks.length === 0) {
//             delete this.events[eventName]; // 如果没有订阅者，则删除事件  
//         }
//         return this;
//     }

//     // 触发事件  
//     emit(eventName, ...args) {
//         if (this.events[eventName]) {
//             const callbacks = [...this.events[eventName]]; // 复制数组以避免在回调中修改事件数组  
//             callbacks.forEach(callback => {
//                 callback(...args);
//             });
//         }
//         return this;
//     }

//     // 订阅一次事件  
//     once(eventName, callback) {
//         const wrapper = (...args) => {
//             callback(...args);
//             this.off(eventName, wrapper);
//         };
//         this.on(eventName, wrapper);
//         return this;
//     }
// }

// // 使用示例  
// const eventEmitter = new EventEmitter();

// // 订阅一次事件  
// eventEmitter.once('greeting', (name) => {
//     console.log(`Hello, ${name}!`);
// });

// // 触发事件  
// eventEmitter.emit('message', 'Hello from EventEmitter');
// eventEmitter.emit('greeting', 'Alice'); // 这个只会触发一次  
// eventEmitter.emit('greeting', 'Bob'); // 这个不会触发，因为已经用once订阅过了  

// function promisify(fn) {
//     return function () {
//         return new Promise((resolve, reject) => {
//             fn(...arguments, (err, data) => {
//                 if (err) reject(err);
//                 resolve(data);
//             });
//         });
//     };
// }
// const p2 = new Promise((resolve, reject) => {
//     return new Promise((res, rej) => {
//         resolve(1)
//     })
// })
// p2.then((res) => {
//     console.log(res,111)
// }, (rej) => {
//     console.log(rej,222)
// })
// // console.log(p2)\
// const defaults = {
//     timeout: 1000
// }

