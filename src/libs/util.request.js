import axios from 'axios'
import merge from 'lodash/merge'
import store from '@/store'
import cookies from '@/libs/util.cookies'
import { refreshToken } from '@/api/modules/sys'
import qs from 'qs'
import {
  Message,
  Loading
} from 'element-ui'

// 超时时间
axios.defaults.timeout = 100000
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
axios.defaults.headers = { 'Content-Type': 'application/json; charset=utf-8' }
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
// 非生产环境 && 开启代理, 接口前缀统一使用[/api]前缀做代理拦截!
const BASE_URL = process.env.NODE_ENV !== 'production' ? process.env.VUE_APP_BASE_API : process.env.VUE_APP_SERVER_URL
// 对面暴露的基础请求路径
axios.BASE_URL = BASE_URL

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
  // 请求头带上token
  config.headers.Authorization = 'Bearer ' + cookies.get('token')
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
  if (response.data && response.data.code !== 200) {
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
}, error => {
  if (loading) {
    loading.close()
  }
  if (error.response.status === 401) { // 超时自动刷新
    const token = cookies.get('refreshToken')
    if (token) {
      refreshToken({ token: cookies.get('refreshToken') }).then(res => {
        if (res.status === 200 && res.data) {
          cookies.set('token', res.data.access_token)
          cookies.set('refreshToken', res.data.refresh_token)
        } else {
          store.dispatch('sys/account/logout')
        }
      })
    } else {
      // 没有refreshToken
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

export default axios
