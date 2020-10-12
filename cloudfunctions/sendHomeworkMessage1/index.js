
const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
  })
  const db = cloud.database();
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  //获取当前时间
  var n = timestamp * 1000;
  //获取当前时间
  var date = new Date(n);
  //年
  var YY = date.getFullYear();
  //月
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时
  var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  //分
  var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

  var ho = (parseInt(hh) + 2) < 10 ? '0' + (parseInt(hh) + 2) : (parseInt(hh) + 2).toString()
  //跨天
  if (hh >= 22) {
    DD++
    DD = '0' + DD
    hh = (hh + 2) % 24
    hh = '0' + hh
    ho = hh
  }

  var nowtime = hh + ':' + mm
  var nowdate = YY + '-' + MM + '-' + DD
  

  try {
    // 从云开发数据库中查询等待发送的消息列表
    const messages = await db
      .collection('_homework')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      // 在真正的生产环境，可以根据开课日期等条件筛选应该发送哪些消息
      .where({
        flag: true,
        state: 0,
        handdate: nowdate,
        hour:ho,
      })
      .get();

    // 循环消息列表
    const sendPromises = messages.data.map(async message => {

      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message._openid,
          page: 'pages/index/index',
          data: {
            thing2: {
              value: message.project
            },
            date6: {
              value: message.handtime
            },
            thing7: {
              value: '此作业将在2小时内截至！！！'
            }
          },
          template_id: 'EbEqTDlAXxLuB4lY97ZB3-E40PYPoyG7bpfNY12E6oM',
        });
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('_homework')
          .doc(message._id)
          .update({
            data: {
              flag: false,
            },
          });
      } catch (e) {
        return e;
      }
    });
    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};