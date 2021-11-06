import {showModal,showToast} from "../../utils/asyncWX.js"
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyProducts:"",
    searchInput:null,
    tips:''
  },
  page:1,
  limit:10,
  totalPageNum:1,

  onShow: function () {
    this.setData({
      searchInput:null,
    })
    this.page = 1
    this.sendRequest() 
  },
  handleInput(e){
    const input = e.detail.value
    this.setData({searchInput:input})
    if(input == ""){
      this.sendRequest()
    }
  },
  handleClickCancelButton(e){
    this.setData({
      searchInput:"",
    })
    this.page = 1
    this.sendRequest()
  },
  async handleClickSearchButton(){
    this.page = 1
    const input = this.data.searchInput
    if(!input.trim()){
      await showToast({title:'输入不合法,请重新输入'})
      this.setData({searchInput:null})
      return;
    }
    this.sendRequest()
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
      const searchInput = this.data.searchInput
      // 参数的合并
      let url = "http://59.64.75.5:8104/api/princi/auth/records/" + page + "/" + limit
      if(searchInput){
        url += "?equipName=" + searchInput
      }
      // console.log(url)
      const token = wx.getStorageSync('token')
      const header = {"token":token}

      //发送请求
      wx.request({
        url: url,
        method:'GET',
        header:header,
        success:(result)=>{
          // console.log(result)
          if(result.data.code == 200){
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
            if(historyProducts.length == 0){
              this.setData({tips:'目前还没有借出任何物品'})
            }
            //函数结束，下拉刷新结束
            wx.stopPullDownRefresh()
          }else{
            this.setData({tips:'请在连接校园网后重试'})
          }
         
        },
        fail:(error)=>{
          this.setData({tips:'请在连接校园网后重试'})
        }
      })
    }catch(error){
      this.setData({tips:'请在连接校园网后重试'})
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