import { uniqueId } from 'lodash'
/**
 * @description 创建菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function elMenuItem (h, menu) {
  let icon = null
  if (menu.icon) {
    icon = <i class={menu.icon} aria-hidden="true"></i>
  } else {
    icon = <i class="fa fa-file-o" aria-hidden="true"></i>
  }
  const uniqueTag = menu.path || uniqueId('empty-menu-item-')
  return <el-menu-item
    key={uniqueTag}
    index={uniqueTag}>
    {icon}
    <span slot="title">{menu.title || '未命名菜单'}</span>
  </el-menu-item>
}

/**
 * @description 创建子菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function elSubmenu (h, menu) {
  let icon = null
  if (menu.icon) {
    icon = <i class={menu.icon} aria-hidden="true" slot="title"></i>
  } else {
    icon = <i class="fa fa-file-o" aria-hidden="true"></i>
  }
  const uniqueTag = menu.path || uniqueId('empty-menu-item-')
  return <el-submenu
    key={uniqueTag}
    index={uniqueTag}>
    {icon}
    <span slot="title">{menu.title || '未命名菜单'}</span>
    {menu.children.map(child => createMenu.call(this, h, child))}
  </el-submenu>
}

/**
 * @description 在组件中调用此方法渲染菜单项目
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 */
export function createMenu (h, menu) {
  if (menu.children === undefined) return elMenuItem.call(this, h, menu)
  return elSubmenu.call(this, h, menu)
}
