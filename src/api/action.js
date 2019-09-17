import request from '@/libs/request'

/**
 * 获取菜单下操作列表
 * @param menuId
 */
export const getActionsByMenu = (menuId) => {
  const params = {menuId: menuId}
  return request({
    url: 'api/sys/queryPermisByMenuId',
    params,
    method: 'get'
  })
}

/**
 * 获取角色信息
 */
export const getRoles = () => {
  return request({
    url: 'api/sys/getRoles',
    method: 'get'
  })
}

/**
 * 添加权限
 * @param data
 */
export const addAction = (data,parentId) => {
  const info = {
    parentId: parentId,
    fullName: data.actionName,
    menuAuthority: data.actionCode,
    operType: 'button',
    menuState: data.status
  }
  return request({
    url: 'api/sys/saveMenuInfo',
    data: info,
    method: 'post'
  })
}

/**
 * 添加权限
 * @param data
 */
export const saveUser = (data,orgId,roles) => {
  const info = {
    orgId: orgId,
    roles: roles,
    userStatus:data.userStatus,
    userName: data.userName,
    userPhone: data.userPhone,
    userAccount:data.userAccount,
    userPass:data.userPass
  }
  return request({
    url: 'api/sys/saveUser',
    data: info,
    method: 'post'
  })
}

/**
 * 添加权限
 * @param data
 */
export const updateUser = (data,roles) => {
  const info = {
    roles: roles,
    userId:data.userId,
    userStatus:data.userStatus,
    userName: data.userName,
    userPhone: data.userPhone,
    orgId:data.orgId,
    userAccount:data.userAccount,
    userPass:data.userPass
  }
  return request({
    url: 'api/sys/modifyUser',
    data: info,
    method: 'post'
  })
}


/**
 * 删除用户信息
 * @param userId
 */
export const delUserInfo = (userId) => {
  const data = {
    userIds:userId
  }
  return request({
    url: 'api/sys/delUserInfo',
    data,
    method: 'post'
  })
}
/**
 * 校验权限是否存在
 * @param data
 */
export const checkAuthOnelyone = (parentId,actionCode) => {
  const info = {
    menuAuthority: actionCode,
    parentId:parentId
  }
  return request({
    url: 'api/sys/checkAuthOnelyone',
    data: info,
    method: 'post'
  })
}

/**
 * 校验权限是否存在
 * @param data
 */
export const checkUserAccountOnelyOne = (userAccount) => {
  const info = {
    userAccount: userAccount,
  }
  return request({
    url: 'api/sys/checkUserAccountOnelyOne',
    data: info,
    method: 'post'
  })
}

/**
 * 更新操作
 * @param data
 */
export const updateAction = (data) => {
  const info = {
    menuId: data.menuId,
    fullName: data.actionName,
    menuAuthority: data.actionCode,
    menuState: data.status
  }
  return request({
    url: 'api/sys/modifyMenuInfo',
    data: info,
    method: 'post'
  })
}


/**
 * 删除操作
 * @param actionId
 */
export const removeAction = (menuId) => {
  const data = {
    menuId
  }
  return request({
    url: 'api/sys/deleteMenuInfo',
    data,
    method: 'post'
  })
}


/**
 * 根据机构查询用户信息
 * @param orgId
 */
export const getUserListByOrgId = (pageInfo, data) => {
  const params = {current: pageInfo.current,size:pageInfo.size, orgId: data.orgId,userName:data.userName,userAccount:data.userAccount,userStatus:data.userStatus}
  return request({
    url: 'api/sys/getUserListByOrgId',
    params,
    method: 'get'
  })
}

