import {baseURL} from './config'
// 封装成函数
// export function hyRequest(options) {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       ...options,
//       success: (res) => {
//         resolve(res.data)
//       },
//       fail: reject
//     })
//   })
// }

// 封装成类 -> 实例
class HYRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }
  request(options) {
    const { url } = options
    return new Promise((reslove, reject) => {
      wx.request({
        ...options,
        url: this.baseUrl + url,
        success: (res) => {
          reslove(res.data)
        },
        fail: reject
      })
    })
  }
  get(options) {
    return this.request({...options, method: 'get'})
  }
  post(options) {
    return this.request({...options, method: 'post'})
  }
}

export const hyRequest = new HYRequest(baseURL)
// export const hyRequest = new HYRequest("http://localhost:3000")