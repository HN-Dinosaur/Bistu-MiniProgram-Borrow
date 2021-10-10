import {showToast} from "../../utils/asyncWX.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchInput:"",
    focus:true,
    isDisplaySearchInput:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(e){
      // console.log(e)
      const {value} = e.detail
      //将输入框值赋值
      this.setData({
        searchInput:value
      })
    },
    cancel(){
      const bool = this.isDisplaySearchInput
      // console.log(bool)
      //清空输入框
      this.setData({
        searchInput:""
      }),
      //子向父传值  但是父亲不需要值  就是触发父亲的回调函数
      this.triggerEvent("clickCancelButton",{bool})
    },
    //点击搜索按钮之后  向父亲传送输入框中的值
    async search(){
      let value = this.data.searchInput
      const placeholder = this.data.placeholder
 
      //输入合法性判断
      if(!value.trim()){
        await showToast({title:'输入不合法,请重新输入'})
        this.setData({searchInput:"",focus:true})
        return;
      }
      if(placeholder === "根据名称模糊搜索"){
        // console.log(1)
        value = "name=" + value 
      }else if(placeholder === "根据物品id搜索"){
        // console.log(2)
        value = "deviceId=" + value
      }else{
        // console.log(3)
        value = "brandName=" + value
      }
       //子向父亲传值
      this.triggerEvent("clickSearchButton",{value})
    }
  }
})
