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
  },

  onLoad:function(){
    // this.loadAnimation();
    this.setData({
      height: '10.5%',
      width: '19%',
      top_one: '44%',
      top_two: '56%',
      top_three: '67.5%',
      left_one: '20%',
      left_two: '40.6%',
      left_three: '62%'
    })
  },

  input:function(e){
    var data = e.detail.value;
      this.setData({
        luckPosition: data
      })
  },


  //点击抽奖按钮
  clickLuck:function(){

    var e = this;

    //判断中奖位置格式
    if (e.data.luckPosition == null || isNaN(e.data.luckPosition) || e.data.luckPosition>7){
      wx.showModal({
        title: '提示',
        content: '请填写正确数值',
        showCancel:false,
      })
      return;
    }

    

    //设置按钮不可点击
    e.setData({
      btnconfirm:'/pages/pages/images/dianjichoujiangd.png',
      clickLuck:'',
    })
    //清空计时器
    clearInterval(interval);
    var index = 0;
    console.log(e.data.showChecked[0]);
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

    //模拟网络请求时间  设为两秒
    var stoptime = 2000;
    setTimeout(function () {
      e.stop(e.data.luckPosition);
    }, stoptime)

  },

  //也可以写成点击按钮停止抽奖
  // clickStop:function(){
  //   var stoptime = 2000;
  //   setTimeout(function () {
  //     e.stop(1);
  //   }, stoptime)
  // },

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
                    btnconfirm: '/pages/images/dianjichoujiang.png',
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
                    btnconfirm: '/pages/images/dianjichoujiang.png',
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
}
})
