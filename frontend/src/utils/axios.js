import axios from 'axios'

// 创建axios实例
const instance = axios.create({
  baseURL: '',  // 移除 baseURL，因为我们直接使用完整路径
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    console.log('Full Request Config:', config)
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    console.log('Full Response:', response)
    return response
  },
  error => {
    console.error('Full Response Error:', error.response || error)
    return Promise.reject(error)
  }
)

export default instance 