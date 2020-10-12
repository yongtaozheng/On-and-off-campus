const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  try {
    return await db.collection('_courseHomeworkList').where({
        _id: event._id
      })
      .update({
        data: {
          submitNum: event.submitNum
        },
      })
  } catch (e) {
    console.error(e)
  }
}