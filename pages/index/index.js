// index.js
// 获取应用实例
const app = getApp()
import {showToast} from "../../utils/asyncWX.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    historyProducts:"",
    tips:""
  },
  page:1,
  limit:10,
  totalPageNum:1,

  onShow: function () {
    //当没有认证信息时 主界面显示认证
    if(!wx.getStorageSync('verificationInfo').name){
      this.setData({tips:'请完成认证后使用'})
    }else{
      this.page = 1 
      this.sendRequest() 
    }
  },
   //发送请求
  async sendRequest(){
    try{
      const page = this.page
      const limit = this.limit
      // 参数的合并
      let url = "http://59.64.75.5:8104/api/princi/auth/records/" + page + "/" + limit
      // console.log(url)
      const token = wx.getStorageSync('token')
      const header = {"token":token}

      //发送请求
      wx.request({
        //超时
        timeout:2000,
        url: url,
        method:'GET',
        header:header,
        success:(result)=>{
          // console.log(result)
          //请求后端成功
          if(result.data.code == 200){
            let total = result.data.data.total
            this.totalPageNum = Math.ceil(total / this.limit)
            //找到未归还的物品
            const historyProducts = (result.data.data.records).reverse().filter(item => item.param.returnStatus == "未归还")
            //有两页以上的数据
            if(this.page >= 2){
              this.setData({
                historyProducts:[...this.data.historyProducts,...historyProducts.reverse()]
              })
            }else if(this.page === 1){
              this.setData({
                historyProducts:historyProducts.reverse()
              })
            }
            if(historyProducts.length == 0){
              this.setData({tips:'目前没有借出任何物品'})
            }
            //函数结束，下拉刷新结束
            wx.stopPullDownRefresh()
            //请求后端失败
          }else{ 
            this.setData({tips:'请连接校园网后重试'})
          }
        },
        fail:(error)=>{
          this.setData({tips:'请连接校园网后重试'})
        }
      })
    }catch(error){
      this.setData({tips:'请连接校园网后重试'})
    }
  }, 
  // 下拉触底函数
  async onReachBottom(){
    if(this.page >= this.totalPageNum){
      await showToast({title:"已展示全部物品"})
    }else{
      this.page++
      this.sendRequest()
    }
  },
    // 下拉刷新功能
  onPullDownRefresh(){
    this.setData({historyProducts:[]})
    this.page=1
    this.sendRequest()
  }

})
