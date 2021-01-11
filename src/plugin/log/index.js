import store from '@/store'
import log from '@/libs/util.log'

export default {
  install (Vue, options) {
    // 快速打印 log
    Vue.prototype.$log = {
      ...log,
      push (data) {
        if (typeof data === 'string') {
          // 如果传递来的数据是字符串
          // 赋值给 message 字段
          // 为了方便使用
          // eg: this.$log.push('foo text')
          store.dispatch('sys/log/push', {
            message: data
          })
        } else if (typeof data === 'object') {
          // 如果传递来的数据是对象
          store.dispatch('sys/log/push', data)
        }
      }
    }
  }
}
