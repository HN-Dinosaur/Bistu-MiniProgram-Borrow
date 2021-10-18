// pages/query_history/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyProducts:""
  },
  page:1,
  limit:10,
  product:{},
  totalPageNum:1,

  onShow: function () {
    
  },
  handleClickCancelButton(e){
    this.setData({
      searchInput:"",
    })
    this.page = 1
    this.sendRequest()
  },
  handleSelect(e){
    const select = e.currentTarget.dataset.index
    const historyProducts = this.data.historyProducts
    const id = historyProducts[select].id
    wx.setStorageSync('returnId', id)
    wx.navigateTo({
      url: '../return/index',
    })
  },
    //发送请求
  async sendRequest(){
    try{
      const page = this.page
      const limit = this.limit
      const searchInput = this.data.searchInput
      // 参数的合并
      let url = "http://59.64.75.5:8101/admin/equip/list/" + page + "/" + limit
      if(searchInput){
        url += "?name=" + searchInput
      }
      // 发送请求
      const result = await request({url,method:"get"})
       // 实现触底刷新功能
      let total = result.data.data.total
      this.totalPageNum = Math.ceil(total / this.limit)
      // 对当前页面的物品列表赋值
      const productsList = result.data.data.records
      if(this.page >= 2){
        this.setData({
          productsList:[...this.data.productsList,...productsList]
        })
      }else if(this.page === 1){
        this.setData({
          productsList:productsList
        })
      }
      //函数结束，下拉刷新结束
      wx.stopPullDownRefresh()
    }catch(error){
      // console.log(error)
      if(error.errMsg === "request:fail timeout"){
        await showToast({title:"网络出现问题"})
      }
    }
  },
   //发送请求
   async sendRequest(){
    try{
      const page = this.page
      const limit = this.limit
      // const searchInput = this.data.searchInput
      // 参数的合并
      let url = "http://59.64.75.5:8104/api/princi/auth/records/" + page + "/" + limit
      // if(searchInput){
      //   url += "?name=" + searchInput
      // }
      // 发送请求
      // const result = await request({url,method:"get"})

      const token = wx.getStorageSync('token')
      const header = {"token":token}
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
              historyProducts:[...this.data.historyProducts,...historyProducts]
            })
          }else if(this.page === 1){
            this.setData({
              historyProducts:historyProducts
            })
          }
          //函数结束，下拉刷新结束
          wx.stopPullDownRefresh()
          // this.setData({
          //   historyProducts:result.data.data.records
          // })
        }
      })
  
    }catch(error){
      // console.log(error)
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
      productsList:[],
      searchInput:null
    })
    this.page=1
    this.sendRequest()
  }

})