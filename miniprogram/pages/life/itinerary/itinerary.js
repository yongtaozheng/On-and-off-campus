// miniprogram/pages/life/ininerary/ininerary.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,//弹窗状态
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    index: 0,//选择的下拉列表下标
    slectind:0,
    nowdate:'',//当前日期
    nowtime:'',//当前时间
    itineraryName:'',//新建行程名称
    useropenid:'',//用户openid
    allItinerary:[],//所有行程集合
    myItinerary:[],//我的行程集合
    itineraryDate:[],//行程日期集合
    hiddenmodalput1: true, //确定删除
  },
  //新建行程名称
  changItineraryName(e) {
    this.setData({
      itineraryName: e.detail.value,
    })
  },
  //行程日期
  changeDate(e) {
    this.setData({ nowdate: e.detail.value });
  },
  //行程时间
  changeTime(e) {
    this.setData({ nowtime: e.detail.value });
  },

  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      slectind:Index,
      show: !this.data.show
    });
  },
  createIninerary: function(e){
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
      img: "",
    })
  },
  //确认
  confirm: function () {
    var that = this
    this.setData({
      hiddenmodalput: true,
    })
    const db = wx.cloud.database()//操作数据库必须添加的字段，是固定的
    db.collection('_itineraryCollection').add({//counters是需要添加数据的集合名字
      data: {// data 字段表示需新增的 JSON 数据
        itineraryName: this.data.itineraryName,
        itineraryDate:this.data.nowdate,
        itineraryTime:this.data.nowtime,
      },
      success: function (res) {
        wx.showModal({
          title: '新建行程',
          content: '成功',
          showCancel:false,
        })
        that.onLoad()
      },
      fail: console.error
    })
  },
//获取我的行程
getMyItinerary:function(e){
  var that = this;
  var allItinerary = this.data.allItinerary
  var itineraryDate = []
  var myItinerary = []
  var d = app.nowtime('y') + '-' + app.nowtime('M') + '-' + app.nowtime('d')
  var today = d
  var tomorrow = today.substr(0, today.length - 1) + (parseInt(today.substr(-1)) + 1)
  var yesterday = d.substr(0, today.length - 1) + (parseInt(d.substr(-1)) - 1)

  for (var i = allItinerary.length - 1; i >= 0; i--) {
    if (allItinerary[i]._openid == this.data.useropenid) {
      var date = allItinerary[i]
      if (today == allItinerary[i].itineraryDate) date.itineraryDate = "今天"
      else if (tomorrow == allItinerary[i].itineraryDate) date.itineraryDate = "明天"
      else if (yesterday == allItinerary[i].itineraryDate) date.itineraryDate = "昨天"
      else date = allItinerary[i]
      myItinerary.push(date)
      var flag = 0
      //日期去重
      for (var j = 0; j < itineraryDate.length; j++) {
        if (itineraryDate[j] == allItinerary[i].itineraryDate){ 
          flag = 1;
          break
        }
        if (itineraryDate[j] == "今天" && today == allItinerary[i].itineraryDate) { 
          flag = 1;
          break
        }
        if (itineraryDate[j] == "明天" && tomorrow == allItinerary[i].itineraryDate) { 
          flag = 1;
          break
        }
        if (itineraryDate[j] == "昨天" && yesterday == allItinerary[i].itineraryDate) { 
          flag = 1;
          break
        }
      }
      if (flag == 0) {
        if (allItinerary[i].itineraryDate == today)
          itineraryDate.push("今天")
        else if (allItinerary[i].itineraryDate == tomorrow)
          itineraryDate.push("明天")
        else if (allItinerary[i].itineraryDate == yesterday)
          itineraryDate.push("昨天")
        else
          itineraryDate.push(allItinerary[i].itineraryDate)
      }
    }
  }
  console.log("myItinerary", myItinerary)
  console.log("itineraryDate", itineraryDate)
  //行程按时间点排序
  var temp = ''
  for(var i = 0;i<myItinerary.length;i++){
    for(var j = i+1;j<myItinerary.length;j++){
      var itime = myItinerary[i].itineraryDate.replace(/\-/g, "") + myItinerary[i].itineraryTime.replace(/\:/g, "")
      var jtime = myItinerary[j].itineraryDate.replace(/\-/g, "") + myItinerary[j].itineraryTime.replace(/\:/g, "")
      if(jtime<itime)
      {
        temp = myItinerary[i]
        myItinerary[i] = myItinerary[j]
        myItinerary[j] = temp
      }
    }
  }
  this.setData({
    myItinerary: myItinerary,//我的行程集合
    itineraryDate: itineraryDate,//行程日期集合
  })
},
//删除行程
  delBtn: function (e) {
    this.setData({
      hiddenmodalput1: !this.data.hiddenmodalput1,
      delId: e.target.dataset.id,
    })
  },
  //取消按钮
  delcancel: function () {
    this.setData({
      hiddenmodalput1: true,
    })
  },
  //确认
  delconfirm: function () {
    this.setData({
      hiddenmodalput1: true,
    })
    var that = this;
    var useropenid = this.data.useropenid
    var delId = this.data.delId
    const db = wx.cloud.database()
    const dbcolloction = db.collection("_itineraryCollection")
    dbcolloction.doc(delId).remove({
      success: function (res) {
        console.log("成功")
        that.onLoad()
      }
    })
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'useropenid',
      success: function (res) {
        that.setData({
          useropenid: res.data,
          nowdate: app.nowtime('y') + '-' + app.nowtime('M') + '-' + app.nowtime('d'),
          nowtime: app.nowtime('h') + ':' + app.nowtime('m'),
        })
      },
    })
    //获取所有行程
    wx.cloud.callFunction({
      name: "allItinerary",
      data: {
        name: '_itineraryCollection',
      },
      success: res => {
        this.setData({
          allItinerary: res.result.data,
        })
        this.getMyItinerary()//筛选出我的行程
        console.log("allItinerary:", res.result.data)
      },
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
    this.onLoad()
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