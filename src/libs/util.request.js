import axios from 'axios'
import merge from 'lodash/merge'
import store from '@/store'
import cookies from '@/libs/util.cookies'
import { refreshToken, params } from '@/api/modules/sys'
import qs from 'qs'
import {
  Message,
  Loading,
  Notification
} from 'element-ui'

// 超时时间
axios.defaults.timeout = 30000
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
axios.defaults.headers = { 'Content-Type': 'application/json; charset=utf-8' }
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
// 非生产环境 && 开启代理, 接口前缀统一使用[/api]前缀做代理拦截!
const BASE_URL = process.env.NODE_ENV !== 'production' ? process.env.VUE_APP_BASE_API : process.env.VUE_APP_SERVER_URL
// 对面暴露的基础请求路径
axios.BASE_URL = BASE_URL

// token刷新时等待重试队列
let requests = []

// response 不拦截提示，主要用于非常规的返回数据格式
let notAutoTips = [params.login_url].map(e => BASE_URL + e)

/**
 * 请求拦截
 */
let loading
axios.interceptors.request.use(config => {
  let showLoading = false
  if (config.loading === true) {
    showLoading = true
  }
  if (showLoading) {
    loading = Loading.service({
      text: config.loadingText || 'Loading...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  return config.headers.retry === true ? config : addConfig(config)
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
axios.interceptors.response.use(response => {
  if (loading) {
    loading.close()
  }
  if (notAutoTips.indexOf(response.config.url) === -1 && response.data && response.data.code && response.data.code !== 200) {
    Message({
      message: response.data.msg,
      type: 'error',
      showClose: true,
      dangerouslyUseHTMLString: true,
      duration: 3000,
      customClass: 'zZindex'
    })
  }
  return response
}, async error => {
  if (loading) {
    loading.close()
  }
  // 认证异常
  if (error.response.status === 401) {
    // 身份认证续签
    const token = cookies.get('refreshToken')
    if (token) {
      // 当前没有在刷新token
      if (!store.getters['sys/runtime/getIsRefreshToken']) {
        // 设置store中的标志位为正在刷新token
        store.commit('sys/runtime/setIsRefreshToken', true, { root: true })
        Notification({
          message: '身份失效，正在续签身份',
          type: 'error',
          title: '认证',
          duration: 3000
        })
        // refreshToken
        const res = await refreshToken({ token: cookies.get('refreshToken') }).then((res) => { if (res.status === 200) { return res.data } })
        if (!res) {
          // 续签失败逻辑
          Notification({
            message: '身份续签失败，请重新登录',
            type: 'error',
            title: '认证',
            duration: 3000
          })
          store.dispatch('sys/account/logout')
        } else {
          // 续签成功逻辑
          cookies.set('token', res.access_token)
          cookies.set('refreshToken', res.refresh_token)
          // 重置store中的标志位为未刷新
          store.commit('sys/runtime/setIsRefreshToken', false, { root: true })
          Notification({
            message: '身份续签成功',
            type: 'success',
            title: '认证',
            duration: 3000
          })
          const newToken = getBearerToken()
          // 执行在刷新token时挂起的请求
          requests.forEach(e => {
            // 重发携带认证参数
            e.config.headers.Authorization = newToken
            // 设置header中的retry标志位，以便通知axios request拦截器不重复设置config
            e.config.headers.retry = true
            e.resolve(e.axios(e.config))
          })
          // 执行完成后，清空队列
          requests = []
          // 重发携带认证参数
          error.response.config.headers.Authorization = newToken
          // 设置header中的retry标志位，以便通知axios request拦截器不重复设置config
          error.response.config.headers.retry = true
          return axios.request(error.response.config)
        }
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个对象来保存关键数据，等token刷新后作为参数封装为axios请求直接执行
          requests.push({ config: error.response.config, resolve, axios })
        })
      }
    } else {
      // 没有refreshToken
      Notification({
        message: '身份失效，请重新登录',
        type: 'error',
        showClose: true,
        dangerouslyUseHTMLString: true,
        duration: 3000
      })
      store.dispatch('sys/account/logout')
    }
  } else if (
    error.response.status === 402 ||
    error.response.status === 403) { // 402 未登录或者refresh token过时， 403 账号在其他地方登录
    store.dispatch('sys/account/logout')
    Message({
      message: error.response.data.msg || error.response.data.exception,
      type: 'error',
      showClose: true,
      dangerouslyUseHTMLString: true,
      duration: 3000,
      customClass: 'zZindex'
    })
  } else if (error.response.status === 404) { // 路径找不到
    Message({
      message: '404，路径找不到' + ':' + error.response.data.path,
      type: 'error',
      showClose: true,
      duration: 3000
    })
  } else if (error.response.status === 504) {
    Message({
      message: '网络连接错误' + ':' + error.response.data,
      type: 'error',
      showClose: true,
      duration: 3000,
      customClass: 'zZindex'
    })
  } else {
    Message({
      message: error.response.data.msg || error.response.data.exception || error.response.data || error.response || error,
      type: 'error',
      showClose: true,
      duration: 5000,
      customClass: 'zZindex'
    })
  }
  return Promise.reject(error)
})

/**
 * 添加请求配置
 * @param {*} config
 */
function addConfig (config) {
  // 请求头带上token
  config.headers.Authorization = getBearerToken()
  // 请求地址处理
  config.url = BASE_URL + config.url
  const type = config.method
  const defaults = {}
  const arrayFormat = config.headers.arrayFormat || 'indices'
  if (type === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded; charset=utf-8') {
    // post请求参数处理
    config.data = qs.stringify(config.data, { allowDots: true, arrayFormat: arrayFormat })
  } else if (type === 'get') {
    // get请求参数处理
    config.params = qs.stringify(config.params, { allowDots: true, arrayFormat: arrayFormat })
    config.params = qs.parse(config.params)
    config.params = merge(defaults, config.params)
  }
  return config
}

/**
 * 从cookie中获取token，并格式化
 */
function getBearerToken () {
  return `Bearer ${cookies.get('token')}`
}

export default axios
