/*
import Power from '.....'
new Models({
    $power: Power
})
this.$power
*/
// eslint-disable-next-line no-unused-vars
let _Vue = null
export default class Models {
  static install (Vue) {
    // 1. 判断当前插件是否被安装
    if (Models.install.installed) {
      return
    }
    Models.install.installed = true
    // 2. 把Vue构造函数记录到全局变量
    _Vue = Vue
    // 3. 把创建Vue实例时候传入的router对象注入到Vue实例上
    // 混入
    _Vue.mixin({
      beforeCreate () {
        if (this.$options.model) {
          _Vue.prototype.$model = this.$options.model
          this.$options.model.init()
        }
      }
    })
  }

  constructor (options) {
    this.options = options || {}
    this.dataMap = {}
  }

  // 初始化
  init () {
    this.createPrototype()
  }

  // 将初始化放入vue的prototype
  createPrototype () {
    for (const i of Object.keys(this.options)) {
      // 模块初始化
      const model = new this.options[i]()
      const dataTemp = {}
      for (const m of Object.keys(model)) {
        dataTemp[m] = model[m]
      }

      this.dataMap[i] = _Vue.observable(dataTemp)

      // 数据劫持
      const self = this
      _Vue.prototype.$model[i] = new Proxy(model, {
        get: function (obj, prop) {
          if (prop in obj) {
            // console.log(typeof obj[prop] == 'function')
            if(typeof obj[prop] == 'function'){
              return obj[prop]
            }
            return self.dataMap[i][prop]
          } else {
            throw new Error('No this key in Class')
          }
        },
        set: function (obj, prop, value) {
          if (prop in obj) {
            obj[prop] = value
            self.dataMap[i][prop] = value
          } else {
            throw new Error('No this key in Class')
          }
          return true
        }
      })
    }
  }
}
