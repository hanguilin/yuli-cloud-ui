// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// fontawesome
import '@/assets/lib/font-awesome-4.7.0/css/font-awesome.min.css'
// flex 布局库
import 'flex.css'
// 动画
import animated from 'animate.css'
// axios请求
import httpRequest from '@/libs/util.request'
// 功能插件
import pluginError from '@/plugin/error'
import pluginLog from '@/plugin/log'
// 工具类
import util from '@/libs/util'
// 表单校验扩展
import validator from '@/libs/validator'
// 自定义指令
import '@/directive'

export default {
  async install (Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL
    // 当前版本
    Vue.prototype.$version = process.env.VUE_APP_VERSION
    // 构建时间
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME
    // axios请求方法
    Vue.prototype.$http = httpRequest
    // 工具类
    Vue.prototype.$util = util
    // 校验类
    Vue.prototype.validator = validator
    // 权限判断
    Vue.prototype.hasPermission = util.permission.hasPermission

    // Element
    Vue.use(ElementUI)
    // 插件
    Vue.use(pluginError)
    Vue.use(pluginLog)
    // animated动画
    Vue.use(animated)
  }
}
