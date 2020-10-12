var app = getApp()
var timestamp = Date.parse(new Date());
timestamp = timestamp / 1000;
//获取当前时间
var n = timestamp * 1000;
var date = new Date(n);
//年
var Y = date.getFullYear();
//月
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//日
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
//时
var h = date.getHours();
var ho = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
//分
var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
//秒
var s = date.getSeconds();
console.log(Y + M + D + h + m + s)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    tid: "",
    cid: "",
    deadline: "",
    homeworkid: "",
    homeworkTitle: "",
    homeworkContent: "",
    nowdate: "",
    nowtime: "",
    allStu: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid: wx.getStorageSync('useropenid'),
      tid: wx.getStorageSync('tid'),
      cid: wx.getStorageSync('cid'),
    })
    var that = this;

    var YY = date.getFullYear();
    //月
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    //分
    var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    //跨天
    if (hh >= 22) {
      DD++
      DD = '0' + DD
      hh = (hh + 2) % 24
      hh = '0' + hh
    }
    console.log("hh=", (parseInt(hh) + 2) < 10 ? '0' + (parseInt(hh) + 2) : (parseInt(hh) + 2))
    var nowtime = hh + ':' + mm
    var nowdate = YY + '-' + MM + '-' + DD
    console.log("nowdate=", nowdate)
    console.log("nowtime=", nowtime)

    wx.getStorage({
      key: 'useropenid',
      success: function(res) {
        that.setData({
          useropenid: res.data,
          nowdate: Y + '-' + M + '-' + D,
          nowtime: h + ':' + m,
          date: Y + '-' + M + '-' + D
        })
      },
    })

    const db = wx.cloud.database()
    //查询课程所有已加入同学
    db.collection("_courseSelect").where({
      courseid: that.data.cid,
      state: 1
    }).get({
      success: res => {
        that.setData({
          allStu: res.data
        })
        console.log(that.data.allStu)
      }
    })
  },

  changeDate(e) {
    this.setData({
      nowdate: e.detail.value
    });
  },
  changeTime(e) {
    this.setData({
      nowtime: e.detail.value
    });
  },

  getTitle: function(e) {
    this.setData({
      homeworkTitle: e.detail.value
    })
  },
  getContent: function(e) {
    this.setData({
      homeworkContent: e.detail.value
    })
  },
  assignHomework: function() {
    var that = this
    var title = this.data.homeworkTitle
    var content = this.data.homeworkContent
    var time = this.data.nowtime
    var date = this.data.nowdate

    if (title == "" || content == "") {
      wx.showToast({
        title: '作业标题或要求未输入',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    const db = wx.cloud.database()

    //新增作业
    db.collection('_courseHomeworkList').add({
      data: { // data 字段表示需新增的 JSON 数据
        cid: that.data.cid,
        title: title,
        content: content,
        time: time,
        date: date,
        submitNum:0,
      },
      success: function(res) {
        that.setData({
          homeworkid: res._id
        })
        console.log("aaddcc", res)
        
        wx.navigateBack({
          delta: 1
        })
      },
      fail: console.error
    })

  },


})