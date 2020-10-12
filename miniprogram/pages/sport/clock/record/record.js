var Charts = require('wxcharts.js');       //引入wxcharts.js  
var app = getApp();

// 为了使canvas在不同屏幕自适应进行以下换算
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;
const code_w = 680 / rate;
const code_h = 300 / rate;

Page({

  data: {
    code_w: code_w,      //柱状图的宽
    code_h: code_h,        //柱状图的高
    useropenid: wx.getStorageSync("useropenid"),
    today: app.nowtime('st')
  },

  onLoad: function (options) {
    //获取所有计划
    wx.cloud.callFunction({
      name: "findAll",
      data: {
        name: '_sportClockCollection',
      },
      success: res => {
        console.log("ressss=", res)
        this.setData({
          allclock: res.result.data,
        })
        this.getMyClock()//筛选出我的打卡情况
      },
      complete: res => {
        console.log("ressss=", res)
      }
    })
  },
  //筛选出我的打卡情况
  getMyClock: function (e) {
    var that = this
    var myclock = []
    var myclockDate = []
    var flag = []
    var today = this.data.today
    var allclock = this.data.allclock
    var j = 0
    for (var i = 0; i < allclock.length; i++) {
      if (allclock[i]._openid == this.data.useropenid) {
        myclock.push(allclock[i])
        if (allclock[i].clockdate.indexOf(today) == -1)
          flag[j] = false
        else flag[j] = true
        j++;
      }
      this.setData({
        flagIndex: flag,
      })
    }
    console.log("today=", this.data.today)
    console.log("myclock=", myclock)
    console.log("allclock=", allclock)
    this.setData({
      myclock: myclock,
      myclockDate: myclockDate,
    })
    this.initxy()
  },
  //初始化x轴标题和时长
  initxy(e){
    var i = 0;
    var myclock = this.data.myclock;
    var that = this;
    var title = [];
    var timelong = [];
    for(i=0;i<myclock.length;i++){
      title.push(myclock[i].title);
      if(this.data.flagIndex[i])
        timelong.push(myclock[i].timelong);
      else 
        timelong.push(0);
    }
    // this.setData({
    //   title:title,
    //   timelong:timelong,
    // })
    // console.log("title======", myclock)

    var weekDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var myDate = new Date(Date.parse(this.data.today));
    var weekday=weekDay[myDate.getDay()];
    var w=[];
    var d=[];
    var wt =[];
    var j = myDate.getDay();
    var year = this.data.today.split("/")[0];
    var month = this.data.today.split("/")[1];
    var day = this.data.today.split("/")[2];
    //初始化前一周
    for(var i =0;i<7;i++){
      wt[i] = 0;
      w[6-i] = weekDay[j];
      if(j==0) j=6;
      else j--;

      d[6 - i] = year + '/' + month + '/' + day;
      if(day-i<=0){
        if (month == 2 || month == 4 || month == 6 || month == 8 || month == 9 || month == 11 || month == 1){
          if(month == 1)  month=12;
          else month-- ;
          day = 31;
        }
        else if (month == 5 || month == 7 || month == 10|| month == 12 ) {
          month-- ;
          day = 30;
        }
        else{
          if((year%4==0&&year%100!=0)||year%400==0)
            day = 29;
          else day = 28;
          month-- ;
        }
      }
      else day--;
      if(day[0] != 0)  
        day = day < 10 ? '0' + day : day;
      if (month[0] != 0)  
        month = month < 10 ? '0' + month : month;
    }

    for (i = 0; i < myclock.length; i++) {
      for(j=0;j<7;j++){
        if (myclock[i].clockdate.indexOf(d[j]) == -1)
          wt[j] += 0;
        else 
          wt[j]+=myclock[i].timelong;
      }
    }
    console.log("w:", w, "d=", d, "wt", wt);
    this.setData({
      title: title,
      timelong: timelong,
      w:w,
      wt:wt,
    })
    

    this.charts()
  },

  charts: function () {
    var title = this.data.title
    var timelong = this.data.timelong
    console.log("title->", title)
    console.log("timelong->", timelong)
    let _this = this
    return new Promise(function () {
      //
      new Charts({
        canvasId: 'columnCanvas',
        dataPointShape: false,
        type: 'column',
        legend: false,
        //categories:['篮球','羽毛球','乒乓球'], //['16', '17', '18', '19', '20', '21', '22',],
        categories:_this.data.title,
        xAxis: {
          disableGrid: true,
          type: 'calibration'
        },
        series: [{
          name: '成交量',
          data: _this.data.timelong, //['122', '222', '110', '123', '234', '211', '220',],
          //data:['111','123','432'],
          color: "#2E3E5B"
          // color: "rgba(254,129,84,1)"
        }
        ],
        yAxis: {
          disableGrid: false,
          gridColor: "#ffffff",
          fontColor: "#ffffff",
          min: 0,
          max: _this.data.max,
          disabled: true,
          fontColor: "#ff6700"
        },
        dataItem: {
          color: "#ff6700"
        },
        width: code_w,
        height: code_h,
        extra: {
          column: {
            width: 15
          },
        }
      })
      new Charts({
        canvasId: 'columnCanvas1',
        dataPointShape: false,
        type: 'column',
        legend: false,
        //categories:['篮球','羽毛球','乒乓球','足球'], //['16', '17', '18', '19', '20', '21', '22',],
        categories: _this.data.w,
        xAxis: {
          disableGrid: true,
          type: 'calibration'
        },
        series: [{
          name: '成交量',
          data: _this.data.wt, //['122', '222', '110', '123', '234', '211', '220',],
          //data:['111','123','432'],
          color: "#2E3E5B"
          // color: "rgba(254,129,84,1)"
        }
        ],
        yAxis: {
          disableGrid: false,
          gridColor: "#ffffff",
          fontColor: "#ffffff",
          min: 0,
          max: _this.data.max,
          disabled: true,
          fontColor: "#ff6700"
        },
        dataItem: {
          color: "#ff6700"
        },
        width: code_w,
        height: code_h,
        extra: {
          column: {
            width: 15
          },
        }
      })

    })
  }
})
