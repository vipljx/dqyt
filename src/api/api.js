import request from '@/libs/request'

/**
 * 获取接口列表
 * @param page
 * @param limit
 */
export const getApis = ({page, limit, path, apiName, apiCode, serviceId}) => {
  const params = {page: page, limit: limit, path: path, apiName: apiName, apiCode: apiCode, serviceId: serviceId}
  return request({
    url: 'base/api',
    params,
    method: 'get'
  })
}

/**
 * 获取所有接口
 */
export const getAllApi = (serviceId) => {
  const params = {serviceId: serviceId}
  return request({
    url: 'base/api/all',
    params: params,
    method: 'get'
  })
}

/**
 * 添加接口
 * @param apiCode
 * @param apiName
 * @param apiCategory
 * @param serviceId
 * @param path
 * @param status
 * @param priority
 * @param apiDesc
 * @param isAuth
 */
export const addApi = ({apiCode, apiName, apiCategory, serviceId, path, status, priority, apiDesc, isAuth}) => {
  const data = {
    apiCode: apiCode,
    apiName: apiName,
    apiCategory: apiCategory,
    serviceId: serviceId,
    path: path,
    status: status,
    priority: priority,
    apiDesc: apiDesc,
    isAuth: isAuth
  }
  return request({
    url: 'base/api/add',
    data,
    method: 'post'
  })
}

/**
 * 更新接口
 * @param apiId
 * @param apiCode
 * @param apiName
 * @param apiCategory
 * @param serviceId
 * @param path
 * @param status
 * @param priority
 * @param apiDesc
 * @param isAuth
 */
export const updateApi = ({apiId, apiCode, apiName, apiCategory, serviceId, path, status, priority, apiDesc, isAuth}) => {
  const data = {
    apiId: apiId,
    apiCode: apiCode,
    apiName: apiName,
    apiCategory: apiCategory,
    serviceId: serviceId,
    path: path,
    status: status,
    priority: priority,
    apiDesc: apiDesc,
    isAuth: isAuth
  }
  return request({
    url: 'base/api/update',
    data,
    method: 'post'
  })
}

/**
 * 删除接口
 * @param apiId
 */
export const removeApi = (apiId) => {
  const data = {
    apiId: apiId
  }
  return request({
    url: 'base/api/remove',
    data,
    method: 'post'
  })
}
