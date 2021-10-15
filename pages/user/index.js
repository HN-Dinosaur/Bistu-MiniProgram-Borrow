// pages/cart/index.js
import {login} from "../../utils/asyncWX.js"
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */

  data: {
    verification:{
      name:"待填写",
      college:"待填写",
      sex:"待填写",
      schoolClass:"待填写",
      major:"待填写",
      no:"待填写"
    }
  },
  onLoad(){
    
  },
  onShow(){
    const verification = wx.getStorageSync('verificationInfo')
    if(verification.name != undefined){
      this.setData({verification})
    }
  },
  handleModify(){
    console.log(1)
  }

})