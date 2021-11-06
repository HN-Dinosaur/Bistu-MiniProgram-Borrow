// pages/return/index.js
import {showToast} from "../../utils/asyncWX.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    returnBase64Self:"",
    returnBase64Lend:"",
    returnSelfImg:"",
    returnLendImg:"",
    returnSelfName:"",
  },
  returnInfo:{
    id:"",
    reHuman:"",
    reHumanSign:"",
    reUsername:"",
    reUserSign:""
  },
  onShow: function () { 
    //返还人姓名  签名
    const returnSelfImg = wx.getStorageSync('returnSelfImg')
    const returnSelfName = wx.getStorageSync('returnSelfName')
    //经办人姓名 签名
    const returnLendImg = wx.getStorageSync('returnLendImg')
    this.returnInfo.id = wx.getStorageSync('returnId')

    this.toBase64Code(returnSelfImg,5)
    this.toBase64Code(returnLendImg,6)
    this.setData({
      returnSelfImg,
      returnLendImg,
      returnSelfName,
    })
  },
  toBase64Code(path,method){
    wx.getFileSystemManager().readFile({
      filePath: path,
      encoding:'base64',
      success:(result)=>{
        if(method === 5){
          this.setData({
            // base64SelfImg:'data:image/png;base64,'+ result.data
            returnBase64Self:result.data
          })
        }else if(method === 6){
          this.setData({
            returnBase64Lend:result.data
          })
        }
      }  
    })
  },
  handleReturnSelfNameInput(e){
    //返还人姓名
    const returnSelfName = e.detail.value
    this.returnInfo.reUsername = returnSelfName
    wx.setStorageSync('returnSelfName', returnSelfName)
  },
  handleReturnLendNameInput(e){
    //返还经办人姓名
    const returnLendName = e.detail.value
    this.returnInfo.reHuman = returnLendName
  },
  async handleSubmit(){
    this.returnInfo.reUserSign = this.data.returnBase64Self
    this.returnInfo.reHumanSign = this.data.returnBase64Lend
    this.returnInfo.reUsername = this.data.returnSelfName
    const returnInfo = this.returnInfo
    console.log(returnInfo)
    if(returnInfo.reUsername == "" || returnInfo.reHuman == "" || returnInfo.reUserSign == "" || returnInfo.reHumanSign == ""){
      await showToast({title:'请填写完全部信息'})
    }else{
      // console.log(returnInfo)
      const token = wx.getStorageSync('token')
      const header = {"token":token,"content-type":"application/json"}
      const url = 'http://59.64.75.5:8104/api/princi/auth/return/' + this.returnInfo.id
      // console.log(url)
      wx.request({
        timeout:1000,
        url: url,
        method:'POST',
        header:header,
        data:this.returnInfo,
        success:(result)=>{
          // console.log(result)
          if(result.data.code == 200){
            wx.removeStorage({
              key: 'returnId',
            })
            wx.showToast({
              title: '返还成功',
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1,
              })
            },1000)
          }else{
            wx.showToast({
              icon:'error',
              title: '返还失败',
            })
          }
        }
      })
    }
  }

})