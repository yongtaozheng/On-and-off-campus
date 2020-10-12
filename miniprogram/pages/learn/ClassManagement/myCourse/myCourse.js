Page({

  /**
   * 页面的初始数据
   */
  data: {
    allClass: "",
    allCreateClass: "",
    allSelect: "",
    useropenid: "",
    currentData: 0,
    delBtnWidth: 160,
    courseHomeworkList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'useropenid',
      success: function(res) {
        that.setData({
          useropenid: res.data,
        })
        console.log('useropenid=', res.data)

        const db = wx.cloud.database()
        //所有课程
        db.collection("_courseCollection").get({
          success: function(res) {
            that.setData({
              allClass: res.data,
            })
          }
        })

        //获取所有自己创建的课程
        db.collection("_courseCollection").where({
          teacherid: res.data
        }).get({
          success: function(res) {
            that.setData({
              allCreateClass: res.data,
            })
          }
        })

        //获取自己所有未完成作业和已加入课程
        wx.cloud.callFunction({
          //首先获取自己所有加入课程id
          name: 'findAll',
          data: { // data 传入需要局部更新的数据
            name: "_courseSelect"
          },
          success: function(res) {
            var cid = []
            console.log(res.result)
            var allSelect = res.result.data
            for (var h = 0; h < allSelect.length; h++) {
              if (allSelect[h].state == 1 && allSelect[h].studentid == that.data.useropenid)
                cid[h] = allSelect[h].courseid;

            }
            that.setData({
              allSelect: cid,
            })
            console.log(that.data.allSelect)

            wx.cloud.callFunction({
              //取出我的课程所有作业
              // 要调用的云函数名称
              name: 'findAll',
              data: { // data 传入需要局部更新的数据
                name: "_courseHomeworkList"
              },
              success: function(res) {
                var temp = []
                var courseHomeworkList = res.result.data
                var allSelect = that.data.allSelect

                for (var i = 0; i < courseHomeworkList.length; i++) {
                  for (var j = 0; j < allSelect.length; j++) {
                    if (courseHomeworkList[i].cid == allSelect[j]) {
                      temp.push(courseHomeworkList[i])
                    }
                    if (i == courseHomeworkList.length - 1) {
                      that.setData({
                        courseHomeworkList: temp
                      })
                    }
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
                    var allSelect = that.data.allSelect

                    for (var i = 0; i < courseHomeworkSubmit.length; i++) {
                      for (var j = 0; j < allSelect.length; j++) {
                        if (courseHomeworkSubmit[i].cid == allSelect[j]) {
                          temp.push(courseHomeworkSubmit[i])
                        }
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
                  }
                })
              },
            })

          }
        })
      },
    })

  },
  //--------------查看课程详情--------------------
  coursedetail: function(e) {
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

  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current,
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

  // 截获竖向滑动
  catchTouchMove: function(res) {
    return false
  },

  drawStart: function(e) {
    // console.log("drawStart");  
    var touch = e.touches[0]

    for (var index in this.data.footprint) {
      var item = this.data.footprint[index]
      item.right = 0
    }
    this.setData({
      footprint: this.data.footprint,
      startX: touch.clientX,
    })

  },
  drawMove: function(e) {
    var touch = e.touches[0]
    var item = this.data.footprint[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        footprint: this.data.footprint
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        footprint: this.data.footprint
      })
    }
  },
  drawEnd: function(e) {
    var item = this.data.footprint[e.currentTarget.dataset.index]
    console.log(item)
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        footprint: this.data.footprint,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        footprint: this.data.footprint,
      })
    }
  },

  //---------查看作业----------//
  viewCourseHomework: function(e) {
    var homeworkid = e.currentTarget.dataset.homeworkid
    var isComplete = e.currentTarget.dataset.iscomplete
    var submitid = e.currentTarget.dataset.submitid
    wx.setStorageSync('tid', 'notme')
    wx.setStorageSync('homeworkid', homeworkid)
    wx.navigateTo({
      url: '../viewHomework/viewHomework?isComplete=' + isComplete + '&submitid=' + submitid,
    })
  },

  delItem: function(e) {
    //删除
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
    this.onLoad();
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

  }
})