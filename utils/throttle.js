export default function hythrottle(fn, interval = 200, {leading = true, trailing = false} = {} ) {
  let startTime = 0
  let timer = null
  const _throttle = function(...args) {
    return new Promise((resolve, reject) => {
      try {
        // 1.获取当前事件
        const nowTime = new Date().getTime()
        // 对立即执行函数进行控制
        if(!leading && startTime === 0) {
          startTime = nowTime
        }
        // 2.计算需要等待的时间执行函数
        const waitTime = interval - (nowTime = startTime)
        if(waitTime <= 0) {
          if(timer) clearTimeout(timer)
          const res = fn.apply(this, args)
          resolve(res)
          startTime = nowTime
          timer = null
          return
        }
      } catch (error) {
        
      }
    })
  }
}