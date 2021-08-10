// store 统一存储state数据,并是响应式的
// 提供commit、dispatch

let Vue = null;

class Store{
  constructor(options){
    // 保存选项
    this.options = options

    // 对state做响应式处理,并不做代理 ,不能在外部直接修改这些数据
    this._vm = new Vue({
      data(){
        return {
          //给属性改名字，加上$或者_  vue在初始化的时候就不会给这个属性做代理，不能直接使用this.xxx, 就能访问到里面的xxx
          $$state: options.state
        }
      }
    })

    setInterval(() => {
      this.state.counter++
    }, 1000)


  }
    get state(){
        return this._vm._data.$$state
      }
    set state(value){
      console.error('请使用replace来操作')
    }
  commit(){}
  dispatch(){}
}

function install(_Vue){

  Vue = _Vue;

  Vue.mixin({
    beforeCreate(){
      // 可以在vue组件中直接使用 $store
      if (this.$options.store){
        Vue.prototype.$store = this.$options.store;
      }
    }
  })



}

export default {Store, install}