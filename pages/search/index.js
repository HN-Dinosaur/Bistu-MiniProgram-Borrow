// pages/search/index.js
import {showModal,showToast} from "../../utils/asyncWX.js"
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisplaySearchInput:false,
    placeholder:"",
    //发送请求返回的数组
    productsList:[],
    searchInput:null,
  }, 
  page:1,
  limit:10,
  product:{},
  totalPageNum:1,
  onShow(){
    this.setData({
      isDisplaySearchInput:false,
      searchInput:null,
    })
    this.page = 1
    this.sendRequest()
  },
  handleAccordingName(){
    this.setData({
      isDisplaySearchInput:true,
      placeholder:"根据名称模糊搜索"
    })
  },
  handleAccordingId(){
    this.setData({
      isDisplaySearchInput:true,
      placeholder:"根据物品id搜索"
    })
  },
  handleAccordingBrand(){
    this.setData({
      isDisplaySearchInput:true,
      placeholder:"根据物品品牌进行搜索"
    })
  },
  //点击搜索按钮  子组件触发的回调函数
  handleClickSearchButton(e){
    this.page=1
    const searchInput = e.detail.value
    this.setData({searchInput:searchInput})
    this.sendRequest()
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
        url += "?" + searchInput
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
  handleClickCancelButton(e){
    this.setData({
      searchInput:"",
      isDisplaySearchInput:false
    })
    this.page = 1
    this.sendRequest()
  },
  async handleSelect(e){
    // console.log(e)
    const result = await showModal({content:"只能选取一个物品"})
    if(result.confirm){
      const index = e.currentTarget.dataset.index
      const productsList = this.data.productsList
      this.product = productsList[index]
      wx.setStorageSync('product', this.product)
 
      wx.switchTab({
        url: '../cart/index',
      })
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