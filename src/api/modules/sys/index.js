import request from '@/libs/util.request'

const scope = 'server'
const client_id = 'web'
const client_secret = '123456'
const login_url = '/auth/oauth/token'

export const params = {
  scope, client_id, client_secret, login_url
}

/**
 * 登录，获取token
 * @param {*} param0 
 */
export function sysLogin ({ username, password }) {
  return request({ url: login_url, method: 'post', params: { username, password, grant_type: 'password', scope, client_id, client_secret } })
}

/**
 * 刷新token
 * @param {*} param0 
 */
export function refreshToken ({ token }) {
  return request({ url: login_url, method: 'post', params: { refresh_token: token, grant_type: 'refresh_token', scope, client_id, client_secret } })
}

/**
 * 注销
 */
export function logoutRequest () {
  return request.delete('/auth/token/logout')
}

/**
 * 获取用户菜单
 */
export function getMenu () {
  return request.get('/sys/user/menu/tree')
}

/**
 * 获取用户权限
 */
export function getPermission () {
  return request.get('/sys/user/permission/code')
}

/**
 * 获取字典
 */
export function getDict () {
  return request.get('/sys/dict/type/all')
}

