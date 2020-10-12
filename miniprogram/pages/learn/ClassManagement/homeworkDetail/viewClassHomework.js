// miniprogram/pages/learn/ClassManagement/viewHomework/viewClassHomework.js
Page({
  data: {
    classname: "",
    cid: "",
    homeworkid: "",
    // allCourseSelect:"",
    allSelect: "",
    allSubmit: "",
    allHomework: "",
    currentData:0,
    allUnfinished: "" //所有没交作业学生
  },

  onLoad: function(options) {

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('classname')
    })

    var that = this
    this.setData({
      cid: wx.getStorageSync('cid'),
      classname: wx.getStorageSync('classname'),
      homeworkid: wx.getStorageSync('homeworkid'),
    })
    const db = wx.cloud.database()


    wx.cloud.callFunction({
      //先取出得到班级学生
      // 要调用的云函数名称
      name: 'findAll',
      data: { // data 传入需要局部更新的数据
        name: "_courseSelect"
      },
      success: function(res) {
        var allSelect = res.result.data
        var temp = []
        for (var i = 0; i < allSelect.length; i++) {
          if (allSelect[i].classname == that.data.classname && allSelect[i].courseid == that.data.cid && allSelect[i].state == 1) {
            temp.push(allSelect[i])
          }
        }
        that.setData({
          allSelect: temp
        })

        wx.cloud.callFunction({
          //再取出班级所有提交情况
          // 要调用的云函数名称
          name: 'findAll',
          data: { // data 传入需要局部更新的数据
            name: "_courseHomeworkSubmit"
          },
          success: function(res) {
            var allSubmit = res.result.data
            var temp = []
            for (var i = 0; i < allSubmit.length; i++) {
              if (allSubmit[i].homeworkid == that.data.homeworkid && allSubmit[i].classname == that.data.classname && allSubmit[i].cid == that.data.cid) {
                temp.push(allSubmit[i])
              }
            }


            var allSubmit = temp
            var allSelect = that.data.allSelect
            var allUnfinished = that.data.allSelect
            for (var i = 0; i < allSubmit.length; i++) {
              for (var j = 0; j < allSelect.length; j++) {
                if (allSubmit[i].studentid == allSelect[j].studentid) {
                  allSubmit[i].studentn = allSelect[j].studentn
                  allSubmit[i].studentname = allSelect[j].studentname
                  var str = 'allSubmit['+i+']'
                  that.setData({
                    [str] : allSubmit[i]
                  })
                  that.remove(allUnfinished, allSelect[j])
                }
              }
            }
            that.setData({
              allUnfinished: allUnfinished,
            })

          },
          fail: console.error
        })
      },
      fail: console.error
    })
  },


  remove: function(array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == val) {
        array.splice(i, 1);
      }
    }
    return -1;
  },

  onShow: function() {
    this.onLoad();
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.onLoad();
  },

  //获取当前滑块的index
  bindchange: function(e) {

    this.setData({
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

  viewHomework: function(e) {
    var submitid = e.currentTarget.dataset.submitid
    var isComplete = e.currentTarget.dataset.iscomplete
    wx.navigateTo({
      url: '../viewHomework/viewHomework?submitid=' + submitid + '&isComplete=' + isComplete,
    })
  },

})