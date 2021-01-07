import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import { uniqueId } from 'lodash'
import router from '@/router'
import store from '@/store'

const util = {
  cookies,
  db,
  log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

/**
 * 格式化el-menu菜单
 * @param {*} menu 菜单
 */
util.formatMenu = function (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: util.formatMenu(e.children)
    } : {}
  }))
}

/**
 * 清除登录信息
 */
util.clearLoginInfo = function () {
  cookies.remove('token')
  cookies.remove('refreshToken')
  cookies.remove('userId')
  store.commit('resetStore')
  store.dispatch('sys/user/set', {}, { root: true })
  router.options.isAddDynamicMenuRoutes = false
}

/**
 * 根据路由path生成name
 * @param {*} path 路径
 */
util.genRouteName = function (path) {
  return path.replace(/^\//g, '').replace(/[/]/g, '-').replace(/[?]/g, '-').replace(/&/g, '-').replace(/=/g, '-')
}

export default util
