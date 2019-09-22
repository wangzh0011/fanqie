// pages/index/index.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: app.systemInfo.windowWidth,
      windowHeight: app.systemInfo.windowHeight,
      atbs_pic_style: app.systemInfo.windowHeight / 24,
    })
  },

  /**
   * 点击问号弹出遮罩层
   */
  coinTap: function () {
    this.setData({
      showMask: true
    })
  },

  /**
   * 关闭按钮
   */
  closeTap: function () {
    this.setData({
      showMask: false
    })
  },

  /**
   * 跳转到健康饮食计划小程序
   */
  navigateToFoodsTap: function () {
    wx.navigateToMiniProgram({
      appId: 'wx8e9d3584b599f6fb',
      path: 'pages/index/index',
      extraData: {
      },
      envVersion: 'trial',/*develop	开发版	trial	体验版	release 正式版*/
      success(res) {
        // 打开成功
      }
    })
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