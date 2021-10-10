// pages/cart/index.js
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */

  data: {
    param:{
      page:1,
      limit:10,
      equipmentQueryVo:{}
    },
    equipmentQueryVo:{
      deviceId:null,
      name:null,
      brandName:null,
      price:null,
      buyDate:null,
      type:null,
      status:null,
      itemNo:null
    },
  },
  onLoad(){
    const equipmentQueryVo = this.data.equipmentQueryVo
    let param = this.data.param
    param.equipmentQueryVo = equipmentQueryVo
    this.getData({
      param:param
    })
  },
  async getData(){
    const param = this.data.param
    const result = await request({url:"http://localhost:8101/admin/equip/list",data:param,method:"get"})
    console.log(result)
  } 
})