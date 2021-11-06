import {showToast} from "../../utils/asyncWX.js"
Page({

  data: {
    userInfo:null,
    product:null
  },
  uploadInfo:{
    equipId:0,
    equipName:"",
    username:"",
    userSign:"",
    lendHuman:"",
    leHumanSign:"",
    tecName:"",
    tecSign:"",
    borrowTime:""
  },
  onShow(){
    this.setData({
      userInfo:wx.getStorageSync('userInfo'),
      product:wx.getStorageSync('product')
    })
  },
  async handleUpload(){
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
    //上传信息
    this.requestResult()
  },
  wrapperInfo(){
    const wrapInfo = this.uploadInfo
    const userInfo = this.data.userInfo
    const product = this.data.product

    wrapInfo.equipId = product.id
    wrapInfo.equipName = product.name

    wrapInfo.username = userInfo.selfName
    wrapInfo.userSign = userInfo.base64SelfImg
    wrapInfo.lendHuman = userInfo.lendName
    wrapInfo.leHumanSign = userInfo.base64LendImg
    wrapInfo.tecName = userInfo.teacherName
    wrapInfo.tecSign = userInfo.base64TeacherImg
    wrapInfo.borrowTime = parseInt(userInfo.lendTime)
    this.uploadInfo = wrapInfo
  },
  async requestResult(){
    // console.log(this.uploadInfo)
    //封装好参数  
    this.wrapperInfo()
    const token = wx.getStorageSync('token')
    const header = {"token":token,"content-type":"application/json"}
    // console.log(header) 
    wx.request({
      timeout:1000,
      url: 'http://59.64.75.5:8104/api/princi/auth/borrow',
      method:"POST",
      data:this.uploadInfo, 
      header:header,
      success:(result)=>{
        console.log(result)
        if(result.data.code == 200){
          //从缓存中删除
          wx.removeStorage({
            key: 'product',
          })
          wx.showToast({
            title: '成功借出',
          })
          //延迟跳转
          setTimeout(function(){
            wx.switchTab({
              url: '../search/index',
            })
          },1000)
        }else{
          wx.showToast({
            icon:'error',
            title:'借出失败',
          })
        }
      },
      fail:(error)=>{
        wx.showToast({
          title: '请在连接校园网后重试',
        })
      }
    })
  }
})