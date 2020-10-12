const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('_courseHomeworkSubmit').where({
      _id: event._id
    })
      .update({
        data: {
          homeworkFileID: event.homeworkFileID,
          homeworkPath: event.homeworkPath,
          state: event.state,
          homeworkName: event.homeworkName,
          nowtime:event.nowtime
        },
      })
  } catch (e) {
    console.error(e)
  }
}