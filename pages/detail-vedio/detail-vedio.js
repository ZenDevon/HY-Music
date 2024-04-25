// pages/detail-vedio/detail-vedio.js
import {getMVUrl, getMVInfo, getMVRelated} from '../../services/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    mvUrl: '',
    videoInfo: {},
    videoCommend: [], //推荐视频
    danmuList: [
      {text: "哈哈哈，真好听", color: "#ff0000", time: 3},
      {text: "呵呵呵，不错哦", color: "#ffff00", time: 10}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let id = options.id
    this.setData({id})
    this.fetchMVUrl(id)
    this.fetechMVDetail(id)
    this.fetechRecommend()
  },
  async fetchMVUrl(id) {
    const res = await getMVUrl(id)
    this.setData({mvUrl: res.data.url})
  },
  async fetechMVDetail(id) {
    const res = await getMVInfo(id)
    this.setData({videoInfo: res.data})
  },
  // 获取推荐视频
  async fetechRecommend() {
    const res = await getMVRelated()
    this.setData({videoCommend: res.result})
  }
})