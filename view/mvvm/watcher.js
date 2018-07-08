class Watcher {
    constructor (vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldVal = this.getOldVal()
    }
    getOldVal () {
        Dep.target = this;
        let oldVal = compileUtil.getVal(this.vm, this.expr);
        Dep.target = null;
        return oldVal
    }
    update () {
        let newVal = compileUtil.getVal(this.vm, this.expr);
        // callback，就是去执行更新数据的函数
        this.cb(newVal)
    }
}










// // 给需要变化的dom添加观察者，当数据模型变化，执行对应的观察者方法（新老值对比，发生变化调用更新方法）
// // watcher是针对expr值的变化的监控
// class Watcher {
//     constructor (vm, expr, cb) {
//         this.vm = vm;
//         this.expr = expr;
//         this.cb = cb;

//         // 先获取老值
//         this.oldValue = this.getOldVal()
//     }
//     getOldVal() {
//         Dep.target = this;
//         let oldValue = compileUtil.getVal(this.expr, this.vm);
//         Dep.target = null;
//         return oldValue
//     }

//     // 对外暴露的方法，拿老值和新值对比
//     update () {
//         let newValue = compileUtil.getVal(this.expr, this.vm); 
//         let oldValue = this.oldValue;
//         if (newValue !== oldValue) {
//             this.cb(newValue) //调用wactch的callback
//         }
//     }
// }
