// miniprogram/pages/learn/ClassManagement/classDetail/classDetail.js
var app = getApp()
var timestamp = Date.parse(new Date());
timestamp = timestamp / 1000;
//获取当前时间
var n = timestamp * 1000;
var date = new Date(n);
//年
var Y = date.getFullYear();
//月
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//日
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
// //时
// var h = date.getHours();
// var ho = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
// //分
// var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
// //秒
// var s = date.getSeconds();
// console.log(Y + M + D + h + m + s)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cid: "", //课程id
    tid: "", //创建人openid
    openid: "", //用户openid
    cname: "", //课程名
    teacher: "", //老师、创建人
    clollectionName: "", //用户加入课程集合名
    flag: 0, //学生加入课程状态 0：待审核 1：已加入 2：未申请
    hiddenmodalput: true, //加入课程
    hiddenmodalput1: true, //创建班级
    quitCoursemodal: true, //退出课程
    uploadFilemodal: true, //上传文件
    uploadPhotomodal: true, //上传相册相片
    uploadVideomodal: true, //上传相册视频
    checkJoinmodal: true, //审核加入申请
    claname: "", //创建班级姓名
    array: [], //班级列表
    index: "", //选中班级
    stuname: "", //学生姓名
    stunum: "", //学生学号
    allClass: "", //班级详细列表
    allstu: "", //学生申请列表
    n: "", //学生人数
    myclassname: "", //学生班级名
    img: [], //课程封面
    currentData: 0,
    image1: "/images/myCourse/courseIntroduction1.png",
    image2: "/images/myCourse/homework.png",
    image3: "/images/myCourse/resources.png",
    courseResources: [],
    localFileName: "", //本地文件名
    localFileName1: "", //文件名无后缀
    fileName: "", //上传到云端的文件名
    isMedia: false,
    length: 0,
    courseHomeworkList: [], //课程作业列表
    courseHomeworkSubmit: [], //学生作业列表
    newSelect: false,
    abstract: "",
  },

  checkJoin: function() {
    this.setData({
      checkJoinmodal: !this.data.checkJoinmodal //弹窗
    })
  },

  //审核学生加入班级
  allow: function(e) {
    wx.showLoading({
      title: '加载中…',
    })
    var that = this
    const db = wx.cloud.database() //操作数据库必须添加的字段，是固定的
    var flag = 1
    //判断点击事件
    console.log(e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.flag != 1) {
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'updateSelectForm',
        // 传递给云函数的参数
        data: {
          date: "",
          state: -1,
          id: e.currentTarget.dataset.id,
        },
        success: function(res) {
          that.onLoad()
        },
        complete: function(res) {
          wx.hideLoading()
        }
      })
    } else {
      //更新选课表数据
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'updateSelectForm',
        // 传递给云函数的参数
        data: {
          date: app.nowtime(),
          state: flag,
          id: e.currentTarget.dataset.id,
        },
        success: function(res) {
          console.log("更新选课表信息", res),
            //更新课程总人数
            db.collection("_courseCollection").doc(that.data.cid).get()
            .then(res => {
              var n = res.data.number + 1;
              console.log('a', n)
              db.collection("_courseCollection").doc(that.data.cid).update({
                data: { // data 传入需要局部更新的数据
                  number: n
                },
                success: console.log("更新课程人数", e.currentTarget.dataset.classname),
                fail: console.error
              })
            })
          //获取班级人数
          db.collection("_classCollection").where({
              courseid: that.data.courseid,
              classname: e.currentTarget.dataset.classname,
            }).get()
            .then(res => {
              //更新班级人数
              console.log('b', res.data)
              wx.cloud.callFunction({
                // 要调用的云函数名称
                name: 'classN',
                data: { // data 传入需要局部更新的数据
                  number: res.data[0].number + 1,
                  courseid: that.data.courseid,
                  classname: e.currentTarget.dataset.classname,
                },
                success: console.log("更新班级人数"),
                fail: console.error
              })
            })
          //that.cancel() //关闭弹窗
          that.onLoad() //刷新
        },
        complete: function(res) {
          wx.hideLoading()
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this
    this.setData({
      cid: wx.getStorageSync('cid'),
      tid: wx.getStorageSync('tid'),
      openid: wx.getStorageSync('useropenid'),
      cname: wx.getStorageSync('cname'),
      teacher: wx.getStorageSync('teacher'),
      n: wx.getStorageSync('courseN'),
      img: wx.getStorageSync('img'),
      fileName: "",
      abstract: wx.getStorageSync('abstract')
    })
    wx.setNavigationBarTitle({
      title: this.data.cname
    })

    //查询用户加入课程的状态
    var collectionName = this.data.clollectionName
    const db = wx.cloud.database()

    console.log("cid", that.data.cid)

    db.collection("_courseSelect").where({
      courseid: that.data.cid, // 课程id
      studentid: that.data.openid, //学生id
      //state: 1
    }).get({
      success: res => {
        if (res.data.length == 0 || res.data[0].state == -1) {
          that.setData({
            flag: 2
          })
        } else {
          that.setData({
            flag: res.data[0].state,
            myclassname: res.data[0].classname
          })
        }
        wx.setStorageSync('stunum', res.data[0].studentn)
      }
    })

    //查询所有申请加入课程的学生
    db.collection("_courseSelect").where({
      courseid: that.data.cid, // 课程id
      state: 0
    }).get({
      success: res => {
        that.setData({
          allSelect: res.data,
        })
        if (res.data.length > 0) {
          that.setData({
            newSelect: true
          })
        } else {
          that.setData({
            newSelect: false
          })
        }
        console.log('aa', that.data.newSelect)
      }
    })

    //查询课程的所有班级集合
    wx.cloud.callFunction({
      name: "allClass",
      data: {
        cid: that.data.cid,
      },
      success: res => {
        console.log("成功", res)
        //取出班级名称
        var c = []
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i].courseid == that.data.cid)
            c.push(res.result.data[i].classname)
        }
        this.setData({
          allClass: res.result.data,
          array: c
        })
      },
    })

    //获取该课程所有作业
    wx.cloud.callFunction({
      //取出班课程所有作业
      // 要调用的云函数名称
      name: 'findAll',
      data: { // data 传入需要局部更新的数据
        name: "_courseHomeworkList"
      },
      success: function(res) {
        var temp = []
        var courseHomeworkList = res.result.data
        for (var i = 0; i < courseHomeworkList.length; i++) {
          if (courseHomeworkList[i].cid == that.data.cid) {
            temp.push(courseHomeworkList[i])
          }
          if (i == courseHomeworkList.length - 1) {
            that.setData({
              courseHomeworkList: temp
            })
          }
        }

        wx.cloud.callFunction({
          //再取用户所有作业提交情况
          // 要调用的云函数名称
          name: 'findAll',
          data: { // data 传入需要局部更新的数据
            name: "_courseHomeworkSubmit"
          },
          success: function(res) {


            var temp = []
            var courseHomeworkSubmit = res.result.data

            for (var i = 0; i < courseHomeworkSubmit.length; i++) {
              if (courseHomeworkSubmit[i].cid == that.data.cid) {
                temp.push(courseHomeworkSubmit[i])
              }
            }


            var allSubmit = temp
            var allHomework = that.data.courseHomeworkList
            var state = 0
            var submitid = ""

            for (var i = 0; i < allHomework.length; i++) {
              for (var j = 0; j < allSubmit.length; j++) {
                if (allHomework[i]._id == allSubmit[j].homeworkid) {
                  state = allSubmit[j].state
                  submitid = allSubmit[j]._id
                  break
                } else {
                  state = 0
                }
              }
              var str = 'courseHomeworkList[' + i + '].state'
              var str1 = 'courseHomeworkList[' + i + '].submitid'
              that.setData({
                [str]: state,
                [str1]: submitid
              })
            }
            console.log('homeworklist', that.data.courseHomeworkList)
          },
          fail: function(res) {
            console.log('res', res)
          },
        })


      },
    })

    // 查询当前课程所有的文件路径
    db.collection('filePath').where({
      cid: this.data.cid
    }).get({
      success: res => {
        this.setData({
          courseResources: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

    var YY = date.getFullYear();
    //月
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    //分
    var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var nowdate = YY + '-' + MM + '-' + DD
    this.data.nowdate = nowdate
  },
  //-----------------加入课程的弹窗------------------------------
  joincourse: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput //弹窗
    })
  },
  //-----------------退出课程的弹窗------------------------------
  quitCourse: function() {
    this.setData({
      quitCoursemodal: !this.data.quitCoursemodal //弹窗
    })
  },
  //---------------创建班级的弹窗----------------------------
  createclass: function() {
    this.setData({
      hiddenmodalput1: !this.data.hiddenmodalput //弹窗
    })
  },

  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true,
      hiddenmodalput1: true,
      quitCoursemodal: true,
      uploadFilemodal: true,
      uploadPhotomodal: true,
      uploadVideomodal: true,
      checkJoinmodal: true,
      localFileName: "",
      localFileName1: "",
      fileName: ""
    })
  },
  //确认加入课程
  confirm: function() {
    this.setData({
      hiddenmodalput: true,
    })
    var that = this
    var index = this.data.index //选中班级下标
    var _class = this.data.array[index] //选中班级

    const db = wx.cloud.database() //操作数据库必须添加的字段，是固定的
    db.collection('_courseSelect').add({ //counters是需要添加数据的集合名字
      data: { // data 字段表示需新增的 JSON 数据
        courseid: that.data.cid,
        classname: _class,
        state: 0,
        studentid: that.data.openid,
        studentn: that.data.stunum,
        studentname: that.data.stuname,
        date: "",
      },
      success: function(res) {
        that.onLoad();
        that.setData({
          flag: 0
        })
      },
      fail: console.error
    })
  },
  //确认退出课程
  confirmQuit: function(e) {
    this.setData({
      quitCoursemodal: true,
    })
    var that = this

    const db = wx.cloud.database() //操作数据库必须添加的字段，是固定的
    db.collection('_courseSelect').where({
      courseid: this.data.cid,
      studentid: this.data.openid
    }).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.setData({
          counterId: '',
          count: null,
        })
        //更新课程总人数
        db.collection("_courseCollection").doc(that.data.cid).get()
          .then(res => {
            var n = res.data.number - 1;
            db.collection("_courseCollection").doc(that.data.cid).update({
              data: { // data 传入需要局部更新的数据
                number: n
              },
              success: console.log("更新课程人数", that.data.myclassname),
              fail: console.error
            })
          })
        //获取班级人数
        db.collection("_classCollection").where({
            courseid: that.data.courseid,
            classname: that.data.myclassname,
          }).get()
          .then(res => {
            //更新班级人数
            wx.cloud.callFunction({
              // 要调用的云函数名称
              name: 'classN',
              data: { // data 传入需要局部更新的数据
                number: res.data[0].number - 1,
                courseid: that.data.courseid,
                classname: that.data.myclassname,
              },
              success: console.log("更新班级人数"),
              fail: console.error
            })
          })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })

    this.onLoad() //刷新页面
  },

  //学生姓名
  stuname: function(e) {
    this.setData({
      stuname: e.detail.value
    })
  },
  //学生学号
  stunum: function(e) {
    this.setData({
      stunum: e.detail.value
    })
  },
  //班级名称
  claname: function(e) {
    this.setData({
      claname: e.detail.value
    })
  },
  //---------选中班级--------
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  //--------------------------创建班级--------------------------
  confirm1: function() {
    var that = this
    this.setData({
      hiddenmodalput1: true,
    })
    var tid = this.data.tid //创建人openid
    var claname = this.data.claname //创建班级名称
    var cname = this.data.cname //课程名
    var name = tid.substring(10)

    const db = wx.cloud.database()
    db.collection('_classCollection').add({
      data: { // data 字段表示需新增的 JSON 数据
        classname: claname,
        number: 0,
        courseid: that.data.cid,
      },
      success: function(res) {
        console.log("创建班级成功", res)
        wx.showModal({
          title: '操作成功',
          content: '已成功创建班级',
          showCancel: false,
        })
        that.onLoad() //刷新
      },
      fail: function(res) {
        console.log("创建班级失败", res)
        wx.showModal({
          title: '操作失败',
          content: '创建失败',
          showCancel: false,
        })
      },
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
    this.onLoad()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    var image1 = "/images/myCourse/courseIntroduction.png";
    var image2 = "/images/myCourse/homework.png";
    var image3 = "/images/myCourse/resources.png"
    switch (e.detail.current) {
      case 0:
        image1 = "/images/myCourse/courseIntroduction1.png"
        break;
      case 1:
        image2 = "/images/myCourse/homework1.png"
        break;
      case 2:
        image3 = "/images/myCourse/resources1.png"
        break;
    }

    that.setData({
      currentData: e.detail.current,
      image1: image1,
      image2: image2,
      image3: image3
    })

  },

  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current,
      })
    }
  },
  //---------查看班级----------//
  viewClass: function() {

  },

  //---------查看班级作业完成情况----------//
  viewHomeworkClass: function(e) {
    var homeworkContent = e.currentTarget.dataset.content
    var homeworkid = e.currentTarget.dataset.homeworkid
    var title = e.currentTarget.dataset.title
    wx.setStorageSync('homeworkContent', homeworkContent)
    wx.setStorageSync('homeworkid', homeworkid)
    wx.setStorageSync('title', title)

    wx.navigateTo({
      url: '../homeworkDetail/viewHomeworkClass'
    })
  },

  //---------查看作业----------//
  viewCourseHomework: function(e) {
    var homeworkid = e.currentTarget.dataset.homeworkid
    var isComplete = e.currentTarget.dataset.iscomplete
    var submitid = e.currentTarget.dataset.submitid
    var myclassname = e.currentTarget.dataset.myclassname
    wx.setStorageSync('homeworkid', homeworkid)
    wx.setStorageSync('myclassname', myclassname)
    console.log('isComplete', isComplete)
    wx.navigateTo({
      url: '../viewHomework/viewHomework?isComplete=' + isComplete + '&submitid=' + submitid,
    })
  },

  createHomework: function() {
    wx.navigateTo({
      url: '../courseHomework/courseHomework',
    })
  },
  //-------------在线预览文件内容-----------//
  previewFile: function(e) {
    wx.showLoading({
      title: '正在打开文件',
    })
    let fileName = e.currentTarget.dataset.filename;
    let file_id = e.currentTarget.dataset.fileid;
    let type = e.currentTarget.dataset.path.match(/\.[^.]+?$/)[0]

    //let type = fileName;
    wx.cloud.downloadFile({
      fileID: file_id,
      success: res => {
        // 不同文件格式预览方法
        switch (type) {
          case ".mp3":
          case ".m4a":
          case ".wav":
          case ".aac":
            //若为微信支持播放的音频类型，则后台播放音频
            const backgroundAudioManager = wx.getBackgroundAudioManager()
            backgroundAudioManager.title = fileName
            backgroundAudioManager.coverImgUrl = null
            // 设置了 src 之后就会自动播放，若此处不设置src默认将为空字符串，当设置了src可以播放音乐
            backgroundAudioManager.src = res.tempFilePath
            break;

          case ".mp4":
          case ".3gp":
          case ".m3u8":
            //若为微信支持播放的视频类型，则打开新的页面播放视频
            
            wx.navigateTo({
              url: '../courseDetail/preview?src=' + res.tempFilePath + '&name=' + fileName,
            })
            break;

          case ".doc":
          case ".docx":
          case ".xls":
          case ".xlsx":
          case ".ppt":
          case ".pptx":
          case ".pdf":
            //若为微信支持预览的文档类型，则新页面打开文档
            const file_path = res.tempFilePath
            wx.openDocument({
              filePath: file_path,
              showMenu:true,
              success: function(res) {
                console.log('打开文档成功')
              },
              fail: function(res) {
                wx.showToast({
                  title: '文件预览失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
            break;

          case ".bmp":
          case ".jpg":
          case ".png":
          case ".tif":
          case ".gif":
          case ".pcx":
          case ".tga":
          case ".exif":
          case ".fpx":
          case ".svg":
          case ".psd":
          case ".cdr":
          case ".pcd":
          case ".dxf":
          case ".ufo":
          case ".eps":
          case ".ai":
          case ".raw":
          case ".WMF":
          case ".webp":
          case ".jpeg":
          case ".ico":
            wx.previewImage({
              current: res.tempFilePath, // 当前显示图片的http链接
              urls: [res.tempFilePath] // 需要预览的图片http链接列表
            })
            break;

          default:
            wx.showToast({
              title: '暂不支持该类型文件的预览',
              icon: 'none',
              duration: 2000
            })
            break;
        }
      },
      fail: err => {
        // handle error
        wx.showToast({
          icon: 'none',
          title: '打开文件失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  //------------------上传资源-----------------//
  chooseFile() {
    const that = this;
    wx.chooseMessageFile({
      count: 1,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          src: res.tempFiles[0],
          localFileName: res.tempFiles[0]['name'],
          localFileName1: res.tempFiles[0]['name'].substring(0, res.tempFiles[0]['name'].lastIndexOf('.'))
        })
      }
    })
  },

  choosePhoto() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          src: res.tempFilePaths[0],
          localFileName: res.tempFilePaths[0],
        })
      }
    })
  },

  chooseVideo() {
    const that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        that.setData({
          src: res.tempFilePath,
          localFileName: res.tempFilePath,
        })
      }
    })
  },

  getfilename: function(e) {
    this.setData({
      fileName: e.detail.value
    })
  },


  doUpload: function() {
    wx.showLoading({
      title: '上传中',
    })
    // 上传文件到云端
    var that = this;
    if (!this.data.isMedia) {
      //文件路径处理
      var filePath = this.data.src['path'] //临时路径
      if (this.data.fileName == "") {
        this.data.fileName = this.data.localFileName1
      }
    } else {
      //相片或视频路径处理
      var filePath = this.data.src //临时路径
      if (this.data.fileName == "") {
        wx.showToast({
          title: '请输入文件名',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    }
    var fileExtension = filePath.substring(filePath.lastIndexOf('.'));
    var cloudPath = this.data.cid + "/" + this.data.fileName + fileExtension //云端路径 
    var fileName1 = that.data.fileName + fileExtension //云端文件名

    const db = wx.cloud.database()
    //查询是否有同名文件
    db.collection('filePath').where({
      cid: that.data.cid,
      fileName: fileName1,
    }).get({
      success: res => {
        that.data.length = res.data.length
        if (res.data.length == 0) {
          wx.cloud.uploadFile({
            filePath,
            cloudPath,
            success: res => {
              console.log('[上传文件] 成功：', res)
              const db = wx.cloud.database()
              db.collection('filePath').add({
                // 将存储路径和fileID存放到数据库中
                data: {
                  cid: that.data.cid,
                  path: cloudPath,
                  fileID: res.fileID,
                  fileName: fileName1,
                  time: that.data.nowdate
                },
                success: res => {
                  console.log("新增记录成功")
                  that.onLoad()
                }
              })

              this.setData({
                uploadFilemodal: true,
                uploadPhotomodal: true,
                uploadVideomodal: true,
              })

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
              that.setData({
                localFileName: "",
                localFileName1: "",
                src: ""
              })
            }
          })
        } else {
          wx.showToast({
            title: '存在同名文件，请重新命名',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })


  },



  uploadFile: function() {
    this.setData({
      uploadFilemodal: !this.data.uploadFilemodal //弹窗
    })
  },
  uploadPhoto: function() {
    this.setData({
      uploadPhotomodal: !this.data.uploadPhotomodal //弹窗
    })
  },
  uploadVideo: function() {
    this.setData({
      uploadVideomodal: !this.data.uploadVideomodal //弹窗
    })
  },
  listenerButton: function() {
    var itemList = ['从会话中选择文件', '上传相片']
    var that = this;
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        if (res.tapIndex == 0) {
          that.data.isMedia = false;
          that.uploadFile()
        } else if (res.tapIndex == 1) {
          that.data.isMedia = true;
          that.uploadPhoto()
        } 
      }
    })
  }

})