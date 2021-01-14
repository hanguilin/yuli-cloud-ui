import store from '@/store'

export function hasPermission (code) {
  const permissionList = store.getters['sys/permission/get']
  return permissionList.indexOf(code) !== -1
}

export default { hasPermission }