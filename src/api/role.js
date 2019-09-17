import request from '@/libs/request'

/**
 * 获取角色列表
 * @param page
 * @param limit
 */
export const getRoles = (pageInfo) => {
  const params = {current: pageInfo.page,size:pageInfo.size, roleName:pageInfo.roleName}
  return request({
    url: 'api/sys/queryRoleList',
    params,
    method: 'get'
  })
}

/**
 * 获取所有角色
 */
export const getAllRoles = () => {
  return request({
    url: 'base/role/all',
    method: 'get'
  })
}

/**
 * 添加角色
 * @param roleCode
 * @param roleName
 * @param roleDesc
 * @param status
 */
export const addRole = ({roleName, roleDesc}) => {
  const data = {
    roleName: roleName,
    roleDesc: roleDesc
  }
  return request({
    url: 'api/sys/saveRoleInfo',
    data,
    method: 'post'
  })
}

/**
 * 更新角色
 * @param roleId
 * @param roleCode
 * @param roleName
 * @param roleDesc
 * @param status
 */
export const updateRole = (data) => {
  const info = {
    roleId: data.roleId,
    roleName: data.roleName,
    roleDesc: data.roleDesc
  }
  return request({
    url: 'api/sys/modifyRoleInfo',
    data:info,
    method: 'post'
  })
}

/**
 * 删除角色
 * @param roleId
 */
export const removeRole = (roleId) => {
  const data = {
    roleIds: roleId
  }
  return request({
    url: 'api/sys/delRoleInfo',
    data,
    method: 'post'
  })
}

/**
 * 获取角色成员
 * @param roleId
 * @param userIds
 */
export const getRoleUsers = (roleId) => {
  const params = {
    roleId: roleId
  }
  return request({
    url: 'base/role/users',
    params,
    method: 'get'
  })
}

/**
 * 添加角色成员
 * @param roleId
 * @param userIds
 */
export const addRoleUsers = ({roleId, userIds}) => {
  const data = {
    roleId: roleId,
    userIds: userIds.join(',')
  }
  return request({
    url: 'base/role/users/add',
    data,
    method: 'post'
  })
}


