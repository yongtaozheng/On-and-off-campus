// miniprogram/pages/learn/ClassManagement/ClassManagement.js
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchkey: "",//搜索关键字
    useropenid: "",//用户openid 
    allClass: [],//所有的课程
    searchByName: [],//通过课程名查找课程
    searchByCreatUser: [],//通过创建人查找课程
    searchByNumber: [],//通过人数查找课程
    hiddenmodalput: true,//弹窗状态
    courseName: "",//新建课程名
    createrName: "",//创建人姓名
    courseid: "", //课程id
    cname: "",//选中课程名
    img: "",//上传封面
    n: "",//学生人数
    show: 5,
  },

  //--------------查看课程详情--------------------
  coursedetail: function (e) {
    wx.setStorageSync('cid', e.currentTarget.dataset.cid)
    wx.setStorageSync('tid', e.currentTarget.dataset.tid)
    wx.setStorageSync('openid', this.data.openid)
    wx.setStorageSync('cname', e.currentTarget.dataset.cname)
    wx.setStorageSync('teacher', e.currentTarget.dataset.teacher)
    wx.setStorageSync('courseN', e.currentTarget.dataset.n)
    wx.setStorageSync('img', e.currentTarget.dataset.img)
    wx.setStorageSync('abstract', e.currentTarget.dataset.abstract)
    console.log(e);
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        that.search()
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
  //搜索关键字
  nhw: function (e) {
    this.setData({
      searchkey: e.detail.value,
    })
  },

  //----------搜索课程---------------------
  search: function (e) {
    var that = this;
    var i = this.data.searchkey;   //获取输入框输入内容
    console.log('searchkey:', i)
    const db = wx.cloud.database()
    const dbcolloction = db.collection("_courseCollection")
    //-----------通过课程名查找--------------
    dbcolloction.where({
      coursename: db.RegExp({
        regexp: i,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      }),
    })
      .get({
        success: res => {
          this.setData({
            data: res.data,
            searchByName: res.data,
            search: 1,
          })
          const a = res;
          //console.log('[按课程名搜索成功]', a)
          //----------------按创建人查询-----------------
          dbcolloction.where({
            teacher: db.RegExp({
              regexp: i,
              //从搜索栏中获取的value作为规则进行匹配。
              options: 'i',
              //大小写不区分
            }),
          })
            .get({
              success: res => {
                this.setData({
                  data: res.data,
                  searchByCreatUser: res.data,
                })
                const b = res;
                //console.log('[按创建人搜索成功]', b)
                //------------------------按人数查询------------------------------
                dbcolloction.where({
                  number: db.RegExp({
                    regexp: i,
                    //从搜索栏中获取的value作为规则进行匹配。
                    options: 'i',
                    //大小写不区分
                  }),
                })
                  .get({
                    success: res => {
                      var a = this.data.searchByCreatUser
                      var b = this.data.searchByName
                      var c = a.concat()
                      //数组去重
                      if (c.length == 0)
                        c = a.concat(b)
                      else {
                        for (var i = 0; i < b.length; i++) {
                          for (var j = 0; j < c.length; j++) {
                            if (b[i]._id == c[j]._id) {
                              break;
                            }
                            if (j == c.length - 1)
                              c.push(b[i])
                          }
                        }
                      }
                      this.setData({
                        data: res.data,
                        searchByNumber: res.data,
                        allClass: c,
                        searchkey: ""
                      })
                    }
                  })
              }
            })
        }
      })
    console.log("查询结束", that.data.allClass)
  },

  //点击按钮指定的hiddenmodalput弹出框
  modalinput: function () {
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
    var useropenid = this.data.useropenid
    var courseName = this.data.courseName
    var createrName = this.data.createrName
    var nowtime = app.nowtime()
    //----------------------------------
    var img = ""
    if (that.data.img == "") {
      img = "cloud://it-cloud-hdrd7.6974-it-cloud-hdrd7-1300036058/courseCoverImg/默认头像1.jpg"
    }
    else {
      img = that.data.img
    }
    console.log("createrName=", createrName)
    console.log("courseName=", courseName)
    const db = wx.cloud.database()//操作数据库必须添加的字段，是固定的
    db.collection('_courseCollection').add({//counters是需要添加数据的集合名字
      data: {// data 字段表示需新增的 JSON 数据
        teacher: createrName,
        coursename: courseName,
        number: 0,
        teacherid: useropenid,
        date: nowtime,
        img: img,
      },
      success: function (res) {
        wx.showModal({
          title: '添加成功',
          content: '添加成功',
          showCancel: false,
        })
        this.onLoad()
      },
      fail: console.error
    })
  },


  //课程名
  courseName: function (e) {
    this.setData({
      courseName: e.detail.value
    })
  },
  //创建人
  createrName: function (e) {
    this.setData({
      createrName: e.detail.value
    })
  },
  mycourse: function () {
    wx.navigateTo({
      url: '/pages/learn/ClassManagement/myCourse/myCourse',
    })

  },

  // 上传图片
  doUpload: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log("cloudPath:", res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        console.log("cloudPath:", filePath)
        // 上传图片http://tmp/wxdbbd0bcf6e854a80.o6zAJs4RoixK9KfI8TwWlhKKB8q0.4pabC0IIiguje485d4a051e3dd9a14b951dc5adf5f61.jpg
        var p = filePath.substring(filePath.length - 10)
        const cloudPath = "courseCoverImg/" + that.data.cname + p    //filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.setData({
              img: filePath
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
    wx.stopPullDownRefresh();
    this.onLoad();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      show: this.data.show + 3
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})