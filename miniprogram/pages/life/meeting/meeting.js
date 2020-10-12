// miniprogram/pages/life/meeting.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '2018-11-11',
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    lastMonth: 'lastMonth',
    nextMonth: 'nextMonth',
    selectVal: '',
    nowweek:'',
    theme:'',
    place:'',
    people:'',
    remark: '', 
    hiddenmodalput1:true,
    hiddenmodalput: true,
    hiddenmodalput2: true,
    hiddenmodalput3:true,//会议笔记
    allmeeting:[],//所有行程
    allMeetingDate:[],//有行程的时间
    showmeeting:true,
    writing:false,
    show:true,
  },
  //组件监听事件
  select(e) {
    // console.log(e.detail.substring(8))
    this.setData({
      selectVal: e.detail,
      nowweek:app.nowweek(e.detail),
    })
  },

  toggleType() {
    this.setData({
      showmeeting:!this.data.showmeeting
    })
    this.selectComponent('#Calendar').toggleType();
  },

//切换文本框
  showTextarea(e){
    if(this.data.writing)
    this.setData({
      show:!this.data.show
    })
      
      console.log("show=",this.data.show,"writing=",this.data.writing)
  },

//会议主题
inputTheme (e){
  this.setData({ theme: e.detail.value });
  },
  //备注
  inputRemark(e) {
    this.setData({ remark: e.detail.value });
  },
  //会议时间
  changeTime(e) {
    this.setData({ nowtime: e.detail.value });
  },
  //会议日期
  changeDate(e) {
    this.setData({ nowdate: e.detail.value });
  },
  //会议地点
  inputPlace(e) {
    this.setData({ place: e.detail.value });
  },
  //会议人员
  inputPeople(e) {
    this.setData({ people: e.detail.value });
  },
  //会议笔记
  inputNote(e) {
    this.setData({ note: e.detail.value });
  },

