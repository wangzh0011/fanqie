//index.js
//获取应用实例
const app = getApp()

//计数器
var interval = null;

//值越大旋转时间越长  即旋转速度
var intime = 50;

Page({
  data: {
    color: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    showChecked: [false,false,false,false,false,false,false,false],
    // showChecked: [true,true,true,true,true,true,true,true],
    //9张奖品图片
    images: ['/pages/images/item.png', '/pages/images/item1.png', '/pages/images/item.png', '/pages/images/item1.png', '/pages/images/item.png', '/pages/images/item1.png', '/pages/images/item.png', '/pages/images/item1.png', '/pages/images/item.png'],
    btnconfirm: '/pages/images/dianjichoujiang.png',
    clickLuck:'clickLuck',
    luckPosition:5,
    integral: 0,
    advers: [
      '林三***获得了 50 元红包',
      '张***获得了15 积分',
      '王长春***获得了 20 元红包',
      '思考***获得了 15 积分',
      '丽***获得了100元京东卡',
      '好滋味***获得了 100积分',
      '说那时***获得了 50 元红包',
      '试试就***获得了 20 元红包',
      '诚***获得了 100 积分',
      '舞蹈c***获得了 50 元红包',
      '李大王***获得了 2 元红包',
      '来快***获得了 50 元红包',
      '晚上***获得了100元京东卡',
      '秋溢凉***获得了 50 元红包',
      '战胜自*** 获得了20 元红包',
      '秋*** 获得了100积分',
      '是啊秋***获得了 20 元红包',
      '战士***获得了 20 元红包',
      '十多***获得了 2 元红包',
      '弓长***获得了 50 元红包',
      '睡得晚***获得了 50 元红包',
      '马儿***获得了 15积分',
      '等等我***获得了 100元京东卡',
      '快跑***获得了 50 元红包',
      '恩情***获得了 20 元红包',
      '好滋味***获得了 15积分',
      '凭空***获得了1000元红包',
      '二不二***获得了 2 元红包',
    ],
    luckyTimes: 10,
    showText: false,
    showMygoods: false,
    showIntegral: false,
    showGetintegral: false,
    showAgent: false,
    showAgentMask: false
  },


  onLoad: function (options) {

    
    var adverNum = this.data.advers.length;
    var index = Math.floor(Math.random()*adverNum);

    this.setData({
      height: '10.5%',
      width: '18.8%',
      top_one: '43.8%',
      top_two: '55.8%',
      top_three: '67.5%',
      left_one: '20%',
      left_two: '40.6%',
      left_three: '61.8%',
      color: '#F8CF80',
      opacity: '0.4',
      border: '12rpx',
      adver: this.data.advers[index]//广告初始化
    })
    //广告轮播
    var i = 0;
    setInterval(() => {
      this.setData({
        adver: this.data.advers[i]
      })
      i++;
      if (i == adverNum) {
        i = 0;
      }
    }, 2000);



    var id = options.shareuid ; //id 和 jkId 是同一个
    console.log("index.js 小程序跳转uid " + id)
    if (id == undefined || id == '' || id == "null") {
      wx.setStorageSync("id",0)
    } else {
      wx.setStorageSync("id",id)
    }
      
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
            console.log("抽奖小程序uid:" + uid)
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
                  console.log("抽奖小程序进入 jkid = " + userInfo.jkId)
                  this.getShareInfo(userInfo.jkId)
                } else { //从健康计划小程序跳转进入
                  console.log("健康计划小程序进入 jkid = " + id)
                  this.getShareInfo(id)
                  //更新用户
                  if (userInfo.id != null && userInfo.id != undefined) {
                    console.log("更新用户")
                    this.updateUser(userInfo.id,userInfo.id,id)
                  }
                } 
              }
              
          
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

    

    
    


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var id = wx.getStorageSync("wxData").jkId
    console.log("onShow ==> Jkid " + id)
    var userInfo = wx.getStorageSync("wxData")
    if(id != '0') {
      if (id == undefined || id == '' || id == "null") {//直接从小程序进入
        console.log("onShow jkid = " + userInfo.jkId)
        this.getShareInfo(userInfo.jkId)
      } else { //从健康计划小程序跳转进入
        this.getShareInfo(id)
      } 
    }

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
          console.log("注册用户jkid = " + result.data.jkId)
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
        var isAgent = result.data.shareInfo.isAgent;//是否是代理
        var money = result.data.shareInfo.money;//佣金
        var canAgent = result.data.shareInfo.canAgent;//代理权限
        var integral = result.data.shareInfo.integral;//积分
        var times = result.data.shareInfo.times;//抽奖次数
        var hasPayNum = result.data.shareInfo.hasPayNum;//已支付人数
        var notPayNum = result.data.shareInfo.notPayNum;//未支付人数
        wx.setStorageSync("hasPayNum",hasPayNum)
        wx.setStorageSync("notPayNum",notPayNum)
        wx.setStorageSync("money",money)
        
        that.setData({
          showText: 10 - times < 1 ? false : true,
          luckyTimes: 10 - times,
          integral: integral,
          showAgent: canAgent == 'Y' ? true : false
        })
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  /**
   * 我的积分
   */
  integralTap: function() {
    var hasPayNum = wx.getStorageSync("hasPayNum")
    var notPayNum = wx.getStorageSync("notPayNum")
    this.setData({
      showIntegral: true,
      integralText: '当前有' + (hasPayNum + notPayNum) + '个微信好友看了我的推广获得' + (hasPayNum + notPayNum) * 1 + '积分\n其中有' + hasPayNum + '个微信好友通过链接参与计划获得' + hasPayNum * 5 + '积分'
    })
  },

  /**
   * 关闭我的积分
   */
  closeIntegral: function() {
    this.setData({
      showIntegral: false,
    })
  },

  /**
   * 获取积分
   */
  getintegralTap: function() {
    this.setData({
      showGetintegral: true,
      getintegralText: '1.分享朋友/朋友圈后 好友点击链接即可获得1积分（上限50）\n2.微信好友认可计划 通过您的链接参与计划即可获得5积分。'
    })
  },

  /**
   * 关闭获取积分
   */
  closeGetintegral: function () {
    this.setData({
      showGetintegral: false,
    })
  },

  /**
   * 我的奖品
   */
  mygoodsTap: function () {
    wx.request({
      url: app.data.server + 'getMyGoods',
      data: {
        uid: wx.getStorageSync("wxData").jkId
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        this.setData({
          goodsList: result.data
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    this.setData({
      showMygoods: true
    })
  },

  /**
   * 关闭我的奖品
   */
  closeMygoods: function () {
    this.setData({
      showMygoods: false
    })
  },

  /**
   * 返回计划
   */
  toJKTap: function () {
    app.navigateToFoodsTap()
  },

  /**
   * 申请代理
   */
  agentTap: function() {
    this.setData({
      showAgentMask: true,
      agentText: '恭喜您获得代理资格！\n为反馈做出贡献的用户 我们特推出代理机制 用户在获得100积分时即可申请成为代理。\n以下我们为您说明代理的福利：\n1.推广佣金：当成为代理时 用户通过您的链接每产生1笔购买 即可为你带来5元的推广佣金。\n2. 佣金体现：赚取的佣金可体现 我们将以现金的方式返现给您\n3.数据支持：成为代理之后 可实时监控每日产品情况 一目了然\n'
    })
  },

  /**
   * 关闭代理弹出层
   */
  closeAgent: function() {
    this.setData({
      showAgentMask: false,
    })
  },

  /**
   * 成为代理
   */
  beAgent: function() {
    var that = this;
    wx.request({
      url: app.data.server + 'beAgent',
      data: {
        uid: wx.getStorageSync("wxData").jkId
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        if (result.data == true) {
          wx.navigateTo({
            url: '/pages/agent/agent',
            success: () => {
              that.setData({
                showAgentMask: false,
              })
            }
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '系统异常',
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#3CC51F',
            
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },


  //点击抽奖按钮
  clickLuck:function(){

    var e = this;


    //设置按钮不可点击
    e.setData({
      clickLuck:'',
    })
    //清空计时器
    clearInterval(interval);
    var index = 0;

    //模拟网络请求时间  设为两秒
    wx.request({
      url: app.data.server + 'lucky',
      data: {
        uid: wx.getStorageSync("wxData").jkId
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log("抽奖结果 " + result.data.luckyInfo.luckyType)
        console.log("抽奖次数 " + result.data.luckyInfo.times)
        
        if (result.data.luckyInfo.luckyType == '-1') {
          wx.showModal({
            title: '提示',
            content: result.data.luckyInfo.luckyMessage,
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: ()=>{
              e.setData({
                clickLuck: 'clickLuck',
              })
            }
          });
          return;
        }
        //设置积分和抽奖次数

        e.setData({
          integral_temp: result.data.luckyInfo.integral,//积分  点击确认之后再显示剩余积分
          showText: 10 - result.data.luckyInfo.times < 1 ? false : true,
          luckyTimes:  10 - result.data.luckyInfo.times//已抽奖次数
        })
        //循环设置每一项的透明度
        interval = setInterval(function () {
          if (index > 7) {
            index = 0;
            e.data.showChecked[7] = false
          } else if (index != 0) {
            e.data.showChecked[index - 1] = false
          }
          e.data.showChecked[index] = true
          e.setData({
            showChecked: e.data.showChecked,
          })
          index++;
        }, intime);
        //设置停止跑马灯效果
        var stoptime = 2000;
        setTimeout(function () {
          e.stop(result.data.luckyInfo.luckyType);
        }, stoptime)
      },
      fail: ()=>{
        wx.showModal({
          title: '提示',
          content: "服务器异常",
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: ()=>{
            e.setData({
              clickLuck: 'clickLuck',
            })
          }
        });
        // var stoptime = 2000;
        // setTimeout(function () {
        //   e.stop(e.data.luckPosition);
        // }, stoptime)
      },
      complete: ()=>{}
    });
    

  },


  stop: function (which){
    var e = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    var current = -1;
    var showChecked = e.data.showChecked;
    for (var i = 0; i < showChecked.length; i++) {
      if (showChecked[i] == 1) {
        current = i;
      }
    }
    //下标从1开始
    var index = current + 1;

    e.stopLuck(which, index, intime, 10);
  },


/**
 * which:中奖位置
 * index:当前位置
 * time：时间标记
 * splittime：每次增加的时间 值越大减速越快
 */
  stopLuck: function (which, index,time,splittime){
    var e = this;
    //值越大出现中奖结果后减速时间越长
    var showChecked = e.data.showChecked;
    setTimeout(function () {
      //重置前一个位置
      if (index > 7) {
        index = 0;
        showChecked[7] = false
      } else if (index != 0) {
        showChecked[index - 1] = false
      }
      //当前位置为选中状态
      showChecked[index] = true
      e.setData({
        showChecked: showChecked,
      })
          //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
          //直到旋转至中奖位置
        if (time < 400 || index != which){
          //越来越慢
          splittime++;
          time += splittime;
          //当前位置+1
          index++;
          e.stopLuck(which, index, time, splittime);
        }else{
        //1秒后显示弹窗
          setTimeout(function () {
        if (which != 5 ) {
            //中奖
            wx.showModal({
              title: '提示',
              content: '恭喜中奖',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //设置按钮可以点击
                  e.setData({
                    integral: e.data.integral_temp,
                    clickLuck: 'clickLuck',
                  })
                  // e.loadAnimation();
                }
              }
            })
          } else {
            //中奖
            wx.showModal({
             title: '提示',
              content: '很遗憾未中奖',
              showCancel: false,
              success:function(res){
                if(res.confirm){
                  //设置按钮可以点击
                  e.setData({
                    integral: e.data.integral_temp,
                    clickLuck: 'clickLuck',
                  })
                  // e.loadAnimation();
                }
              }
            })
          }
          }, 1000);
        }
    }, time);
  },
  //进入页面时缓慢切换
 loadAnimation:function (){
  var e = this;
  var index = 0;
  // if (interval == null){
  interval = setInterval(function () {
    if (index > 7) {
      index = 0;
      e.data.color[7] = 0.5
    } else if (index != 0) {
      e.data.color[index - 1] = 0.5
    }
    e.data.color[index] = 1
    e.setData({
      color: e.data.color,
    })
    index++;
  }, 1000);
  // }  
},

  onShareAppMessage: function () {
    
  },

  /**
   * 跳转到健康饮食计划小程序
   */
  navigateToFoodsTap: function () {
    app.navigateToFoodsTap();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var id = wx.getStorageSync("id")
    console.log("下拉刷新 ==> Jkid " + id)
    var userInfo = wx.getStorageSync("wxData")
    if (id == undefined || id == '' || id == "null") {//直接从小程序进入
      console.log("下拉刷新 jkid = " + userInfo.jkId)
      this.getShareInfo(userInfo.jkId)
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
    } else { //从健康计划小程序跳转进入
      this.getShareInfo(id)
    } 
  },
})
