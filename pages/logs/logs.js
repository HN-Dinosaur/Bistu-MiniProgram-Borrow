// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad() {
    this.setData({
      //从缓存中拿到数组，map成一个新数组
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          //format
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  }
})
