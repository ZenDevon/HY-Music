// pages/main-video/main-video.js
import { getTopMV } from "../../services/video"

Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },

  onLoad() {
    // 获取视频
    this.fetchTopMV()
  },
  // 获取视频
  async fetchTopMV() {
    wx.showLoading({
      title: '加载中',
    })
    const res = await getTopMV(this.data.offset)
    const newVideoList = [...this.data.videoList, ...res.data]
    this.setData({videoList: newVideoList})
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
    wx.hideLoading()
  },

  // 监听上拉和下拉刷新
  onReachBottom() {
    // 判断是否有更多数据
    if(!this.data.hasMore) return
    // 有更多数据，继续获取
    this.fetchTopMV()
  },

  async onPullDownRefresh() {
    this.setData({
      videoList: [],
      offset: 0,
      hasMore: true
    })
    await this.fetchTopMV()
    wx.stopPullDownRefresh()
  }
})