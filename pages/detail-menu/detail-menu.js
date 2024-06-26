// pages/detail-menu/detail-menu.js
import {getSongMenuTag, getSongMenuList} from '../../services/music'
Page({
  data: {
    songMenus: []
  },
  onLoad(options) {
    this.fetchAllMenuList()
  },
  // 发送网络请求
  async fetchAllMenuList() {
    wx.showLoading()
    // 获取tags
    const tagRes = await getSongMenuTag()
    const tags = tagRes.tags
    // 根据tags获取歌单详情
    const allPromises = []
    for(const tag of tags) {
      const promise = getSongMenuList(tag.name)
      allPromises.push(promise)
    }
    // 获取到所有的数据之后，调用一次setData
    Promise.all(allPromises).then(res => {
      this.setData({songMenus: res})
      wx.hideLoading()
    })
  }
})