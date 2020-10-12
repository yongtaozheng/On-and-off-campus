// miniprogram/pages/life/time/clock/clock.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:"30:00",
    start:0,
    m:30,
    s:0,
    flag:1,
    v:1,

  },

  //倒计时
  countDown: function (that, m, s,flag) {
    if (flag == 0) return;
    if (m < 0 || s < 0) return 
    // console.log("start=", that.data.start)
    if(that.data.start == 1) return;
    var M = m < 10 ? '0' + m : m
    var S = s < 10 ? '0' + s : s
    var count = M.toString()+":"+S.toString()
    var flag = that.data.flag
    this.setData({
      count:count,
      m:m,
      s:s,
    })
    //倒计时结束
    if (count == "00:00") {
      this.countEnd()
      return;
    }
    setTimeout(function () {
      if(s>0) s--;
      else if(s==0){
        m--;
        s=59;
      }
      that.countDown(that, m, s, flag);
    }, 1000);
    },

    //暂停
    pausecount: function(){
      this.setData({
        start:1,
      })
    },

    //开始
  startcount: function () {
      var that = this
      this.setData({
        start:0,
      })
      setTimeout(function () {
        var m = that.data.m
        var s = that.data.s
        if(s>0) s--;
        else if(s==0){
          m--;
          s=59;
        }
        that.countDown(that, m,s,1);
      }, 500);
    },
    //放弃
    giveup: function(){
      this.selectComponent('#ask').newthing();
    },

    //手机震动
  vibration:function(){
    var that = this
    var v = this.data.v;
    console.log("zhendong",v)
    if(v==0) return;
    wx.vibrateLong()
    setTimeout(function () {
      that.vibration()
    }, 1000);
  },
  

  //倒计时结束
  countEnd: function(){
    var that = this;
    var work = this.data.work;
    var study = this.data.study;
    var rest = this.data.rest;
    var sport = this.data.sport;
    var dull = this.data.dull;
    var read = this.data.read;
    var twork = this.data.twork;
    var tstudy = this.data.tstudy;
    var trest = this.data.trest;
    var tsport = this.data.tsport;
    var tdull = this.data.tdull;
    var tread = this.data.tread;
    var t = app.nowtime('t');
    var v = this.data.v

    //手机震动
    that.vibration();

    //清除非今日数据
    if(this.data.lasttime != t) {
      twork = 0;
      tstudy = 0;
      trest = 0;
      tsport = 0;
      tdull = 0;
      tread = 0;
    }

    //更新番茄数
    if (this.data.select == "work") { work++; twork++;}
    else if (this.data.select == "study") { study++; tstudy++;}
    else if (this.data.select == "rest") { rest++; trest++;}
    else if (this.data.select == "sport") { sport++; tsport++;}
    else if (this.data.select == "dull") { dull++; tdull++;}
    else if (this.data.select == "read") { read++; tread++;}

    const db = wx.cloud.database()//操作数据库必须添加的字段，是固定的
    db.collection('_tomato').doc(this.data.useropenid).update({//counters是需要添加数据的集合名字
      data: {// data 字段表示需新增的 JSON 数据
        work: work,
        study: study,
        rest: rest,
        sport: sport,
        dull: dull,
        read: read,
        twork: twork,
        tstudy: tstudy,
        trest: trest,
        tsport: tsport,
        tdull: tdull,
        tread: tread,
        lasttime:t,
      },
      success: function (res) {
        wx.showModal({
          title: '已完成',
          content: '恭喜获得番茄+1',
          showCancel: false,  
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              //停止震动
              that.setData({
                v:0,
              })
              //退出当前页
              wx.navigateBack({
                delta:1,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail: console.error
    })

  },

  //新建待办
  todo: function () {
      this.pausecount();
      this.selectComponent('#modal').newthing();
  },

  //组件监听确定新建待办事件
  confirm(e) {
    this.setData({
      flag: 1,
    })
    this.startcount();
  },
  //组件监听确定放弃事件
  exit(e) {
    console.log("exit");
    wx.navigateBack({
      delta: 1
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
        console.log("res.data",res.data)
        //第一次使用
        if(res.data.length==0){
          console.log("创建",t)
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
            lasttime:res.data[0].lasttime,
          })

          //如果为undefined则赋值为0
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

          if (res.data[0].twork == undefined) {
            that.setData({
              twork: 0
            })
          }
          if (res.data[0].tstudy == undefined) {
            that.setData({
              tstudy: 0
            })
          }

          if (res.data[0].trest == undefined) {
            that.setData({
              trest: 0,
            })
          }

          if (res.data[0].tsport == undefined) {
            that.setData({
              tsport: 0,
            })
          }

          if (res.data[0].tdull == undefined) {
            that.setData({
              tdull: 0,
            })
          }

          if (res.data[0].tread == undefined) {
            that.setData({
              tread: 0,
            })
          }
        }
      },
      fail: console.error
    })

    console.log("开始",options.select)
    wx.setNavigationBarTitle({
      title: options.showtitle,//设置标题
    })
    var count = that.countDown(that, 30, 0,1)//开始倒计时（当前对象，分，秒，开始标志）
    this.setData({
      count: count,
      useropenid: useropenid,
      flag:1,
      select:options.select,
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
    //停止倒计时
    this.setData({
      flag:0,
    })

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