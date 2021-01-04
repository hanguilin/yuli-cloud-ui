// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import sys from '@/plugin/sys'
// store
import store from '@/store'

// 菜单和路由设置
import router from './router'
import { menuHeader, menuAside } from '@/menu'
import { frameInRoutes } from '@/router/routes'

// 核心插件
Vue.use(sys)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    console.log(this.$store)
    this.$store.commit('sys/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('sys/menu/headerSet', menuHeader)
    // 设置侧边栏菜单
    this.$store.commit('sys/menu/asideSet', menuAside)
    // 初始化菜单搜索功能
    this.$store.commit('sys/search/init', menuHeader)
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
