// pages/pk_page/pk_page.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postImg: '/images/touxiang1.png',
    postImg_two: '/images/touxiang1.png',
    logo: '/images/logo2.jpg',
    title: '',
    type: '',
    date: null,
  },
  chooseImg: function (e) {
    const date = Date.now()
    this.setData({
      date: date
    }) //时间戳

    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res.tempFiles[0].size)
        if(res.tempFiles[0].size > 3072000) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '图片大小需小于3M'
          })
          wx.hideToast()
          return
        }
        
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        that.setData({
          postImg: e.currentTarget.dataset.num === '1' ? tempFilePaths : String,
          postImg_two: e.currentTarget.dataset.num === '2' ? tempFilePaths : String,
        })
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        let type = ''
        if (that.type === '1')
          type = "score"
        else if (that.type === '2')
          type = "judge"
        else if (that.type === '3')
          type = "star"
        else
          type = "pk"

        let flag = e.currentTarget.dataset.num
        wx.cloud.uploadFile({
          cloudPath: `image/${app.globalData.openid}/${type}/${e.currentTarget.dataset.num}/${date}`, // 上传至云端的路径
          filePath: tempFilePaths, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res)
            if (flag === '1')
              app.globalData.fileID = res.fileID
            else
              app.globalData.fileID_two = res.fileID
            wx.hideToast();
          },
          fail: () => {
            console.error
          }
        })
        // 将图片转化为base64格式
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths,
          encoding: 'base64',
          success: res => {
            if (flag === '1')
              app.globalData.base64 = res.data 
            else
              app.globalData.base64_two = res.data 
          },
          fail: err => {
            console.log(err)
          }
        })
      }
    })
  },
  play: function () {
    const that = this
    if (this.type === '4') {
      if (!app.globalData.fileID && !app.globalData.fileID_two) {
        console.log("请先上传图片")
        return
      }
    } else {
      if (!app.globalData.fileID) {
        console.log("请先上传图片")
        return
      }
    }
    app.globalData.type = this.type
    wx.navigateTo({
      url: `../pk_result/pk_result?type=${that.type}&ifSet=1`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type)
    let title = ''
    let type = options.type

    if (options.type === '1') {
      title = "给你的颜值评分"
    } else if (options.type === '2') {
      title = "AI智能分析你的脸部信息"
    } else if (options.type === '3') {
      title = "测一测你最像哪个明星"
    } else
      title = "颜值比拼"
    this.type = type
    this.setData({
      title: title,
      type: type
    })

  }
})