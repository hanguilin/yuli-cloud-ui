export default {
  namespaced: true,
  state: {
    // 字典
    dict: []
  },
  actions: {
    /**
     * 设置字典
     * @param {*} param0 
     * @param {*} dict 
     */
    async set ({ state, dispatch }, dict) {
      // store 赋值
      state.dict = dict
      // 持久化
      await dispatch('sys/db/set', {
        dbName: 'sys',
        path: 'dict',
        value: state.dict,
        user: true
      }, { root: true })
    }
  },
  mutations: {},
  getters: {
    /**
     * 获取字典
     * @param {*} state 
     */
    get (state) {
      return state.dict
    }
  }
}
