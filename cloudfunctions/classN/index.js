const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
    try {
      return await db.collection("_classCollection").where({
        courseid: event.courseid,
        classname: event.classname,
      })
        .update({
          data: {
            number: event.number
          },
        })
    } catch (e) {
      console.error(e)
    }
}