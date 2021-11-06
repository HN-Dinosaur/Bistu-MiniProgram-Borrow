// pages/verification/index.js
import {showToast} from "../../utils/asyncWX.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMale:true,
    isStudent:true,
    isfinish:false,
    isCanBack:false,
    verification:""
  }, 
  verificationInfo:{
    name:"",
    sex:1,
    phone:"", 
    no:"",
    college:"",
    identity:0,
    grade:"",
    major:"",
    schoolClass:"",
    dept:"",
    isStudent:true,
    isMale:true
  },
  onShow(){
    const verification = wx.getStorageSync('verificationInfo')
    if(verification.name != undefined){
      this.setData({isCanBack:true})
      this.verificationInfo = verification
    }
    this.setData({
      verification:this.verificationInfo,
      isMale:this.verificationInfo.isMale,
      isStudent:this.verificationInfo.isStudent
    })
  },
  handleNameInput(e){
    this.verificationInfo.name = e.detail.value
    wx.setStorageSync('verificationInfo', this.verificationInfo)
  },
  handleRadioStudent(){
    this.verificationInfo.identity = 0
    this.verificationInfo.isStudent = true
    wx.setStorageSync('verificationInfo', this.verificationInfo)
    this.setData({isStudent:true})
  },
  handleRadioTeacher(){
    this.verificationInfo.identity = 1
    this.verificationInfo.isStudent = false
    wx.setStorageSync('verificationInfo', this.verificationInfo)
    this.setData({isStudent:false})
  },
  handleRadioMaleInput(){
    this.verificationInfo.sex = 1
    this.verificationInfo.isMale = true
    wx.setStorageSync('verificationInfo', this.verificationInfo)
    this.setData({isMale:true})
  },
  handleRadioFemaleInput(){
    this.verificationInfo.sex = 0
    this.verificationInfo.isMale = false
    wx.setStorageSync('verificationInfo', this.verificationInfo)
    this.setData({isMale:false})
  },
  handlePhoneInput(e){
    this.verificationInfo.phone = e.detail.value
    wx.setStorageSync('verificationInfo', this.verificationInfo)
  },
  handleNoInput(e){
    this.verificationInfo.no = e.detail.value
    wx.setStorageSync('verificationInfo', this.verificationInfo)
  },
  handleCollegeInput(e){
    this.verificationInfo.college = e.detail.value
    wx.setStorageSync('verificationInfo', this.verificationInfo)
  },
  handleSchoolClassInput(e){
    this.verificationInfo.schoolClass = e.detail.value
    wx.setStorageSync('verificationInfo', this.verificationInfo)
  },
  handleGradeInput(e){
    this.verificationInfo.grade = e.detail.value
    wx.setStorageSync('verificationInfo', this.verificationInfo)
  },
  handleMajorInput(e){
    this.verificationInfo.major = e.detail.value
    wx.setStorageSync('verificationInfo', this.verificationInfo)
  },
  handleDeptInput(e){
    this.verificationInfo.dept = e.detail.value
    wx.setStorageSync('verificationInfo', this.verificationInfo)
  },
  solveClickStudentAndTeacher(){
    if(this.verificationInfo.isStudent){
      this.verificationInfo.dept = ""
    }else{
      this.verificationInfo.major = ""
      this.verificationInfo.schoolClass = ""
      this.verificationInfo.grade = ""
    }
  },
  async handleSubmit(){
    //检查信息是否填充完毕
    this.isFinishAllInfomation()
    //解决又填充学生信息又填充老师信息的情况
    this.solveClickStudentAndTeacher()
    //发送网络请求
    if(this.data.isfinish){
      wx.setStorageSync('verificationInfo', this.verificationInfo)
      //发网络请求
      const url = "http://59.64.75.5:8104/api/user/auth/userAuth"
      const token = wx.getStorageSync('token')
      const header = {"token":token,"content-type":"application/json"}
      // const result = await request({url,data:this.verificationInfo,method:"POST", header})
      wx.request({
        timeout:1000,
        url: url,
        method:"POST",
        header:header,
        data:this.verificationInfo,
        success:(result)=>{
          if(result.data.code == 200){
            wx.showToast({
              icon:'success',
              title: '认证成功'
            })
            setTimeout(function(){
             //界面跳转
              wx.switchTab({
                url: '../../pages/index/index',
              })
            },1000)
          }else{
            showToast({title:'请在连接校园网后重试'})
          }
        },
        fail:(error)=>{
          showToast({title:'认证失败，请稍后重试'})
        }
      })

    }else{
      showToast({title:"请填写完全部信息"})
    }
  },
  isFinishAllInfomation(){
    const info = this.verificationInfo
    //如果是学生
    if(this.data.isStudent){
      //如果有一个为空则false
      if(info.name == "" || info.phone == "" || info.no == "" || info.college == "" || info.grade == "" || info.schoolClass == "" || info.major == ""){
        return
        //否则true
      }else{
        this.setData({isfinish:true})
      }
      //是老师
    }else{
      //如果有一个为空则false
      if(info.name == "" || info.phone == "" || info.no == "" || info.college == "" || info.dept == ""){
        return
        // 否则true
      }else{
        this.setData({isfinish:true})
      }
    }
    
  },
  handleCancel(){
    if(this.data.isCanBack){
      wx.switchTab({
        url: '../user/index',
      })

    }else{
      showToast({title:"认证信息结束才可以正常使用此小程序"})
    }
  }
})