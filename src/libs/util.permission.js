import store from '@/store'

/**
 * 判断是否有权限
 * @param {*} code 
 */
export function hasPermission (code) {
  const permissionList = store.getters['sys/permission/get']
  return permissionList.indexOf(code) !== -1
}

export default { hasPermission }