import {showModal,showToast} from "../../utils/asyncWX.js"
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyProducts:"",
    searchInput:""
  },
  page:1,
  limit:10,
  totalPageNum:1,

  onShow: function () {
    this.sendRequest()
  },
  handleInput(e){
    const input = e.detail.value
    this.setData({searchInput:input})
  },
  handleClickCancelButton(e){
    this.setData({
      searchInput:"",
    })
    this.page = 1
    this.sendRequest()
  },
  async handleClickSearchButton(){
    // const historyProducts = this.data.historyProducts
    const url = "http://59.64.75.5:8104/api/princi/auth/records/1/3?name=" + this.data.searchInput
    const token = wx.getStorageSync('token')
    const header = {"token":token}
    // const resultArray = historyProducts.filter((item)=>item.equipName == this.data.searchInput)
    wx.request({
      url: url,
      method:"GET",
      header:header,
      success:(result)=>{
        console.log(result)
      }
    })
    // console.log(resultArray)
    // this.setData({
    //   historyProducts:resultArray
    // })
  },
  handleSelect(e){
    const select = e.currentTarget.dataset.index
    const historyProducts = this.data.historyProducts
    const id = historyProducts[select].id
    wx.setStorageSync('returnId', id)
    wx.navigateTo({
      url: '../return_info/index',
    })
  },
   //发送请求
   async sendRequest(){
    try{
      const page = this.page
      const limit = this.limit
      // 参数的合并
      let url = "http://59.64.75.5:8104/api/princi/auth/records/" + page + "/" + limit
      const token = wx.getStorageSync('token')
      const header = {"token":token}

      //发送请求
      wx.request({
        url: url,
        method:'GET',
        header:header,
        success:(result)=>{
          // console.log(result)
               // 实现触底刷新功能
          let total = result.data.data.total
          this.totalPageNum = Math.ceil(total / this.limit)
          // 对当前页面的物品列表赋值
          const historyProducts = result.data.data.records
          if(this.page >= 2){
            this.setData({
              historyProducts:[...this.data.historyProducts,...historyProducts.reverse()]
            })
          }else if(this.page === 1){
            this.setData({
              historyProducts:historyProducts.reverse()
            })
          }
          //函数结束，下拉刷新结束
          wx.stopPullDownRefresh()
        }
      })
  
    }catch(error){
      if(error.errMsg === "request:fail timeout"){
        await showToast({title:"网络出现问题"})
      }
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
    this.setData({
      historyProducts:[],
      searchInput:null
    })
    this.page=1
    this.sendRequest()
  }

})