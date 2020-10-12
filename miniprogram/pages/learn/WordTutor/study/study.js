var app = getApp();
var i = 0;
var pieChart = null;
var wxCharts = require('../../../../utils/wxcharts.js');

Page({
  data: {
    id1: "我在校里校外背单词发现这个单词很有趣，一起来学习吧！",
    id2: "我在校里校外完成了今天的背单词任务，一起来学习吧！",
    counter: [1],
    n: 0,
    openid: "",
    word_list: [],
    plan: "",
    today_num: 0,
    bookname: "",
    cpt: false,
    keep_study:0
  },

  onLoad: function(options) {
    var keep_study = wx.getStorageSync('keep_study')
    this.setData({
      keep_study: keep_study
    }) 
    var bookaddress = "../../../../data/" + wx.getStorageSync('book') + ".js"
    console.log('zzzzzzzzz', bookaddress)
    var total_word = require(bookaddress).wordList
    var n = wx.getStorageSync('wordnum')
    var today_num = wx.getStorageSync('today_num')
    var plan = wx.getStorageSync('plan')
    var remain = plan - today_num
    if (remain <= 0) {
      this.todayComplete()
    }
    var word_list = []
    console.log("total", total_word[n])

    for (var i = 0; i < remain; i++) {
      word_list.push(total_word[n + i])
    }

    this.setData({
      n: n,
      openid: wx.getStorageSync('useropenid'),
      word_list: word_list,
      plan: plan,
      today_num: today_num,
      bookname: wx.getStorageSync('bookname')
    })
    console.log('word', word_list)
    this.search(word_list[0]);
  },

  onReady: function() {},


  //当用页面重新展示时调用函数
  onShow: function() {

  },

  //当页面被隐藏时，保存数据到
  onHide: function() {
    const db = wx.cloud.database()

    db.collection('_wordCollection').where({
      _openid: this.data.openid,
      bookname: this.data.bookname
    }).update({
      data: {
        n: this.data.n,
        today_num: this.data.today_num
      },
      success: function(res) {}
    })
  },

  //页面被卸载时，保存学习数据到数据库
  onUnload: function() {
    const db = wx.cloud.database()

    db.collection('_wordCollection').where({
      _openid: this.data.openid,
      bookname: this.data.bookname
    }).update({
      data: {
        n: this.data.n,
        today_num: this.data.today_num
      },
      success: function(res) {
        console.log('trsrtsr', res)
      }
    })
  },

  //单词被展示时
  show: function() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.pron_audio.uk[0]
    innerAudioContext.onPlay(() => {})
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.setData({
      showNot: true,
      more: false
    })
  },

  //页面分享函数
  onShareAppMessage: function(options) {
    var id = options.target.id
    return {
      title: id,
      path: '/pages/learn/WordTutor/WordTutor',
    }
  },


  //用户点击认识
  next: function() {

    var counter = this.data.counter
    var word_list = this.data.word_list
    for (var i = 0; i < counter.length; i++) {

      if (counter[i].word == word_list[0] && counter[i].blur == 1 && counter[i].rem == 0) {
        //如果是之前点过模糊且还没点过认识
        if (word_list.length >= 20) {
          //如果单词列表长度大于等于20，就把单词放到20
          var temp = word_list[0]
          word_list.splice(0, 1)
          word_list.splice(19, 0, temp)
          console.log("模糊过，长度大于20", word_list)

        } else {
          //长度不够20，放到末尾
          var temp = word_list[0]
          word_list.splice(0, 1)
          word_list.push(temp)
          console.log('zzzzzzzzzz', word_list)
        }
        counter[i].rem = 1
        counter[i].blur = 0
        break
      } else if (counter[i].word == word_list[0] && counter[i].forget == 1 && counter[i].rem == 0) {

        if (word_list.length >= 14) {
          //如果单词列表长度大于等于14，就把单词放到14
          var temp = word_list[0]
          word_list.splice(0, 1)
          word_list.splice(13, 0, temp)
          console.log("忘记过，长度大于14", word_list)

        } else {
          //长度不够14，放到末尾
          var temp = word_list[0]
          word_list.splice(0, 1)
          word_list.push(temp)
        }
        counter[i].rem = 0
        counter[i].forget = 0
        break
      } else if (counter[i].word == word_list[0] && counter[i].rem == 1) {

        //如果是第二次点认识
        var n = this.data.n + 1
        var today_num = this.data.today_num + 1
        // word_list.push(total_word[n])
        this.setData({
          n: n,
          today_num: today_num
        })
        word_list.splice(0, 1)
        counter.splice(i, 1)
        break
      }
      if (i == counter.length - 1) {
        //如果是第一次见到就点认识
        var td = wx.getStorageSync('today_detail');
        td.rem = td.rem + 1
        wx.setStorageSync('today_detail', td)

        var n = this.data.n + 1
        var today_num = this.data.today_num + 1
        // word_list.push(total_word[n])
        this.setData({
          n: n,
          today_num: today_num
        })
        word_list.splice(0, 1)
        break
      }
    }
    console.log('counter', counter)
    console.log('word_list', word_list)
    this.setData({
      counter: counter,
      word_list: word_list,
      showNot: false
    })
    this.search(this.data.word_list[0])

    var today_num = this.data.today_num
    var plan = this.data.plan
    var remain = plan - today_num
    if (remain <= 0) {
      var keep_study = wx.getStorageSync('keep_study') + 1
      wx.setStorageSync('keep_study',keep_study)
      this.setData({
        keep_study: keep_study
      }) 
      this.todayComplete()
    }

  },


  //用户点击忘记时调用该函数
  forget: function() {

    var counter = this.data.counter
    var word_list = this.data.word_list
    for (var i = 0; i < counter.length; i++) {

      if (counter[i].word == word_list[0]) {
        //如果之前点过模糊或忘记
        counter[i].rem = 0
        counter[i].blur = 0
        counter[i].forget = 1
      }
      if (i == counter.length - 1) {
        //之前没点过，新建记录
        var td = wx.getStorageSync('today_detail');
        td.forget = td.forget + 1
        wx.setStorageSync('today_detail', td)

        var ct = {
          wordnumber: this.data.n,
          word: word_list[0],
          rem: 0,
          blur: 0,
          forget: 1
        }
        counter.push(ct)
        break
      }
    }
    if (word_list.length >= 3) {
      //长度够3，放到3
      var temp = word_list[0]
      word_list.splice(0, 1)
      word_list.splice(2, 0, temp)
    } else {
      //不够，放末尾
      var temp = word_list[0]
      word_list.splice(0, 1)
      word_list.push(temp)
    }

    console.log('counter', counter)
    console.log('word_list', word_list)
    this.setData({
      counter: counter,
      word_list: word_list,
      showNot: false
    })
    this.search(this.data.word_list[0])

  },

  //用户点击模糊时调用函数
  mohu: function() {

    var counter = this.data.counter
    var word_list = this.data.word_list
    for (var i = 0; i < counter.length; i++) {

      if (counter[i].word == word_list[0]) {
        //如果之前点过模糊或忘记
        counter[i].rem = 0
        counter[i].blur = 1
        counter[i].forget = 0
      }
      if (i == counter.length - 1) {
        //之前没点过，新建记录
        var td = wx.getStorageSync('today_detail');
        td.blur = td.blur + 1
        wx.setStorageSync('today_detail', td)

        var ct = {
          wordnumber: this.data.n,
          word: word_list[0],
          rem: 0,
          blur: 1,
          forget: 0
        }
        counter.push(ct)
        break
      }
    }
    if (word_list.length >= 3) {
      //长度够8，放到8
      var temp = word_list[0]
      word_list.splice(0, 1)
      word_list.splice(7, 0, temp)
    } else {
      //不够，放末尾
      var temp = word_list[0]
      word_list.splice(0, 1)
      word_list.push(temp)
    }

    console.log('counter', counter)
    console.log('word_list', word_list)
    this.setData({
      counter: counter,
      word_list: word_list,
      showNot: false
    })
    this.search(this.data.word_list[0])

  },


  //通过扇贝提供的api搜索该函数
  search: function(word) {
    this.setData({
      content: word
    })
    console.log(word);
    var that = this;
    wx.request({
      url: 'https://api.shanbay.com/bdc/search/?word=' + word,
      data: {},
      method: 'GET',
      success: function(res) {

        that.setData({
          pron: res.data.data.pronunciations,
          pron_audio: res.data.data.audio_addresses,
          definition: res.data.data.definition,
        })
        var id = res.data.data.conent_id
        that.liju(id)
      },
      fail: function() {},
      complete: function() {}
    })
    wx.setStorage({
      key: 'first_login',
      data: false,
    })

  },

  //单词发音触发函数
  read: function(e) {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = e.target.id
    innerAudioContext.onPlay(() => {})
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  todayComplete: function() {
    this.setData({
      cpt: true
    })
    //绘制当天学习细节扇行图
    var chart_detail = wx.getStorageSync('today_detail');
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      console.log(windowWidth)
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '认识',
        data: chart_detail.rem,
      }, {
        name: '模糊',
        data: chart_detail.blur,
      }, {
        name: '忘记',
        data: chart_detail.forget,
      }],
      width: windowWidth,
      height: 320,
      dataLabel: true,
    });
  },

  //触发例句函数
  liju(id) {
    var that = this
    wx.request({
      url: 'https://api.shanbay.com/bdc/example/?vocabulary_id=' + id,
      data: {},
      method: 'GET',
      success: function(res) {
        console.log(res)
        that.setData({
          defen: [res.data.data[0], res.data.data[1], res.data.data[3], res.data.data[4]]
        })
      },
      fail: function() {},
      complete: function() {}
    })

  },
})