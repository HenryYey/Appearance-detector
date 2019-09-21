const cloud = require('wx-server-sdk')
const axios = require('axios')
cloud.init()

exports.main = async (event, context) => {
  let result
  console.log(event.base64)
  const url = `https://api.eyekey.com/face/Check/checking?app_id=537008577e5c44b489d042739078ee91&app_key=d5cc217c76484c97bfbe2d6d6b8e13b8&img=${event.base64}`
  await axios({
    method: "GET",
    url: url
  }).then( res => {

      result = {
        res
      }
    
  }).catch(err => {
    result = {
      code: 1,
      result: err
    }
  })
  return {
    result
  }
}