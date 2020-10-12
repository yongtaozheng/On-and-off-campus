//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    username:'unlogin',
    useropenid:"",
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    imgUrls: [
      'cloud://it-cloud-hdrd7.6974-it-cloud-hdrd7-1300036058/p2.jpg',
      'cloud://it-cloud-hdrd7.6974-it-cloud-hdrd7-1300036058/p3.jpg',
      'cloud://it-cloud-hdrd7.6974-it-cloud-hdrd7-1300036058/p5.jpg',
      'cloud://it-cloud-hdrd7.6974-it-cloud-hdrd7-1300036058/p6.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 1000
  },



  touchStart(e) {
    // console.log(e)
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY
    });
  },

  touchEnd(e) {
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    if (app.getTouchData(x, y, this.data.startX, this.data.startY) == 'left') {
      console.log("左滑")
      // wx.switchTab({
      //   url: 'pages/index/index/index'
      // });

    }
    if (app.getTouchData(x, y, this.data.startX, this.data.startY) == 'right') {
      console.log("右滑")
      wx.switchTab({
        url: '/pages/sport/sport'
      });
    }
  },
 
  totest:function(){
    wx.navigateTo({
      url: '../test/test',
    })

  },

  onLoad: function() {
    console.log("onload")
    // const db = wx.cloud.database();
    // const c =db.collection("info");
    // c.get().then(res=>{
    //   console.log(res); 
    // })

    // //http://sa.sogou.com/sgsearch/sgs_video.php?docid=19a245041oG7Rw
    // wx.request({
    //   url: 'http://sa.sogou.com/sgsearch/sgs_video.php',
    //   data:{
    //     'docid':'19a245041oG7Rw'
    //   },
    //   method:'get',
    //   success: function(res){
    //     console.log("网络请求成功",res)
    //   },
    //   fail: function(err){
    //     console.log("网络请求失败", err)
    //   }
    // })


    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                username: res.userInfo.nickName
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
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
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
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
      fail: e => {
        console.error(e)
      }
    })
  },

})
