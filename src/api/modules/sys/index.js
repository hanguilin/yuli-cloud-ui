import request from '@/libs/util.request'

const grant_type = 'password'
const scope = 'server'
const client_id = 'web'
const client_secret = '123456'

export function sysLogin ({ username, password }) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: { username, password, grant_type, scope, client_id, client_secret }
  })
}
