
const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
  })
  const db = cloud.database();


  try {
    // 从云开发数据库中查询等待发送的消息列表
    const messages = await db
      .collection('_homework')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      // 在真正的生产环境，可以根据开课日期等条件筛选应该发送哪些消息
      .where({
        flag: true,
        state: 0,
        handtime:"2020-04-04"
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
              value: '如已完成，请打上标签'
            }
          },
          template_id: 'EbEqTDlAXxLuB4lY97ZB3-E40PYPoyG7bpfNY12E6oM',
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