//新建会议
  createMeeting: function (e) {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      nowdate:this.data.selectVal
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
    const db = wx.cloud.database()//操作数据库必须添加的字段，是固定的
    db.collection('_meetingCollection').add({//counters是需要添加数据的集合名字
      data: {// data 字段表示需新增的 JSON 数据
        meetingTheme: this.data.theme,
        meetingPlace: this.data.place,
        meetingTime: this.data.nowtime,
        meetingDate: this.data.nowdate,
        meetingPeople: this.data.people,
        meetingRemark: this.data.remark,
        meetingNote:"",
        meetingImg:[],
      },
      success: function (res) {
        wx.showModal({
          title: '新建会议',
          content: '成功',
          showCancel: false,
        })
        that.onLoad()
      },
      fail: console.error
    })
  },
  //筛选出我的行程
  getMyMeeting: function(e){
    var mymeeting=[]
    var myMeetingDate=[]
    var allmeeting = this.data.allmeeting
    for(var i = 0;i<allmeeting.length;i++){
      if(allmeeting[i]._openid == this.data.useropenid){
        mymeeting.push(allmeeting[i])
        if(myMeetingDate.indexOf(allmeeting[i].meetingDate)==-1)
          myMeetingDate.push(allmeeting[i].meetingDate)
      }
    }
    this.setData({
      mymeeting:mymeeting,
      myMeetingDate:myMeetingDate,
    })
  },
  //修改会议记录笔记
  write(e) {
    this.setData({
      writing: true,
    })
  },
  //取消修改
  cancelNote(e){
    this.setData({
      hiddenmodalput3:true,
    })

  },
  //完成修改
  compNote(e) {
    this.setData({
      writing: false,
    })
  },
  //保存修改
  saveNote(e) {
    const db = wx.cloud.database()//操作数据库必须添加的字段，是固定的
    db.collection('_meetingCollection').doc(this.data.showId).update({
      // data 传入需要局部更新的数据
      data: {
        meetingImg:this.data.img,
        meetingNote:this.data.note,
      },
      success(res) {
        console.log(res.data)
      }
    })
    this.cancelNote();
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

  //点击预览  
  clickImg: function (e) {
    if (this.data.endTime - this.data.startTime < 350) {
    console.log("点击图片",e);
    var i = e.target.dataset.index;
    var imgUrl = this.data.img[i];
    wx.previewImage({
      urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    }
  },
  clear(e){
    if (this.data.writing){
      var that = this;
      var i = e.target.dataset.index;
      var img = that.data.img;
      wx.showModal({
        title: '删除',
        content: '删除该图片？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {
          console.log("res=",res)
          if (res.confirm) {
            img.splice(i, 1);
            that.setData({
              img: img,
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  //上传图片
  uploadPic(e){
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log("cloudPath:", res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        console.log("cloudPath:", filePath)
        
        var p = filePath.substring(filePath.length - 10)
        const cloudPath = "image/live/meetting/"+p;//filePath.match(/\.[^.]+?$/)[0]

        var mymeeting = that.data.mymeeting;

        var img = mymeeting[that.data.showIndex].meetingImg;
        img.push("cloud://it-cloud-hdrd7.6974-it-cloud-hdrd7-1300036058/" + cloudPath);
        mymeeting[that.data.showIndex].meetingImg = img;
        console.log("cloudPath:", cloudPath)

        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.setData({
              img: img,
              mymeeting:mymeeting,
            })
            console.log('[上传文件] 成功：', res)
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //显示会议记录笔记
  notes(e) {
    var meet = this.data.mymeeting;
    console.log("meet[parseInt(e.target.dataset.index)]", meet[parseInt(e.target.dataset.index)].meetingNote);
    var pla = "还没有添加笔记";
    if (meet[parseInt(e.target.dataset.index)].meetingNote != "")
      pla = " ";
    this.setData({
      hiddenmodalput3: false,
      showDate: e.target.dataset.date,
      showPeople: e.target.dataset.people,
      showPlace: e.target.dataset.place,
      showRemark: e.target.dataset.remark,
      showTheme: e.target.dataset.theme,
      showTime: e.target.dataset.time,
      showId: e.target.dataset.id,
      note: meet[parseInt(e.target.dataset.index)].meetingNote,
      showIndex:e.target.dataset.index,
      pla:pla,
      img: meet[parseInt(e.target.dataset.index)].meetingImg,
    })
  }, 

  //删除会议
  delBtn: function (e) {
    // console.log("id=", e.target.dataset.id)
    this.setData({
      hiddenmodalput1: false,
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
      hiddenmodalput2: true,
    })
    var that = this;
    var useropenid = this.data.useropenid
    var delId = this.data.delId
    const db = wx.cloud.database()
    const dbcolloction = db.collection("_meetingCollection")
    // console.log("id=", delId)
    dbcolloction.doc(delId).remove({
      success: function (res) {
        // console.log("成功")
        that.onLoad()
      }
    })
  },
  //查看会议详情
  showModal: function (e) {
    // console.log(e)
    this.setData({
      hiddenmodalput2: false,
      showDate: e.target.dataset.date,
      showPeople: e.target.dataset.people,
      showPlace: e.target.dataset.place,
      showRemark: e.target.dataset.remark,
      showTheme: e.target.dataset.theme,
      showTime: e.target.dataset.time,
      showId: e.target.dataset.id,
    })
  },
  //确认
  confirm1: function () {
    this.setData({
      hiddenmodalput2: true,
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
      name: "findAll",
      data: {
        name: '_meetingCollection',
      },
      success: res => {
        this.setData({
          allmeeting: res.result.data,
        })
        this.getMyMeeting()//筛选出我的行程
        console.log("mymeeting:",this.data.mymeeting);
        wx.setStorage({
          key: "calendarDate",
          data: this.data.myMeetingDate
        })
        // wx.setStorageSync('calendarDate', 'this.data.myMeetingDate')
        // console.log("allmeeting:", res.result.data)
      },
    })
    // this.selectComponent('#Calendar').today();
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
    this.getMyMeeting()//筛选出我的行程
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