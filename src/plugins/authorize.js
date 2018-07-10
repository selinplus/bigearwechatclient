// import something here
import axios from 'axios'
import * as wechatUtil from '../utils/wechat'
// leave the export, even if you don't use it
export default ({ app, router, Vue, store }) => {
  // something to do
  Vue.config.productionTip = false;
  router.beforeEach((to, from, next) => {
    if (wechatUtil.isWechat()) {
      if (store.state.wechatModule.userInfo) {
        // console.log(store.state.wechatModule.userInfo);
        next();
      } else {
        var code = wechatUtil.getQuery('code');
        if (code) {
          axios.get(process.env.API +  '/wechat/oauth/code2accesstoken', { params: {code: code } })
          .then(res => {
            store.commit('saveUserInfo', res.data);
            // window.location.replace(to.path);
            next();
          })
        } else {
          axios.get(process.env.API + '/wechat/oauth/auth_url', { params: { uri: window.location.href } })
          .then(res => {
            window.location.replace(res.data);
          }) 
          // window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf3b90ca8041754fa&response_type=code&scope=snsapi_userinfo&redirect_uri=${encodeURIComponent(window.location.href)}`);
        }
      }
    } else {
      next();
    }
  });
  
}

