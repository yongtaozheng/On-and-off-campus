//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env: 'it-cloud-hdrd7',
        traceUser: true
      })
    }

    this.globalData = {
      userInfo: null,
      show_userinfo_auth: false,
      newsHref: "https://wedengta.com/wxnews/",
    }
  },

//-----------------------获取当前时间--------------------------------------------
  nowtime: function(e){
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    if (e == 'y')
      return Y;
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    if (e == 'M')
      return M;
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    if (e == 'd')
      return D;
    //时
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    if (e == 'h')
      return h;
    //分
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    if (e == 'm')
      return m;
    //秒
    var s = date.getSeconds();
    if (e == 's')
      return s;
    if(e == 't')
      return Y + '-' + M + '-' + D;
    if (e == 'st')
      return Y + '/' + M + '/' + D;
    return Y + '-' + M + '-' + D + '-' + h + ':' + m + ':' + s;
  },

  onGetOpenid: function () {
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
  nowweek: function(date){
    var weekDay = ["日", "一", "二", "三", "四", "五", "六"];
    var myDate = new Date(Date.parse(date));  
    return weekDay[myDate.getDay()];
  },
  /***
 * 判断用户滑动
 * 左滑还是右滑
 */
  getTouchData: function(endX, endY, startX, startY) {
    let turn = "";
    if (endX - startX > 50 && Math.abs(endY - startY) < 50) {      //右滑
      turn = "right";
    } else if (endX - startX < -50 && Math.abs(endY - startY) < 50) {   //左滑
      turn = "left";
    }
    return turn;
  },

})
