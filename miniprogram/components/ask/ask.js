// components/modal/modal.js
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

  /**
   * 组件的方法列表
   */
  methods: {
    //弹出弹窗
    newthing(e) {
      this.setData({ hiddenmodalput: !this.data.hiddenmodalput })
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
      this.triggerEvent('exit', flag);
      }
  }
})
