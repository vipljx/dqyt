import request from '@/libs/request'

/**
 * 获取角色列表
 * @param page
 * @param limit
 */
export const getLogs = (pageInfo) => {
  const params = {current: pageInfo.page,size:pageInfo.size, userName:pageInfo.userName,userAccount:pageInfo.userAccount}
  return request({
    url: 'api/sys/queryLogList',
    params,
    method: 'get'
  })
}

