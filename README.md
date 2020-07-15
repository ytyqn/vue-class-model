# vue-class-model
在vue中使用面向对象class开发，使class的公有数据双向绑定；

如果不需要使用双向绑定可以将属性通过Symbol私有化

## 安装

```shell
npm install vue-class-model
or 
yarn add vue-class-model
```

## 配置

```javascript
// model/hello.js
class Hello{
  // constructor如果有参数传入需要配置默认值
  // 目前需要自己创建init方法初始化数据
  constructor(){
    // msg双向绑定，数据修改后组件会更新
    this.msg = 'Hello'
  }
  // mm双向绑定，数据修改后组件会更新
  mm = 'ggg'
  // 初始化方法名不一定是init，你可以自己命名
  init(m){
    this.msg = m
  }
  setMsg(v){
    this.msg = v
  }
}
// 为了方便不同model之间交流数据
export default new Hello()
```



```javascript
// main.js
import Vue from 'vue'
import Models from 'vue-class-model'
import Hello from './model/hello.js'
Vue.use(Models)

Vue.use(Model)
const model = new Model({
  // mode分为none和model
  mode: 'none',
  models: {
    $power: Hello
  },
  // 全局声明组件，全局可用
  components: {
    Test: () => import('./components/test.vue')
  }
})

// 配置好后可以在所有组件中使用，
// model模式下
// 使用class变量this.$model.hello.msg
// 使用class方法this.$model.hello.setMsg('Bye')
// none模式下
// 使用class变量this.hello.msg
// 使用class方法this.hello.setMsg('Bye')
new Vue({
  el:'#app',
  model
})
```

