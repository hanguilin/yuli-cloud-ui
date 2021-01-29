import router from '@/router'
import store from '@/store'
import cookies from '@/libs/util.cookies'
import permission from '@/libs/util.permission'
import dict from '@/libs/util.dict'

const util = {
  cookies,
  permission,
  dict
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'YULI CLOUD'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * 清除登录信息
 */
util.clearLoginInfo = function () {
  cookies.remove('token')
  cookies.remove('refreshToken')
  cookies.remove('userId')
  store.commit('resetStore')
  store.dispatch('sys/user/set', {}, { root: true })
  router.options.isAddDynamicMenuRoutes = false
}

/**
 * 根据路由path生成name
 * @param {*} path 路径
 */
util.genRouteName = function (path) {
  return path ? path.replace(/^\//g, '').replace(/[/]/g, '-').replace(/[?]/g, '-').replace(/&/g, '-').replace(/=/g, '-') : null
}

/**
 * 去除指定前缀
 * @param {*} prefix 前缀
 * @param {*} str 字符串
 */
util.removePrefix = function (prefix, str) {
  return str.startsWith(prefix) ? str.substr(prefix.length, str.length) : str
}

/**
 * 表单对象赋值:
 * 对目标对象存在且源对象同样存在的属性，全部覆盖；
 * 目标对象不存在但是源对象存在的属性， 全部丢弃；
 * 目标对象存在但是源对象不存在的属性，如果是字符串赋值为空串，其余类型赋值为undefined
 * @param {*} target 目标对象
 * @param {*} source 源对象
 */
util.recover = function (target, source) {
  if (target === undefined || target === null) { throw new TypeError('Cannot convert first argument to object') }
  var to = Object(target)
  if (source === undefined || source === null) { return to }
  var keysArray = Object.keys(Object(target))
  for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
    var nextKey = keysArray[nextIndex]
    var desc = Object.getOwnPropertyDescriptor(target, nextKey)
    if (desc !== undefined && desc.enumerable) {
      if (Object.prototype.hasOwnProperty.call(to, nextKey)) {
        if (to[nextKey] instanceof Array) {
          to[nextKey] = source[nextKey]
        } else if (to[nextKey] instanceof Object) {
          util.recover(to[nextKey], source[nextKey])
        } else if (source[nextKey] !== undefined) {
          to[nextKey] = source[nextKey]
        } else if (typeof (to[nextKey]) === 'string') {
          to[nextKey] = ''
        } else {
          to[nextKey] = undefined
        }
      }
    }
  }
  return to
}

/**
 * 剔除对象的空属性
 * @param {*} obj 参数
 */
util.filterParams = function (obj) {
  var _newObj = {}
  for (var key in obj) {
    // 判断对象中是否有这个属性
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (isEmpty(obj[key])) {
        continue
      }
      _newObj[key] = typeof obj[key] === 'object' ? (
        obj[key] instanceof Array ? arrayFilterParams(obj[key]) : util.filterParams(obj[key])
      ) : obj[key]
    }
  }
  return _newObj
}

/**
 * 剔除数组中的空值
 * @param {*} arr 数组
 */
function arrayFilterParams (arr) {
  var err = []
  arr.forEach((item, index) => {
    if (isEmpty(item)) return
    err.push(
      typeof item === 'object' ? (
        item instanceof Array ? arrayFilterParams(item) : util.filterParams(item)
      ) : item
    )
  })
  return err
}

/**
 * 为空情况
 * @param {*} obj 对象
 */
function isEmpty (obj) {
  const emptyArr = ['', undefined, null]
  return (emptyArr.indexOf(obj) > -1 || obj.toString().trim() === '')
}

/**
 * 下载后台返回数据
 * @param {*} res axios返回response
 */
util.download = function (res) {
  const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const contentDisposition = res.headers['content-disposition']
  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const result = patt.exec(contentDisposition)
  const filename = decodeURI(result[1])
  downloadElement.style.display = 'none'
  downloadElement.href = href
  // 下载后文件名
  downloadElement.download = filename
  document.body.appendChild(downloadElement)
  // 点击下载
  downloadElement.click()
  // 下载完成移除元素
  document.body.removeChild(downloadElement)
  // 释放掉blob对象
  window.URL.revokeObjectURL(href)
}

export default util
