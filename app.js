//app.js
App({

 /**请求后台url */
 data: {
  uploadUrl:
    "http://127.0.0.1:8080/upload/",
    // "http://120.24.5.8:8080/upload/",
  server:
    "http://127.0.0.1:8080/eatingplan/"  
    // "http://120.24.5.8:8080/eatingplan/"  
  },

  onLaunch: function () {

    //获取配置信息
    wx.request({
      url: this.data.server + 'getParameters',
      data: {},
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log(result.data)
        wx.setStorageSync("systemConf",result.data)
      },
      fail: ()=>{},
      complete: ()=>{}
    });


    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
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
    appid: 'wx8e9d3584b599f6fb'
  }

})