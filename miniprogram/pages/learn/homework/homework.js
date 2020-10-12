// pages/learn/homework/homework.js
var app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    hiddenmodalput1: true,
    currentData: 0,
    homework: [],
    deadline: [],
    sheight:600,

  },

  handleTap: function (e) {

    console.log(e);
    let id = e.currentTarget.id;

    if (id) {
      this.setData({ currentId: id })
      this.onLoad();
    }

  },

  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },

  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    this.setHeight(this.data.homework, e.target.dataset.current)
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
//查看详情
  check(e) {
    console.log("check:e=", e)
    this.setData({
      hiddenmodalput1: !this.data.hiddenmodalput1,
      iproject: e.currentTarget.dataset.project,
      idetail: e.currentTarget.dataset.detail,
      handdate: e.currentTarget.dataset.date,
      id:e.currentTarget.dataset.id,
      state:e.currentTarget.dataset.state,
    })
  },
//删除
del(e){
  this.setData({
    hiddenmodalput1: true,
  })
  var that = this;
  var useropenid = this.data.useropenid
  var id = this.data.id
  const db = wx.cloud.database()
  const dbcolloction = db.collection("_homework")
  dbcolloction.doc(id).remove({
    success: function (res) {
      wx.showModal({
        title: '删除',
        content: '已删除',
        showCancel: false,
      })
      that.onLoad();
    }
  })
},
//完成
comp(e){
  this.setData({
    hiddenmodalput1: true,
  })
  var that = this;
  var useropenid = this.data.useropenid
  var id = this.data.id
  const db = wx.cloud.database()
  const dbcolloction = db.collection("_homework")
  dbcolloction.doc(id).update({
    data: {
      state: 1,
      flag:false,
    },
    success: function (res) {
      wx.showModal({
        title: '完成',
        content: '已完成',
        showCancel: false,
      })
      that.onLoad();
    }
  })
  }, 
//触碰开始
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
    this.setData({
      startTime: e.timeStamp
    })
  },
