//index.js
//获取应用实例
let app = getApp()
const config = require('../../config/config.js')

Page({
  data: {
    title: '颜值鉴定仪',
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  navigationTo: function (e) {
    // 由于明星数据库未完成，所以明星像暂时未开发
    if (e.currentTarget.dataset.type != 3)
      wx.navigateTo({
        url: `../pk_page/pk_page?type=${e.currentTarget.dataset.type}`,
      })
  },
  onLoad: function () {
    wx.request({
      url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${config.baidu.appid}&client_secret=${config.baidu.secret}`,
      method: "GET",
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        app.globalData.access_token = res.data.access_token
        console.log(app.globalData.access_token)
      },
      fail: function () {
        console.log("接口调用失败");
      }
    })

  },

})