import Vue from 'vue'
import VueRouter from 'vue-router'
import cloneDeep from 'lodash/cloneDeep'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getMenu, getPermission } from '@/api/modules/sys/index'
import store from '@/store'
import util from '@/libs/util'
// 路由数据
import { frameInRoutes, frameOutRoutes } from './routes'
import { hasPermission } from '@/libs/util.permission'

// 开发环境不使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: [
    frameInRoutes,
    ...frameOutRoutes
  ]
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  hasPermission()
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('sys/search/set', false)
  console.log(to.path, fnCurrentRouteType(to, frameOutRoutes))
  // 框架外部路由或由接口提供的动态路由则直接放行，不查询菜单
  if (fnCurrentRouteType(to, frameOutRoutes) === 'frameOut' || router.options.isAddDynamicMenuRoutes) {
    next()
  } else {
    // 框架内路由或非动态路由查询菜单
    getMenu().then((res) => {
      if (res.data.code === 200) {
        router.options.isAddDynamicMenuRoutes = true
        const menu = res.data.data
        // 根据返回数据添加动态路由
        fnAddDynamicMenuRoutes(menu)
        /// 设置数据到vuex
        store.commit('sys/menu/asideSet', menu)
        // 设置name和meta.title属性
        const poolMenu = fnGenPoolMenu(menu)
        // 设置框架内展示到页签的路由
        store.commit('sys/page/init', poolMenu.concat(frameInRoutes))
        // 设置可搜索的路由
        store.commit('sys/search/init', menu)
        // 持久化数据加载上次退出时的多页列表
        store.dispatch('sys/page/openedLoad', null, { root: true })
        // 保证动态路由有效性
        next({ ...to, replace: true })
      } else {
        next()
      }
    })
    // 设置权限标识到vuex
    getPermission().then(({ data }) => {
      if (data && data.code === 200) {
        store.dispatch('sys/permission/set', data.data, { root: true })
      }
    })
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('sys/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

/**
 * 判断当前路由类型, frameIn: 框架内路由, frameOut: 框架外路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, frameOutRoutes = []) {
  let temp = []
  for (let i = 0; i < frameOutRoutes.length; i++) {
    if (route.path === frameOutRoutes[i].path) {
      return 'frameOut'
    } else if (frameOutRoutes[i].children && frameOutRoutes[i].children.length >= 1) {
      temp = temp.concat(frameOutRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'frameIn'
}
/**
 * 添加动态路由
 * @param {*} menuList 菜单数据
 * @param {*} routes 递归路由数据
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  let temp = []
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    }

    if (menuList[i].path && /\S/.test(menuList[i].path)) {
      menuList[i].path = menuList[i].path.replace(/[/]$/, '')
      const route = {
        path: menuList[i].path.split('?')[0],
        component: null,
        name: util.genRouteName(menuList[i].path),
        meta: {
          menuId: menuList[i].id,
          title: menuList[i].title,
          isDynamic: true
        }
      }
      try {
        // 系统页面
        if (menuList[i].target === '0') {
          // 去除前缀/
          const componentPath = util.removePrefix('/', menuList[i].path.split('?')[0])
          route.component = _import(componentPath) || null
        } else if (menuList[i].target === '1') {
          route.meta.iframeUrl = menuList[i].url
          route.meta.type = 'outLink'
        }
      } catch (e) {
        console.error(e)
      }
      console.log('route', route)
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    const frameInRoutesCopy = cloneDeep(frameInRoutes)
    frameInRoutesCopy.name = 'main-dynamic'
    frameInRoutesCopy.children = routes
    const addDynamicRoutes = [
      frameInRoutesCopy,
      { path: '*', redirect: { name: '404' } }
    ]
    router.addRoutes(addDynamicRoutes)
  }
}

/**
 * 生成格式化的菜单数据
 * @param {*} menu 动态菜单数据
 */
function fnGenPoolMenu (menu) {
  return menu.map(e => {
    if (e.children && e.children.length > 0) {
      e.children = fnGenPoolMenu(e.children)
    }
    return {
      ...e,
      meta: {
        title: e.title
      },
      fullPath: e.path,
      name: util.genRouteName(e.path)
    }
  })
}

export default router
