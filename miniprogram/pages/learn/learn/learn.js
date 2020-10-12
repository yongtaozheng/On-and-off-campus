// miniprogram/pages/learn/learn/learn.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    useropenid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    *获取用户的openid
    */

    var that = this;
    //获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        that.setData({
          useropenid: res.result.openid,
        })
        wx.setStorage({
          key: 'useropenid',
          data: res.result.openid
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
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
    if (app.getTouchData(x, y, this.data.startX, this.data.startY)=='left'){
      console.log("左滑")
      wx.switchTab({
        url: '/pages/life/life'
      });

    }
    if (app.getTouchData(x, y, this.data.startX, this.data.startY) == 'right') {
      console.log("右滑")
    }
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

  },

  toHomework: function (options) {
    wx.navigateTo({
      url: '/pages/learn/homework/homework',
    })
  },
  toClassManagement: function(options) {
    wx.navigateTo({
      url: '/pages/learn/ClassManagement/ClassManagement',
    })
  },
  toWordTutor:function(){
    wx.navigateTo({
      url: '/pages/learn/WordTutor/WordTutor',
    })
  }

})