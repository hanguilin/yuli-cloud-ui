import request from '@/libs/util.request'

const scope = 'server'
const client_id = 'web'
const client_secret = '123456'

export function sysLogin ({ username, password }) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: { username, password, grant_type: 'password', scope, client_id, client_secret }
  })
}

export function refreshToken ({ token }) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: { refresh_token: token, grant_type: 'refresh_token', scope, client_id, client_secret }
  })
}

export function getMenu () {
  return request({
    url: '/sys/menu/tree/own',
    method: 'get'
  })
}
