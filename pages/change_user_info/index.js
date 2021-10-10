// pages/change_user_info/index.js
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
    userInfo:{
      selfName:"",
      lendName:"",
      teacherName:"",
      lendTime:"",
      method:"",
      base64SelfImg:"",
      base64LendImg:"",
      base64TeacherImg:""
    }
  },
  selfName:"",
  lendName:"",
  teacherName:"",
  lendTime:"",
  method:"借用",
  onShow: function () {
    //从缓存中拿出
    const selfImg = wx.getStorageSync('selfImg')
    const lendImg = wx.getStorageSync('lendImg')
    const teacherImg = wx.getStorageSync('teacherImg')
    
    this.toBase64Code(selfImg,1)
    this.toBase64Code(lendImg,2)
    this.toBase64Code(teacherImg,3)
    // 对当前属性赋值使页面中出现签名图片
    this.setData({
      selfImg:selfImg,
      lendImg: lendImg,
      teacherImg: teacherImg
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
    this.selfName = e.detail.value
  },
  handleLendNameInput(e){
    this.lendName = e.detail.value
  },
  handleTeacherNameInput(e){
    this.teacherName = e.detail.value
  },
  handleLendTime(e){
    this.lendTime = e.detail.value
  },
  handleMethodBorrow(e){
    this.method = "借用"
  },
  handleMethodBring(e){
    this.method = "签领"
  },
  handleSubmit(){
    const userInfo = this.data.userInfo
    userInfo.selfName = this.selfName
    userInfo.lendName = this.lendName
    userInfo.teacherName = this.teacherName
    userInfo.lendTime = this.lendTime
    userInfo.method = this.method
    userInfo.base64SelfImg = this.data.base64SelfImg
    userInfo.base64LendImg = this.data.base64LendImg
    userInfo.base64TeacherImg = this.data.base64TeacherImg
    this.setData({userInfo})
    wx.setStorageSync('userInfo', userInfo)
  }
})