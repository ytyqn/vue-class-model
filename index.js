/*
import Power from '.....'
new Models({
    $power: Power
})
this.$power
*/
// eslint-disable-next-line no-unused-vars
let _Vue = null
class Models {
  static install (Vue) {
    // 1. 判断当前插件是否被安装
    if (Models.install.installed) {
      return
    }
    Models.install.installed = true
    // 2. 把Vue构造函数记录到全局变量
    _Vue = Vue
    // 3. 把创建Vue实例时候传入的router对象注入到Vue实例上
    // _Vue.prototype.$router = this.$options.router
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
    this.$model = ''
  }

  // 初始化
  init () {
    this.createPrototype()
    this.createComponent(_Vue)
  }

  // 将class model初始化放入vue的prototype
/* 数据一目了然
  将一些数据其私有化，节省监听器双向绑定
  不必烦恼组件间的数据传递
  逻辑处理清晰
  可以废弃大部分vue的methods，computed等等
  将数据独立出来
  方便开发和数据模拟（class只需要一开始的数据初始化，其他的数据变动都在class model中，之后直接将真实数据代替模拟数据）
  class 之间可以调用其他class，交流方便 
  保留vue的原有功能，两种方式混合使用，推荐以class使用为主
  你可以自己写生命周期
  */
  createPrototype () {
    // class models
    let models = this.options.models || {}
    // 使用模式
    let mode = this.options.mode || 'model'
    for (const i of Object.keys(models)) {
      // 模块初始化
      const model = new models[i]()
      const dataTemp = {}
      for (const m of Object.keys(model)) {
        dataTemp[m] = model[m]
      }

      this.dataMap[i] = _Vue.observable(dataTemp)

      // 数据劫持
      const self = this
      if(mode === 'model'){
        this.$model = _Vue.prototype.$model
      }else{
        this.$model = _Vue.prototype
      }
      this.$model[i] = new Proxy(model, {
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

  // vue组件初始化
  /* 
  取代vue component
  一次声明所有组件都可以使用，不需要再在组件中import
  保留vue的原有功能，两种方式混合使用，推荐组件复用多使用该功能，组件使用少可以考虑Vue原功能
  */
 createComponent(Vue){
    let components = this.options.components || {}
    for(let i of Object.keys(components)){
      Vue.components(i,{
        render(h) {
          const component = components[i]
          return h(compontent)
        }
      })
    }
 }
}
