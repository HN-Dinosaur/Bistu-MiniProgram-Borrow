var context = null;// 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false;//是否在绘制中
var arrx = [];//动作横坐标
var arry = [];//动作纵坐标
var arrz = [];//总做状态，标识按下到抬起的一个组合
var canvasw = 0;//画布宽度
var canvash = 0;//画布高度
Page({

  data: {

  },
  index:0,
  onLoad: function (e) {
  //  console.log(e)
    this.startCanvas();
 },
  onShow(e){

    const currentPages = getCurrentPages()
    const page = currentPages[currentPages.length - 1]
    // console.log(page)
    this.index = parseInt(page.options.index)
  },
 /**
 * 以下 - 手写签名 / 上传签名
 */
  startCanvas: function () {//画布初始化执行
  var that = this;
  //获取系统信息
  wx.getSystemInfo({
    success: function (res) {
    canvasw = res.windowWidth;
    canvash = res.windowHeight;
    that.setData({ canvasw: canvasw });
    that.setData({ canvash: canvash });
    }
  }); 
  this.initCanvas();
  this.cleardraw(); 
  },
  //初始化函数
  initCanvas: function () {
  context = wx.createCanvasContext('canvas');
  context.beginPath()
  context.fillStyle = 'rgba(255, 255, 255, 0)';
  context.setStrokeStyle('#000000');
  context.setLineWidth(4);
  context.setLineCap('round');
  context.setLineJoin('round');
  },
  canvasStart: function (event) {
  isButtonDown = true;
  arrz.push(0);
  arrx.push(event.changedTouches[0].x);
  arry.push(event.changedTouches[0].y);
  },
  canvasMove: function (event) {
  if (isButtonDown) {
    arrz.push(1);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
  }
  for (var i = 0; i < arrx.length; i++) {
    if (arrz[i] == 0) {
    context.moveTo(arrx[i], arry[i])
    } else {
    context.lineTo(arrx[i], arry[i])
    }
  }
  context.clearRect(0, 0, canvasw, canvash);
  context.setStrokeStyle('#000000');
  context.setLineWidth(4);
  context.setLineCap('round');
  context.setLineJoin('round');
  context.stroke();
  context.draw(false);
  },
  canvasEnd: function (event) {
  isButtonDown = false;
  },
  //清除画布
  cleardraw: function () {
  arrx = [];
  arry = [];
  arrz = [];
  context.clearRect(0, 0, canvasw, canvash);
  context.draw(true);
  },
  uploadImg(){
  var that = this
  const index = this.index
  //生成图片
  wx.canvasToTempFilePath({
    canvasId: 'canvas',
    //设置输出图片的宽高
    // destWidth:150, 
    // destHeight:150,
    fileType:'jpg',
    quality:1.0,
    success: function (res) {
    //点击第一个button，后续以此类推

    if(index === 1){
      console.log(1)
      wx.setStorageSync('selfImg', res.tempFilePath)
    }else if(index === 2){
      console.log(2)
      wx.setStorageSync('lendImg', res.tempFilePath)
    }else if(index == 3){
      console.log(3) 
      wx.setStorageSync('teacherImg', res.tempFilePath)
    }else if(index == 5){
      console.log(5)
      wx.setStorageSync('returnSelfImg', res.tempFilePath)
    }else if(index == 6){
      console.log(6)
      wx.setStorageSync('returnLendImg', res.tempFilePath)
    }
    wx.navigateBack({
      delta: 1,
    })
    // canvas图片地址 res.tempFilePath

    },
    fail: function () {
      wx.showModal({
      title: '提示',
      content: 'canvas生成图片失败。微信当前版本不支持，请更新到最新版本！',
      showCancel: false
    });
    },
    complete: function () {}
  })
  },
})