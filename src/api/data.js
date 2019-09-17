import request from '@/libs/request'

/**
 * 保存错误日志
 * @param info
 */
export const saveErrorLogger = info => {
  return request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

/**
 * 获取第三方登录配置
 */
export const loginConfig = () => {
  return request({
    url: 'auth/login/config',
    method: 'get'
  })
}

/**
 * 获取服务列表
 */
export const getServiceList = () => {
  return request({
    url: 'service/list',
    method: 'get'
  })
}
