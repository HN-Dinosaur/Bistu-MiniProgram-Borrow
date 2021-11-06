  // let ajaxTimes=0
  export const request=(params)=>{
    // ajaxTimes++;
    // wx.showModal({
    //   title: '提示',
    //   content: '请连接学校vpn进行使用',
    // })
    // let header={...params.header}
    // if(params.url.includes("/my/")){
    //   header["Authorization"] = wx.getStorageSync('token')
    // }

    wx.showLoading({
      title: '加载中',
      mask:true
    })
    return new Promise((resolve, reject)=>{
      wx.request({
        ...params,
        // header: header,
        // url: baseURL + params.url,
        timeout:1000,
        success:(result)=>{
          // resolve(result.data.message)
          if(result.data.code == 200){
            resolve(result)
          }
        },
        fail:(err)=>{
          reject(err)
        },
        complete:()=>{
          // ajaxTimes--
          // if(ajaxTimes===0){
            //防止多次异步请求 而有的成功，有的没有成功，导致这个弹窗消失
            wx.hideLoading()
          // }
        }
      })
    })
  }