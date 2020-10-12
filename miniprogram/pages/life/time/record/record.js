// miniprogram/pages/life/time/record/record.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  totime: function(e){
    wx.navigateTo({
      url: '../time',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var useropenid = wx.getStorageSync('useropenid')
    var t = app.nowtime('t');
    //获取番茄数
    const db = wx.cloud.database()
    db.collection('_tomato').where({
      _openid: useropenid // 填入当前用户 openid
    }).get({
      success: function (res) {
        console.log("res.data", res.data)
        //第一次使用
        if (res.data.length == 0) {
          console.log("创建", t)
          db.collection('_tomato').add({//counters是需要添加数据的集合名字
            data: {// data 字段表示需新增的 JSON 数据
              _id: useropenid,
              work: 0,
              study: 0,
              rest: 0,
              sport: 0,
              dull: 0,
              read: 0,
              twork: 0,
              tstudy: 0,
              trest: 0,
              tsport: 0,
              tdull: 0,
              tread: 0,
              lasttime: t,
            },
            success: function (res) {
            },
            fail: console.error
          })
        }
        else {
          that.setData({
            work: res.data[0].work,
            study: res.data[0].study,
            rest: res.data[0].rest,
            sport: res.data[0].sport,
            dull: res.data[0].dull,
            read: res.data[0].read,
            twork: res.data[0].twork,
            tstudy: res.data[0].tstudy,
            trest: res.data[0].trest,
            tsport: res.data[0].tsport,
            tdull: res.data[0].tdull,
            tread: res.data[0].tread,
            lasttime: res.data[0].lasttime,
          })

          if (res.data[0].work == undefined) {
            that.setData({
              work: 0
            })
          }
          if (res.data[0].study == undefined) {
            that.setData({
              study: 0
            })
          }

          if (res.data[0].rest == undefined) {
            that.setData({
              rest: 0,
            })
          }

          if (res.data[0].sport == undefined) {
            that.setData({
              sport: 0,
            })
          }

          if (res.data[0].dull == undefined) {
            that.setData({
              dull: 0,
            })
          }

          if (res.data[0].read == undefined) {
            that.setData({
              read: 0,
            })
          }

          if (res.data[0].twork == undefined || res.data[0].lasttime != t) {
            that.setData({
              twork: 0
            })
          }
          if (res.data[0].tstudy == undefined || res.data[0].lasttime != t) {
            that.setData({
              tstudy: 0
            })
          }

          if (res.data[0].trest == undefined || res.data[0].lasttime != t) {
            that.setData({
              trest: 0,
            })
          }

          if (res.data[0].tsport == undefined || res.data[0].lasttime != t) {
            that.setData({
              tsport: 0,
            })
          }

          if (res.data[0].tdull == undefined || res.data[0].lasttime != t) {
            that.setData({
              tdull: 0,
            })
          }

          if (res.data[0].tread == undefined || res.data[0].lasttime != t) {
            that.setData({
              tread: 0,
            })
          }
          var all = that.data.work + that.data.study + that.data.rest + that.data.sport + that.data.dull + that.data.read;
          var tal = 0;
          if(res.data[0].lasttime == t){
            tal = that.data.twork + that.data.tstudy + that.data.trest + that.data.tsport + that.data.tdull +                                 that.data.tread;
          }

          that.setData({
            all:all,
            tal:tal,
          })
        }
      },
      fail: console.error
    })

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