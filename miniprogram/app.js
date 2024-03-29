//app.js
App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: "heng-bcd5ad", //生产环境id
        traceUser: true,
      })
    }
    this.globalData = {}
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(`user openid: ${res.result.openid}`)
        this.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('调用失败，未授权用户', err)
      }
    })
  }
})