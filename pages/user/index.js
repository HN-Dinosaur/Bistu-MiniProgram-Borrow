// pages/cart/index.js
import {login} from "../../utils/asyncWX.js"
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */

  data: {
  },
  onLoad(){
    
  },
  async handleLogin(){
    //wx.login 先拿code
    const result = await login()
    const js_code = result.code
    const appid = 'wxfebf5c0be605da58'
    const secret = 'a996eb5519b343a297949318f0cf35b9'
    const grant_type = 'authorization_code'
    const param = {js_code,appid,secret,grant_type}
    const resultAPPID = await request({url:'https://api.weixin.qq.com/sns/jscode2session',data:param,method:'get'})
    // console.log(resultAPPID)
    wx.setStorageSync('openid', resultAPPID.data.openid)
    //oGMK75Jqo3ZfATxO__MBJ7xqN0RE
  }
})