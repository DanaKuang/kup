const textMustacheReg = /\{\{([^\}]+)\}\}/g

let compileUtil = {
    getVal (vm, expr) {
        expr = expr.split('.');
        return expr.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    },
    getTextVal (vm, expr) {
        if (!textMustacheReg.test(expr)) return
        return expr.replace(textMustacheReg, (...arguments) => {
            return this.getVal(vm, arguments[1])
        })
    },
    watchElement (node, vm, expr) {
        let updateFn = this.updater['elementUpdate'];
        updateFn && updateFn(node, this.getVal(vm, expr))
        new Watcher(vm, expr, () => {
            updateFn && updateFn(node, this.getVal(vm, expr)) 
        })
    },
    watchText (node, vm, expr) {
        let updateFn = this.updater['textUpdate'];
        updateFn && updateFn(node, this.getTextVal(vm,expr))
        expr.replace(textMustacheReg, (...arguments) => {
            new Watcher(vm, arguments[1], () => {
                updateFn && updateFn(node, this.getTextVal(vm, expr))
            })
        })
    },
    updater: {
        elementUpdate(node, value) {
            node.value = value
        },
        textUpdate(node, value) {
            node.textContent = value;
        }
    }
}

class Dep {
    constructor () {
        this.subs = []
    }
    addSub (watcher) {
        this.subs.push(watcher)
    }
    notify () {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}













// const reg = /\{\{([^\}]+)\}\}/g;

// compileUtil = {
//     getVal (expr, vm) { // 拿具体的expr a.b.c，获取实例上对应的数据
//         expr = expr.split('.');
//         return expr.reduce((prev, next) => {
//             return prev[next]
//         }, vm.$data)
//     },
//     watchModel (node, expr, vm) {
//         let updateFn = this.updater['modelUpdater'];
//         updateFn && updateFn(node, this.getVal(expr, vm));
//         new Watcher(vm, expr, (newValue) => {
//             updateFn && updateFn(node, this.getVal(expr, vm))
//         })
//     },
//     getTextVal (expr, vm) {
//         return expr.replace(reg, (...arguments) => {
//             return this.getVal(arguments[1], vm)
//         })
//     },
//     watchText (node, expr, vm, value) {
//         let updateFn = this.updater['textUpdater'];
//         updateFn && updateFn(node, value);
//         expr.replace(reg, (...arguments) => {
//             new Watcher(vm, arguments[1], (newValue) => {
//                 updateFn && updateFn(node, this.getTextVal(expr, vm)) 
//             })
//         })
//     },
//     updater: {
//         textUpdater (node, value) {
//             node.textContent = value;
//         },
//         modelUpdater (node, value) {
//             node.value = value;
//         }
//     }
// }

// // 发布-订阅，就是一中介
// class Dep {
//     constructor () {
//         // 订阅的数组
//         this.subs = []
//     }
//     addSub (watcher) {
//         this.subs.push(watcher)
//     }
//     notify () {
//         this.subs.forEach(watcher => {
//             watcher.update()
//         })
//     }
// }