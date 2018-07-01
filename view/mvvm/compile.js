// 编译模板
class Compile {
    constructor (el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {
            // 1. 把dom存到内存中进行操作更快
            let fragment = this.node2fragment(this.el)
            // 2. 编译
            this.compile(fragment)
            // 3. 放回到文档流中
            this.el.appendChild(fragment)
        }
    }
    // 辅助方法
    isElementNode(node) {
        return node.nodeType === 1
    }
    isDirective(name) {
        return name.includes('k-')
    }

    isText (text) {
        if (reg.test(text)) {
            return true
        }
    }

    // 核心方法
    compile (fragment) {
        let childnodes = fragment.childNodes;
        Array.from(childnodes).forEach(node => {
            if (this.isElementNode(node)) {
                this.compileElement(node);
                this.compile(node);
            } else {
                this.compileText(node);
            }
        })
    }

    compileElement (node) {
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
            if (this.isDirective(attr.name)) {
                let expr = attr.value;
                let value = this.model(node, this.vm, expr)
            }
        })
    }

    model (node, vm, expr) {
        let updateFn = compileUtil.updater['modelUpdater'];
        compileUtil.watchModel(node, expr, vm)

        node.addEventListener('input', (e) => {
            let newValue = e.target.value;
            this.setVal(vm, expr, newValue)
        })
    }

    setVal (vm, expr, value) {
        expr = expr.split('.');
        return expr.reduce((prev, next, currentIndex) => {
            if (currentIndex === expr.length -1) {
                return prev[next] = value;
            }
            return prev[next]
        }, vm.$data)
    }

    compileText (node) {
        let textCont = node.textContent;
        if (this.isText(textCont)) {
            let value = this.text(node, this.vm, textCont);
        }
    }

    text (node, vm, expr) {
        let value = compileUtil.getTextVal(expr, vm);
        compileUtil.watchText(node, expr, vm, value)
    }

    node2fragment (el) {
        let fragment = document.createDocumentFragment();
        let firstchild;
        while (firstchild = el.firstChild) {
            fragment.appendChild(firstchild)
        }
        return fragment
    }
}

