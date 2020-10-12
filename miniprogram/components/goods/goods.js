// components/goods/goods.js

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

  },

  /**
   * 组件的方法列表
   */
  methods: {


    _handlerSubmit: function (evt) {
      console.log(evt)

      let account = evt.detail.value.account
      let pwd = evt.detail.value.pwd

      const db = wx.cloud.database()

      const accountCollection = db.collection("like")

      accountCollection.add({
        data: {
          name: account,
          age: pwd
        }
      })
    },
  }
})
