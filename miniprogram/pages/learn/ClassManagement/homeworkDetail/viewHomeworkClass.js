Page({

  data: {
    classList: [],
    allSubmit: [],
    submitNum: 0,
    homeworkid: "",
  },

  onLoad: function(options) {
    var that = this;
    this.setData({
      cid: wx.getStorageSync('cid'),
      homeworkid: wx.getStorageSync('homeworkid'),
  
    })

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('title')
    })

    const db = wx.cloud.database()

    // 查询当前课程所有班级提交情况
    db.collection('_classCollection').where({
      courseid: this.data.cid
    }).get({
      success: res => {
        that.setData({
          classList: res.data
        })

        db.collection('_courseHomeworkSubmit').where({
          cid: this.data.cid,
          homeworkid: this.data.homeworkid,
        }).get({
          success: res => {
            that.setData({
              allSubmit: res.data,
              submitNum: res.data.length
            })

            var as = that.data.allSubmit
            var cl = that.data.classList
            var aa = that.data.classList.length
            var bb = that.data.allSubmit.length

            for (var i = 0; i < aa; i++) {
              var x = 0
              for (var j = 0; j < bb; j++) {
                if (as[j].state != 0 && as[j].classname == cl[i].classname) {
                  x++
                }
              }
              var str = 'classList[' + i + '].submitNum'

              that.setData({
                [str]: x
              })
            }

          }
        })

      },
    })
  },

  onShow: function() {
    this.onLoad();
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.onLoad();
  },

  viewCourseHomework: function(e) {
    var classname = e.currentTarget.dataset.classname
    wx.setStorageSync('classname', classname)
    wx.navigateTo({
      url: './viewClassHomework',
    })
  },

})