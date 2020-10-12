const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('_courseSelect').where({
      _id:event.id
    })
    .update({
      data: {
        date: event.date,
        state: event.state,
      },
    })
  } catch(e) {
    console.error(e)
  }
}