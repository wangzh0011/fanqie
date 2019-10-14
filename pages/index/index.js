// pages/index/index.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMask: false,
    coinTotal: 0,
    hasPayNum: 0,
    notPayNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.shareuid ; //id 和 jkId 是同一个
    console.log(id)
    if (id == undefined || id == '' || id == "null") {
      wx.setStorageSync("id",0)
    } else {
      wx.setStorageSync("id",id)
    }
      
    this.setData({
      windowWidth: app.systemInfo.windowWidth,
      windowHeight: app.systemInfo.windowHeight,
      atbs_pic_style: app.systemInfo.windowHeight / 24,
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: app.data.server + 'login',
          data: {
            code: res.code,
            type: 'FQ'
          },
          header: {'content-type':'application/json'},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (result)=>{
            console.log("微信接口返回数据：")
            console.log(result.data)
            // this.userInfo.userInfo = result.data//将openId, sessionKey, unionId赋值给userInfo.userInfo
            wx.setStorageSync("wxData",result.data);//已注册用户返回openID和id，未注册用户返回openID
            var userInfo = result.data
            var uid = userInfo.id;
            console.log("uid:" + uid)
            //回调函数
            // app.loginCallback = res => {
              //注册用户
              if(uid == 'null' || uid == undefined){
                  console.log("开始注册用户信息 , id = " + id)
                  if (id == undefined || id == '' || id == "null") {
                    this.registerUser(0); //jkId
                  }else {
                    this.registerUser(id); //jkId
                  }
              } else {
                if (id == undefined || id == '' || id == "null") {//直接从小程序进入
                  console.log("jkid = " + userInfo.jkId)
                  this.getShareInfo(userInfo.jkId)
                } else { //从健康计划小程序跳转进入
                  this.getShareInfo(id)
                  //更新用户
                  if (userInfo.id != null && userInfo.id != undefined) {
                    
                    this.updateUser(userInfo.id,userInfo.id,id)
                  }
                } 
              }
              console.log("index.js 小程序跳转uid " + id)
          
            // }
            // 由于 login 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            // if (this.loginCallback) {
            //   this.loginCallback(result.data)
            // }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    })

    // var userInfo = wx.getStorageSync("wxData");
    


  },

/**
 * 更新用户
 * @param {*} id 
 * @param {*} fqId 
 */
updateUser: function (id,fqId,jkId) {
    wx.request({
      url: app.data.server + 'updateUser',
      data: {
          id: id,
          fqId: fqId,
          jkId: jkId
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
          
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  /** 
   * 注册用户
  */
  registerUser: function (id) {
    wx.request({
      url: app.data.server + 'register',
      data: {
          openid: wx.getStorageSync("wxData").openid,
          type: 'FQ',
          jkId: id == undefined ? 0 : id //从健康计划传入的useID
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        if (id == 0) {//直接从小程序进入
          console.log("jkid = " + result.data.jkId)
          this.getShareInfo(result.data.jkId)
        } else { //从健康计划小程序跳转进入
          this.getShareInfo(id)
        } 
      },
      fail: ()=>{},
      complete: ()=>{}
  });
  },

  /**
   * 获取分享信息
   */
  getShareInfo: function (id) {
    var that = this;
    wx.request({
      url: app.data.server + 'getShareInfo',
      data: {
        shareuid: id //自己的id  jkid
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        var coin = null;
        var coinDesc = null;
        var shareTotalNum = result.data.shareInfo.shareTotalNum;//分享总人数
        var hasPayNum = result.data.shareInfo.hasPayNum;//已支付人数
        var notPayNum = result.data.shareInfo.notPayNum;//未支付人数
        //获取配置信息
        wx.request({
          url: app.data.server + 'getParameters',
          data: {},
          header: {'content-type':'application/json'},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (result)=>{
            console.log(result.data)
            coin = result.data.coin;//每分享一个人获得的金币数
            coinDesc = result.data.coinContext;
            that.setData({
              coinTotal: coin * shareTotalNum,
              coinDesc: coinDesc,
              hasPayNum: hasPayNum,
              notPayNum: notPayNum
            })
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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
      appId: app.foodsInfo.appid,
      path: 'pages/index/index?fqId=' + wx.getStorageSync("wxData").id,
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
    var id = wx.getStorageSync("id")
    console.log("onShow ==> id " + id)
    var userInfo = wx.getStorageSync("wxData")
    if (id == undefined || id == '' || id == "null") {//直接从小程序进入
      console.log("jkid = " + userInfo.jkId)
      this.getShareInfo(userInfo.jkId)
    } else { //从健康计划小程序跳转进入
      this.getShareInfo(id)
    } 
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  
})