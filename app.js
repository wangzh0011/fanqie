//app.js
App({

 /**请求后台url */
 data: {
  uploadUrl:
    // "http://127.0.0.1:8080/upload/",
    "https://fangqie.top/upload/",
  server:
    // "http://127.0.0.1:8080/eatingplan/"  
    "https://fangqie.top/eatingplan/"  
  },

  onLaunch: function (e) {

    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //获取设备信息
    wx.getSystemInfo({
      success: (result) => {
        that.systemInfo.windowWidth = result.windowWidth,
        that.systemInfo.windowHeight = result.windowHeight
      },
      fail: () => { },
      complete: () => { }
    });


  },

  globalData: {
    userInfo: null
  },

  systemInfo: {
    windowWidth: null,
    windowHeight: null
  },

  foodsInfo: {
    appid: 'wxf818611b94a0c6fe'
  },

  /**
   * 跳转到健康饮食计划小程序
   */
  navigateToFoodsTap: function () {
    wx.navigateToMiniProgram({
      appId: this.foodsInfo.appid,
      path: 'pages/index/index?fqId=' + wx.getStorageSync("wxData").id,
      extraData: {
      },
      envVersion: 'trial',/*develop	开发版	trial	体验版	release 正式版*/
      success(res) {
        // 打开成功
      }
    })
  },

})