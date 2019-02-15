/**
 * 全局相关配置
 */
import Qs from 'qs'
import Store from 'store2';

// 对外暴露全局常量及函数
export default {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  headersJson: {
    'Content-Type': 'application/json'
  },
  // setLogin: function (user) {
  //   Store.session('loginUser', user);
  // },
  // getLogin: function () {
  //   return Store.session('loginUser');
  // },
  //用户信息
  setUserInfo: function (userInfo) {
    Store.session('userInfo', userInfo);
  },
  getUserInfo: function () {
    return Store.session('userInfo');
  },
  getLn: function () {
    return this.getCookie('ln');
  },
  //code
  getCode:function(){
    return 'gxxt'
  },
  getCookie: function (cookieName) {
    if (document.cookie.length > 0) {
      let start = document.cookie.indexOf(cookieName + "=");
      if (start !== -1) {
        start = start + cookieName.length + 1;
        let end = document.cookie.indexOf(";", start);
        if (end === -1) end = document.cookie.length;
        return document.cookie.substring(start, end)
      }
    }
    return null;
  },
  logout: function () {
    // 清空所有缓存数据，保留主题选择、用户名、密码
    let themeFile = Store.get('themeFile');
    let username = Store.get('username');
    let password = Store.get('password');
    Store.clearAll();
    if (themeFile) {
      localStorage.setItem("themeFile", themeFile);
    }
    Store.set('username', username);
    Store.set('password', password);
  },
  env: process.env.NODE_ENV,
  webURL: process.env.WEB_URL,
  baseURL: process.env.BASE_URL,
  pushURL: process.env.PUSH_URL,
  ssoURL: process.env.SSO_URL,
  sysURL: process.env.SYS_URL,
  wsURL: process.env.WS_URL,
  transformRequest: [// 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    function (data) {
      return Qs.stringify(data);
    }
  ],
}
