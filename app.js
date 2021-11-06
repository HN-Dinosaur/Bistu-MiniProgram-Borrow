import { showToast } from "./utils/asyncWX"

// app.js
App({
  onLaunch() {
    // 登录 
    wx.login({
      success: result => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const js_code = result.code
        const appid = 'wxfebf5c0be605da58'
        const secret = 'a996eb5519b343a297949318f0cf35b9'
        const grant_type = 'authorization_code'
        const param = {js_code,appid,secret,grant_type}
        //拿openid
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          method:'GET',
          data:param,
          //拿到openid
          //认证
          success: (result)=>{
            const openid = result.data.openid
            const requestUrl = 'http://59.64.75.5:8104/api/user/login?openid=' + openid 
            //判断这个用户是否已经存在于数据库中了
            wx.request({
              timeout:1000,
              url: requestUrl,
              method:"POST",
              success: (result)=>{ 
                //网络请求后端成功
                if(result.data.code == 200){
                    // console.log(result)
                  const authStatus = result.data.data.authStatus
                  const token = result.data.data.token
                  if(authStatus == "0"){
                    //未认证 跳转
                    wx.setStorageSync("token",token)
                    wx.redirectTo({  
                      url: '../verification/index',
                    }) 
                    //已认证
                  }else{
                    wx.setStorageSync("token",token)
                  }
                //请求后端失败
                }else{
                  //什么都不做
                }
              },
              //认证环节失败
              fail:(error)=>{
                console.log(error)
              },
            })
          },
          //拿不到openid
          fail:(error)=>{
            console.log(error)
          }
        })
      }, 
      //login失败
      fail: (error)=>{
        console.log(error)
      } 
    })
  }, 
  globalData: {
    userInfo: null
  }
})
