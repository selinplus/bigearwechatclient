import Vue from 'vue'
import Vuex from 'vuex'

import wechatModule from './module-wechat'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    wechatModule
  }
})

export default store
