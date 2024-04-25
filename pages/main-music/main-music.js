// pages/main-music/main-music.js
import { getMusicBanner, getPlaylistDetail, getSongMenuList } from '../../services/music'
import recommendStore from '../../store/recommendStore'
import querySelect from '../../utils/query-select'
import { throttle } from 'lodash'
import rankingStore from '../../store/rankingStore'

let querySelectThrottle = throttle(querySelect, 600, { 'trailing': false })
const app = getApp()

Page({
  data: {
    searchValue: '',
    bannerList: [], //轮播图数据
    bannerHeight: 0, //轮播图高度
    screenWidth: 375, //屏幕宽度

    recommendSongs: [], //推荐歌单

    hotMenuList: [], //歌单数据
    recMenuList: [],
    // 巅峰榜数据
    isRankingData: false,
    rankingInfo:  {}
  },
  onLoad() {
    this.fetchMusicBanner()
    // this.fetchREcommendSongs()
    this.fetchSongMenuList()

    // 发起action
    recommendStore.onState("recommendSongInfo", this.handleRecomendSongs)
    recommendStore.dispatch('fetchRecommendSongsAction')

    rankingStore.onState("newRanking", this.getRankingHanlder('newRanking'))
    rankingStore.onState("originRanking", this.getRankingHanlder('originRanking'))
    rankingStore.onState("upRanking", this.getRankingHanlder('upRanking'))
    rankingStore.dispatch("fetchRankingDataAction")

    // 获取屏幕的尺寸
    this.setData({ screenWidth: app.globalData.screenWidth })
  },
  // 从store中获取数据
  handleRecomendSongs(value) {
    if(!value.tracks) return
    this.setData({ recommendSongs: value.tracks.slice(0, 6) })
  },
  // handleNewRanking(value) {
  //   console.log("新歌榜", value)
  //   const newRankingInfos = {...this.data.rankingInfo, newRanking: value}
  //   this.setData({rankingInfo: newRankingInfos})
  // },
  // handleOriginRanking(value) {
  //   console.log("原创榜", value)
  //   const newRankingInfos = {...this.data.rankingInfo, originRanking: value}
  //   this.setData({rankingInfo: newRankingInfos})
  // },
  // handleUpRanking(value) {
  //   console.log("飙升榜", value)
  //   const newRankingInfos = {...this.data.rankingInfo, upRanking: value}
  //   this.setData({rankingInfo: newRankingInfos})
  // },
  getRankingHanlder(ranking) {
    return value => {
      if(!value.tracks) return
      this.setData({isRankingData: true})
      const newRankingInfos = {...this.data.rankingInfo, [ranking]: value}
      this.setData({rankingInfo: newRankingInfos})
    }
  },
  onUnload() {
    recommendStore.offState("recommendSongs", this.handleRecomendSongs)
    rankingStore.offState("newRanking", this.handleNewRanking)
    rankingStore.offState("originRanking", this.handleOriginRanking)
    rankingStore.offState("upRanking", this.handleUpRanking)
  },
  // 网络请求的方法封装
  async fetchMusicBanner() {
    const res = await getMusicBanner()
    this.setData({ bannerList: res.banners })
  },
  async fetchREcommendSongs() {
    const res = await getPlaylistDetail(3778678)
    const playlist = res.playlist
    const recommendSongs = playlist.tracks.slice(0, 6)
    this.setData({ recommendSongs })
  },
  fetchSongMenuList() {
    getSongMenuList().then(res => {
      this.setData({ hotMenuList: res.playlists })
    })
    getSongMenuList("华语").then(res => {
      this.setData({ recMenuList: res.playlists })
    })
  },
  // 界面的事件监听方法
  onSearchClick() {
    wx.navigateTo({ url: '/pages/detail-search/detail-search' })
  },
  onBannerImageLoad(event) {
    // 获取Image组件的高度
    querySelectThrottle(".banner-image").then(res => {
      this.setData({ bannerHeight: res[0].height })
    })
  },
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  }
})