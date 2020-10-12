// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
//创建集合
const db = cloud.database()
exports.main = async (event, context) => {
  return await db.createCollection(event.name+"_homework")
}
//插入数据