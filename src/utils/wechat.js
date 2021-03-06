import wx from 'weixin-js-sdk'
import axios from 'axios'
export const isWechat = () => {
  let ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == 'micromessenger';
}

export const getQuery = (name) => {
  let r = window.location.search.substr(1).match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'))
  return r ? r[2] : null
}

// export const getClientIp = () => {
 
// }

export const wechatPay = (payData, successCb, cancelCb) => {
  axios.get(process.env.API + '/wechat/getconfig', { params: { uri: window.location.href } })
  .then(
    res => {
      var config = res.data;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.appId, // 必填，公众号的唯一标识
        timestamp: config.timestamp , // 必填，生成签名的时间戳
        nonceStr: config.nonceStr, // 必填，生成签名的随机串
        signature: config.signature, // 必填，签名
        jsApiList: [
          'chooseWXPay'
        ] // 必填，需要使用的JS接口列表
      });
      wx.ready(()=>{
        console.log('wx.ready');
        wx.chooseWXPay({
          timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
          package: payData.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: payData.paySign, // 支付签名
          success: function (res) {
          // 支付成功后的回调函数
            successCb(res);
          },
          fail: function(res) {
          // 接口调用失败时执行的回调函数。
          },
          cancel:function(res){
          // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
            cancelCb(res);
          },
          complete: function(res) {
          // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
          }

        });
      });

      wx.error(function(res){
        console.log('wx err',res);
      });
    }
  )
  .catch(
    err => {
      console.log(err);
    }
  )
}