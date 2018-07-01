// 监控模型数据的改变
class Observe {
    constructor (data) {
        this.observe(data)
    }
    observe (data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            // 在取值的过程中，添加自己的逻辑
            this.defineReactive(data, key, data[key])
            this.observe(data[key]) //深度劫持数据
        })
    }
    defineReactive (obj, key, value) {
        let that = this;
        let dep = new Dep(); //每个变化的数据，都会对应一个数组，这个数组是存放更新的操作
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () {
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set (newValue) {
                if (value !== newValue) {
                    value = newValue;
                    that.observe(newValue) //如果是对象，继续劫持
                    dep.notify() //通知所有，数据更新
                }
            }
        })
    }
}