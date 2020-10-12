// components/modal/modal.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hiddenmodalput: true,

  },
  //加载
  ready:function(){
    this.setData({
      nowdate: app.nowtime('y') + '-' + app.nowtime('M') + '-' + app.nowtime('d'),
      nowtime: app.nowtime('h') + ':' + app.nowtime('m'),
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //弹出弹窗
    newthing(e){
      this.setData({ hiddenmodalput:!this.data.hiddenmodalput})
    },
    //待办事情
    inputTheme(e) {
      this.setData({ theme: e.detail.value });
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
      })
    },
    //确认
    confirm: function () {
      var that = this
      this.setData({
        hiddenmodalput: true,
      })
      let flag = 1;
      this.triggerEvent('confirm', flag);
      const db = wx.cloud.database()//操作数据库必须添加的字段，是固定的
      db.collection('_itineraryCollection').add({//counters是需要添加数据的集合名字
        data: {// data 字段表示需新增的 JSON 数据
          itineraryName: this.data.theme,
          itineraryDate: this.data.nowdate,
          itineraryTime: this.data.nowtime,
        },
        success: function (res) {
          wx.showModal({
            title: '新建待办',
            content: '已成功添加到行程列表中',
            showCancel: false,
          })
        },
        fail: console.error
      })
    },
  }
})
