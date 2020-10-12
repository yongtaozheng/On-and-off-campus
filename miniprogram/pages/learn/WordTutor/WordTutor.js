// miniprogram/pages/learn/WordTutor/WordTutor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "",
    number1: 20,
    disabled1: false,
    disabled2: false,
    n: 0,
    currentData: 0,
    image1: "/images/WordTutor/book1.png",
    image2: "/icon/my.png",
    openid: "",
    book: "",
    bookname: "",
    plan: 0,
    totalNum: 0,
    planChangemodal: true,
    today_num: 0,
    changeInfo: {
      name: 'cet4',
      value: '四级词汇',
      checked: 'true',
      number: 2895
    },
    items: [{
        name: 'cet4',
        value: '四级词汇',
        checked: 'true',
        number: 2895
      },
      {
        name: 'cet4_import',
        value: '四级核心词汇',
        number: 687
      },
      {
        name: 'cet6',
        value: '六级词汇',
        number: 2085
      },
      {
        name: 'cet6_import',
        value: '六级核心词汇',
        number: 407
      },
      {
        name: 'kaoyan',
        value: '考研词汇',
        number: 3837
      },
      {
        name: 'kaoyan_import',
        value: '考研核心词汇',
        number: 817
      },
      {
        name: 'zy8',
        value: '专八词汇',
        number: 1938
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid: wx.getStorageSync('useropenid')
    })
    // console.log('openid',this.data.openid)
    var that = this
    const db = wx.cloud.database()
    var openid = this.data.openid
    console.log('openid', this.data.openid)

    var time = this.set_time(new Date())
    this.setData({
      time: time, //日期
    })

    db.collection("_wordCollection").where({
      _openid: openid,
      select: true
    }).get({
      success: function(res) {
        if (res.data.length != 0) {
          //用户已经登录过
          wx.setStorageSync('wordnum', res.data[0].n)
          that.setData({
            n: res.data[0].n,
            totalNum: res.data[0].totalNum,
            plan: res.data[0].plan,
            bookname: res.data[0].bookname,
            number1: res.data[0].plan,
            today_num: res.data[0].today_num
          })
          //如果是新的一天，today_num清零
          if (time != wx.getStorageSync("day")) {
            that.new_day();
          }
        }
      }
    })
  },


  onShow: function() {
    this.setData({
      openid: wx.getStorageSync('useropenid')
    })
    // console.log('openid',this.data.openid)
    var that = this
    const db = wx.cloud.database()
    var openid = this.data.openid
    console.log('openid', this.data.openid)

    var time = this.set_time(new Date())
    this.setData({
      time: time, //日期
    })

    db.collection("_wordCollection").where({
      _openid: openid,
      select: true
    }).get({
      success: function(res) {
        if (res.data.length != 0) {
          //用户已经登录过
          wx.setStorageSync('wordnum', res.data[0].n)
          that.setData({
            n: res.data[0].n,
            totalNum: res.data[0].totalNum,
            plan: res.data[0].plan,
            bookname: res.data[0].bookname,
            number1: res.data[0].plan,
            today_num: res.data[0].today_num
          })
          //如果是新的一天，today_num清零
          if (time != wx.getStorageSync("day")) {
            that.new_day();
          }
        } else {
          //若用户还未登录过，新建记录
          that.new_day()
          wx.setStorageSync('keep_study', 0)
          db.collection("_wordCollection").add({
            data: {
              n: 0,
              bookname: "四级词汇",
              plan: 10,
              select: true,
              totalNum: 2895,
              today_num: 0
            },
            success: function(res) {
              wx.setStorageSync('wordnum', 0)
              that.setData({
                n: 0,
                totalNum: 2895,
                plan: 10,
                bookname: "四级词汇",
                number1: 10,
                today_num: 0
              })
              if (time != wx.getStorageSync("day")) {
                that.new_day();
              }
            }
          })
        }
      }
    })
  },

  onPullDownRefresh: function() {
    this.onLoad()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  changePlan: function() {
    this.setData({
      planChangemodal: false
    })
  },

  confirmChange: function() {
    var that = this
    const db = wx.cloud.database()

    var bookname = this.data.changeInfo.value
    // var bo
    var openid = this.data.openid
    // console.log('openid',this.data.openid)
    db.collection("_wordCollection").where({
      _openid: openid,
      bookname: bookname
    }).get({
      success: function(res) {
        console.log('1', res)
        if (res.data.length != 0) {
          //用户以前选择过该单词本
          console.log('2', res)
          wx.setStorageSync('wordnum', res.data[0].n)
          that.setData({
            n: res.data[0].n,
            totalNum: res.data[0].totalNum,
            plan: that.data.number1,
            bookname: res.data[0].bookname,
            today_num: res.data[0].today_num
          })

          db.collection("_wordCollection").where({
            _openid: openid,
            select: true
          }).update({
            data: {
              select: false,
            },
            success: function(res) {
              console.log('3', res)
              db.collection("_wordCollection").where({
                _openid: openid,
                bookname: bookname
              }).update({
                data: {
                  plan: that.data.number1,
                  select: true
                },
                success: function(res) {
                  console.log('4', res)

                  that.setData({
                    planChangemodal: true
                  })
                  that.onLoad()
                }
              })
            }
          })
        } else {
          //若用户还未选择过，新建记录
          wx.setStorageSync('wordnum', 0)
          console.log('5', res)
          db.collection("_wordCollection").where({
            _openid: openid,
            select: true
          }).update({
            data: {
              select: false,
            },
            success: function(res) {
              db.collection("_wordCollection").add({
                data: {
                  n: 0,
                  bookname: that.data.changeInfo.value,
                  plan: that.data.number1,
                  select: true,
                  totalNum: that.data.changeInfo.number,
                  today_num: 0
                },
                success: function(res) {
                  console.log('6', res)
                  that.setData({
                    n: 0,
                    totalNum: that.data.changeInfo.number,
                    plan: that.data.number1,
                    bookname: that.data.changeInfo.value,
                    planChangemodal: true,
                    today_num: 0
                  })
                  that.onLoad()
                }
              })
            }
          })
        }
      }
    })

  },

  cancel: function() {
    this.setData({
      planChangemodal: true
    })
  },

  toStudy: function(e) {
    wx.setStorageSync('bookname', this.data.bookname)
    wx.setStorageSync('plan', this.data.plan)
    wx.setStorageSync('today_num', this.data.today_num)
    console.log('zzzzzzzzzzzzzzzz', this.data.today_num)
    for (var i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i].value == this.data.bookname) {
        wx.setStorageSync('book', this.data.items[i].name)
        break
      }
    }


    wx.navigateTo({
      url: './study/study',
    })
  },

  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    for (var i = 0; i < this.data.items.length; i++) {
      if (this.data.items[i].name == e.detail.value) {
        this.setData({
          changeInfo: this.data.items[i]
        })
        break
      }
    }
    console.log('8888888888888888', this.data.changeInfo)
  },

  changeNumber(e) {
    this.setData({
      number1: e.detail.value
    })
  },

  limit() {
    if (this.data.number1 > 100) {
      this.setData({
        number1: 100,
        disabled2: false
      })
    } else if (this.data.number1 < 10) {
      this.setData({
        number1: 10,
        disabled1: false
      })
    }
  },

  prevNum1() {
    this.setData({
      number1: this.data.number1 + 10 > 100 ? 100 : this.data.number1 + 10,
    });
    this.setData({
      disabled1: false,
      disabled2: this.data.number1 !== 100 ? false : true
    })
  },

  nextNum1() {
    this.setData({
      number1: this.data.number1 - 10 < 10 ? 10 : this.data.number1 - 10,
    });
    this.setData({
      disabled1: this.data.number1 !== 10 ? false : true,
      disabled2: false
    })
  },

  //设置当天日期
  set_time: function(date) {
    var month = date.getMonth() + 1
    var day = date.getDate()
    var year = date.getFullYear()
    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    return [year, month, day].map(formatNumber).join('/')

  },

  new_day: function() {
    var td = {
      rem: 0,
      blur: 0,
      forget: 0
    }
    wx.setStorageSync('day', this.data.time)
    wx.setStorageSync('today_detail', td)
    var aa = wx.getStorageSync('today_detail')
    const db = wx.cloud.database()
    db.collection("_wordCollection").where({
      _openid: this.data.openid,
      select: true
    }).update({
      data: {
        today_num: 0
      }
    })
  }
})