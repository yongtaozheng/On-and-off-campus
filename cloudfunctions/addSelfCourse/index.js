const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  if(event.flag == 0)
  {
    try {
      return await db.collection("_classCollection").doc(event._docid)
        .update({
          data: {
            number: event.n
          },
        })
    } catch (e) {
      console.error(e)
    }
  }
  else{
    try {
      return await db.collection("_classCollection").add({
        data: {
          teacher: event.createUser,
          coursename: event.name,
          number: 0,
          teacherid: event.classid,
          date: event.nowtime,
          img: event.img,
        },
        success: res => {
          console.log("添加记录成功")
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
  
}