//触碰结束
  bindTouchEnd: function (e) {
    this.setData({
      endTime: e.timeStamp
    })
  },
  //授权推送消息
  sqBtn: function (e) {
    var that = this
    if (this.data.endTime - this.data.startTime > 350) {
      console.log("sq:e", this.data.endTime - this.data.startTime)
    var id = e.currentTarget.dataset.id
    wx.requestSubscribeMessage({
      tmplIds: ['EbEqTDlAXxLuB4lY97ZB3-E40PYPoyG7bpfNY12E6oM'],
      success(res) {
        //用户点击允许
        if (res['EbEqTDlAXxLuB4lY97ZB3-E40PYPoyG7bpfNY12E6oM'] === 'accept') {
          const db = wx.cloud.database()
          const dbcolloction = db.collection("_homework")
          dbcolloction.doc(id).update({
            data: {
              flag: true
            },
            success: function (res) {
              wx.showModal({
                title: '授权',
                content: '授权成功',
              })
              console.log("成功", res)
              that.onLoad();
            }
          })
          console.log("授权成功", res)
        }
        //用户点击取消
        else {
          wx.showModal({
            title: '授权',
            content: '授权失败',
          })
        }
      },
      fail(res) {
        wx.showModal({
          title: '授权',
          content: '授权失败',
        })
        console.log("授权失败", res)
      }
    })
    }
    else{
      that.check(e);
    }
  },

  //取消推送消息
  cancelBtn: function (e) {
    var that = this
    //长按
    if (this.data.endTime - this.data.startTime > 350) {
    console.log("cancelBtn:e", e)
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '授权推送',
      content: '取消授权',
      success(res) {
        if (res.confirm) {
          const db = wx.cloud.database()
          const dbcolloction = db.collection("_homework")
          dbcolloction.doc(id).update({
            data: {
              flag: false
            },
            success: function (res) {
              wx.showModal({
                title: '授权推送',
                content: '取消推送成功',
                showCancel: false
              })
              console.log("成功", res)
              that.onLoad();
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    }
    else {
      that.check(e);
    }
  },

  //弹出弹窗
  add(e) {
    this.setData({
       hiddenmodalput: !this.data.hiddenmodalput,
       })
  },
  //科目
  inputproject(e) {
    this.setData({ iproject: e.detail.value });
  },
  //内容
  inputdetail(e) {
    this.setData({ idetail: e.detail.value });
  },
  //时间
  changeTime(e) {
    this.setData({ nowtime: e.detail.value });
  },
  //日期
  changeDate(e) {
    this.setData({ nowdate: e.detail.value });
  },

  //新建待办
  createMeeting: function (e) {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      nowdate: this.data.selectVal
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
      hiddenmodalput1: true,
    })
  },
  //确认
  confirm: function () {
    var that = this
    this.setData({
      hiddenmodalput: true,
      hiddenmodalput1: true,
    })

    var useropenid = this.data.useropenid
    var a = this.data.iproject
    var b = this.data.idetail
    var c = this.data.nowdate
    var d = this.data.nowtime
    var ho = d.split(':')[0]
    
    const db = wx.cloud.database()
    const dbcolloction = db.collection("_homework")
    dbcolloction.add({
      data: {
        project: a,
        detail: b,
        handdate: c,
        handtime: d,
        state: 0,
        flag: false,
        hour: ho,
      }
    }).then(res => {
      console.log(res)
      that.setData({
        f: res._id
      })
    })
    var homework = [];
    homework = that.data.homework;
    var ad = {
      project: a,
      detail: b,
      handdate: c,
      handtime: d,
      state: 0,
      flag: false,
      hour: ho,
      }

    homework[homework.length]=(ad);
    that.setData({
      homework:homework,
      sheight:that.data.sheight+1,
      })
//授权
    wx.requestSubscribeMessage({
      tmplIds: ['EbEqTDlAXxLuB4lY97ZB3-E40PYPoyG7bpfNY12E6oM'],
      success(res) {
        console.log("授权成功", res)
        if (res['EbEqTDlAXxLuB4lY97ZB3-E40PYPoyG7bpfNY12E6oM'] === 'accept') {
          console.log("授权成功le!!!")
          dbcolloction.doc(that.data.f).update({
            data: {
              flag: true,
            }
          })
          that.onLoad();
        }
      },
      fail(res) {
        console.log("授权失败", res)
      }
    })
    //提示
    wx.showModal({
      title: '添加成功',
      content: '添加成功',
      showCancel: false,
    })
  },
  setHeight: function(e,f){
    console.log("setheight:e=",e)
    var i = 0;
    var c = 0;
    for(i;i<e.length;i++){
      if(e[i].state==0)
        c++;
    }
    if (f == 0) {
      this.setData({ sheight: c })
    }
    else {
      c = e.length - c;
      this.setData({ sheight: c })
      }
    console.log("setheight:c=",c)
  },


  onLoad: function () {
    var that = this;
    this.setData({
      nowdate: app.nowtime('y') + '-' + app.nowtime('M') + '-' + app.nowtime('d'),
      nowtime: app.nowtime('h') + ':' + app.nowtime('m'),
    })
    wx.getStorage({
      key: 'useropenid',
      success: function (res) {
        that.setData({
          useropenid: res.data,
        })
        console.log('useropenid=', res.data)
        //获取所有作业
        const db = wx.cloud.database()
        const dbcolloction = db.collection("_homework")
        dbcolloction.where({
          _openid: that.data.useropenid // 填入当前用户 openid
        }).get({
          success: function (res) {
            var d = [];
            that.setData({
              homework: res.data,
            })
            that.setHeight(res.data,0);
            for (var i = 0; i < res.data.length; i++) {
              var date = res.data[i].handdate.replace(/\-/g, "");
              var time = res.data[i].handtime.replace(/\:/g, "");
              var nowdate = Y + M + D;
              var nowtime = h.toString() + m.toString();
              if (date <= parseInt(nowdate)) {
                if (time <= parseInt(nowtime)) {
                  d[i] = true
                }
                else {
                  d[i] = false
                }
              }
              else {
                d[i] = false
              }
            }
            that.setData({
              deadline: d,
            })
            console.log("res.data=", res.data)
            console.log("deadline=", that.data.d)
            console.log("homework=", that.data.homework)
          }
        })
      },
    })
  },


})