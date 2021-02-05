import store from '@/store'

/**
 * 获取字典label
 * @param {*} type 字典类型
 * @param {*} value 字典值
 * @param {*} defaultLabel 字典标签
 */
export function getDictLabel (type, value, defaultLabel) {
  // 获取字典类型的值列表
  var dictValueList = getValueList(type, defaultLabel)
  // 如果返回值等于默认值，说明其中有数据为空，取默认值
  if (dictValueList === defaultLabel) {
    return defaultLabel
  }
  // 如果匹配多条值数据，则以逗号拼接返回标签
  return dictValueList.filter(e => e.value === value).map(e => e.label).join(',')
}

/**
 * 获取字典值
 * @param {*} type 字典类型
 * @param {*} label 字典标签
 * @param {*} defaultValue 默认值
 */
export function getDictValue (type, label, defaultValue) {
  // 获取字典类型的值列表
  var dictValueList = getValueList(type, defaultValue)
  // 如果返回值等于默认值，说明其中有数据为空，取默认值
  if (dictValueList === defaultValue) {
    return defaultValue
  }
  // 如果匹配多条值数据，则以逗号拼接返回标签
  return dictValueList.filter(e => e.label === label).map(e => e.value).join(',')
}

/**
 * 获取字典值列表
 * @param {*} type 字典类型
 */
export function getDictValueList (type) {
  return getValueList(type, [])
}

/**
 * 获取字典类型的值列表
 * @param {*} type 字典类型
 * @param {*} defaultValue 默认返回值
 */
function getValueList (type, defaultValue) {
  // 获取字典列表
  const dictList = store.getters['sys/dict/get']
  // 如果字典列表无数据，则返回默认值
  if (!dictList || dictList.length < 1) {
    return defaultValue
  }
  // 如果字典列表中类型无数据，则返回默认值
  var typeList = dictList.filter(e => e.type.indexOf(type) !== -1)
  if (!typeList || typeList.length < 1) {
    return defaultValue
  }
  // 如果类型中无键值数据，则返回默认值
  var dictValueList = typeList[0].dictValueList
  if (!dictValueList || dictValueList.length < 1) {
    return defaultValue
  }
  return dictValueList
}

export default { getDictLabel, getDictValue, getDictValueList }