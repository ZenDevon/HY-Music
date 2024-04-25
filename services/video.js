import {hyRequest} from './index'

// 获取mv
export function getTopMV(offset = 0, limit = 20,) {
  return hyRequest.get({
    url: '/top/mv',
    data: {
      limit,
      offset
    }
  })
}
// 获取mv播放地址
export function getMVUrl(id) {
  return hyRequest.get({
    url: '/mv/url',
    data: {
      id
    }
  })
}
// 获取mv详情
export function getMVInfo(mvid) {
  return hyRequest.get({
    url: '/mv/detail',
    data: {
      mvid
    }
  })
}

// 获取推荐视频
export function getMVRelated() {
  return hyRequest.get({
    url: '/personalized/mv',
  })
}