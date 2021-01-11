import log from '@/libs/util.log'

export default {
  namespaced: true,
  mutations: {
    /**
     * @description 显示版本信息
     * @param {Object} state state
     */
    versionShow () {
      log.capsule('YULI-CLOUD', `v${process.env.VUE_APP_VERSION}`)
    }
  }
}
