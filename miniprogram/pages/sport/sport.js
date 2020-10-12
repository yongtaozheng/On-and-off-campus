// miniprogram/pages/sport/sport.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toPlan(e){
    wx.navigateTo({
      url: './plan/plan',
    })
  },
  toClock(e){
    wx.navigateTo({
      url: './clock/clock',
    })
  },


  touchStart(e) {
    // console.log(e)
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    });
  },

  touchEnd(e) {
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    if (app.getTouchData(x, y, this.data.startX, this.data.startY) == 'left') {
      console.log("左滑")
      wx.switchTab({
        url: '/pages/index/index/index'
      });

    }
    if (app.getTouchData(x, y, this.data.startX, this.data.startY) == 'right') {
      console.log("右滑")
      wx.switchTab({
        url: '/pages/life/life'
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})