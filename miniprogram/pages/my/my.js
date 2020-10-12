var app = getApp();

Page({
  data: {
    userInfo: {},
    mode: ['联系客服', '意见反馈']
  },
  onLoad: function () {
    var that = this;
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              userInfo: res.userInfo
            })
          }
        })
      }
    });
  }
})