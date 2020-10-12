// miniprogram/pages/life/time/time.js
var Charts = require('../../../utils/wxcharts.js'); //引入wxcharts.js  
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    currentData: 0,
    show: true,

  },
  handleTap: function(e) {

    console.log(e);
    let id = e.currentTarget.id;

    if (id) {
      this.setData({
        currentId: id
      })
      this.onLoad();
    }

  },
  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;
    console.log(e)
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  //选中第一个
  select1: function(e) {
    this.setData({
      select: "work",
      showtitle: "工作",
      hiddenmodalput: false,
    });
  },
  //选中第二个
  select2: function(e) {
    this.setData({
      select: "study",
      showtitle: "学习",
      hiddenmodalput: false,
    });
  },
  //选中第三个
  select3: function(e) {
    this.setData({
      select: "rest",
      showtitle: "休息",
      hiddenmodalput: false,
    });
  },
  //选中第四个
  select4: function(e) {
    this.setData({
      select: "sport",
      showtitle: "跑步",
      hiddenmodalput: false,
    });
  },
  //选中第五个
  select5: function(e) {
    this.setData({
      select: "dull",
      showtitle: "发呆",
      hiddenmodalput: false,
    });
  },
  //选中第六个
  select6: function(e) {
    this.setData({
      select: "read",
      showtitle: "阅读",
      hiddenmodalput: false,
    });
  },

  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true,
    })
  },
  //确认
  confirm: function() {
    this.setData({
      hiddenmodalput: true,
    })
    wx.navigateTo({
      url: 'clock/clock?select=' + this.data.select + '&showtitle=' + this.data.showtitle,
    })
  },

  toclock: function(e) {
    wx.navigateTo({
      url: 'clock/clock',
    })
  },

  torecord: function(e) {
    wx.navigateTo({
      url: 'record/record',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var useropenid = wx.getStorageSync('useropenid')
    var t = app.nowtime('t');
    //获取番茄数
    const db = wx.cloud.database()
    db.collection('_tomato').where({
      _openid: useropenid // 填入当前用户 openid
    }).get({
      success: function(res) {
        console.log("res.data", res.data)
        //第一次使用
        if (res.data.length == 0) {
          console.log("创建", t)
          db.collection('_tomato').add({ //counters是需要添加数据的集合名字
            data: { // data 字段表示需新增的 JSON 数据
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
            success: function(res) {},
            fail: console.error,
          })
        } else {
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
          if (res.data[0].lasttime == t) {
            tal = that.data.twork + that.data.tstudy + that.data.trest + that.data.tsport + that.data.tdull + that.data.tread;
          }

          that.setData({
            all: all,
            tal: tal,
          })
        }
      },
      fail: console.error,
    })
    // this.charts();
  },
  switchview(e) {
    var that = this;
    if (e.currentTarget.dataset.ch == '1')
      this.setData({
        show: true,
      })
    else {
      this.setData({
        show: false,
      })
    }
    if (!this.data.show) {
      that.charts()
      // wx.showLoading({
      //   title: '加载中',
      //   mask: true,
      // })
      // setTimeout(function () {
      //   that.charts()
      //   wx.hideLoading()
      // }, 1000);
    }
  },

  charts: function() {
    var twork = this.data.twork;
    var tstudy = this.data.tstudy;
    var trest = this.data.trest;
    var tsport = this.data.tsport;
    var tdull = this.data.tdull;
    var tread = this.data.tread;
    var a = 111;
    console.log("twork=", this.data.work)
    var s = [{
      name: '工作:' + twork * 30 + "min",
      data: twork
    }, {
      name: '学习:' + tstudy * 30 + "min",
      data: tstudy
    }, {
      name: '休息:' + trest * 30 + "min",
      data: trest
    }, {
      name: '跑步:' + tsport * 30 + "min",
      data: tsport
    }, {
      name: '发呆:' + tdull * 30 + "min",
      data: tdull
    }, {
      name: '阅读:' + tread * 30 + "min",
      data: tread
    }];
    var s1 = [{
      name: '工作:' + this.data.work * 30 + "min",
      data: this.data.work
    }, {
      name: '学习:' + this.data.study * 30 + "min",
      data: this.data.study
    }, {
      name: '休息:' + this.data.rest * 30 + "min",
      data: this.data.rest
    }, {
      name: '跑步:' + this.data.sport * 30 + "min",
      data: this.data.sport
    }, {
      name: '发呆:' + this.data.dull * 30 + "min",
      data: this.data.dull
    }, {
      name: '阅读:' + this.data.read * 30 + "min",
      data: this.data.read
    }];
    var that = this;
    console.log(s)

    new Charts({
      canvasId: 'canvas1',
      type: 'pie',
      series: s1,
      width: 320,
      height: 300,
      dataLabel: true,
    });
    new Charts({
      canvasId: 'canvas',
      type: 'pie',
      series: s,
      width: 320,
      height: 300,
      dataLabel: true,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})