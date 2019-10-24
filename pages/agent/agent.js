// pages/agent/agent.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.request({
      url: app.data.server + 'getAgentData',
      data: {
        uid: wx.getStorageSync("wxData").jkId
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log(result.data)
        var agentData = result.data;

        var yesterdayHasPay = agentData.yesterdayHasPay;
        var yesterdayNotPay = agentData.yesterdayNotPay;
        var beforeYesterdayHasPay = agentData.beforeYesterdayHasPay;
        var beforeYesterdayNotPay = agentData.beforeYesterdayNotPay;
        var todayHasPay = agentData.todayHasPay;
        var todayNotPay = agentData.todayNotPay;
        //找出最大值
        var max = Math.max(yesterdayHasPay,yesterdayNotPay,beforeYesterdayHasPay,beforeYesterdayNotPay,todayHasPay,todayNotPay)
        
        this.setData({
          money: wx.getStorageSync("money"),
          //计算统计表中各个数据的高度
          yesterdayHasPayPercentage: Math.round(yesterdayHasPay/max*100) + "%",
          yesterdayNotPayPercentage: Math.round(yesterdayNotPay/max*100) + "%",
          beforeYesterdayHasPayPercentage: Math.round(beforeYesterdayHasPay/max*100) + "%",
          beforeYesterdayNotPayPercentage: Math.round(beforeYesterdayNotPay/max*100) + "%",
          todayHasPayPercentage: Math.round(todayHasPay/max*100) + "%",
          todayNotPayPercentage: Math.round(todayNotPay/max*100) + "%",
          //各个数据
          yesterdayHasPay: yesterdayHasPay,
          yesterdayNotPay: yesterdayNotPay,
          beforeYesterdayHasPay: beforeYesterdayHasPay,
          beforeYesterdayNotPay: beforeYesterdayNotPay,
          todayHasPay: todayHasPay,
          todayNotPay: todayNotPay,
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });


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
   * 跳转到健康饮食计划小程序
   */
  toJKTap: function () {
    app.navigateToFoodsTap();
  },

  /**
   * 去推广
   */
  toShare: function () {
    app.navigateToFoodsTap();
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