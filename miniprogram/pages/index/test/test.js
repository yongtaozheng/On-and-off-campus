// miniprogram/pages/index/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:0,

  },
//选中第一个
select1:function(e){
  this.setData({
   select:"work",
  });
  },
  //选中第二个
  select2: function (e) {
    this.setData({
      select: "study",
    });
  },
  //选中第三个
  select3: function (e) {
    this.setData({
      select: "rest",
    });
  },

//新建待办
  newThing:function(){
    this.selectComponent('#modal').newthing();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})