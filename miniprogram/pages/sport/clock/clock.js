
var app = getApp()
Page({

  /**
  * 页面的初始数据
  */
  data: {
    dateList: [], //存放日期的数组
    nowDate: '', //系统当前日期
    modalHidden: true,//是否隐藏对话框
    clickIndex: "",//存放点击的下标
    hiddenmodalput: true,//完成打卡
    flagIndex: "",//打卡下标
    myclock: [],
  },
  // 格式化日期，时间
  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },
  // 格式化数字
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  // 获取日期详情
  getDateInfo(ts) {
    const date = new Date(ts);
    const weekArr = new Array("日", "一", "二", "三", "四", "五", "六");
    const week = date.getDay();
    let dateString = this.formatTime(date);
    let shortDateString = dateString.replace(/\//g, '-').substring(5, 7);
    if (date.getDate() < 10) {
      shortDateString = shortDateString.replace(/0/g, '');
    }
    return {
      shortDateString,
      dateString,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      week: weekArr[week]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var myDate = new Date(); //获取系统当前时间
    var sysmonth = myDate.getMonth() + 1
    var yy = myDate.getFullYear();
    var nowDate = myDate.getDate(); //当前是本月几日
    // var today = myDate.toLocaleDateString(); //今日年月日
    var today = app.nowtime('st')
    const  mm  =  new  Array( "January ",  "February ",  "March",  "April ",  "May ",  "June", "July", "August", "September", "October", "November ", "December");
    that.setData({
      nowDate: nowDate,
      sysmonth: sysmonth,
      mm: mm[sysmonth - 1],
      yy: yy,
      useropenid: wx.getStorageSync("useropenid"),
      today: today,
      selectDate: today
    }),
      console.log('系统日期：', myDate);
    console.log('系统日期（年/月/日）：', today);
    console.log('系统日期（月）：', sysmonth);
    console.log('系统日期（日）：', nowDate);

    // 获取屏幕宽度，设置每个日期宽度
    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
        this.setData({
          windowWidth: res.windowWidth,
          itemWidth: parseInt(res.windowWidth / 7),
        });
      },
    })
    //获取所有计划
    wx.cloud.callFunction({
      name: "findAll",
      data: {
        name: '_sportClockCollection',
      },
      success: res => {
        console.log("ressss=", res)
        this.setData({
          allclock: res.result.data,
        })
        this.getMyClock()//筛选出我的打卡情况
      },
      complete: res => {
        console.log("ressss=", res)
      }
    })
    // this.selectComponent('#Calendar').today();
    this.initData();
  },

  //筛选出我的打卡情况
  getMyClock: function (e) {
    var myclock = []
    var myclockDate = []
    var flag = []
    var today = this.data.today
    var allclock = this.data.allclock
    var j = 0
    for (var i = 0; i < allclock.length; i++) {
      if (allclock[i]._openid == this.data.useropenid) {
        myclock.push(allclock[i])
        if (allclock[i].clockdate.indexOf(today) == -1)
          flag[j] = false
        else flag[j] = true
        j++;
      }
      this.setData({
        flagIndex: flag,
      })
    }
    console.log("this.data.useropenid=", this.data.useropenid)
    console.log("myclock=", myclock)
    console.log("allclock=", allclock)
    this.setData({
      myclock: myclock,
      myclockDate: myclockDate,
    })
  },

  //完成打卡
  comp(e) {
    var id = e.currentTarget.dataset.id;
    var clockdate = e.currentTarget.dataset.clockdate;
    var ind = e.currentTarget.dataset.ind;
    console.log("ind = ", ind)
    console.log("clockdate = ", clockdate)
    console.log("today = ", this.data.today)
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      id: id,
      clockdate: clockdate,
      ind: ind,
    })
  },
  acomp(e) {
    wx.showToast({
      title: '只能当天打卡哦',
      // icon: 'loading',
      image: "./icon/感叹号.png",
      duration: 2000
    })
  },

  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
    })
  },
  //删除
  del: function () {
    var that = this
    this.setData({
      hiddenmodalput: true,
    })
    var clockdate = this.data.clockdate
    clockdate.push(this.data.today)
    const db = wx.cloud.database()//操作数据库必须添加的字段，是固定的
    db.collection('_sportClockCollection').doc(this.data.id).remove({//counters是需要添加数据的集合名字
      success: function (res) {
        wx.showModal({
          title: '删除',
          content: '已删除成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.onLoad();
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail: console.error
    })
  },
  //确认
  confirm: function () {
    var that = this
    this.setData({
      hiddenmodalput: true,
    })
    var clockdate = this.data.clockdate
    clockdate.push(this.data.today)
    const db = wx.cloud.database()//操作数据库必须添加的字段，是固定的
    db.collection('_sportClockCollection').doc(this.data.id).update({//counters是需要添加数据的集合名字
      data: {// data 字段表示需新增的 JSON 数据
        clockdate: clockdate
      },
      success: function (res) {
        wx.showModal({
          title: '打卡',
          content: '打卡成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.onLoad();
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail: console.error
    })
  },

  // 初始化日期
  initData() {
    const nowDateTime = +new Date();
    let dateList = [];
    for (let i = -30; i < 30; i++) {
      let obj = this.getDateInfo(nowDateTime + i * 24 * 60 * 60 * 1000);
      obj.isChoose = i == 0;
      dateList.push(obj);
    }
    this.setData({
      dateList,
      clickIndex: 30,
      scrollLeftIndex: 30
    });
  },


  // 点击日期方法
  clickDate(e) {
    var that = this;
    const  mm  =  new  Array( "January ",  "February ",  "March",  "April ",  "May ",  "June", "July", "August", "September", "October", "November ", "December");
    console.log('点击日期携带的下标：', e.currentTarget.dataset.index); //当前的点击的日期
    var index = e.currentTarget.dataset.index;
    that.setData({
      clickIndex: index,
      mm: mm[that.data.dateList[index].shortDateString - 1]
    });
    // console.log(that.data.scrollLeftIndex);
    var year = that.data.dateList[index].year
    var month = that.data.dateList[index].month
    var day = that.data.dateList[index].day
    //格式化日期
    month = month > 10 ? month : '0' + month;
    day = day > 10 ? day : '0' + day;
    var date = year + '/' + month + '/' + day
    console.log("日期列表：", that.data.dateList)
    console.log('当前点击日期：', date); //当前点击的日期

    var myclock = this.data.myclock
    var flag = []
    for (var i = 0; i < myclock.length; i++) {
      if (myclock[i].clockdate.indexOf(date) == -1)
        flag[i] = false
      else flag[i] = true
    }
    this.setData({
      flagIndex: flag,
      selectDate: date
    })

  },
  //查看记录
  toRecord(e) {
    wx.navigateTo({
      url: './record/record',
    })
  },

  //事件处理函数
  bindViewTap: function () {
    this.setData({
      modalHidden: !this.data.modalHidden
    })

  },
  //确定按钮点击事件
  modalBindaconfirm: function () {
    var that = this;
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
    var i = that.data.clickIndex;
    var date = that.data.dateList[i].dateString.substring(0, 10);
    const db = wx.cloud.database()
    var h = that.data.nowtime.split(':');
    var min = parseInt(h[0] * 60) + parseInt(h[1]);
    console.log("date=", date, "m=", min)
    var myclock = that.data.myclock;
    var ad = {
      title: that.data.theme,
      timelong: min,
      clockdate: []
    };
    myclock.push(ad);
    db.collection('_sportClockCollection').add({
      data: {
        title: that.data.theme,
        timelong: min,
        clockdate: []
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        that.setData({
          myclock: myclock
        })
      },
      fail: console.error,
      complete: that.onLoad()
    })
  },

  //取消按钮点击事件
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })

  },

  //打卡内容
  inputTheme(e) {
    this.setData({ theme: e.detail.value });
  },
  //打卡时长
  changeTime(e) {
    this.setData({ nowtime: e.detail.value });
  },

})