import { request } from "../../request/index.js"
import {showModal,showToast} from "../../utils/asyncWX.js"
Page({

  data: {
    userInfo:null,
    product:null
  },
  onShow(){

    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      product:wx.getStorageSync('product')
    })
  },
  async handleUpload(){

    const openid = wx.getStorageSync('openid')
    const product = wx.getStorageSync('product')
    const userInfo = wx.getStorageSync('userInfo')
    if(!product){
      await showToast({title:"请先选择物品"})
      return
    }
    if(!userInfo){
      await showToast({title:"请先填写基本信息"})
      return 
    }
    if(!openid){
      await showToast({title:"请先登录"})
      return
    }
        //上传信息
    this.uploadInfo()
  },
  async uploadInfo(){
    
  }
})