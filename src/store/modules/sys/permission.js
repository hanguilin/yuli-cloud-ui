export default {
  namespaced: true,
  state: {
    // 权限标识码
    permission: []
  },
  actions: {
    /**
     * 设置权限标识
     * @param {*} param0 
     * @param {*} permission 
     */
    async set ({ state, dispatch }, permission) {
      // store 赋值
      state.permission = permission
      // 持久化
      await dispatch('sys/db/set', {
        dbName: 'sys',
        path: 'permission',
        value: state.permission,
        user: true
      }, { root: true })
    }
  },
  mutations: {},
  getters: {
    /**
     * 获取权限标识
     * @param {*} state 
     */
    get (state) {
      return state.permission
    }
  }
}
