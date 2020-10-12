// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init({
//   // API 调用都保持和云函数当前所在环境一致
//   env: cloud.DYNAMIC_CURRENT_ENV
// })

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()
//   try {//subscribeMessage
//     const res = await cloud.openapi.subscribeMessage.send({
//     touser: event.openid,
//     //touser: "onBNL5DOD7e7qKMut3swNFG7Zx9I",
//     page: 'pages/index/index',
//    data: {
//      thing2:{
//        value: '作业'
//      },
//      date6: {
//        value: '2019-15-25 13:00'
//      },
//      thing7: {
//        value: '备注'
//      }
//    },
//     template_id: 'EbEqTDlAXxLuB4lY97ZB3-E40PYPoyG7bpfNY12E6oM'
//   })
//   console.log(result)
//   return result
// } catch (err) {
//   console.log(err)
//   return err
// }
// }
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
        state:0,
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
          thing2:{
            value: message.project
          },
          date6: {
            value: message.handtime
          },
          thing7: {
            value: '如果您已做完作业，请去小程序内打上已完成标签'
          }
        },
          template_id: 'EbEqTDlAXxLuB4lY97ZB3-E40PYPoyG7bpfNY12E6oM',
        });
        // // 发送成功后将消息的状态改为已发送
        // return db
        //   .collection('messages')
        //   .doc(message._id)
        //   .update({
        //     data: {
        //       done: true,
        //     },
        //   });
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