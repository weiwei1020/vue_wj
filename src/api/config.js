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
  getLn: function () {
    return localStorage.getItem('personRole');
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
    return true;
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
  // env: process.env.NODE_ENV,
  baseURL: process.env.BASE_URL,
  transformRequest: [// 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    function (data) {
      return Qs.stringify(data);
    }
  ],
}
