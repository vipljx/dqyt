import axios from 'axios'
import qs from 'qs'
import config from '@/config'
import {getToken} from '@/libs/util'
import {Message, Spin} from 'iview'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
/**
 * 创建axios实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 50000  // 设置请求超时时间30s
})
/**
 * 请求参数处理
 */
service.interceptors.request.use((config) => {
    config.method === 'post'
      ? config.data = qs.stringify({...config.data})
      : config.params = {...config.params}
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  }
)
/**
 * 响应结果处理
 */
service.interceptors.response.use(
  (response) => {
    Spin.hide()
    if (response.data.code !== 0) {
      Message.error({content: response.data.msg})
    }
    return Promise.resolve(response.data)
  }, error => {
    Spin.hide()
    let message = ''
    console.log(error)
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          location.reload()
          return
        case 403:
          message = error.response.data.path + ',' + error.response.data.message
          break
        case 502:
          message = '连接服务器失败'
          break
        default:
          message = error.response.data.message ? error.response.data.message : '服务器错误'
          break
      }
      Message.error({content: message})
      // 请求错误处理
      return Promise.reject(error)
    } else {
      message = '连接服务器失败'
      Message.error({content: message})
      return Promise.reject(error)
    }
  }
)

export default service
