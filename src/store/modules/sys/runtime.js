/**
 * 系统运行时参数
 */
export default {
  namespaced: true,
  state: {
    // 是否有请求在刷新身份认证
    isRefreshToken: false
  },
  mutations: {
    /**
     * 设置
     * @param {*} state
     * @param {*} isRefreshToken
     */
    setIsRefreshToken (state, isRefreshToken) {
      state.isRefreshToken = isRefreshToken
    }
  },
  getters: {
    /**
     * 获取
     * @param {*} state
     */
    getIsRefreshToken (state) {
      return state.isRefreshToken
    }
  }
}
