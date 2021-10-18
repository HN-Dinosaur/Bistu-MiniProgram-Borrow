// app.js
App({
  onLaunch() {
    //就获取当前时间  然后存储到缓存里
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

 
    // 登录 
    wx.login({
      success: result => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const js_code = result.code
        const appid = 'wxfebf5c0be605da58'
        const secret = 'a996eb5519b343a297949318f0cf35b9'
        const grant_type = 'authorization_code'
        const param = {js_code,appid,secret,grant_type}

        wx.showLoading({
          title: '登录中',
        })
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          method:'GET',
          data:param,
          //拿到openid
          success: (result)=>{
            const openid = result.data.openid
            const requestUrl = 'http://59.64.75.5:8104/api/user/login?openid=' + openid 
            //判断这个用户是否已经存在于数据库中了
            wx.request({
              url: requestUrl,
              method:"POST",
              success: (result)=>{
                const authStatus = result.data.data.authStatus
                const token = result.data.data.token
                if(authStatus == "0"){ 
                  //未认证 跳转
                  wx.setStorageSync("token",token)
                  wx.redirectTo({ 
                    url: '../verification/index',
                  })
                }else{
                  wx.setStorageSync("token",token)
                }
              },
              fail:(error)=>{
                console.log(error)
              },
              complete:()=>{
                wx.hideLoading()
              }
            })
          }
        })
          }, 
          fail: (error)=>{
            console.log(error)
          }
          
        })


  },
  globalData: {
    userInfo: null
  }
})
