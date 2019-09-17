import request from '@/libs/request'
import {Spin} from 'iview'

/**
 * 获取井口数据分析图表信息
 * @param i
 */
export const getDataDnalysis = (i) => {
  const params = {type: i, defaultQuery: 8, timeType: 'hour'}
  Spin.show()
  return request({
    url: '/api/portal/wellHeadDataDnalysis',
    params,
    method: 'get'
  })
}

/**
 * 获取数据分析/综合指数分析
 * @param i
 * @param deviceName
 * @param startTime
 * @param endTime
 * @param defaultQuery
 */
export const getDataDnalysisDetail = (i, deviceName, startTime, endTime, timeType, defaultQuery) => {
  const params = {
    type: i,
    defaultQuery: defaultQuery || 0,
    timeType: timeType,
    deviceName: deviceName,
    startTime: startTime,
    endTime: endTime
  }
  Spin.show()
  return request({
    url: '/api/portal/wellHeadDataDnalysis',
    params,
    method: 'get'
  })
}

/**
 * 获取井口数据分析表格信息
 * @param size
 * @param current
 * @param deviceName
 * @param startTime
 * @param endTime
 * @param timeType
 * @param defaultQuery
 */
export const getDataDnalysisTable = (deviceName, startTime, endTime, timeType, defaultQuery) => {
  const params = {
    timeType: timeType,
    deviceName: deviceName,
    startTime: startTime,
    endTime: endTime,
    defaultQuery: defaultQuery || 0
  }
  Spin.show()
  return request({
    url: '/api/portal/wellHeadDataDnalysisPage',
    params,
    method: 'get'
  })
}

/**
 * 获取井口列表
 */
export const getShaft = () => {
  Spin.show()
  return request({
    url: '/api/portal/queryWellheaadConfigList',
    method: 'get'
  })
}

/**
 * 查询前一千条数据
 * @param deviceName
 * @param startTime
 * @param endTime
 * @param type
 */
export const getDataTop = (deviceName, startTime, endTime, type) => {
  Spin.show()
  const params = {
    deviceName: deviceName,
    startTime: startTime,
    endTime: endTime,
    type: type
  }
  return request({
    url: '/api/portal/queryCCollectionDataTop1000',
    params,
    method: 'get'
  })
}

/**
 * 获取地图预警状态信息
 */
export const getWarning = () => {
  Spin.show()
  return request({
    url: '/api/portal/realTimeEarlyWarning',
    method: 'get'
  })
}

/**
 * 获取地图井信息
 */
export const getOneShaft = (deviceName) => {
  // Spin.show()
  const params = {
    deviceName: deviceName,
  }
  return request({
    url: '/api/portal/realTimeMonitoring',
    params,
    method: 'get'
  })
}

/**
 * 查询PHM设备概览设备概况信息
 */
export const getPHMInfo = () => {
  Spin.show()
  return request({
    url: '/api/portal/getPhmInfo',
    method: 'get'
  })
}

/**
 * 查询设备概览井信息列表
 * @param name
 */
export const getPHMShaftCard = (name) => {
  Spin.show()
  const params = {
    deviceName: name,
  }
  return request({
    url: '/api/portal/queryWellheaadConfigList',
    params,
    method: 'get'
  })
}

/**
 * 获取自诊井口卡片
 * @param name
 */
export const getPHMZZShaftCard = (name) => {
  Spin.show()
  const params = {
    deviceName: name,
  }
  return request({
    url: '/api/portal/getPhmSelfDiagnosisList',
    params,
    method: 'get'
  })
}

/**
 * 获取自诊概括信息
 * @param name
 */
export const getPHMZZInfo = () => {
  Spin.show()
  return request({
    url: '/api/portal/getPhmSelfDiagnosisInfo',
    method: 'get'
  })
}

/**
 * 获取PHM详细信息
 * @param name
 * @param startTime
 * @param endTime
 * @param isFlag
 * @param defaultQuery
 */
export const getPHMDetail = (name, startTime, endTime, isFlag, defaultQuery) => {
  // Spin.show()
  const params = {
    deviceName: name,
    startTime: startTime,
    isFlag: isFlag,
    endTime: endTime,
    defaultQuery: defaultQuery
  }
  return request({
    url: '/api/portal/getPhmView',
    params,
    method: 'get'
  })
}

/**
 * 获取自诊详情
 * @param wellheadId
 * @param startTime
 * @param endTime
 */
export const getPHMWarningDetail = (wellheadId, startTime, endTime) => {
  // Spin.show()
  const params = {
    wellheadId: wellheadId,
    startTime: startTime,
    endTime: endTime
  }
  return request({
    url: '/api/portal/getPhmZzView',
    params,
    method: 'get'
  })
}
