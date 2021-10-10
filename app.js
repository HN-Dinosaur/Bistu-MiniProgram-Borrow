// app.js
App({
  onLaunch() {
    //就获取当前时间  然后存储到缓存里
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })


  },
  globalData: {
    userInfo: null
  }
})
