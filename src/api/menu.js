import request from '@/libs/request'

/**
 * 获取菜单列表
 */
export const getMenus = () => {
  return request({
    url: 'api/sys/queryMenuAll',
    method: 'get'
  })
}

/**
 * 添加菜单
 * @param data
 */
export const addMenu = (data) => {
  alert(JSON.stringify(data))
  const info = {
    parentId: data.parentId,
    fullName: data.menuName,
    operType: data.parentId === '60914034d768af34cedfa8d7f0defca2' ? 'dic' : 'menu',
    menuIcon: data.icon,
    menuUrl: data.path,
    menuSort: data.priority,
    menuState: data.status
  }
  return request({
    url: 'api/sys/saveMenuInfo',
    data: info,
    method: 'post'
  })
}
/**
 * 菜单排序
 * @param type: 0上移 1下移
 * @param menuId
 * @param menuSort
 */
export const menuSort = (data,type) => {
  const info ={
    type:type,
    menuId:data.menuId,
    menuSort:data.priority
  }
  console.log(info);
  return request({
    url: 'api/sys/menuSort',
    data:info,
    method: 'post'
  })
}

/**
 * 更新菜单
 * @param data
 */
export const updateMenu = (data) => {
  const info = {
    menuId: data.menuId,
    fullName: data.menuName,
    menuIcon: data.icon,
    menuUrl: data.path,
    menuState: data.status
  }
  return request({
    url: 'api/sys/modifyMenuInfo',
    data:info,
    method: 'post'
  })
}
/**
 * 删除菜单
 * @param menuId
 */
export const removeMenu = (menuId) => {
  const data = {
    menuId: menuId
  }
  return request({
    url: 'api/sys/deleteMenuInfo',
    data,
    method: 'post'
  })
}
