import layout from '@/layout/index.vue'
// import util from '@/libs/util'
// import cookies from '@/libs/util.cookies'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = {
  path: '/',
  redirect: { name: 'index' },
  component: layout,
  children: [
    // 首页
    {
      path: '/index',
      name: 'index',
      meta: {
        title: '首页',
        auth: true
      },
      component: _import('sys/index')
    },
    // 系统 前端日志
    {
      path: '/log',
      name: 'log',
      meta: {
        title: '前端日志',
        auth: true
      },
      component: _import('sys/log/index')
    },
    // 刷新页面 必须保留
    {
      path: '/refresh',
      name: 'refresh',
      hidden: true,
      component: {
        beforeRouteEnter (to, from, next) {
          from.meta[`__stamp-${from.path}`] = Date.now()
          next(instance => instance.$router.replace({ path: from.fullPath, meta: from.meta }))
        },
        render: h => h()
      }
    },
    // 页面重定向 必须保留
    {
      path: '/redirect/:route*',
      name: 'redirect',
      hidden: true,
      component: {
        beforeRouteEnter (to, from, next) {
          next(instance => instance.$router.replace(JSON.parse(from.params.route)))
        },
        render: h => h()
      }
    }
  ],
  beforeEnter (to, from, next) {
    // const token = cookies.get('token')
    // if (!token || !/\S/.test(token)) {
    //   util.clearLoginInfo()
    //   next({ name: 'login' })
    // }
    next()
  }
}

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('sys/login/index')
  },
  {
    path: '/404',
    name: '404',
    component: _import('sys/error/404/index')
  }
]

export const frameInRoutes = frameIn
export const frameOutRoutes = frameOut

// 重新组织后导出
export default [
  frameIn,
  ...frameOut
]
