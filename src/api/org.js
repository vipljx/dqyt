import request from '@/libs/request'

/**
 * 获取菜单列表
 */
export const getOrgs = () => {
  return request({
    url: 'api/sys/queryOrgAll',
    method: 'get'
  })
}

/**
 * 添加机构
 * @param data
 */
export const addOrg = (data) => {
  const info = {
    orgParentId: data.parentId,
    orgName: data.menuName,
  }
  return request({
    url: 'api/sys/saveOrgInfo',
    data: info,
    method: 'post'
  })
}

/**
 * 更新菜单
 * @param data
 */
export const updOrgInfo = (data) => {
  const info = {
    orgId:data.menuId,
    orgParentId: data.parentId,
    orgName: data.menuName,
  }
  return request({
    url: 'api/sys/updOrgInfo',
    data:info,
    method: 'post'
  })
}
/**
 * 删除菜单
 * @param menuId
 */
export const delOrgInfo = (menuId) => {
  const data = {
    orgId: menuId
  }
  return request({
    url: 'api/sys/delOrgInfo',
    params:data,
    method: 'get'
  })
}
