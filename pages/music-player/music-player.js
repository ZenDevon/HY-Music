// pages/music-player/music-player.js
import { get } from "lodash"
import { getSongDetail, getSongLyric } from "../../services/player"
import {parseLyric} from '../../utils/parse-lyric'
import { throttle } from 'underscore'

const app = getApp()

// 创建播放器
const audioContext = wx.createInnerAudioContext()
Page({
  data: {
    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,
    id: '', //音乐id
    currentSong: {}, //歌曲
    lyricInfos: [], //歌词
    contentHeight: 0, //内容高度
    currentTime: 0,
    durationTime: 0,
    currentLyricText: '', //一句歌词
    currentLyricIndex: -1,
    sliderValue: 0, //滑块位置
    isSliderChangeing: false,
    isWaiting: false,
    isPlaying: true,
  },
  onLoad(options) {
    this.setData({ contentHeight: app.globalData.contentHeight })
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })

    // 2.根据id获取歌曲的详情
    getSongDetail(id).then(res => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt
      })
    })
    // 3.根据id获取歌词的信息
    getSongLyric(id).then(res => {
      const lrcString = res.lrc.lyric
      const lyricInfos = parseLyric(lrcString)
      this.setData({lyricInfos})
      console.log(lyricInfos)
    })
    // 播放当前歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}`
    audioContext.autoplay = true

    // 监听播放的进度
    const throttleUpdateProgress = throttle(this.updateProgress, 1000, {
      leading: false,
      trailing: false
    })
    audioContext.onTimeUpdate(() => {
      // 1.更新歌曲的进度
      if (!this.data.isSliderChangeing && !this.data.isWaiting) {
        throttleUpdateProgress()
      }
      // 2.匹配正确的歌词
      if(!this.data.lyricInfos.length) return
      let index = this.data.lyricInfos.length - 1
      for(let i = 0; i < this.data.lyricInfos.length; i ++) {
        const info = this.data.lyricInfos[i]
        if(info.time > audioContext.currentTime * 1000) {
          index = i - 1
          break
        }
      }
      if(index === this.data.currentLyricIndex) return
      const currentLyricText = this.data.lyricInfos[index].text
      this.setData({currentLyricText, currentLyricIndex: index})
    })
    audioContext.onWaiting(() => {
      audioContext.pause()
    })
    audioContext.onCanplay(() => {
      audioContext.play()
    })
  },
  updateProgress() {
    // 1.记录当前时间
    // 2.修改sliderValue
    const sliderValue = this.data.currentTime / this.data.durationTime * 100
    this.setData({ 
      currentTime: audioContext.currentTime * 1000,
      sliderValue 
    })
  },
  // ============事件监听==============
  onSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },
  onNavTabItemTap(event) {
    const index = event.currentTarget.dataset.index
    this.setData({ currentPage: index })
  },
  onSliderChange(event) {
    console.log('点击了滑块')
    this.data.isWaiting = true
    setTimeout(() => {
      this.data.isWaiting = false
    }, 500)
    // 1.获取点击的滑块位置对应的值
    const value = event.detail.value
    // 2.计算出要播放的时间
    const currentTime = value / 100 * this.data.durationTime
    // 3.设置播放器，播放计算出的时间
    audioContext.seek(currentTime / 1000)
    this.setData({ currentTime, isSliderChangeing: false, sliderValue: value })
  },
  onSliderChangeing(event) {
    // 1.获取滑动到的位置的value
    const value = event.detail.value
    // 2.根据当前的值，计算出对应的时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({ currentTime })

    // 3.当前正在滑动
    this.data.isSliderChangeing = true
  },
  // 播放暂停
  onPlayOrPauseTap() {
    if(this.data.isPlaying) {
      audioContext.pause()
      this.setData({isPlaying: false})
    } else {
      audioContext.play()
      this.setData({isPlaying: true})
    }
  }
})