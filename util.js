//正则判断
function Regular(str, reg) {
  if (reg.test(str))
    return true;
  return false;
}

//是否为中文
function IsChinese(str) {
  var reg = /^[\u0391-\uFFE5]+$/;
  return Regular(str, reg);
}
//去左右空格;
function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, "");
}
//当前时间
function nowtime(a){
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
  //时
  var h = date.getHours();
  //分
  var m = date.getMinutes();
  //秒
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}


var util = {
  /**
   *var testDate = new Date( 1320336000000 );//这里必须是整数，毫秒
   *var testStr = testDate.format("yyyy年MM月dd日hh小时mm分ss秒");
   *var testStr2 = testDate.format("yyyyMMdd hh:mm:ss");
   */
  dateConverter: function (formatData, timestamp) {
    Date.prototype.format = function (format) {
      var o =
      {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
      }

      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }

      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return format;
    }
    var timeFormat = new Date(timestamp);
    return timeFormat.format(formatData);
  },
  timeShow: function (timeStamp) {
    if (this.dateConverter('yyyy', timeStamp) != this.dateConverter('yyyy', new Date())) {
      return this.dateConverter('yyyy-MM-dd', timeStamp);
    } else if (this.dateConverter('yyyy-MM-dd', timeStamp) == this.dateConverter('yyyy-MM-dd', new Date())) {
      return this.dateConverter('hh:mm', timeStamp);
    } else if (this.dateConverter('yyyy-MM-dd', timeStamp) == this.dateConverter('yyyy-MM-dd', new Date() - 1000 * 60 * 60 * 24)) {
      return '昨天';
    } else {
      return this.dateConverter('MM-dd', timeStamp);
    }
  },
}


//最下面一定要加上你自定义的方法（作用：将模块接口暴露出来），否则会报错：util.trim is not a function;
module.exports = {
  IsChinese: IsChinese,
  trim: trim,
  nowtime: nowtime,
  util: util
}