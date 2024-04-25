// pages/detail-song/detail-song.js
import { getPlaylistDetail } from '../../services/music'
import rankingStore from '../../store/rankingStore'
import recommendStore from '../../store/recommendStore'
Page({
  data: {
    songs: [],
    type: 'ranking',
    key: "newRanking",
    songInfos: {},
    id: ''
  },
  onLoad(options) {
    // recommendStore.onState('recommendSongs', (value) => {
    //   this.setData({songs: value})
    // })
    // 1.确定获取数据的类型
    // type:ranking -> 榜单数据
    // type: recommend -> 推荐数据
    const type = options.type
    this.setData({type})
    if(type === "ranking") {
      const key = options.key
      this.data.key = key
      rankingStore.onState(key, this.handleRanking)
    } else if(type === "recommend") {
      this.data.key = "recommendSongInfo"
      recommendStore.onState("recommendSongInfo", this.handleRanking)
    } else if (type === "menu") {
      const id = options.id
      this.data.id = id
      this.fetchMenuSongInfo(id)
    }
    
  },

  async fetchMenuSongInfo(id) {
    const res = await getPlaylistDetail(id)
    this.setData({
      songInfos: res.playlist
    })
  },
  // 获取store中榜单数据
  handleRanking(value) {
    // if(this.data.type == "recommend") {
    //   value.name = "推荐歌曲"
    // }
    this.setData({songInfos: value})
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },

  onUnload() {
    if(this.data.type == "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking)
    } else if(this.data.type === "recommend") {
      recommendStore.offState(this.data.key, this.handleRanking)
    }
  }
})