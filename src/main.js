// Vue
import Vue from 'vue'
import App from './App'
// 核心插件
import sys from '@/plugin/sys'
// store
import store from '@/store'
// axios请求
import httpRequest from '@/libs/util.request'
// 菜单和路由设置
import router from './router'
import cloneDeep from 'lodash/cloneDeep'

// 核心插件
Vue.use(sys)
// axios请求方法
Vue.prototype.$http = httpRequest

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG = {}
window.SITE_CONFIG.storeState = cloneDeep(store.state)

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('sys/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('sys/account/load')
    // 获取并记录用户 UA
    this.$store.commit('sys/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('sys/fullscreen/listen')
  }
}).$mount('#app')
