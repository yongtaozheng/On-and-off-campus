// miniprogram/pages/learn/ClassManagement/ClassManagement.js
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchkey: "", //搜索关键字
    useropenid: "", //用户openid 
    allClass: [], //所有的课程
    searchByName: [], //通过课程名查找课程
    searchByCreatUser: [], //通过创建人查找课程
    searchByNumber: [], //通过人数查找课程
    hiddenmodalput: true, //弹窗状态
    courseName: "", //新建课程名
    createrName: "", //创建人姓名
    courseid: "", //课程id
    cname: "", //选中课程名
    img: "", //上传封面
    n: "", //学生人数
    show: 3,
    abstract:"",
  },

  //查看课程
  tocheakCourse: function(e) {
    wx.navigateTo({
      url: 'cheakCourse/cheakCourse'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //加载中的动画
    wx.showNavigationBarLoading()
    //获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        that.setData({
          useropenid: res.result.openid,
        })
        wx.setStorage({
          key: 'useropenid',
          data: res.result.openid
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
    wx.hideNavigationBarLoading()
  },
  //点击按钮指定的hiddenmodalput弹出框
  modalinput: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true,
      img: "",
    })
  },
  //确认
  confirm: function() {
    var that = this
    this.setData({
      hiddenmodalput: true,
    })
    var useropenid = this.data.useropenid
    var courseName = this.data.courseName
    var createrName = this.data.createrName
    var abstract = this.data.abstract
    var nowtime = app.nowtime()
    //----------------------------------
    var img = ""
    if (that.data.img == "") {
      img = "cloud://it-cloud-hdrd7.6974-it-cloud-hdrd7-1300036058/courseCoverImg/默认头像1.jpg"
    } else {
      img = that.data.img
    }
    console.log("createrName=", createrName)
    console.log("courseName=", courseName)
    const db = wx.cloud.database() //操作数据库必须添加的字段，是固定的
    db.collection('_courseCollection').add({ //counters是需要添加数据的集合名字
      data: { // data 字段表示需新增的 JSON 数据
        teacher: createrName,
        coursename: courseName,
        abstract: abstract,
        number: 0,
        teacherid: useropenid,
        date: nowtime,
        img: img,
      },
      success: function(res) {
        wx.showModal({
          title: '添加成功',
          content: '添加成功',
          showCancel: false,
        })
        that.setData({
          img: '',
          p: '',
          createrName: '',
          courseName: '',
          abstract:''
        })
        this.onLoad()
      },
      fail: console.error
    })
  },
  //课程名
  courseName: function(e) {
    this.setData({
      courseName: e.detail.value
    })
  },
  //创建人
  createrName: function(e) {
    this.setData({
      createrName: e.detail.value
    })
  },
  //封面名
  coverImage: function(e) {
    this.setData({
      p: e.detail.value
    })
  },

  //课程简介
  getAbstract:function(e){
    this.setData({
      abstract: e.detail.value
    })
  },
  //查看我的课程
  mycourse: function() {
    wx.navigateTo({
      url: '/pages/learn/ClassManagement/myCourse/myCourse',
    })
  },

  // 上传图片
  doUpload: function() {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log("cloudPath:", res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        console.log("cloudPath:", filePath)
        // 上传图片http://tmp/wxdbbd0bcf6e854a80.o6zAJs4RoixK9KfI8TwWlhKKB8q0.4pabC0IIiguje485d4a051e3dd9a14b951dc5adf5f61.jpg
        var p = filePath
        if (p.length > 10)
          p = filePath.substring(filePath.length - 10, filePath.length - 4)
        const cloudPath = "courseCoverImg/" + that.data.cname + p //filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.setData({
              img: "cloud://it-cloud-hdrd7.6974-it-cloud-hdrd7-1300036058/" + cloudPath,
              p: p,
            })
            console.log('[上传文件] 成功：', res)
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.onLoad();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      show: this.data.show + 3
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})