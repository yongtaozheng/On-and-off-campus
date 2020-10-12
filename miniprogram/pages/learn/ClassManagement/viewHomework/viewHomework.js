var util = require('../../../../utils/util.js');

Page({

  data: {
    homeworkid: "",
    openid: "",
    cid: "",
    homework: "",
    isComplete: 0,
    isChoose: false,
    submitid: "",
    fileName: "",
    homeworkDetail: "",
    correctmodal: true,
    score: 0,
    nowtime: "",
    date: "",
    time: "",
  },

  onLoad: function(options) {
    var that = this
    this.setData({
      openid: wx.getStorageSync('useropenid'),
      tid: wx.getStorageSync('tid'),
      cid: wx.getStorageSync('cid'),
      homeworkid: wx.getStorageSync('homeworkid'),
      classname: wx.getStorageSync('myclassname'),
      isComplete: options.isComplete,
      submitid: options.submitid
    })



    const db = wx.cloud.database()

    db.collection("_courseHomeworkList").where({
      _id: that.data.homeworkid,
    }).get({
      success: res => {
        this.setData({
          homework: res.data[0]
        })
        wx.setNavigationBarTitle({
          title: that.data.homework.title
        })
      }
    })

    if (this.data.isComplete != 0) {
      db.collection("_courseHomeworkSubmit").where({
        _id: that.data.submitid,
      }).get({
        success: res => {
          that.setData({
            homeworkDetail: res.data[0]
          })
        }
      })
    }

  },

  chooseFile() {
    const that = this;
    wx.chooseMessageFile({
      count: 1,
      success(res) {
        that.setData({
          src: res.tempFiles[0],
          isChoose: true
        })
      }
    })
  },

  submitHomework: function() {
    var that = this
    const db = wx.cloud.database()
    console.log(util)
    var time = util.formatTime(new Date()); //获取当前时间
    time = time.split(" ")
    this.setData({
      date: time[0],
      time: time[1]
    })
    console.log('datedate', this.data.date, 'timetime', this.data.time)
    wx.showLoading({
      title: '提交中',
    })
    // 上传文件到云端
    var filePath = this.data.src['path'] //临时路径
    this.data.fileName = this.data.src['name'] // 文件名

    var stunum = wx.getStorageSync('stunum')
    var cloudPath = this.data.cid + "/" + stunum + "/" + this.data.homeworkid + "/" + this.data.fileName //云端路径 

    wx.cloud.uploadFile({
      filePath,
      cloudPath,
      success: res => {
        console.log('classname', that.data.classname)
        db.collection('_courseHomeworkSubmit').add({
          // 将存储路径和fileID存放到数据库中
          data: {
            cid: that.data.cid,
            classname: that.data.classname,
            date: that.data.date,
            time: that.data.time,
            homeworkid: that.data.homeworkid,
            homeworkPath: cloudPath,
            homeworkFileID: res.fileID,
            homeworkName: that.data.fileName,
            state: 1,
            score: 0,
            studentid: that.data.openid
          },
          success: res => {
            db.collection("_courseHomeworkList").where({
              _id: that.data.homeworkid,
            }).get({
              success: res => {
                that.setData({
                  homework: res.data[0]
                })
                wx.cloud.callFunction({
                  // 云函数名称
                  name: 'updateCourseHomeworkList',
                  // 传给云函数的参数
                  data: {
                    _id: that.data.homework._id,
                    submitNum: that.data.homework.submitNum + 1
                  },
                  success: function(res) {}
                })
              }
            })
            wx.navigateBack({
              delta: 1
            })
          }
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
      }
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
              success: function(res) {

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

  correct: function() {
    this.setData({
      correctmodal: !this.data.correctmodal //弹窗})
    })
  },

  cancel: function() {
    this.setData({
      correctmodal: true
    })
  },

  getScore: function(e) {
    this.setData({
      score: e.detail.value
    })
  },

  confirmScore: function() {
    var that = this

    wx.cloud.callFunction({
      // 云函数名称
      name: 'updateScore',
      // 传给云函数的参数
      data: {
        _id: that.data.submitid,
        score: that.data.score,
        state: 2,
      },
      success: function(res) {
        that.setData({
          correctmodal: true
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

})