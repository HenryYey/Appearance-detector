// pages/history/histroy.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
goto(event){
  // 暂定为重测一次。。
  // 将图片转化为base64格式
  wx.getFileSystemManager().readFile({
    filePath: event.currentTarget.dataset.fileID,
    encoding: 'base64',
    success: res => {
      app.globalData.base64 = res.data
      console.log('1111')
    },
    fail: err => {
      console.log(err)
    }
  })
  if (event.currentTarget.dataset.fileID_two) {
    wx.getFileSystemManager().readFile({
      filePath: event.currentTarget.dataset.fileID_two,
      encoding: 'base64',
      success: res => {
        app.globalData.base64_two = res.data
      },
      fail: err => {
        console.log(err)
      }
    })
  }
  console.log('222')

  app.globalData.fileID = event.currentTarget.dataset.fileID
  app.globalData.fileID_two = event.currentTarget.dataset.fileID_two
  console.log(app.globalData.base64)
  wx.navigateTo({
    url: `../pk_result/pk_result?type=${event.currentTarget.dataset.type}&ifSet=0`
  })
},
  /**
   * 生命周期函数--监听页面加载71
   */
  onLoad: function (options) {
    const that = this
    const db = wx.cloud.database()
    db.collection('history')
      .get().then(res => {
        res.data.forEach(item => {
          let time = item.time
          let base64 = item.base64
          let base64_two = item.base64_two? item.base64_two: null
          let fileID_two = item.fileID_two? item.fileID_two: null 
          let type
          if (item.type === '1')
            type = "颜值评分"
          else if (item.type === '2')
            type = "人脸分析"
          else if (item.type === '3')
            type = "测明星相"
          else if (item.type === '4')
            type = "颜值PK"
          let fileID = item.fileID
          console.log(res)
          this.setData({
            list: [...this.data.list, {
              time,
              type,
              fileID,
              base64,
              base64_two,
              fileID_two
            }]
          })
        })
      })
    // 根据fileID显示List里的图像
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