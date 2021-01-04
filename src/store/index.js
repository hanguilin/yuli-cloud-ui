import Vue from 'vue'
import Vuex from 'vuex'

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
  }
})
