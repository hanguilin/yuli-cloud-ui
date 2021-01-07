import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

const files = require.context('./modules/sys', false, /\.js$/)
const storeModelues = {}

files.keys().forEach(key => {
  storeModelues[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sys: {
      namespaced: true,
      modules: storeModelues
    }
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG.storeState[key])
      })
    }
  }
  // ,
  // strict: process.env.NODE_ENV !== 'production'
})
