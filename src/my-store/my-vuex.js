// store 统一存储state数据,并是响应式的
// 提供commit、dispatch

let Vue = null;

class Store{
  constructor(options){
    // 0.保存选项
    this.options = options
    this._mutations = options.mutations
    this._actions = options.actions
    this._wrapperGetters = options.getters

    const computed = {}
    this.getters = {}
    const store = this;
    Object.keys(this._wrapperGetters).forEach(key => {
      const fn = store._wrapperGetters[key]
      computed[key] = function(){
        return fn(store.state)
      }

      Object.defineProperty(store.getters, key, {
        get: () => {
          return store._vm[key]
        }
      })
    })

    // 1.对state做响应式处理,并不做代理 ,不能在外部直接修改这些数据
    this._vm = new Vue({
      data(){
        return {
          //给属性改名字，加上$或者_  vue在初始化的时候就不会给这个属性做代理，不能直接使用this.xxx, 就能访问到里面的xxx
          $$state: options.state, 
        }
      },
      computed // 计算属性会直接代理到vue的实例上，所以在上面可能直接使用store._vm[key] 来直接得到doubleCounter
    })

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)


  }
    get state(){
        return this._vm._data.$$state
      }
    set state(value){
      console.error('请使用replace来操作')
    }
  commit(type, payload){
    const entry = this._mutations[type]
    if (!entry){
      console.log('这是一个错误的commit')
      return;
    }
    entry(this.state, payload)
  }
  dispatch(type, payload){
    const entry = this._actions[type]
    if (!entry){
      console.log('这是一个错误的action')
      return;
    }
    // dispatch的上下文是store实例
    entry(this, payload)
  }
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