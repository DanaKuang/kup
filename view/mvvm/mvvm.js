// 每个vm都是MVVM的实例
class MVVM {
    constructor (options) {
        this.$el = options.el;
        this.$data = options.data;

        if (this.$el) {
            new Observe(this.$data)
            new Compile(this.$el, this)
        }
    }
}































// class MVVM {
//     constructor (options) {
//         this.$el = options.el;
//         this.$data = options.data;
        
//         if (this.$el) {
//             new Observe(this.$data)
//             // this.proxyData(this.$data)
//             new Compile(this.$el, this)
//         }
//     }
//     // proxyData (data) {
//     //     Object.keys(data).forEach((key) => {
//     //         Object.defineProperty(this, key, {
//     //             get () {
//     //                 return data[key]
//     //             },
//     //             set (newValue) {
//     //                 data[key] = newValue
//     //             }
//     //         })
//     //     })
//     // }
// }