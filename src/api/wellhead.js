import request from '@/libs/request'

/**
 * 获取井口信息
 * @param page
 * @param limit
 */
export const queryWellheadConfigList = (pageInfo) => {
  const params = {
    current: pageInfo.page,
    size: pageInfo.size,
    deviceName: pageInfo.deviceName,
    workState: pageInfo.workState,
    isOnline: pageInfo.isOnline
  }
  return request({
    url: 'api/sys/queryWellheadConfigList',
    params,
    method: 'get'
  })
}

/**
 * 根据id获取井口信息
 * @param page
 * @param limit
 */
export const queryWellheadConfigById = (wellheadId) => {
  return request({
    url: 'api/sys/queryWellheadConfigById',
    params: { wellheadId },
    method: 'get'
  })
}

/**
 * 校验是否是末级机构
 * @param page
 * @param limit
 */
export const checkOrgLast = (orgId) => {
  return request({
    url: 'api/sys/checkOrgLast',
    params: { orgId },
    method: 'get'
  })
}
/**
 * 更新井口信息
 * @param data
 */
export const updWellheadConfig=(data)=>{
  return request({
    url: 'api/sys/updWellheadConfig',
    data,
    method: 'post'
  })
}

