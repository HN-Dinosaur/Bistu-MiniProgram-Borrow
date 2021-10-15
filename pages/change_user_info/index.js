// pages/change_user_info/index.js
import {showToast} from "../../utils/asyncWX.js"
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    selfImg:"",
    lendImg:"",
    teacherImg:"",
    base64SelfImg:"",
    base64LendImg:"",
    base64TeacherImg:"",
    isBorrow:true,
    canTakeAway:true,
    userInfo:""
  },
  userInfo:{
    selfName:"",
    lendName:"",
    teacherName:"",
    lendTime:"",
    method:"借用",
    base64SelfImg:"",
    base64LendImg:"",
    base64TeacherImg:""
  },
  onShow: function () {
    //从缓存中拿出
    this.isCanTakeAway()
    const selfImg = wx.getStorageSync('selfImg')
    const lendImg = wx.getStorageSync('lendImg')
    const teacherImg = wx.getStorageSync('teacherImg')
    this.toBase64Code(selfImg,1)
    this.toBase64Code(lendImg,2) 
    this.toBase64Code(teacherImg,3)
  
    //如果重新进入修改信息界面  则丰富用户体验
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo.selfName != undefined){
      this.userInfo = userInfo
    }
    // 对当前属性赋值使页面中出现签名图片
    this.setData({
      selfImg:selfImg,
      lendImg: lendImg,
      teacherImg: teacherImg,
      userInfo: this.userInfo,
      isBorrow: this.userInfo.method == "借用"
    })

  },
  isCanTakeAway(){
    const verification = wx.getStorageSync('verificationInfo')
    this.setData({
      canTakeAway:verification.isStudent
    })
  },
  toBase64Code(path,method){
    wx.getFileSystemManager().readFile({
      filePath: path,
      encoding:'base64',
      success:(result)=>{
        if(method === 1){
          this.setData({
            // base64SelfImg:'data:image/png;base64,'+ result.data
            base64SelfImg:result.data
          })
        }else if(method === 2){
          this.setData({
            base64LendImg:result.data
          })
        }else if(method === 3){
          this.setData({
            base64TeacherImg:result.data
          })
        }
      }  
    })
  },
  handleSelfNameInput(e){
    this.userInfo.selfName = e.detail.value
    wx.setStorageSync('userInfo', this.userInfo)
  },
  handleLendNameInput(e){
    this.userInfo.lendName = e.detail.value
    wx.setStorageSync('userInfo', this.userInfo)
  },
  handleTeacherNameInput(e){
    this.userInfo.teacherName = e.detail.value
    wx.setStorageSync('userInfo', this.userInfo)
  },
  handleLendTime(e){
    this.userInfo.lendTime = e.detail.value
    wx.setStorageSync('userInfo', this.userInfo)
  },
  handleMethodBorrow(e){
    this.userInfo.method = "借用"
    wx.setStorageSync('userInfo', this.userInfo)
  },
  handleMethodBring(e){
    this.userInfo.method = "签领"
    wx.setStorageSync('userInfo', this.userInfo)
  },
  async handleSubmit(){
    this.userInfo.base64SelfImg = this.data.base64SelfImg
    this.userInfo.base64LendImg = this.data.base64LendImg
    this.userInfo.base64TeacherImg = this.data.base64TeacherImg
    wx.setStorageSync('userInfo', this.userInfo)
    if(this.userInfo.selfName == "" || this.userInfo.lendName == "" || this.userInfo.teacherName == "" || this.userInfo.lendTime == "" || this.userInfo.base64SelfImg == "" || this.userInfo.base64LendImg == "" || this.userInfo.base64TeacherImg == ""){
      await showToast({title:"请填写完借用信息"})
    }else{ 
        wx.setStorageSync('userInfo', this.userInfo)
        wx.switchTab({
          url: '../cart/index',
        })
    }
    
  }
})