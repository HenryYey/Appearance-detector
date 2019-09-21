// pages/pk_result/pk_result.js
let app = getApp()
const format = require("../../utils/util.js")
const config = require("../../config/config")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    title: "",
    myImg: '',
    otherImg: '',
    result_two: {},
    result: {},
  },

  returnHome: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const base64 = app.globalData.base64
    const base64_two = app.globalData.base64_two? app.globalData.base64_two: null
    wx.showToast({
      title: '正在分析结果...',
      icon: 'loading',
      mask: true,
      duration: 5000
    })
    this.type = options.type
    if (this.type === '1'){
      this.setData({
        title: "评分结果",
        type: 'score',
        myImg: app.globalData.fileID
      })
    }
    else if (this.type === '2')
      this.setData({
        title: "分析结果",
        type: 'judge',
        myImg: app.globalData.fileID
      })
    else if (this.type === '3'){
      this.setData({
        title: "你最像的明星",
        type: 'star',
        myImg: app.globalData.fileID,
        // otherImg: app.globalData.fileID_two        
      })
    }
    else {
      this.setData({
        title: "颜值PK",
        //myImg: app.globalData.fileID,
        type: 'pk',
        //otherImg: app.globalData.fileID_two
      })
    }
    if(that.type === '3') {
      wx.cloud.callFunction({
        name: 'getStarFace',
        data: {
          base64: base64
        },
        success: res => {
          console.log(res)
        },
        fail: err => {

          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000
          })
          wx.reLaunch({
            url: `../pk_page/pk_page?type=${this.type}`
          })
          console.error('调用失败', err)
        }
      })
    }
    else {
      wx.request({
        url: `https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=${app.globalData.access_token}`,
        method: "POST",
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          image_type: `BASE64`,
          face_field: `race,age,beauty,face_shape,expression,gender,glasses,quality,emotion,face_type`,
          image: base64
        },
        success: res => {
          console.log(res)
          if(!res.data.result) {
            wx.reLaunch({
              url: `../pk_page/pk_page?type=${this.type}`
            })
          }
          let temp = res.data.result.face_list[0]
          let gender = temp.gender.type === 'female'? '女':'男'    
          let expression
          switch (temp.expression.type){
            case 'none':
              expression = '面无表情'
              break
            case 'smile':
              expression = '微笑'
              break
            case 'laugh':
              expression = '大笑'
          }
          let emotion
          switch (temp.emotion.type) {
            case 'angry': 
              emotion='愤怒'
              break
            case 'disgust': 
              emotion ='厌恶'
              break
            case 'fear': 
              emotion ='恐惧'
              break
            case 'happy': 
              emotion ='高兴'
              break
            case 'sad': 
              emption = '伤心'
              break
            case 'surprise': 
              emotion ='惊讶'
              break
            case  'neutral': 
              emotion = '无情绪'
          }
          let shape
          switch (temp.face_shape.type) {
            case 'square': 
              shape = '正方形' 
              break
            case 'triangle': 
              shape = '三角形' 
              break
            case 'oval': 
              shape ='椭圆' 
              break
            case 'heart': 
              shape ='心形' 
              break
            case 'round': 
              shape ='圆形'
          }
            that.setData({
              result: {
                shape: shape,
                age: temp.age,
                gender: gender,
                expression: expression,
                emotion: emotion,
                beauty: temp.beauty
              }
            })
          },
    
        fail: err => {
          console.error('???', err)
          wx.hideToast()
        }
      })
    }
    if( that.type === '4') {
      wx.request({
        url: `https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=${app.globalData.access_token}`,
        method: "POST",
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          image_type: `BASE64`,
          face_field: `race,age,beauty,face_shape,expression,gender,glasses,quality,emotion,face_type`,
          image: base64_two
        },
        success: res => {
          console.log(res)
            that.setData({
              beauty_two: res.data.result.face_list[0].beauty
            })
            console.log(that.data.result)
          if (that.data.result.beauty >= that.data.beauty_two)
            this.setData({
              myImg: app.globalData.fileID
            })
          else
            this.setData({
              myImg: app.globalData.fileID_two
            })
            /*把存储路径存入数据库 */
            // 如果是查询记录就不存
          if(options.ifSet === '1') {
            const db = wx.cloud.database()
            db.collection('history')
              .add({
                data: 
                  {
                    type: '4',
                    fileID: app.globalData.fileID,
                    fileID_two: app.globalData.fileID_two,
                    time: format.formatTime(new Date())
                  }
                
              }).then(res => {
                console.log(res)
              })
          }

          app.globalData.fileID = null
          app.globalData.fileID_two = null
          app.globalData.base64_two = null
          app.globalData.base64 = null
          wx.hideToast();
        },
        fail: err => {
          console.error('???', err)
          wx.hideToast()
        }
      })

    } else {
      let that = this 
      if (options.ifSet === '1') {
      const db = wx.cloud.database()
        db.collection('history')
          .add({
            data: 
              {
                type: that.type,
                fileID: app.globalData.fileID,
                time: format.formatTime(new Date())
              }
            
          })
      }
      app.globalData.fileID = null
      app.globalData.fileID_two = null
      app.globalData.base64_two = null
      app.globalData.base64 = null
    }
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