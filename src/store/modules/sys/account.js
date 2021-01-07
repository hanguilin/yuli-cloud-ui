import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import { sysLogin } from '@/api/modules/sys'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async login ({ dispatch, commit }, {
      username = '',
      password = ''
    } = {}) {
      await sysLogin({ username, password }).then((res) => {
        if (res.status === 200 && res.data) {
          const data = res.data
          util.cookies.set('userId', data.user_id)
          util.cookies.set('token', data.access_token)
          util.cookies.set('refreshToken', data.refresh_token)
          // 设置 vuex 用户信息
          dispatch('sys/user/set', { name: data.nickname }, { root: true })
          // 获取菜单
          // getMenu()
          dispatch('load')
        }
      })
      return Promise.resolve()
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      async function logout () {
        // 跳转路由
        router.push({ name: 'login' })
        util.clearLoginInfo()
      }
      // 判断是否需要确认
      if (confirm) {
        commit('sys/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', { type: 'warning' })
          .then(() => {
            commit('sys/gray/set', false, { root: true })
            logout()
          })
          .catch(() => {
            commit('sys/gray/set', false, { root: true })
            Message({ message: '取消注销操作' })
          })
      } else {
        logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async load ({ dispatch }) {
      // 加载用户名
      await dispatch('sys/user/load', null, { root: true })
      // 加载主题
      await dispatch('sys/theme/load', null, { root: true })
      // 加载页面过渡效果设置
      await dispatch('sys/transition/load', null, { root: true })
      // 持久化数据加载侧边栏配置
      await dispatch('sys/menu/asideLoad', null, { root: true })
      // 持久化数据加载全局尺寸
      await dispatch('sys/size/load', null, { root: true })
      // 持久化数据加载颜色设置
      await dispatch('sys/color/load', null, { root: true })
    }
  }
}
